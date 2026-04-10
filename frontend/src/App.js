import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Check,
  Copy,
  Disc3,
  FileText,
  Gauge,
  Headphones,
  Home,
  Layers,
  Library,
  ListMusic,
  Music4,
  Radio,
  Search,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Tags,
  Wand2,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const shell = "min-h-screen bg-[#111827] text-white";
const card = "rounded-3xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-sm";
const soft = "text-[#F3F4F6]";

function CopyBox({ title, text, small = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <Card className={`${card} h-full`}>
      <CardHeader className={small ? "pb-2" : "pb-3"}>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className={small ? "text-lg" : "text-xl"}>{title}</CardTitle>
          <Button type="button" size="sm" variant="secondary" className="rounded-2xl" onClick={handleCopy}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="overflow-auto max-h-96 whitespace-pre-wrap break-words rounded-2xl bg-black/20 p-4 font-mono text-sm leading-7 text-[#F5EDE5]">
          {text}
        </pre>
      </CardContent>
    </Card>
  );
}

function StatGrid({ items }) {
  return (
    <div className="grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
      {items.map(([title, desc]) => (
        <div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="font-medium text-[#F5EDE5]">{title}</div>
          <div className="mt-1 text-[#D1C0B2]">{desc}</div>
        </div>
      ))}
    </div>
  );
}

const pages = [
  { id: "home", label: "Home", icon: Home },
  { id: "turtle", label: "Turtle Way", icon: Sparkles },
  { id: "prompts", label: "Prompt Engine", icon: Wand2 },
  { id: "collections", label: "Prompt Collections", icon: BookOpen },
  { id: "styles", label: "Style Vault", icon: Library },
  { id: "vocals", label: "Vocal Library", icon: Radio },
  { id: "references", label: "Reference Map", icon: ListMusic },
  { id: "lyrics", label: "Lyrics + Structure", icon: FileText },
  { id: "tags", label: "Suno Tags", icon: Tags },
  { id: "exclusions", label: "Exclusions", icon: Shield },
  { id: "features", label: "Suno Features", icon: SlidersHorizontal },
  { id: "workflow", label: "Workflow", icon: Workflow },
  { id: "mix", label: "Mix + DJ", icon: Headphones },
  { id: "radio", label: "Radio DJ", icon: Music4 },
  { id: "rights", label: "Rights", icon: Gauge },
];

const turtleRules = [
  "Custom Mode over Simple Mode when control matters.",
  "Style box controls the sonic lane. Lyrics box controls structure and performance.",
  "Keep the lyrics box lean. Strong images, fewer words, more air.",
  "Build songs section by section. Director approach beats one-shot roulette.",
  "Impact can come from silence, kick, bass, snare, and restraint.",
  "Use exclusions aggressively when Suno drifts.",
  "Make everything reusable. Strong prompts become templates.",
];

const promptBlueprint = `MASTER PROMPT STACK

1) GOAL
What is the song supposed to feel like?

2) FORMAT
Instrumental only / vocal song / club mix / intro tool / extended mix

3) STYLE BOX
Genre + mood + instrumentation + vocal character + arrangement behavior

4) LYRICS / STRUCTURE BOX
Only the section tags and actual singable lines.

5) EXCLUSIONS
List what must never happen.

6) ADVANCED OPTIONS
Weirdness / Style Influence / Audio Influence

7) REVIEW LOOP
What worked?
What drifted?
What needs tightening?`;

const styleFormula = `STYLE BOX FORMULA

[Primary genre], [secondary influence], [emotional lane], [tempo/BPM], [lead vocal type or instrumental], [instrumentation], [mix attitude], [arrangement behavior], [do-not-drift clues]

Example:
Dark cinematic synth-pop, sensual slow-burn, 92 BPM, intimate female lead, analog bass, restrained drums, expensive tension, no trap, no EDM cheese, no brass`;

const lyricsFormula = `[Intro]
(no vocal)

[Verse]
short line
short line
short line
short line

[Pre-Chorus]
rising line
rising line

[Chorus]
hook line
answer line
hook line
answer line

[Bridge]
contrast section
less words
more tension`;

const output4 = `[OUTPUT 4: SONG CUES + MIX & MASTER NOTES]
[(ALL INSTRUCTION ONLY — DO NOT SING)]

[VOCAL MIX:]
[Lead mono, center, forward]
[Light compression, clean diction]
[Plate reverb only]
[No widening on lead]

[GLOBAL:]
[Roland Jupiter sound palette only]
[Cinematic 80s tension with warm analog weight]

[MASTER:]
[Glue comp 1.5–2:1]
[Attack 20–30ms]
[Release auto / ~120ms]
[Gain reduction 1–2 dB]
[Limiter transparent; ceiling -1 dBTP]`;

const exclusionsMaster = `MASTER EXCLUSIONS CORE

No vocal chops
No spoken words
No choir wash
No brass
No horn stabs
No trap hats
No future bass
No hardstyle
No festival EDM drop
No supersaw overload
No dreamy ballad feel
No sweetness
No glossy modern vocals
No washed reverb
No echo FX
No vocal delay
No bright lift
No overcrowded arrangement`;

const advancedOptions = [
  {
    title: "Safe default for polished songs",
    text: `Weirdness: 10–20
Style Influence: 70–85
Audio Influence: 0 unless using source audio`,
  },
  {
    title: "Creative but still usable",
    text: `Weirdness: 20–35
Style Influence: 65–80
Audio Influence: 0–20`,
  },
  {
    title: "For your Turtle sound",
    text: `Weirdness: 12–25
Style Influence: 75–90
Audio Influence: 0 unless extending a strong approved section`,
  },
];

const styleTemplates = [
  {
    title: "Dark fatal minimal — updated core lane",
    text: `Dark cinematic femme-fatale track, sparse and hard-hitting, cold sensual dangerous feminine energy, minimal arrangement, intimate low female vocal, dry close-mic mono lead, deep clean bass pulse, punchy dry kick, sharp snare, silence before impact, tension through space, sleek noir atmosphere, stylish and lethal, emotional restraint, no softness, no sweetness, no chorus bloom`,
  },
  {
    title: "Liquid DnB emotional",
    text: `Liquid drum and bass, atmospheric and emotional, 174 BPM with half-time vocal feel, deep clean sub, spacious piano motifs, restrained lift into a chest-hitting drop, cinematic but club-capable, no pop cheese, no jump-up aggression`,
  },
  {
    title: "Pure instrumental only",
    text: `Pure instrumental only, absolutely no vocals, no voice, no spoken words, no chanting, no whispers, no breaths, no human sounds, synths and instruments only`,
  },
];

const lyricTemplates = [
  {
    title: "Cold restrained vocal direction note",
    text: `[Very slow, cold, controlled, close-mic, low female vocal, dry delivery, no bloom, no belting, chorus does not get bigger, music hits through kick, bass, snare, and silence]`,
  },
  {
    title: "Soft sexy sparse cadence",
    text: `[Verse]
Low light
on us
We move
through the sound
Stay close
real slow`,
  },
  {
    title: "Hook skeleton",
    text: `[Chorus]
Don't pull away
Stay in the blue
Hold me like you do`,
  },
];

const featureCards = [
  {
    title: "Custom Mode",
    body: "Use Custom Mode when you want proper control over lyrics, style, structure, title, instrumental toggle, and advanced shaping.",
  },
  {
    title: "Reuse Prompt",
    body: "Version intelligently. Change only the weak variable.",
  },
  {
    title: "Extend",
    body: "Best used after approving a section. Build the song in steps.",
  },
];

const workflowSteps = [
  { title: "1. Lock the lane", text: "Decide the exact job of the track." },
  { title: "2. Build the style box", text: "Genre, mood, instrumentation, voice, arrangement, exclusions." },
  { title: "3. Keep lyrics lean", text: "Write only what should actually be sung." },
  { title: "4. Generate the intro first", text: "Approve the mood before moving into verse and chorus." },
  { title: "5. Extend intentionally", text: "Verse → Pre → Chorus → Bridge → Final Chorus → Outro." },
];

const vocalLibrary = {
  pop: `bright polished pop vocal
airy emotional pop vocal
powerful radio pop belting
soft intimate pop female lead`,
  rnb: `smooth sensual R&B vocal
rich soulful female vocal
smoky late-night soul vocal
melismatic gospel-influenced vocal`,
  dark: `sultry dark-pop female vocal
dramatic cinematic femme vocal
haunting gothic female lead
intense emotional torch-style vocal`,
  texture: `breathy
smoky
velvety
crystal-clear
silky
intimate close-mic`,
  bestForYourLane: `1. smoky sensual female vocal
2. angelic ethereal female vocal
3. powerful soulful female vocal
4. dark cinematic female vocal`,
};

const referenceLibrary = {
  popFemale: `Beyoncé — pop, R&B, vocal powerhouse
Taylor Swift — country pop, narrative songwriting
Rihanna — pop, dancehall, reggae
Adele — soul, pop ballad, emotional vocals`,
  rock: `The Beatles — rock and roll, pop rock
Nirvana — grunge, alternative rock
Coldplay — pop rock, alternative rock
Muse — alternative rock, progressive rock`,
  hipHop: `Eminem — hip hop, rap
Kendrick Lamar — hip hop, conscious rap, jazz rap
Drake — hip hop, R&B, pop rap
Cardi B — hip hop, trap`,
  electronic: `Daft Punk — house, electronic, disco
Calvin Harris — EDM, dance pop, electro house
Deadmau5 — progressive house, electro house, techno
Flume — future bass, electronic, downtempo`,
  proTips: `Use artist names as private inspiration, then convert them into descriptive traits.
Separate genre, vocal tone, songwriting style, and production texture.`,
  safeConversion: `Instead of: "in the style of Taylor Swift"
Use: "narrative country-pop writing, intimate female lead, modern polished pop drums, emotional chorus lift"`,
};

const collectionLibrary = {
  nav: `Song Prompt Guide
Song Structure Basics
Advanced Lyric Structure
Describe Mode Guide
Complete Genre Reference`,
  optimization: `Copy and modify.
Mix elements carefully.
Adjust tempo, mood, and instrumentation.
Experiment with variations.
Layer details when needed.`,
  structureBasics: `Core sections:
Verse — tells the story
Chorus / Hook — memorable repeated highlight
Pre-Chorus — builds into the chorus
Bridge — contrast before the final chorus`,
  pop: `pop, synth-pop, bright melodies, nostalgic, 80s retro vibe, medium-fast tempo, electronic drums
pop, dark pop, moody synths, mysterious, brooding atmosphere, slow tempo, dramatic tension`,
  electronic: `electronic, deep house, lush textures, hypnotic, immersive atmosphere, medium tempo
edm, trance fusion, melodic and uplifting, celestial vibe, fast tempo`,
};

const sunoTagLibrary = {
  basics: `Square brackets [ ... ] = structure or direction tags.
Use them deliberately and sparingly.`,
  dynamics: `[Build-up dynamics]
[Gradual swell]
[Rhythmic build-up]
[Emotional climax]
[Tonal resolution]`,
  harmony: `[Bridge modulation]
[Chromatic transition]
[Relative switch]
[Voice leading]`,
  arrangement: `[Atmospheric shift]
[Textural contrast]
[Quiet arrangement]
[Outward expansion]`,
  narrative: `[Guided imagery]
[Narrative build-up]
[Storytelling arc]
[Introspective moment]`,
  example: `[Intro]
[Quiet arrangement]

[Verse]
[Introspective moment]

[Pre-Chorus]
[Rhythmic build-up]

[Chorus]
[Emotional climax]
[Outward expansion]`,
};

const radioTemplates = [
  {
    title: "Deep Play Box — radio intro script prompt",
    text: `Act as a professional radio production manager. Write a 30-second script for a club / dance radio show intro.
Use a 3-part structure: Hook → Show Name → Teaser.
Include production notes for bass drops and sweepers.`,
  },
  {
    title: "Technical Master — broadcast engineer prompt",
    text: `Act as a professional radio broadcast engineer. I want a pitch-perfect radio DJ sound for a club podcast.
Provide EQ, compression, mastering chain, and noise reduction tips.`,
  },
  {
    title: "Turtle version — dark clean club announcer",
    text: `Professional club-style radio DJ voice, dark and controlled, crystal clear, deep close-mic presence, dry lead, punchy compression, tight low end, crisp top clarity, zero hiss, zero hum, zero interference.`,
  },
];

const djTemplates = [
  {
    title: "DJ track prep checklist",
    text: `Analyze BPM
Check beatgrid
Set key / Camelot label
Cue intro
Cue drop
Cue breakdown
Cue outro`,
  },
  {
    title: "Phrase-aware transition rules",
    text: `Mix on phrase boundaries
Use 8 / 16 / 32 bar logic
Swap bass on the one
If vocals clash, wait or cut`,
  },
  {
    title: "Turtle mix priorities",
    text: `Lead vocal mono and centered
Low end controlled and clean
Preserve transients
Use warmth over brightness`,
  },
];

const rightsText = `RIGHTS SNAPSHOT

Paid plans typically allow commercial use for songs made while subscribed.
Free plans are generally non-commercial.
Original lyrics you write remain yours.
Do not imitate identifiable songs too closely.`;

const sanityChecks = {
  pageCount: pages.length,
  hasMixTemplates: djTemplates.length > 0,
  hasVocalLibrary: Object.keys(vocalLibrary).length > 0,
  hasCollections: Object.keys(collectionLibrary).length > 0,
  hasTagLibrary: Object.keys(sunoTagLibrary).length > 0,
};

// Home page sub-components
function HeroSection() {
  const features = [
    [Music4, "Build cleaner songs"],
    [Layers, "Use sections properly"],
    [Radio, "Control vocal behavior"],
    [Disc3, "Create DJ-ready versions"],
  ];

  return (
    <Card className={`${card} overflow-hidden`}>
      <CardContent className="p-8 md:p-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <Badge className="mb-4 rounded-full border border-[#CFA18D]/30 bg-[#CFA18D]/20 text-[#F5EDE5]">Turtle Suno System</Badge>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">The full master website for making better Suno songs.</h1>
            <p className={`mt-4 text-base md:text-lg ${soft}`}>
              Built as a usable handbook: templates, copy boxes, workflow logic, mix notes, prompt collections, and Suno tag guidance.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge variant="secondary" className="rounded-full">Prompt blueprints</Badge>
              <Badge variant="secondary" className="rounded-full">Style vault</Badge>
              <Badge variant="secondary" className="rounded-full">Lyrics maps</Badge>
              <Badge variant="secondary" className="rounded-full">Suno tags</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {features.map(([Icon, label], i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <Icon className="mb-3 h-6 w-6 text-[#CFA18D]" />
                <div className="font-medium">{label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}

function HomePage() {
  return (
    <div className="space-y-6">
      <HeroSection />

      <div className="grid gap-6 md:grid-cols-2">
        <CopyBox
          title="Built-in sanity checks"
          text={`Page count: ${sanityChecks.pageCount}
Has mix templates: ${String(sanityChecks.hasMixTemplates)}
Has vocal library: ${String(sanityChecks.hasVocalLibrary)}
Has collections: ${String(sanityChecks.hasCollections)}
Has tag library: ${String(sanityChecks.hasTagLibrary)}`}
          small
        />
        <CopyBox
          title="Test cases to try"
          text={`1. Open Home and confirm the header renders.
2. Open Mix + DJ and confirm all 3 copy boxes render.
3. Open Vocal Library and confirm the vocal boxes render.
4. Open Prompt Collections and confirm the prompt banks render.
5. Open Suno Tags and confirm the tag boxes render.
6. Search for mix and confirm nav filtering works.
7. Click Copy and confirm the button changes to Copied.`}
          small
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <CopyBox title="Quick-start master prompt stack" text={promptBlueprint} />
      </div>
    </div>
  );
}

function TurtlePage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className={card}>
          <CardHeader>
            <CardTitle>The Turtle Way</CardTitle>
            <CardDescription className={soft}>Your core operating philosophy for Suno.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-base leading-7">
              {turtleRules.map((rule) => (
                <li key={rule} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#CFA18D] flex-shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <CopyBox title="Output 4 master block" text={output4} />
      </div>
      <CopyBox title="Style box formula" text={styleFormula} />
    </div>
  );
}

function PromptPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <CopyBox title="Prompt architecture" text={promptBlueprint} />
        <CopyBox title="Lyrics / structure formula" text={lyricsFormula} />
      </div>
    </div>
  );
}

function CollectionsPage() {
  return (
    <div className="space-y-6">
      <Card className={card}>
        <CardHeader>
          <CardTitle>Prompt Collections</CardTitle>
          <CardDescription className={soft}>Large copy-ready banks for describe mode, structure basics, genre prompts, and workflow notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <StatGrid
            items={[
              ["Song Prompt Guide", "Structure + describe mode"],
              ["Genre collections", "Pop, R&B, electronic"],
              ["Extended banks", "Orchestral and folk"],
              ["Optimization", "How to get better generations"],
            ]}
          />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <CopyBox title="Quick navigation" text={collectionLibrary.nav} />
        <CopyBox title="Prompt optimization tips" text={collectionLibrary.optimization} />
        <CopyBox title="Song structure basics" text={collectionLibrary.structureBasics} />
        <CopyBox title="Pop prompt bank" text={collectionLibrary.pop} />
        <CopyBox title="House & electronic prompt bank" text={collectionLibrary.electronic} />
      </div>
    </div>
  );
}

function StylesPage() {
  return (
    <div className="space-y-6">
      <Card className={card}>
        <CardHeader>
          <CardTitle>Updated sound target</CardTitle>
          <CardDescription className={soft}>This is the corrected core lane for the dangerous feminine track direction.</CardDescription>
        </CardHeader>
        <CardContent>
          <StatGrid
            items={[
              ["Core feel", "Dark, minimal, feminine"],
              ["Energy", "Cold, hard-hitting, stylish"],
              ["Behavior", "Restrained, sleek, dangerous"],
              ["Avoid", "Soft ballad energy, dreamy noir, cosplay"],
            ]}
          />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        {styleTemplates.map((item) => (
          <CopyBox key={item.title} title={item.title} text={item.text} />
        ))}
      </div>
    </div>
  );
}

function VocalsPage() {
  return (
    <div className="space-y-6">
      <Card className={card}>
        <CardHeader>
          <CardTitle>Female Vocal Library</CardTitle>
          <CardDescription className={soft}>A structured bank of female vocal directions you can plug into Suno style prompts and testing rounds.</CardDescription>
        </CardHeader>
        <CardContent>
          <StatGrid
            items={[
              ["Pop", "Bright, polished, direct"],
              ["R&B / Soul", "Sensual, rich, fluid"],
              ["Dark / Dramatic", "Stylish, lethal, cinematic"],
              ["Texture", "Breathy, smoky, silky"],
            ]}
          />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <CopyBox title="Pop vocal styles" text={vocalLibrary.pop} />
        <CopyBox title="R&B / Soul vocal styles" text={vocalLibrary.rnb} />
        <CopyBox title="Dark / Dramatic vocal styles" text={vocalLibrary.dark} />
        <CopyBox title="Texture descriptors" text={vocalLibrary.texture} />
        <CopyBox title="Best next options for your lane" text={vocalLibrary.bestForYourLane} />
      </div>
    </div>
  );
}

function ReferencePage() {
  return (
    <div className="space-y-6">
      <Card className={card}>
        <CardHeader>
          <CardTitle>Artist Reference Map</CardTitle>
          <CardDescription className={soft}>A reference bank for inspiration, converted into reusable genre and trait language.</CardDescription>
        </CardHeader>
        <CardContent>
          <StatGrid
            items={[
              ["Genre bank", "Artists grouped by lane"],
              ["Trait conversion", "Turn names into descriptors"],
              ["Prompt safety", "Use references as inspiration"],
              ["Reusable prompts", "Descriptor-first phrasing"],
            ]}
          />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <CopyBox title="Pop — female icons" text={referenceLibrary.popFemale} />
        <CopyBox title="Rock" text={referenceLibrary.rock} />
        <CopyBox title="Hip-hop / rap" text={referenceLibrary.hipHop} />
        <CopyBox title="Electronic" text={referenceLibrary.electronic} />
        <CopyBox title="How to use artist references better" text={referenceLibrary.proTips} />
        <CopyBox title="Convert artist names into safer descriptors" text={referenceLibrary.safeConversion} />
      </div>
    </div>
  );
}

function LyricsPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {lyricTemplates.map((item) => (
        <CopyBox key={item.title} title={item.title} text={item.text} />
      ))}
    </div>
  );
}

function TagsPage() {
  return (
    <div className="space-y-6">
      <Card className={card}>
        <CardHeader>
          <CardTitle>Suno Lyrics Tags</CardTitle>
          <CardDescription className={soft}>A practical tag layer for shaping structure, emotion, arrangement, transitions, and story beats.</CardDescription>
        </CardHeader>
        <CardContent>
          <StatGrid
            items={[
              ["Dynamics", "Build, climax, release"],
              ["Harmony", "Modulation and pivots"],
              ["Arrangement", "Texture and contrast"],
              ["Narrative", "Foreshadowing and arc"],
            ]}
          />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <CopyBox title="Tag basics" text={sunoTagLibrary.basics} />
        <CopyBox title="Dynamics and energy tags" text={sunoTagLibrary.dynamics} />
        <CopyBox title="Harmony tags" text={sunoTagLibrary.harmony} />
        <CopyBox title="Arrangement tags" text={sunoTagLibrary.arrangement} />
        <CopyBox title="Narrative tags" text={sunoTagLibrary.narrative} />
        <CopyBox title="Example tagged structure" text={sunoTagLibrary.example} />
      </div>
    </div>
  );
}

function ExclusionsPage() {
  return (
    <div className="space-y-6">
      <CopyBox title="Master exclusions" text={exclusionsMaster} />
    </div>
  );
}

function FeaturesPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featureCards.map((item) => (
          <Card key={item.title} className={card}>
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className={soft}>{item.body}</CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {advancedOptions.map((item) => (
          <CopyBox key={item.title} title={item.title} text={item.text} />
        ))}
      </div>
    </div>
  );
}

function WorkflowPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {workflowSteps.map((item) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className={card}>
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className={soft}>{item.text}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MixPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {djTemplates.map((item) => (
          <CopyBox key={item.title} title={item.title} text={item.text} />
        ))}
      </div>
    </div>
  );
}

function RadioPage() {
  return (
    <div className="space-y-6">
      <Card className={card}>
        <CardHeader>
          <CardTitle>Radio DJ / Broadcast Voice</CardTitle>
          <CardDescription className={soft}>Club-style radio intros and ready-to-copy prompt setups for clean DJ voice energy.</CardDescription>
        </CardHeader>
        <CardContent>
          <StatGrid
            items={[
              ["Script writing", "Hook, show name, teaser"],
              ["Audio engineering", "EQ, compression, cleanup"],
              ["AI generation", "Prompt language for voice tools"],
              ["Terminology", "Use real hi-fi words"],
            ]}
          />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        {radioTemplates.map((item) => (
          <CopyBox key={item.title} title={item.title} text={item.text} />
        ))}
      </div>
    </div>
  );
}

function RightsPage() {
  return (
    <div className="space-y-6">
      <CopyBox title="Rights and monetisation snapshot" text={rightsText} />
    </div>
  );
}

// Sidebar Navigation Component
function Sidebar({ page, setPage, query, setQuery, filteredPages }) {
  return (
    <aside className="border-r border-white/10 bg-black/20 p-4 lg:p-6">
      <div className="sticky top-0 space-y-5">
        <div>
          <div className="text-sm uppercase tracking-[0.25em] text-[#FDE68A]">Master website</div>
          <div className="mt-2 text-3xl font-semibold">Turtle Suno Playbook</div>
          <p className={`mt-2 text-base ${soft}`}>Every rule, template, workflow, and copy box in one place.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages..."
            className="rounded-2xl border-white/10 bg-white/5 pl-9"
          />
        </div>

        <ScrollArea className="h-[65vh] pr-2">
          <div className="space-y-2">
            {filteredPages.map((item) => {
              const Icon = item.icon;
              const active = page === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPage(item.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${active ? "bg-white text-[#0B0E1A]" : "bg-white/5 text-white hover:bg-white/10"}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-base font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}

// Main Content Header Component
function ContentHeader({ currentLabel, page, setPage }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-3xl font-semibold md:text-4xl">{currentLabel}</h2>
        <p className={`${soft} mt-1 text-base`}>Structured for fast use, copying, and iteration.</p>
      </div>
      <Tabs value={page} onValueChange={(value) => setPage(value)}>
        <TabsList className="rounded-2xl border border-white/10 bg-white/5">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="mix">Mix</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

export default function TurtleSunoMasterPlaybook() {
  const [page, setPage] = useState("home");
  const [query, setQuery] = useState("");

  const filteredPages = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return pages;
    return pages.filter((item) => item.label.toLowerCase().includes(trimmed));
  }, [query, pages]);

  const currentPageMap = {
    home: HomePage,
    turtle: TurtlePage,
    prompts: PromptPage,
    collections: CollectionsPage,
    styles: StylesPage,
    vocals: VocalsPage,
    references: ReferencePage,
    lyrics: LyricsPage,
    tags: TagsPage,
    exclusions: ExclusionsPage,
    features: FeaturesPage,
    workflow: WorkflowPage,
    mix: MixPage,
    radio: RadioPage,
    rights: RightsPage,
  };

  const CurrentPage = currentPageMap[page];
  const currentLabel = pages.find((item) => item.id === page)?.label ?? "Home";

  return (
    <div className={shell}>
      <div className="grid min-h-screen lg:grid-cols-[290px_1fr]">
        <Sidebar 
          page={page} 
          setPage={setPage} 
          query={query} 
          setQuery={setQuery} 
          filteredPages={filteredPages} 
        />

        <main className="p-5 md:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl space-y-6">
            <ContentHeader currentLabel={currentLabel} page={page} setPage={setPage} />
            <CurrentPage />
          </div>
        </main>
      </div>
    </div>
  );
}
