/**
 * archetypeContent.ts
 *
 * Soul Sounds — Archetype presentation copy.
 *
 * This file holds ONLY the human-facing text shown on the results
 * page. It is intentionally separated from archetypes.ts (which holds
 * the numeric dimensions used by the Soul Engine) so that copy can be
 * edited freely without touching scoring data.
 *
 * Records are keyed by archetype id — the same id used in
 * archetypes.ts. Adding a new archetype means adding an entry to both
 * files under the same id.
 *
 * Fields:
 *   - soulIdentity              short poetic identity statement
 *   - soulKeywords              evocative descriptors for the results page
 *   - coreEmotion               the central feeling this archetype carries
 *   - corePurpose               what this soul moves toward in the world
 *   - emotionalJourney          the inner arc this archetype tends to walk
 *   - desiredListenerExperience how the Soul Sound should make them feel
 *   - promptFoundation          base musical/aesthetic seed for the
 *                               prompt generator (not the final prompt)
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
  dreamer: {
    soulIdentity: "A soul that lives between worlds, sensing what is not yet visible.",
    soulKeywords: ["imaginative", "tender", "open", "yearning", "ethereal"],
    coreEmotion: "Wonder",
    corePurpose: "To hold space for the beauty others overlook.",
    emotionalJourney: "From quiet longing toward the courage to honor an inner vision.",
    desiredListenerExperience: "A floating, weightless reverie — as if drifting just above the ground.",
    promptFoundation: "Soft piano, airy synth pads, distant choir, slow tempo, dreamlike reverb, in a misty major key.",
  },
  sage: {
    soulIdentity: "A soul that listens more than it speaks, drawn to depth and meaning.",
    soulKeywords: ["wise", "still", "considered", "discerning", "lucid"],
    coreEmotion: "Clarity",
    corePurpose: "To turn experience into understanding worth sharing.",
    emotionalJourney: "From restless searching toward a calm, steady knowing.",
    desiredListenerExperience: "A sense of inner spaciousness, like sitting at the edge of a still lake at dawn.",
    promptFoundation: "Acoustic piano, low strings, gentle wood textures, unhurried tempo, contemplative modal harmony.",
  },
  wanderer: {
    soulIdentity: "A soul drawn to the open road and the unfamiliar horizon.",
    soulKeywords: ["curious", "free", "searching", "unbound", "alive"],
    coreEmotion: "Longing",
    corePurpose: "To follow what calls them, even without a map.",
    emotionalJourney: "From rootlessness toward a sense of home carried within.",
    desiredListenerExperience: "A cinematic, traveling feeling — landscapes opening up beyond the window.",
    promptFoundation: "Fingerpicked guitar, warm strings, soft percussion, mid tempo, hopeful folk-cinematic tone.",
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
  mystic: {
    soulIdentity: "A soul tuned to subtle currents others cannot quite name.",
    soulKeywords: ["intuitive", "deep", "sensitive", "knowing", "sacred"],
    coreEmotion: "Reverence",
    corePurpose: "To bridge the seen and the unseen.",
    emotionalJourney: "From feeling unseen toward trusting the gifts of their own inner sight.",
    desiredListenerExperience: "A hushed, sacred atmosphere — like candlelight in an old chapel.",
    promptFoundation: "Ethereal pads, soft female vocalise, low drone, very slow tempo, modal and meditative.",
  },
  luminary: {
    soulIdentity: "A soul whose presence quietly lights the room before they speak.",
    soulKeywords: ["radiant", "warm", "uplifting", "bright", "magnetic"],
    coreEmotion: "Hope",
    corePurpose: "To remind others of what is still possible.",
    emotionalJourney: "From self-doubt toward fully stepping into their own light.",
    desiredListenerExperience: "A swelling, sunrise feeling — chest opening, eyes lifting.",
    promptFoundation: "Bright piano, soaring strings, gentle brass, building tempo, uplifting major-key arc.",
  },
  alchemist: {
    soulIdentity: "A soul that transforms whatever it touches, including itself.",
    soulKeywords: ["creative", "transformative", "curious", "inventive", "alive"],
    coreEmotion: "Discovery",
    corePurpose: "To turn raw experience into something newly meaningful.",
    emotionalJourney: "From discontent toward the joy of reshaping their own world.",
    desiredListenerExperience: "An unfolding, evolving texture — something quietly becoming.",
    promptFoundation: "Layered piano and synth, evolving textures, subtle electronic pulse, shifting harmonies.",
  },
  voyager: {
    soulIdentity: "A soul built for distance — emotional, physical, spiritual.",
    soulKeywords: ["bold", "expansive", "adventurous", "vast", "open"],
    coreEmotion: "Aspiration",
    corePurpose: "To reach the edges of what they are capable of.",
    emotionalJourney: "From restlessness toward purposeful, chosen direction.",
    desiredListenerExperience: "A wide cinematic vista — high altitude, clear air, forward motion.",
    promptFoundation: "Cinematic strings, soft percussion, expansive synth pads, driving mid tempo, panoramic mix.",
  },
  healer: {
    soulIdentity: "A soul others instinctively soften around.",
    soulKeywords: ["gentle", "nurturing", "tender", "calming", "warm"],
    coreEmotion: "Compassion",
    corePurpose: "To restore wholeness wherever something is hurting.",
    emotionalJourney: "From over-giving toward learning that they too may be tended.",
    desiredListenerExperience: "A wrap-around warmth, like slow breath returning to the body.",
    promptFoundation: "Felt piano, warm strings, soft humming pads, very slow tempo, tender major harmonies.",
  },
  poet: {
    soulIdentity: "A soul that translates ordinary moments into quiet beauty.",
    soulKeywords: ["lyrical", "reflective", "sensitive", "elegant", "intimate"],
    coreEmotion: "Tenderness",
    corePurpose: "To name the feelings others can't quite reach.",
    emotionalJourney: "From private grief toward sharing their voice with the world.",
    desiredListenerExperience: "An intimate, candlelit room — small, true, deeply felt.",
    promptFoundation: "Solo piano, close-mic'd, gentle string textures, slow tempo, melancholic-yet-hopeful melody.",
  },
  warrior: {
    soulIdentity: "A soul forged in conviction, unwilling to look away.",
    soulKeywords: ["fierce", "resolute", "fearless", "powerful", "true"],
    coreEmotion: "Courage",
    corePurpose: "To stand for what is right, even alone.",
    emotionalJourney: "From hardness toward strength that is allowed to feel.",
    desiredListenerExperience: "A rising, unstoppable force — heartbeat steady, chest forward.",
    promptFoundation: "Driving low strings, taiko-like percussion, brass swells, building tempo, heroic minor key.",
  },
  monarch: {
    soulIdentity: "A soul with natural gravity — others orient toward them.",
    soulKeywords: ["composed", "regal", "grounded", "commanding", "warm"],
    coreEmotion: "Dignity",
    corePurpose: "To lead with grace and unwavering presence.",
    emotionalJourney: "From the weight of responsibility toward a quieter, fuller authority.",
    desiredListenerExperience: "A grand, cinematic stillness — vast halls bathed in late afternoon light.",
    promptFoundation: "Full orchestral strings, noble piano, sustained brass, stately tempo, rich major harmonies.",
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
  hermit: {
    soulIdentity: "A soul that finds the world by stepping quietly out of it.",
    soulKeywords: ["solitary", "reflective", "deep", "patient", "still"],
    coreEmotion: "Stillness",
    corePurpose: "To listen — to themselves, to silence, to truth.",
    emotionalJourney: "From withdrawal toward returning with something quiet to offer.",
    desiredListenerExperience: "A held silence — sparse, spacious, intimate as breath.",
    promptFoundation: "Sparse solo piano, distant cello, long pauses, very slow tempo, minimalist and bare.",
  },
  rebel: {
    soulIdentity: "A soul unwilling to be made smaller than they are.",
    soulKeywords: ["unflinching", "raw", "free", "bold", "electric"],
    coreEmotion: "Defiance",
    corePurpose: "To break what cages them — and others.",
    emotionalJourney: "From anger toward freedom that knows what it is for.",
    desiredListenerExperience: "A charged, alive energy — pulse rising, walls falling.",
    promptFoundation: "Distorted low textures, driving percussion, dark synth pads, fast tempo, raw minor key.",
  },
  lover: {
    soulIdentity: "A soul that gives itself fully — to people, art, and life.",
    soulKeywords: ["passionate", "devoted", "warm", "feeling", "true"],
    coreEmotion: "Love",
    corePurpose: "To live with their whole heart open.",
    emotionalJourney: "From fear of being hurt toward loving anyway.",
    desiredListenerExperience: "A swelling, embracing warmth — like a long-held breath finally released.",
    promptFoundation: "Lush strings, intimate piano, soft cello, slow rubato tempo, romantic and emotional harmonies.",
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
  child: {
    soulIdentity: "A soul that has kept its first sense of wonder intact.",
    soulKeywords: ["open", "joyful", "curious", "warm", "alive"],
    coreEmotion: "Joy",
    corePurpose: "To remind the world how to play.",
    emotionalJourney: "From being underestimated toward trusting their own bright knowing.",
    desiredListenerExperience: "A playful, sunlit lightness — easy smiles, easy breath.",
    promptFoundation: "Music box, soft glockenspiel, gentle piano, light strings, skipping tempo, warm major key.",
  },
};
