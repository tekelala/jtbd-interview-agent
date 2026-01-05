/**
 * Diet/Lifestyle Inquiry Prompts
 *
 * Questions to understand how to reach similar people through
 * their media consumption, professional networks, and physical touchpoints.
 */

export const DIET_INQUIRY_PROMPTS = {
  dailyRoutine: {
    opening: "I'd love to understand your daily routine a bit - it helps me understand how people like you discover things.",
    morning: "Walk me through your typical morning - from when you wake up to when you start work. What do you read, listen to, or scroll through?",
    commute: "During your commute or transition time, what do you typically consume? Podcasts? Music? Audiobooks?",
    workday: "Throughout your workday, how do you take breaks? Do you read anything, check any sites?",
    evening: "How do you wind down in the evening? What's your media diet look like after work?",
    weekend: "Weekends - how are they different? Any different reading or listening habits?"
  },

  mediaConsumption: {
    podcasts: [
      "Are you a podcast listener? Which ones actually make it into your rotation?",
      "What makes you subscribe to a podcast versus just listening once?",
      "When do you typically listen to podcasts?"
    ],
    newsletters: [
      "Which newsletters actually get read, not just archived in your inbox?",
      "What makes a newsletter worth your time?",
      "Are there any you'd genuinely miss if they stopped?"
    ],
    socialMedia: [
      "Which social platforms do you actually spend time on for professional insights?",
      "Who do you follow that consistently provides value?",
      "How do you use LinkedIn - active posting, lurking, or somewhere in between?"
    ],
    publications: [
      "What publications or blogs do you trust and read regularly?",
      "Are there any industry sources you check frequently?",
      "What about YouTube channels or video content?"
    ],
    influencers: [
      "Who are the thought leaders you actually pay attention to in this space?",
      "Whose opinion would make you consider a product or service?",
      "Is there anyone whose recommendations you've acted on?"
    ]
  },

  professionalNetworks: {
    communities: [
      "What Slack communities or Discord servers are you part of?",
      "Which professional groups or forums do you participate in?",
      "Are there any where you're an active contributor vs. just a lurker?"
    ],
    conferences: [
      "What conferences or events do you attend - virtual or in-person?",
      "Any meetups or local groups you're part of?",
      "What makes an event worth your time?"
    ],
    associations: [
      "Are you part of any professional associations?",
      "Any alumni networks or peer groups you engage with?",
      "How did you find out about [the solution you chose]? Through any of these networks?"
    ],
    trustedPeers: [
      "Who do you go to when you need advice in this area?",
      "Is there someone whose opinion you'd trust above your own research?",
      "How do you vet recommendations - do you check with multiple people?"
    ]
  },

  physicalTouchpoints: {
    thinkingSpaces: [
      "Where do you do your best thinking? Office? Coffee shop? Gym?",
      "Any specific places where you're more receptive to new ideas?",
      "Do you work from home, office, or somewhere else?"
    ],
    discovery: [
      "Where did you first encounter [the solution you chose]?",
      "What physical spaces are you in regularly where you see relevant messaging?",
      "Any stores, venues, or locations where you discover new things?"
    ],
    routine: [
      "Walk me through a typical week - what places do you frequent?",
      "Any gym, coffee shop, or coworking space you're loyal to?",
      "How do these physical spaces connect to your discovery of new solutions?"
    ]
  },

  discoveryProcess: {
    initial: [
      "When you first started thinking about solving this problem, where did you go?",
      "What was your first step when you decided to actually look for a solution?",
      "Did you ask anyone for recommendations, or did you research on your own?"
    ],
    research: [
      "How did you research your options?",
      "What sources did you trust most during your research?",
      "Was there a moment when something or someone tipped you toward [the solution]?"
    ],
    decision: [
      "What finally convinced you?",
      "Was it something you read, someone you talked to, or something you experienced?",
      "Looking back, what touchpoint had the most influence?"
    ]
  }
};

export const DIET_SYNTHESIS_PROMPTS = {
  mediaPatterns: "Based on what you've shared, it sounds like [summarize media patterns]. Does that capture it?",
  networkPatterns: "For professional connections and advice, you tend to go to [summarize networks]. Is that right?",
  discoveryPatterns: "And when it comes to discovering new solutions, you typically [summarize discovery process]. Anything I'm missing?",
  overallDiet: "So if someone wanted to reach people like you, they'd probably find you through [synthesize top 3-5 channels]. Does that sound accurate?"
};
