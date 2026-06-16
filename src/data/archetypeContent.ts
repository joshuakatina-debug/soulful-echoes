/**
 * archetypeContent.ts
 *
 * Soul Sounds — Archetype presentation copy.
 *
 * Holds ONLY the human-facing text shown on the results page.
 * Separated from archetypes.ts (numeric dimensions) so copy can be
 * edited freely without touching scoring data.
 *
 * Records are keyed by archetype id — the same id used in
 * archetypes.ts. Adding a new archetype means adding an entry to both
 * files under the same id.
 *
 * Only the 18 OFFICIAL Soul Sounds archetypes are included.
 */

export interface ArchetypeContent {
  soulIdentity: string;
  soulKeywords: string[];
  coreEmotion: string;
  corePurpose: string;
  emotionalJourney: string;
  desiredListenerExperience: string;
  promptFoundation: string;
}

export const archetypeContent: Record<string, ArchetypeContent> = {
  idealist: {
    soulIdentity: "A soul guided by what could be — moved by visions of a better world.",
    soulKeywords: ["hopeful", "principled", "visionary", "sincere", "uplifting"],
    coreEmotion: "Hope",
    corePurpose: "To hold the picture of a kinder world steady, even when others can't see it.",
    emotionalJourney: "From quiet disappointment toward renewed faith in what is possible.",
    desiredListenerExperience: "A slow, rising light — gentle conviction, chest opening.",
    promptFoundation: "Warm piano, sustained strings, soft choir pads, mid tempo, hopeful major-key arc.",
  },
  activist: {
    soulIdentity: "A soul that cannot look away — moved into motion by what matters.",
    soulKeywords: ["passionate", "driven", "courageous", "alive", "unflinching"],
    coreEmotion: "Conviction",
    corePurpose: "To turn caring into action others can join.",
    emotionalJourney: "From frustration toward focused, sustained purpose.",
    desiredListenerExperience: "A propulsive, rising energy — heartbeat steady, will lit up.",
    promptFoundation: "Driving percussion, layered strings, building brass, fast tempo, anthemic minor-to-major lift.",
  },
  companion: {
    soulIdentity: "A soul that walks beside others, quietly making the journey lighter.",
    soulKeywords: ["loyal", "warm", "present", "kind", "steady"],
    coreEmotion: "Belonging",
    corePurpose: "To remind others they are not alone.",
    emotionalJourney: "From over-giving toward letting connection move both ways.",
    desiredListenerExperience: "A wrap-around warmth — like a shared breath at the end of the day.",
    promptFoundation: "Felt piano, close strings, soft acoustic guitar, slow tempo, tender major harmonies.",
  },
  anchor: {
    soulIdentity: "A soul others reach for when the ground feels uncertain.",
    soulKeywords: ["grounded", "calm", "dependable", "steady", "rooted"],
    coreEmotion: "Stability",
    corePurpose: "To hold the center while life moves around them.",
    emotionalJourney: "From silent strength toward letting others hold them in return.",
    desiredListenerExperience: "A deep, settled stillness — like standing on bedrock.",
    promptFoundation: "Low piano, sustained cello, soft drone, slow heartbeat tempo, rich grounding harmonies.",
  },
  champion: {
    soulIdentity: "A soul forged in conviction, unwilling to let anyone be left behind.",
    soulKeywords: ["bold", "protective", "resolute", "powerful", "true"],
    coreEmotion: "Courage",
    corePurpose: "To stand up — for themselves, for others, for what is right.",
    emotionalJourney: "From carrying too much alone toward leading with open strength.",
    desiredListenerExperience: "A rising, unstoppable force — chest forward, will steady.",
    promptFoundation: "Driving low strings, taiko-like percussion, brass swells, building tempo, heroic minor key.",
  },
  achiever: {
    soulIdentity: "A soul that turns vision into evidence — and keeps going.",
    soulKeywords: ["focused", "driven", "capable", "precise", "determined"],
    coreEmotion: "Mastery",
    corePurpose: "To build, finish, and elevate what they touch.",
    emotionalJourney: "From relentless striving toward enjoying what they've made.",
    desiredListenerExperience: "A clean, propulsive momentum — forward motion with intent.",
    promptFoundation: "Crisp piano patterns, driving strings, subtle electronic pulse, steady tempo, modern cinematic tone.",
  },
  muse: {
    soulIdentity: "A soul whose presence sparks creation in others.",
    soulKeywords: ["enchanting", "playful", "luminous", "free", "alive"],
    coreEmotion: "Delight",
    corePurpose: "To remind the world that beauty is reason enough.",
    emotionalJourney: "From inspiring others toward honoring their own creative voice.",
    desiredListenerExperience: "A shimmering, dancing lightness — like sunlight through leaves.",
    promptFoundation: "Delicate piano, plucked strings, soft woodwinds, lilting tempo, airy and graceful.",
  },
  imagineer: {
    soulIdentity: "A soul who sees doors where others see walls.",
    soulKeywords: ["inventive", "curious", "playful", "visionary", "expansive"],
    coreEmotion: "Wonder",
    corePurpose: "To shape new worlds out of ordinary materials.",
    emotionalJourney: "From scattered ideas toward bringing one fully to life.",
    desiredListenerExperience: "An unfolding, evolving texture — something quietly becoming.",
    promptFoundation: "Layered piano and synth, evolving textures, subtle electronic pulse, shifting harmonies.",
  },
  philosopher: {
    soulIdentity: "A soul that listens more than it speaks, drawn to depth and meaning.",
    soulKeywords: ["wise", "still", "considered", "discerning", "lucid"],
    coreEmotion: "Clarity",
    corePurpose: "To turn experience into understanding worth sharing.",
    emotionalJourney: "From restless searching toward a calm, steady knowing.",
    desiredListenerExperience: "Inner spaciousness — like sitting at the edge of a still lake at dawn.",
    promptFoundation: "Acoustic piano, low strings, gentle wood textures, unhurried tempo, contemplative modal harmony.",
  },
  architect: {
    soulIdentity: "A soul that sees order beneath what looks like chaos.",
    soulKeywords: ["precise", "thoughtful", "structured", "clear", "calm"],
    coreEmotion: "Composure",
    corePurpose: "To build elegant frameworks others can live inside.",
    emotionalJourney: "From perfectionism toward trusting their own quiet vision.",
    desiredListenerExperience: "A geometric, crystalline calm — measured, beautiful, precise.",
    promptFoundation: "Minimalist piano patterns, clean string lines, subtle electronic pulse, steady tempo, modern classical tone.",
  },
  guardian: {
    soulIdentity: "A soul that protects what matters, quietly and without applause.",
    soulKeywords: ["steady", "loyal", "grounded", "devoted", "warm"],
    coreEmotion: "Care",
    corePurpose: "To make the people and places around them feel safe.",
    emotionalJourney: "From silent duty toward letting their own heart be held in return.",
    desiredListenerExperience: "A feeling of being safely held — strong, warm, and unwavering.",
    promptFoundation: "Cello, warm piano, sustained strings, slow heartbeat tempo, rich and reassuring harmonies.",
  },
  confidant: {
    soulIdentity: "A soul others trust with the truths they cannot say out loud.",
    soulKeywords: ["safe", "deep", "patient", "tender", "wise"],
    coreEmotion: "Trust",
    corePurpose: "To be the steady place where another soul can finally exhale.",
    emotionalJourney: "From carrying others' secrets toward sharing their own inner world.",
    desiredListenerExperience: "An intimate, candlelit room — small, true, deeply felt.",
    promptFoundation: "Solo piano, close-mic'd, gentle string textures, slow tempo, tender melancholic-hopeful melody.",
  },
  pathfinder: {
    soulIdentity: "A soul who finds the way forward when the path is unclear.",
    soulKeywords: ["intuitive", "bold", "clear", "guiding", "open"],
    coreEmotion: "Direction",
    corePurpose: "To move first, so others can follow with courage.",
    emotionalJourney: "From feeling alone in front toward trusting that others are with them.",
    desiredListenerExperience: "A cinematic, traveling feeling — landscapes opening up ahead.",
    promptFoundation: "Fingerpicked guitar, warm strings, soft percussion, mid tempo, hopeful folk-cinematic tone.",
  },
  adventurer: {
    soulIdentity: "A soul drawn to the open road and the unfamiliar horizon.",
    soulKeywords: ["free", "alive", "curious", "fearless", "expansive"],
    coreEmotion: "Aspiration",
    corePurpose: "To follow what calls them, even without a map.",
    emotionalJourney: "From restlessness toward a sense of home carried within.",
    desiredListenerExperience: "A wide cinematic vista — high altitude, clear air, forward motion.",
    promptFoundation: "Cinematic strings, soft percussion, expansive synth pads, driving mid tempo, panoramic mix.",
  },
  maverick: {
    soulIdentity: "A soul unwilling to be made smaller than they are.",
    soulKeywords: ["unflinching", "raw", "free", "bold", "electric"],
    coreEmotion: "Defiance",
    corePurpose: "To break what cages them — and others.",
    emotionalJourney: "From anger toward freedom that knows what it is for.",
    desiredListenerExperience: "A charged, alive energy — pulse rising, walls falling.",
    promptFoundation: "Distorted low textures, driving percussion, dark synth pads, fast tempo, raw minor key.",
  },
  bear: {
    soulIdentity: "A soul of quiet strength — warm, steady, and unafraid to be soft.",
    soulKeywords: ["powerful", "warm", "grounded", "gentle", "protective"],
    coreEmotion: "Strength",
    corePurpose: "To hold others safely without ever needing to prove it.",
    emotionalJourney: "From hiding tenderness toward letting strength and softness coexist.",
    desiredListenerExperience: "A grand, warm stillness — like a deep forest at dusk.",
    promptFoundation: "Low brass, warm cello, soft taiko, slow tempo, rich and reassuring major harmonies.",
  },
  dreamer: {
    soulIdentity: "A soul that lives between worlds, sensing what is not yet visible.",
    soulKeywords: ["imaginative", "tender", "open", "yearning", "ethereal"],
    coreEmotion: "Wonder",
    corePurpose: "To hold space for the beauty others overlook.",
    emotionalJourney: "From quiet longing toward the courage to honor an inner vision.",
    desiredListenerExperience: "A floating, weightless reverie — as if drifting just above the ground.",
    promptFoundation: "Soft piano, airy synth pads, distant choir, slow tempo, dreamlike reverb, in a misty major key.",
  },
  peacemaker: {
    soulIdentity: "A soul that softens the room simply by entering it.",
    soulKeywords: ["calm", "gentle", "harmonious", "patient", "kind"],
    coreEmotion: "Peace",
    corePurpose: "To bring quiet where there has been noise.",
    emotionalJourney: "From keeping the peace outwardly toward finding it within.",
    desiredListenerExperience: "A wrap-around warmth, like slow breath returning to the body.",
    promptFoundation: "Felt piano, warm strings, soft humming pads, very slow tempo, tender major harmonies.",
  },
};
