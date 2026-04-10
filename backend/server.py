from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection with proper error handling and Atlas compatibility
mongo_url = os.environ['MONGO_URL']

# Configure MongoDB client with proper settings for both local and Atlas
client_options = {
    'serverSelectionTimeoutMS': 5000,
    'connectTimeoutMS': 10000,
    'socketTimeoutMS': 10000,
}

# Add authentication mechanism for Atlas compatibility
# Atlas uses SCRAM-SHA-256 by default, but we support both
if 'authMechanism' not in mongo_url and 'mongodb+srv://' in mongo_url:
    # For Atlas, prefer SCRAM-SHA-256
    client_options['authMechanism'] = 'SCRAM-SHA-256'
elif 'authMechanism' not in mongo_url:
    # For local MongoDB, let it auto-negotiate (supports both SCRAM-SHA-1 and SCRAM-SHA-256)
    pass

# Add retryWrites for Atlas MongoDB (safe for local too) - only if not already present
if 'retryWrites' not in mongo_url:
    # Check if URL already has query parameters
    if '?' in mongo_url:
        mongo_url = mongo_url + '&retryWrites=true&w=majority'
    else:
        # Ensure there's a database name or slash before adding query params
        if mongo_url.rstrip('/').count('/') >= 3:  # mongodb://host:port/dbname format
            mongo_url = mongo_url.rstrip('/') + '?retryWrites=true&w=majority'
        elif not mongo_url.endswith('/'):
            # Add trailing slash if missing (mongodb://host:port format)
            mongo_url = mongo_url + '/?retryWrites=true&w=majority'
        else:
            # Already has trailing slash
            mongo_url = mongo_url + '?retryWrites=true&w=majority'

try:
    client = AsyncIOMotorClient(mongo_url, **client_options)
    db = client[os.environ.get('DB_NAME', 'test_database')]
    logger = logging.getLogger(__name__)
    logger.info(f"MongoDB client initialized for database: {os.environ.get('DB_NAME', 'test_database')}")
except Exception as e:
    logger = logging.getLogger(__name__)
    logger.error(f"Failed to initialize MongoDB client: {str(e)}")
    # Initialize client anyway, let it fail on first connection attempt
    client = AsyncIOMotorClient(mongo_url, **client_options)
    db = client[os.environ.get('DB_NAME', 'test_database')]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Root-level health check for Kubernetes probes (no /api prefix)
@app.get("/health")
async def root_health_check() -> Dict[str, str]:
    """Root-level health check for Kubernetes readiness/liveness probes"""
    try:
        # Attempt to ping MongoDB
        await client.admin.command('ping')
        return {
            "status": "healthy",
            "database": "connected",
            "service": "operational"
        }
    except Exception as e:
        # Log error but still return 200 to prevent pod restarts during temporary DB issues
        logger.warning(f"Health check - MongoDB ping failed: {str(e)}")
        return {
            "status": "degraded",
            "database": "checking",
            "service": "operational",
            "note": "Database connectivity issue detected"
        }


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root() -> Dict[str, str]:
    return {"message": "Hello World"}

@api_router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint that verifies MongoDB connectivity"""
    try:
        # Attempt to ping MongoDB
        await client.admin.command('ping')
        return {
            "status": "healthy",
            "database": "connected",
            "message": "Application and database are operational"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "message": f"Database connection failed: {str(e)}"
        }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate) -> StatusCheck:
    try:
        status_dict = input.model_dump()
        status_obj = StatusCheck(**status_dict)
        
        # Convert to dict and serialize datetime to ISO string for MongoDB
        doc = status_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        
        result = await db.status_checks.insert_one(doc)
        
        if not result.inserted_id:
            logger.error("Failed to insert document - no ID returned")
            
        return status_obj
    except Exception as e:
        logger.error(f"Error creating status check: {str(e)}")
        raise

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks() -> List[StatusCheck]:
    try:
        # Exclude MongoDB's _id field from the query results
        status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
        
        # Convert ISO string timestamps back to datetime objects
        for check in status_checks:
            if isinstance(check['timestamp'], str):
                check['timestamp'] = datetime.fromisoformat(check['timestamp'])
        
        return status_checks
    except Exception as e:
        logger.error(f"Error fetching status checks: {str(e)}")
        raise

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@app.on_event("startup")
async def startup_db_client() -> None:
    """Verify MongoDB connection on startup"""
    try:
        # Ping the database to verify connection
        await client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        
        # Log database info (useful for debugging)
        server_info = await client.server_info()
        logger.info(f"MongoDB version: {server_info.get('version', 'unknown')}")
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        logger.error("Application will continue but database operations will fail")
        # Don't raise - let the app start and fail gracefully on DB operations

@app.on_event("shutdown")
async def shutdown_db_client() -> None:
    """Close MongoDB connection on shutdown"""
    try:
        client.close()
        logger.info("MongoDB connection closed")
    except Exception as e:
        logger.error(f"Error closing MongoDB connection: {str(e)}")