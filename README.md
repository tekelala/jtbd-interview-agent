# JTBD Interview Agent

An AI-powered interview agent that conducts Jobs to Be Done (JTBD) interviews following Bob Moesta's methodology. Built with the **Claude Agent SDK** and React, featuring Skills integration for Bob Moesta's interview techniques.

## Features

- **Bob Moesta Interview Style**: Uses the five core techniques (Context, Contrast, Unpacking, Energy, Analogies)
- **Timeline Building**: Automatically tracks the decision journey from first thought to first use
- **Forces of Progress**: Maps push, pull, anxiety, and habit forces that drive decisions
- **Diet/Lifestyle Inquiry**: Captures media consumption, professional networks, and physical touchpoints
- **Real-time Visualization**: See timeline, forces diagram, and insights as they're captured
- **Model Selection**: Choose between Claude Sonnet, Opus, or Haiku for interviews
- **Admin Panel**: View, search, and manage past interviews
- **Interview Reports**: Generate formatted reports with job statements and key insights
- **Export to JSON/Markdown**: Save complete interview data for analysis

## Project Structure

```
jtbd-interview-agent/
├── .claude/
│   └── skills/
│       └── bob-moesta-advisor/   # Bob Moesta JTBD interview skill
│           ├── SKILL.md          # Skill definition and methodology
│           ├── assets/           # Skill assets
│           └── references/       # Framework references
│
├── packages/
│   ├── agent/         # TypeScript agent using Claude Agent SDK
│   │   ├── src/
│   │   │   ├── interviewer.ts    # Main interview agent class
│   │   │   ├── prompts/          # System prompts & interview scripts
│   │   │   ├── tools/            # Custom interview tools
│   │   │   ├── types/            # TypeScript type definitions
│   │   │   ├── server.ts         # HTTP API server
│   │   │   ├── storage.ts        # Interview persistence
│   │   │   └── cli.ts            # Command-line interface
│   │   └── package.json
│   │
│   └── web/           # React frontend
│       ├── src/
│       │   ├── components/       # UI components
│       │   │   └── admin/        # Admin panel components
│       │   ├── pages/            # Page components
│       │   ├── hooks/            # React hooks
│       │   └── types/            # Frontend types
│       └── package.json
│
├── data/              # Interview storage
│   └── interviews/    # Saved interview JSON files
│
├── package.json       # Monorepo root
└── README.md
```

## Skills Integration

This project uses the **Claude Agent SDK** (`@anthropic-ai/claude-agent-sdk`) with Skills support for Bob Moesta's JTBD interview methodology.

### How It Works

The agent uses the SDK's `query()` function with Skills configuration:

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';

for await (const message of query({
  prompt,
  options: {
    model: 'claude-sonnet-4-20250514',
    cwd: PROJECT_ROOT,
    settingSources: ['user', 'project'],  // Load Skills
    allowedTools: ['Skill', 'Read'],
    permissionMode: 'bypassPermissions'
  }
}))
```

### Configuration Options

| Option | Description |
|--------|-------------|
| `settingSources` | Where to load Skills from: `user` (~/.claude/skills/), `project` (.claude/skills/) |
| `allowedTools` | Tools the agent can use. Include `Skill` to enable Skills |
| `permissionMode` | Set to `bypassPermissions` for server/non-interactive use |
| `cwd` | Working directory for project Skills discovery |

### The bob-moesta-advisor Skill

Located in `.claude/skills/bob-moesta-advisor/`, this skill provides:

- **SKILL.md** - Core skill definition with Bob Moesta's methodology
- **references/frameworks.md** - JTBD theory, Forces of Progress, Five Skills of Innovators
- **references/interview-method.md** - Interview techniques and timeline building
- **references/mattress-interview.md** - Example interview transcript

The skill teaches the agent to:
- Use the "empty vessel" interview approach
- Apply the five techniques: Context, Contrast, Unpacking, Energy, Analogies
- Build decision timelines backward from purchase
- Map Forces of Progress (push, pull, anxiety, habit)
- Capture the Information Diet for customer discovery

## Getting Started

### Prerequisites

- Node.js v18+ ([Download](https://nodejs.org/))
- npm (included with Node.js)
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd jtbd-interview-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**

   Create a `.env` file in the project root:
   ```bash
   echo "ANTHROPIC_API_KEY=your-api-key-here" > .env
   ```

   Or export directly (for current session only):
   ```bash
   export ANTHROPIC_API_KEY=your-api-key-here
   ```

4. **Build the packages**
   ```bash
   npm run build
   ```

5. **Verify installation**
   ```bash
   # Check the build succeeded
   ls packages/agent/dist/
   # Should see: cli.js, server.js, interviewer.js, etc.
   ```

### Running the CLI

```bash
# Build the agent (if not already built)
npm run build:agent

# Run CLI interview
node packages/agent/dist/cli.js
```

### Running the Web Interface

**Terminal 1: Start the API server**
```bash
cd packages/agent
npm run start
# Server runs at http://localhost:3001
```

**Terminal 2: Start the web frontend**
```bash
cd packages/web
npm run dev
# Frontend runs at http://localhost:3000
```

Open http://localhost:3000 in your browser.

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `ANTHROPIC_API_KEY not found` | Ensure the API key is exported or in `.env` file |
| `Skills not loading` | Verify `.claude/skills/` directory exists in project root |
| `Port 3001 in use` | Change port: `PORT=3002 npm run start` |
| `TypeScript errors` | Run `npm run typecheck` to see detailed errors |
| `Module not found` | Run `npm install` then `npm run build` |

## Pages

### Interview Page (/)

Conduct new JTBD interviews with the following features:
- Configure interview context and interviewee name
- Select Claude model (Sonnet, Opus, or Haiku)
- Real-time chat interface with the AI interviewer
- Live visualization of timeline, forces, and diet profile
- Export interview data

### Admin Panel (/admin)

View and manage past interviews:
- **Interview List**: Browse all saved interviews with search and filters
- **Interview Detail**: View full conversation, timeline, forces, diet profile, and insights
- **Reports**: Generate formatted markdown reports with job statements and recommendations
- Delete interviews no longer needed

## Model Selection

Choose the Claude model that best fits your needs:

| Model | Model ID | Best For |
|-------|----------|----------|
| **Claude Sonnet 4** | `claude-sonnet-4-20250514` | Most interviews (Recommended) |
| **Claude Opus 4** | `claude-opus-4-20250514` | Complex or sensitive interviews |
| **Claude Haiku 3.5** | `claude-3-5-haiku-20241022` | Quick interviews, testing |

## Interview Flow

### Phase 1: Warm-up
Build rapport and explain the interview purpose.

### Phase 2: Decision Deep-Dive
Explore a recent purchase/decision with timeline questions:
- When did you first think about this?
- What triggered your search?
- How did you research options?
- What made you decide?

### Phase 3: Forces Mapping
Identify the four forces of progress:
- **Push**: What wasn't working?
- **Pull**: What attracted you?
- **Anxiety**: What almost stopped you?
- **Habit**: What kept you comfortable?

### Phase 4: Diet Inquiry
Capture information about how to reach similar customers:
- Media consumption (podcasts, newsletters, social)
- Professional networks (Slack, conferences, associations)
- Physical touchpoints (coffee shops, gyms, commute)
- Trusted sources and discovery channels

### Phase 5: Synthesis
Generate job statement and validate understanding.

## API Endpoints

### Interview Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/interview/start` | POST | Start a new interview |
| `/api/interview/message` | POST | Send a message in an interview |
| `/api/interview/end` | POST | End and save interview |
| `/api/interview/data/:sessionId` | GET | Get interview data |
| `/api/interview/export/:sessionId` | GET | Export as JSON |
| `/api/models` | GET | Get available Claude models |
| `/api/health` | GET | Health check |

### Admin Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/interviews` | GET | List all saved interviews |
| `/api/admin/interviews/:id` | GET | Get interview details |
| `/api/admin/interviews/:id` | DELETE | Delete an interview |
| `/api/admin/interviews/:id/report` | GET | Generate interview report |

## Output Format

The interview generates structured data:

```json
{
  "interviewee": { "name": "", "context": "" },
  "timeline": [
    { "phase": "first_thought", "date": "", "details": "" },
    { "phase": "trigger", "trigger": "", "details": "" }
  ],
  "forces": {
    "push": [{ "description": "", "intensity": 8 }],
    "pull": [{ "description": "", "intensity": 7 }],
    "anxiety": [{ "description": "", "intensity": 5 }],
    "habit": [{ "description": "", "intensity": 4 }]
  },
  "dietProfile": {
    "mediaConsumption": { "podcasts": [], "newsletters": [] },
    "professionalNetworks": [],
    "physicalTouchpoints": [],
    "trustedSources": []
  },
  "jobStatement": "When I [situation], I want [motivation], so I can [outcome]",
  "insights": [],
  "verbatimQuotes": []
}
```

## Report Format

Generated reports include:
- Interview metadata (date, interviewee, model used)
- Job statement
- Struggling moment
- Decision timeline with context
- Forces of progress analysis
- Information diet summary
- Key quotes and insights
- Conversation summary

## Key Interview Questions

### Struggling Moment
- "What wasn't working?"
- "What were you putting up with?"
- "What finally pushed you over the edge?"

### Timeline Building
- "When did you first think about this?"
- "Walk me through that day..."
- "What else was happening in your life?"

### Diet Inquiry
- "Walk me through your typical morning - what do you read/listen to?"
- "Who do you trust for recommendations?"
- "What communities or groups are you part of?"

## Bob Moesta's Five Techniques

1. **Context**: "When the answer feels irrational, you don't know the whole story"
2. **Contrast**: "There's no fast, only faster than..."
3. **Unpacking**: "Words mean different things to different people"
4. **Energy**: "Listen to HOW they say it, not just WHAT"
5. **Analogies**: "When people hit a wall, give them another frame"

## Development

```bash
# Run in development mode
npm run dev

# Build all packages
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

## Storage

Interviews are automatically saved to `data/interviews/` as JSON files when completed. Each file contains:
- Full conversation history
- Captured insights and timeline
- Forces and diet profile
- Generated summary and job statement

## License

MIT
