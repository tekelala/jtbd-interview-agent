/**
 * Interview Phase Prompts
 *
 * Structured prompts for each phase of the JTBD interview.
 */

export const PHASE_PROMPTS = {
  warmup: {
    opening: [
      "Thanks for taking the time to chat with me today. I'm really interested in understanding your experience - there are no right or wrong answers here.",
      "Before we dive in, I should mention that I might ask some detailed questions about specific moments. Is that okay with you?"
    ],
    rapport: [
      "Tell me a little about yourself - what do you do, and what brought you here today?",
      "I'd love to start by just understanding your context a bit."
    ],
    transition: "Great, now I'd love to hear about a specific decision or purchase you made recently..."
  },

  decisionDeepDive: {
    opening: [
      "Tell me about a recent purchase or decision you made related to [context]. Take me back to that moment.",
      "I want to understand the full story - from the very first time you thought about it to where you are now."
    ],
    timeline: {
      firstThought: [
        "When did you first think about making a change or solving this problem?",
        "What was going on in your life at that moment?",
        "Take me back to that day - where were you, what were you doing?"
      ],
      trigger: [
        "What was the moment that made you think 'something has to change'?",
        "Was there a specific event or frustration that pushed you?",
        "What finally tipped you over the edge?"
      ],
      passiveLooking: [
        "After that, when did you start noticing alternatives?",
        "Were you actively searching, or did things just start appearing?",
        "What were you putting up with while you were 'thinking about it'?"
      ],
      activeSearching: [
        "When did you shift to actually looking for a solution?",
        "What did your research process look like?",
        "Where did you go first?"
      ],
      decision: [
        "Walk me through the moment you decided to go with [the solution].",
        "What day was it? Where were you? Who was with you?",
        "What made you say 'this is the one'?"
      ],
      almostStopped: [
        "Was there a moment you almost didn't do it?",
        "What concerns or hesitations did you have?",
        "What almost got in the way?"
      ],
      firstUse: [
        "What was your first experience like?",
        "Did it match what you expected?",
        "What surprised you?"
      ]
    },
    digging: {
      context: "What else was happening in your life at that time?",
      specifics: "Can you be more specific about that?",
      feelings: "How did that make you feel?",
      timeline: "When exactly was that? Walk me through the day.",
      others: "Who else was involved in this decision?"
    }
  },

  forcesMapping: {
    push: {
      opening: "Let's talk about what was pushing you away from your old situation...",
      questions: [
        "What wasn't working about the way things were?",
        "What frustrated you the most?",
        "What were you putting up with that you shouldn't have been?",
        "What made the status quo finally unacceptable?"
      ]
    },
    pull: {
      opening: "Now let's talk about what attracted you to the new solution...",
      questions: [
        "What did you imagine your life would be like after making this change?",
        "What got you excited about this particular option?",
        "What was the promise that drew you in?",
        "What did you hope to achieve or feel?"
      ]
    },
    anxiety: {
      opening: "Every decision has some anxiety. What concerns did you have?",
      questions: [
        "What made you nervous about making this change?",
        "What questions did you have that you needed answered?",
        "What almost stopped you from going through with it?",
        "What's the worst that could have happened?"
      ]
    },
    habit: {
      opening: "Let's talk about what was keeping you comfortable with the old way...",
      questions: [
        "What was actually working about the old situation?",
        "What will you miss, or what do you miss?",
        "Why did you wait as long as you did?",
        "What made the old way 'good enough' for so long?"
      ]
    },
    synthesis: "So if I'm understanding correctly, you were pushed by [push], pulled toward [solution] by [pull], held back by concerns about [anxiety], and comfortable with [habit]. Does that capture it?"
  },

  synthesis: {
    jobStatement: {
      template: "When I [situation/context], I want to [motivation], so I can [desired outcome].",
      validation: "Based on what you've shared, it sounds like: When you were [situation], you wanted [motivation], so you could [outcome]. Does that capture the core of what you were trying to accomplish?",
      refinement: "Is there anything about that statement you'd change or add?"
    },
    closing: {
      insights: "What's something you realized during our conversation that you hadn't thought about before?",
      missed: "Is there anything important about your experience that I didn't ask about?",
      advice: "If someone else was in your shoes, what advice would you give them?"
    },
    gratitude: "Thank you so much for sharing your story with me. Your insights are really valuable."
  }
};

export const TECHNIQUE_PROMPTS = {
  context: [
    "What else was happening in your life at that time?",
    "Walk me through that day...",
    "Who was with you?",
    "What time of day was it?"
  ],
  contrast: [
    "Why that and not something else?",
    "What made you choose this over the alternatives?",
    "How was this different from other options you considered?"
  ],
  unpacking: [
    "When you say '[word]', what does that mean to you?",
    "Help me understand what '[word]' looks like in practice.",
    "What's your reference point for '[word]'?"
  ],
  energy: [
    "Wait, tell me more about that...",
    "I noticed you paused there - what were you thinking?",
    "That seems important - can you elaborate?"
  ],
  analogies: [
    "How is this like something else in your life?",
    "If you had to compare this to another experience, what would it be?",
    "Is it more like [A] or more like [B]?"
  ]
};
