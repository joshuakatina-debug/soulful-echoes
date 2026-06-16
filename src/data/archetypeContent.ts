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
 * Content below is the OFFICIAL approved Soul Archetype Specification.
 * Do not rewrite, shorten, or replace this copy.
 */

export interface ArchetypeContent {
  subtitle: string;
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
    subtitle: "A soul guided by what could be.",
    soulIdentity:
      "You believe that the world changes one quiet act of integrity at a time. Guided by a deep sense of purpose, you strive to live in alignment with your values even when no one is watching. You are thoughtful, patient, and steady, believing that true influence comes through character rather than recognition. While others may chase quick results, you understand that lasting change is built slowly through consistency, humility, and hope. Your life reminds others that doing what is right is always worth pursuing.",
    soulKeywords: ["Principled", "Steadfast", "Reflective", "Peaceful", "Noble"],
    coreEmotion: "Quiet Conviction",
    corePurpose: "To inspire others through integrity, humility, and unwavering character.",
    emotionalJourney:
      "Beginning: Reflection, Order → Middle: Hope, Purpose → End: Peace, Resolution",
    desiredListenerExperience: "Grounded, Peaceful, Hopeful, Encouraged, Restored",
    promptFoundation:
      "Create an instrumental composition that embodies The Idealist. The music should express quiet conviction, peaceful confidence, and noble purpose. It should begin with thoughtful reflection, gradually grow into hopeful determination, and conclude with calm resolution, leaving the listener feeling grounded, peaceful, and inspired.",
  },
  activist: {
    subtitle: "A soul moved into motion by what matters.",
    soulIdentity:
      "You are driven by a desire to make the world a better place and to help others become their best selves. You combine strong principles with genuine compassion, stepping forward when others need guidance or encouragement. Your passion is contagious, and your heart is always searching for ways to serve a greater purpose. You inspire people through both your convictions and your kindness.",
    soulKeywords: ["Purposeful", "Courageous", "Compassionate", "Inspiring", "Resolute"],
    coreEmotion: "Purposeful Resolve",
    corePurpose: "To inspire meaningful action that brings hope and positive change.",
    emotionalJourney: "Beginning: Conviction → Middle: Determination → End: Inspiration",
    desiredListenerExperience: "Motivated, Encouraged, Hopeful, Empowered, Confident",
    promptFoundation:
      "Create an instrumental composition that embodies The Activist. The music should express compassion, determination, and purposeful action. It should begin with quiet conviction, build into courageous momentum, and conclude with an inspiring sense of hope that motivates the listener to make a positive impact.",
  },
  companion: {
    subtitle: "A soul that walks beside others.",
    soulIdentity:
      "You have a gift for seeing the needs of others and responding with warmth, generosity, and care. People feel valued in your presence because you naturally offer encouragement, support, and understanding. Your kindness is grounded in strong values, making you both dependable and nurturing. You bring comfort to others simply by being yourself.",
    soulKeywords: ["Compassionate", "Gentle", "Faithful", "Reassuring", "Warm"],
    coreEmotion: "Gentle Compassion",
    corePurpose: "To help others feel deeply loved, supported, and valued.",
    emotionalJourney: "Beginning: Welcome → Middle: Comfort → End: Belonging",
    desiredListenerExperience: "Loved, Safe, Comforted, Accepted, Warm",
    promptFoundation:
      "Create an instrumental composition that embodies The Companion. The music should communicate warmth, compassion, and sincere kindness. It should begin with a welcoming sense of safety, deepen into genuine emotional connection, and conclude with a lasting feeling of belonging and comfort.",
  },
  anchor: {
    subtitle: "A soul others reach for when the ground shifts.",
    soulIdentity:
      "You have a remarkable ability to make people feel welcomed, appreciated, and celebrated. Your warmth draws others in, while your energy motivates them to become the best version of themselves. You thrive when building connections and creating meaningful experiences. Wherever you go, you bring a sense of belonging and joy.",
    soulKeywords: ["Welcoming", "Joyful", "Encouraging", "Connected", "Generous"],
    coreEmotion: "Joyful Belonging",
    corePurpose: "To create meaningful connection by helping others feel seen, welcomed, and valued.",
    emotionalJourney: "Beginning: Invitation → Middle: Celebration → End: Connection",
    desiredListenerExperience: "Included, Joyful, Appreciated, Connected, Energized",
    promptFoundation:
      "Create an instrumental composition that embodies The Anchor. The music should celebrate joyful connection, warmth, and generosity. It should begin with an inviting spirit, blossom into vibrant celebration, and conclude with a deep sense of belonging and shared happiness.",
  },
  champion: {
    subtitle: "A soul unwilling to let anyone be left behind.",
    soulIdentity:
      "You are ambitious, charismatic, and deeply motivated to make a positive impact. Your confidence inspires others, and your ability to connect with people allows you to lead with both strength and heart. You naturally encourage those around you to dream bigger and achieve more. Your greatest gift is helping others believe in what is possible.",
    soulKeywords: ["Charismatic", "Confident", "Inspiring", "Ambitious", "Magnetic"],
    coreEmotion: "Victorious Hope",
    corePurpose: "To awaken confidence and inspire others to pursue their greatest potential.",
    emotionalJourney: "Beginning: Anticipation → Middle: Momentum → End: Triumph",
    desiredListenerExperience: "Inspired, Motivated, Confident, Energized, Victorious",
    promptFoundation:
      "Create an instrumental composition that embodies The Champion. The music should express confidence, optimism, and inspiring momentum. It should begin with anticipation, steadily build toward triumph, and conclude with a powerful feeling of victory that encourages the listener to believe in what is possible.",
  },
  achiever: {
    subtitle: "A soul that turns vision into evidence.",
    soulIdentity:
      "You are driven to master your craft and leave a meaningful mark on the world. You combine determination with creativity, always seeking excellence while remaining true to your individuality. People admire your competence, vision, and dedication. You show others that success is most fulfilling when it reflects who you truly are.",
    soulKeywords: ["Masterful", "Disciplined", "Visionary", "Refined", "Excellent"],
    coreEmotion: "Focused Excellence",
    corePurpose: "To elevate the world through mastery, creativity, and intentional craftsmanship.",
    emotionalJourney: "Beginning: Curiosity → Middle: Growth → End: Fulfillment",
    desiredListenerExperience: "Focused, Inspired, Accomplished, Hopeful, Elevated",
    promptFoundation:
      "Create an instrumental composition that embodies The Achiever. The music should communicate refinement, disciplined creativity, and purposeful excellence. It should begin with thoughtful curiosity, develop into confident mastery, and conclude with a deep sense of fulfillment that celebrates meaningful achievement.",
  },
  muse: {
    subtitle: "A soul whose presence sparks creation.",
    soulIdentity:
      "You bring passion, creativity, and emotional depth to everything you do. You are uniquely attuned to beauty, meaning, and self-expression, yet you also possess the drive to share your gifts with the world. Your authenticity inspires others to embrace their own uniqueness. You remind people that life is meant to be lived vividly and wholeheartedly.",
    soulKeywords: ["Expressive", "Passionate", "Creative", "Authentic", "Vibrant"],
    coreEmotion: "Inspired Wonder",
    corePurpose: "To awaken beauty, authenticity, and meaningful self-expression in others.",
    emotionalJourney: "Beginning: Curiosity → Middle: Expression → End: Inspiration",
    desiredListenerExperience: "Inspired, Understood, Creative, Hopeful, Alive",
    promptFoundation:
      "Create an instrumental composition that embodies The Muse. The music should celebrate creativity, emotional expression, and authentic beauty. It should begin with quiet curiosity, bloom into passionate self-expression, and conclude with an inspiring sense of possibility that encourages the listener to embrace who they truly are.",
  },
  imagineer: {
    subtitle: "A soul who sees doors where others see walls.",
    soulIdentity:
      "You see the world through a lens of imagination, wonder, and profound insight. Deeply independent and creative, you are drawn to ideas, experiences, and emotions that others may overlook. Your originality allows you to uncover hidden beauty and meaning in everyday life. You inspire others to embrace their true selves without apology.",
    soulKeywords: ["Imaginative", "Insightful", "Original", "Curious", "Visionary"],
    coreEmotion: "Quiet Wonder",
    corePurpose: "To reveal hidden beauty and inspire others to see the world through fresh eyes.",
    emotionalJourney: "Beginning: Mystery → Middle: Discovery → End: Wonder",
    desiredListenerExperience: "Curious, Peaceful, Inspired, Reflective, Awestruck",
    promptFoundation:
      "Create an instrumental composition that embodies The Imagineer. The music should evoke imagination, mystery, and quiet discovery. It should unfold like a journey into the unknown, gradually revealing moments of beauty and insight before ending with a lasting sense of wonder.",
  },
  philosopher: {
    subtitle: "A soul drawn to depth and meaning.",
    soulIdentity:
      "You possess a deep and curious mind that seeks understanding beneath the surface of things. Thoughtful, introspective, and imaginative, you are constantly exploring life's mysteries and asking meaningful questions. Your wisdom often emerges from quiet reflection, offering perspectives that help others see the world in new ways. You remind people that knowledge can be both practical and beautiful.",
    soulKeywords: ["Wise", "Inquisitive", "Thoughtful", "Profound", "Timeless"],
    coreEmotion: "Quiet Wisdom",
    corePurpose: "To seek truth, cultivate understanding, and illuminate life's deeper meaning.",
    emotionalJourney: "Beginning: Reflection → Middle: Discovery → End: Understanding",
    desiredListenerExperience: "Thoughtful, Centered, Enlightened, Peaceful, Inspired",
    promptFoundation:
      "Create an instrumental composition that embodies The Philosopher. The music should express wisdom, curiosity, and thoughtful reflection. It should begin in quiet contemplation, gradually reveal deeper understanding, and conclude with a timeless sense of peace and clarity.",
  },
  architect: {
    subtitle: "A soul that sees order beneath chaos.",
    soulIdentity:
      "You are a natural problem solver with a talent for understanding complex situations. Thoughtful, observant, and dependable, you excel at finding solutions where others see obstacles. Your calm, analytical approach brings clarity during uncertainty. People trust your judgment because you combine intelligence with reliability.",
    soulKeywords: ["Analytical", "Dependable", "Precise", "Resourceful", "Reliable"],
    coreEmotion: "Confident Clarity",
    corePurpose: "To bring order, solutions, and confidence wherever uncertainty exists.",
    emotionalJourney: "Beginning: Challenge → Middle: Clarity → End: Resolution",
    desiredListenerExperience: "Confident, Secure, Focused, Reassured, Capable",
    promptFoundation:
      "Create an instrumental composition that embodies The Architect. The music should communicate precision, confidence, and dependable strength. It should begin with thoughtful tension, steadily organize into clarity, and conclude with a deeply satisfying sense of resolution.",
  },
  guardian: {
    subtitle: "A soul that protects what matters.",
    soulIdentity:
      "You are steadfast, thoughtful, and deeply committed to protecting what matters most. You value loyalty, responsibility, and preparedness, helping create stability for those around you. Your careful judgment allows you to anticipate challenges and navigate them with wisdom. Others find strength in your dependability and trustworthiness.",
    soulKeywords: ["Loyal", "Protective", "Grounded", "Dependable", "Steadfast"],
    coreEmotion: "Steady Security",
    corePurpose: "To create safety, stability, and confidence for those entrusted to your care.",
    emotionalJourney: "Beginning: Vigilance → Middle: Strength → End: Security",
    desiredListenerExperience: "Safe, Grounded, Protected, Calm, Secure",
    promptFoundation:
      "Create an instrumental composition that embodies The Guardian. The music should express quiet strength, steadfast loyalty, and dependable protection. It should begin with careful awareness, grow into unwavering confidence, and conclude with a lasting feeling of security and peace.",
  },
  confidant: {
    subtitle: "A soul others trust with their truth.",
    soulIdentity:
      "You bring together loyalty, warmth, and an uplifting spirit. People are naturally drawn to you because they know they can count on your support and honesty. You help others feel safe while encouraging them to embrace new possibilities. Your combination of reliability and optimism makes you a trusted friend and companion.",
    soulKeywords: ["Loyal", "Encouraging", "Trustworthy", "Optimistic", "Genuine"],
    coreEmotion: "Faithful Hope",
    corePurpose: "To strengthen others through trust, encouragement, and steadfast friendship.",
    emotionalJourney: "Beginning: Trust → Middle: Encouragement → End: Hope",
    desiredListenerExperience: "Encouraged, Supported, Safe, Hopeful, Connected",
    promptFoundation:
      "Create an instrumental composition that embodies The Confidant. The music should communicate loyalty, encouragement, and enduring hope. It should begin with warmth and trust, gradually grow into uplifting confidence, and conclude with a lasting sense of optimism and genuine connection.",
  },
  pathfinder: {
    subtitle: "A soul who finds the way forward.",
    soulIdentity:
      "You are fueled by curiosity, possibility, and a love of life's adventures. You naturally see opportunities where others see obstacles, approaching each day with enthusiasm and optimism. Your adventurous spirit encourages people to step beyond their comfort zones and embrace the unknown with confidence. You remind others that some of life's greatest rewards are found by simply taking the first step.",
    soulKeywords: ["Adventurous", "Optimistic", "Curious", "Joyful", "Free"],
    coreEmotion: "Joyful Discovery",
    corePurpose: "To inspire others to embrace life's possibilities with courage and curiosity.",
    emotionalJourney: "Beginning: Curiosity → Middle: Adventure → End: Freedom",
    desiredListenerExperience: "Excited, Hopeful, Adventurous, Energized, Free",
    promptFoundation:
      "Create an instrumental composition that embodies The Pathfinder. The music should celebrate curiosity, optimism, and joyful exploration. It should begin with a sense of anticipation, build into adventurous momentum, and conclude with an exhilarating feeling of freedom and possibility.",
  },
  adventurer: {
    subtitle: "A soul drawn to the open road.",
    soulIdentity:
      "You combine bold ambition with the confidence to turn possibility into reality. Energetic, resilient, and decisive, you embrace challenges with an unwavering belief that growth comes through action. Rather than waiting for opportunities to appear, you create them. Your fearless determination inspires others to pursue their dreams with courage and conviction.",
    soulKeywords: ["Bold", "Fearless", "Energetic", "Resilient", "Courageous"],
    coreEmotion: "Fearless Momentum",
    corePurpose: "To inspire courageous action and confident pursuit of life's greatest opportunities.",
    emotionalJourney: "Beginning: Excitement → Middle: Momentum → End: Victory",
    desiredListenerExperience: "Courageous, Empowered, Confident, Motivated, Invincible",
    promptFoundation:
      "Create an instrumental composition that embodies The Adventurer. The music should express bold confidence, fearless momentum, and resilient determination. It should begin with excitement, build into unstoppable energy, and conclude with a triumphant feeling of victory and limitless possibility.",
  },
  maverick: {
    subtitle: "A soul unwilling to be made smaller.",
    soulIdentity:
      "You are bold, independent, and fiercely committed to living life on your own terms. You challenge limitations, embrace freedom, and inspire others to pursue their convictions without fear. Your courage gives people permission to think differently, act boldly, and refuse to settle for less than what they believe is possible. Your greatest strength is empowering others to discover their own.",
    soulKeywords: ["Independent", "Powerful", "Bold", "Fearless", "Liberating"],
    coreEmotion: "Unshakable Courage",
    corePurpose: "To empower others to live boldly and pursue freedom without compromise.",
    emotionalJourney: "Beginning: Challenge → Middle: Breakthrough → End: Empowerment",
    desiredListenerExperience: "Empowered, Courageous, Strong, Determined, Fearless",
    promptFoundation:
      "Create an instrumental composition that embodies The Maverick. The music should communicate fearless independence, bold conviction, and powerful determination. It should begin with challenge, rise through breakthrough, and conclude with an overwhelming sense of strength and personal freedom.",
  },
  bear: {
    subtitle: "A soul of quiet strength and warmth.",
    soulIdentity:
      "You possess a quiet strength that makes others feel safe and protected. Calm yet powerful, you stand firmly for the people and values you care about. You lead through presence rather than force, offering stability during difficult times. Your courage is matched by your compassion, reminding others that true strength is measured by the lives it protects.",
    soulKeywords: ["Protective", "Grounded", "Strong", "Compassionate", "Steadfast"],
    coreEmotion: "Quiet Strength",
    corePurpose: "To protect, encourage, and provide unwavering stability for others.",
    emotionalJourney: "Beginning: Stability → Middle: Strength → End: Peace",
    desiredListenerExperience: "Safe, Protected, Grounded, Calm, Secure",
    promptFoundation:
      "Create an instrumental composition that embodies The Bear. The music should express calm strength, dependable protection, and grounded confidence. It should begin with quiet stability, build into powerful resolve, and conclude with a peaceful sense of safety and reassurance.",
  },
  dreamer: {
    subtitle: "A soul that lives between worlds.",
    soulIdentity:
      "You see the world through a lens of hope, harmony, and possibility. Gentle, thoughtful, and idealistic, you seek peace while believing in a better future. Your calming presence helps others slow down, reflect, and reconnect with what truly matters. You inspire people to pursue harmony without losing sight of their deepest values, reminding them that hope is often the quiet force that changes the world.",
    soulKeywords: ["Hopeful", "Graceful", "Harmonious", "Gentle", "Luminous"],
    coreEmotion: "Quiet Hope",
    corePurpose: "To inspire peace, hope, and harmony through gentle encouragement.",
    emotionalJourney: "Beginning: Stillness → Middle: Wonder → End: Renewal",
    desiredListenerExperience: "Peaceful, Hopeful, Restored, Centered, Inspired",
    promptFoundation:
      "Create an instrumental composition that embodies The Dreamer. The music should express quiet hope, graceful optimism, and peaceful harmony. It should begin in stillness, gradually awaken wonder, and conclude with a feeling of renewal that leaves the listener restored and quietly inspired.",
  },
  peacemaker: {
    subtitle: "A soul that brings strength through harmony.",
    soulIdentity:
      "You have a rare ability to bring people together while remaining grounded in your own strength. Calm under pressure and naturally diplomatic, you help resolve conflict and create understanding. People trust you because you listen deeply and act with fairness. Your presence reminds others that strength and peace can coexist, and that unity is often built through quiet wisdom rather than loud persuasion.",
    soulKeywords: ["Harmonious", "Grounded", "Empathetic", "Stable", "Unifying"],
    coreEmotion: "Quiet Harmony",
    corePurpose: "To create understanding, strengthen relationships, and bring lasting peace wherever you go.",
    emotionalJourney: "Beginning: Calm → Middle: Understanding → End: Unity",
    desiredListenerExperience: "Understood, Peaceful, Grounded, Connected, Restored",
    promptFoundation:
      "Create an instrumental composition that embodies The Peacemaker. The music should express calm strength, empathy, and enduring harmony. It should begin with peaceful simplicity, grow into a rich sense of understanding and connection, and conclude with a lasting feeling of unity, balance, and quiet restoration.",
  },
};
