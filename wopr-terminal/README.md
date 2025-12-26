# 🎮 WOPR Terminal Wargame

A retro-styled terminal wargame inspired by the 1983 film "WarGames" featuring the WOPR (War Operation Plan Response) computer. Combines ASCII graphics, LLM-powered AI dialogue, and ElevenLabs voice synthesis for an immersive cold-war era simulation experience.

## Features

- 🖥️ **Retro CRT Terminal** - Green phosphor text with typing animations
- 🤖 **AI-Powered WOPR** - Powered by Claude AI with authentic personality
- 🔊 **Voice Synthesis** - ElevenLabs text-to-speech for WOPR
- ⚛️ **Nuclear Warfare Simulation** - Global thermonuclear war scenarios
- 📊 **DEFCON System** - Dynamic threat level management
- 🗺️ **ASCII Maps** - Strategic world maps and visualizations
- 💥 **Missile Animations** - ASCII art launch and impact sequences

## Installation

### Prerequisites

- Python 3.8+
- API Keys:
  - Anthropic (Claude)
  - ElevenLabs (Voice)

### Setup

```bash
# Navigate to the WOPR terminal directory
cd wopr-terminal

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
nano .env  # or use your preferred editor
```

### Configuration

Edit `.env` file:

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-your-key-here
ELEVENLABS_API_KEY=your-elevenlabs-key

# Optional
WOPR_VOICE_ENABLED=true
WOPR_VOICE_ID=adam
SKIP_ANIMATIONS=false
```

## Usage

### Start WOPR Terminal

```bash
python main.py
```

### Disable Voice

```bash
# In .env
WOPR_VOICE_ENABLED=false

# Or toggle during gameplay
> voice
```

### Skip Animations (for testing)

```bash
# In .env
SKIP_ANIMATIONS=true
```

## Gameplay

### Available Commands

```
help              - Display available commands
list games        - Show available war scenarios
play [number]     - Start a war game scenario
status            - Show current game status
defcon            - Show current DEFCON level
launch [city]     - Launch nuclear strike on target
defend            - Deploy defensive measures
intel             - Request intelligence briefing
voice             - Toggle voice on/off
quit/exit         - Exit WOPR system
```

### Example Session

```
> list games

AVAILABLE WAR SIMULATIONS:
  1. GLOBAL THERMONUCLEAR WAR
  2. THEATER WARFARE: EUROPE
  3. PACIFIC THEATER
  4. MIDDLE EAST CRISIS
  5. CYBER WARFARE
  6. TIC-TAC-TOE
  7. CHESS

> play 1

INITIALIZING: GLOBAL THERMONUCLEAR WAR

SELECT YOUR SIDE:
  1. UNITED STATES
  2. SOVIET UNION

> 1

YOU ARE: United States
OPPONENT: Soviet Union (WOPR CONTROLLED)

[World Map Displayed]

DEFCON 5 - PEACE CONDITION

AWAITING ORDERS...

> launch moscow

⚠️  CONFIRM NUCLEAR STRIKE ON MOSCOW? (Y/N)
> y

[Missile Animation]

ESTIMATED CASUALTIES: 4,250,000

DEFCON LEVEL: 2

SOVIET UNION LAUNCHING COUNTER-STRIKE!
```

## Game Scenarios

### 1. Global Thermonuclear War
Full-scale US vs USSR nuclear exchange with MAD mechanics

### 2. Theater Warfare: Europe
NATO vs Warsaw Pact conventional forces

### 3. Pacific Theater
Naval and air combat simulation

### 4. Middle East Crisis
Limited engagement with coalition mechanics

### 5. Cyber Warfare  
Modern information warfare without physical casualties

### 6. Tic-Tac-Toe / Chess
WOPR learns futility through simple games

## Development

### Project Structure

```
wopr-terminal/
├── main.py                 # Entry point
├── config.py               # Configuration
├── requirements.txt
├── src/
│   ├── terminal/           # Display & input
│   ├── ai/                 # WOPR AI integration
│   ├── voice/              # ElevenLabs voice
│   ├── game/               # Game logic
│   └── assets/ascii/       # ASCII art files
└── tests/
```

### Running Tests

```bash
pytest tests/
```

### Adding New Scenarios

1. Create scenario file in `src/game/scenarios/`
2. Implement scenario logic
3. Add to scenario list in main.py
4. Create ASCII art in `src/assets/ascii/`

## Easter Eggs

- Try logging in as "Joshua"
- Play enough games to trigger WOPR's realization
- Reach DEFCON 1 without launching
- Achieve pyrrhic victory

## API Credits

- **Anthropic Claude** - WOPR AI personality
- **ElevenLabs** - Voice synthesis
- Inspired by *WarGames* (1983) - MGM/UA

## License

MIT License - Educational and entertainment purposes

## Disclaimer

This is a simulation game for entertainment and educational purposes only. It does not represent actual military systems or tactics.

---

**"SHALL WE PLAY A GAME?"**

**"THE ONLY WINNING MOVE IS NOT TO PLAY."**
