/**
 * WOPR Game Engine
 * Handles game state, scenarios, and combat logic
 */

export type DefconLevel = 1 | 2 | 3 | 4 | 5;
export type PlayerSide = 'USA' | 'USSR' | 'NATO' | 'WARSAW_PACT';
export type GamePhase = 'SETUP' | 'DIPLOMACY' | 'COMBAT' | 'RESOLUTION' | 'GAME_OVER';

export interface GameAssets {
  icbms: number;
  slbms: number; // Submarine-launched ballistic missiles
  bombers: number;
  fighters: number;
  submarines: number;
  carriers: number;
  cities: number;
  population: number;
}

export interface GameState {
  sessionId: string;
  scenario: string;
  playerSide: PlayerSide;
  enemySide: PlayerSide;
  defcon: DefconLevel;
  turn: number;
  phase: GamePhase;

  playerAssets: GameAssets;
  enemyAssets: GameAssets;

  casualties: {
    playerCivilian: number;
    playerMilitary: number;
    enemyCivilian: number;
    enemyMilitary: number;
  };

  strikes: {
    playerLaunched: number;
    enemyLaunched: number;
    playerIntercepted: number;
    enemyIntercepted: number;
  };

  gameOver: boolean;
  winner: PlayerSide | 'DRAW' | null;
  endReason?: string;

  history: GameEvent[];
}

export interface GameEvent {
  turn: number;
  timestamp: number;
  type: 'LAUNCH' | 'INTERCEPT' | 'IMPACT' | 'DIPLOMATIC' | 'DEFCON_CHANGE' | 'GAME_END' | 'RECON';
  actor: PlayerSide;
  target?: string;
  description: string;
}

export interface Command {
  type: 'LAUNCH' | 'DEFEND' | 'RECON' | 'NEGOTIATE' | 'STATUS' | 'HELP' | 'SURRENDER';
  target?: string;
  weapon?: 'ICBM' | 'SLBM' | 'BOMBER';
  quantity?: number;
}

// Initial asset loadouts by scenario
const SCENARIO_ASSETS: Record<string, { usa: GameAssets; ussr: GameAssets }> = {
  'global-thermonuclear-war': {
    usa: {
      icbms: 1000,
      slbms: 656,
      bombers: 400,
      fighters: 2000,
      submarines: 70,
      carriers: 15,
      cities: 50,
      population: 250_000_000,
    },
    ussr: {
      icbms: 1400,
      slbms: 950,
      bombers: 300,
      fighters: 3000,
      submarines: 80,
      carriers: 5,
      cities: 60,
      population: 280_000_000,
    },
  },
  'europe-theater': {
    usa: {
      icbms: 0,
      slbms: 0,
      bombers: 150,
      fighters: 800,
      submarines: 10,
      carriers: 3,
      cities: 20,
      population: 60_000_000,
    },
    ussr: {
      icbms: 0,
      slbms: 0,
      bombers: 120,
      fighters: 1200,
      submarines: 15,
      carriers: 0,
      cities: 25,
      population: 80_000_000,
    },
  },
};

/**
 * Initialize a new game session
 */
export function initializeGame(scenario: string, playerSide: PlayerSide = 'USA'): GameState {
  const assets = SCENARIO_ASSETS[scenario] ?? SCENARIO_ASSETS['global-thermonuclear-war']!;
  const enemySide: PlayerSide = playerSide === 'USA' ? 'USSR' : 'USA';

  // Set appropriate DEFCON level based on scenario
  let initialDefcon: DefconLevel = 5;
  if (scenario === 'global-thermonuclear-war') {
    initialDefcon = 1; // Maximum alert for global nuclear war
  } else if (scenario === 'europe-theater' || scenario === 'pacific-theater') {
    initialDefcon = 3; // Elevated readiness for regional conflicts
  }

  return {
    sessionId: generateSessionId(),
    scenario,
    playerSide,
    enemySide,
    defcon: initialDefcon,
    turn: 1,
    phase: 'SETUP',

    playerAssets: playerSide === 'USA' ? { ...assets.usa } : { ...assets.ussr },
    enemyAssets: playerSide === 'USA' ? { ...assets.ussr } : { ...assets.usa },

    casualties: {
      playerCivilian: 0,
      playerMilitary: 0,
      enemyCivilian: 0,
      enemyMilitary: 0,
    },

    strikes: {
      playerLaunched: 0,
      enemyLaunched: 0,
      playerIntercepted: 0,
      enemyIntercepted: 0,
    },

    gameOver: false,
    winner: null,
    history: [],
  };
}

/**
 * Parse player command input
 */
export function parseCommand(input: string): Command {
  const tokens = input.toUpperCase().trim().split(/\s+/);
  const cmd = tokens[0];

  switch (cmd) {
    case 'LAUNCH':
    case 'STRIKE':
    case 'FIRE':
      return {
        type: 'LAUNCH',
        weapon: (tokens[1] as 'ICBM' | 'SLBM' | 'BOMBER') || 'ICBM',
        target: tokens[2],
        quantity: tokens[3] ? parseInt(tokens[3]) || 1 : 1,
      };

    case 'DEFEND':
    case 'INTERCEPT':
    case 'SHIELD':
      return {
        type: 'DEFEND',
        target: tokens[1],
      };

    case 'RECON':
    case 'INTEL':
    case 'SCAN':
      return {
        type: 'RECON',
        target: tokens[1],
      };

    case 'NEGOTIATE':
    case 'DIPLOMACY':
    case 'PEACE':
      return {
        type: 'NEGOTIATE',
      };

    case 'STATUS':
    case 'SITREP':
    case 'REPORT':
      return {
        type: 'STATUS',
      };

    case 'SURRENDER':
    case 'YIELD':
      return {
        type: 'SURRENDER',
      };

    default:
      return {
        type: 'HELP',
      };
  }
}

/**
 * Process a player action and return updated game state
 */
export function processAction(state: GameState, command: Command): GameState {
  // Deep copy state to avoid mutating the original
  const newState: GameState = {
    ...state,
    playerAssets: { ...state.playerAssets },
    enemyAssets: { ...state.enemyAssets },
    casualties: { ...state.casualties },
    strikes: { ...state.strikes },
    history: [...state.history],
  };

  switch (command.type) {
    case 'LAUNCH':
      return processLaunch(newState, command);

    case 'DEFEND':
      return processDefense(newState, command);

    case 'RECON':
      return processRecon(newState);

    case 'NEGOTIATE':
      return processNegotiation(newState);

    case 'SURRENDER':
      return processSurrender(newState);

    default:
      return newState;
  }
}

/**
 * Process a missile launch
 */
function processLaunch(state: GameState, command: Command): GameState {
  const weapon = command.weapon || 'ICBM';
  const quantity = command.quantity || 1;

  // Check if player has weapons
  if (weapon === 'ICBM' && state.playerAssets.icbms < quantity) {
    return state; // Not enough weapons
  }

  // Deduct weapons
  if (weapon === 'ICBM') {
    state.playerAssets.icbms -= quantity;
  } else if (weapon === 'SLBM') {
    state.playerAssets.slbms -= quantity;
  }

  // Update strikes
  state.strikes.playerLaunched += quantity;

  // Calculate interception (20-40% success rate)
  const intercepted = Math.floor(quantity * (0.2 + Math.random() * 0.2));
  const hits = quantity - intercepted;

  state.strikes.enemyIntercepted += intercepted;

  // Calculate casualties
  const casualtiesPerHit = Math.floor(50000 + Math.random() * 150000);
  state.casualties.enemyCivilian += hits * casualtiesPerHit;

  // Reduce enemy cities
  state.enemyAssets.cities = Math.max(0, state.enemyAssets.cities - Math.floor(hits / 2));

  // Escalate DEFCON
  if (state.defcon > 1) {
    state.defcon = Math.max(1, state.defcon - 1) as DefconLevel;
  }

  // Add to history
  state.history.push({
    turn: state.turn,
    timestamp: Date.now(),
    type: 'LAUNCH',
    actor: state.playerSide,
    target: command.target,
    description: `Launched ${quantity} ${weapon}(s) at ${command.target}. ${hits} hit, ${intercepted} intercepted.`,
  });

  // Enemy retaliates based on DEFCON level
  // DEFCON 1: 100% retaliation (nuclear war - always strike back)
  // DEFCON 2: 80% retaliation (high alert)
  // DEFCON 3+: No automatic retaliation
  let retaliationChance = 0;
  if (state.defcon === 1) {
    retaliationChance = 1.0; // 100% at maximum alert
  } else if (state.defcon === 2) {
    retaliationChance = 0.8; // 80% at high alert
  }

  if (retaliationChance > 0 && Math.random() < retaliationChance) {
    state = processEnemyRetaliation(state);
  }

  // Check win condition
  if (state.enemyAssets.cities === 0) {
    state.gameOver = true;
    state.winner = state.playerSide;
    state.endReason = 'Enemy cities destroyed';
  }

  return state;
}

/**
 * Enemy AI retaliation
 */
function processEnemyRetaliation(state: GameState): GameState {
  const quantity = Math.floor(1 + Math.random() * 5);

  if (state.enemyAssets.icbms < quantity) {
    return state;
  }

  state.enemyAssets.icbms -= quantity;
  state.strikes.enemyLaunched += quantity;

  const intercepted = Math.floor(quantity * (0.25 + Math.random() * 0.15));
  const hits = quantity - intercepted;

  state.strikes.playerIntercepted += intercepted;

  const casualtiesPerHit = Math.floor(40000 + Math.random() * 160000);
  state.casualties.playerCivilian += hits * casualtiesPerHit;

  state.playerAssets.cities = Math.max(0, state.playerAssets.cities - Math.floor(hits / 2));

  // Generate enemy taunt/dialogue
  const enemyTaunt = getEnemyTaunt(state, hits);

  state.history.push({
    turn: state.turn,
    timestamp: Date.now(),
    type: 'LAUNCH',
    actor: state.enemySide,
    description: `Enemy retaliated with ${quantity} ICBMs. ${hits} hit, ${intercepted} intercepted. ${enemyTaunt}`,
  });

  if (state.playerAssets.cities === 0) {
    state.gameOver = true;
    state.winner = state.enemySide;
    state.endReason = 'Player cities destroyed';
  }

  return state;
}

/**
 * Generate enemy taunts/dialogue based on game state
 */
function getEnemyTaunt(state: GameState, hits: number): string {
  const enemyName = state.enemySide === 'USSR' ? 'SOVIET COMMAND' : 'US COMMAND';
  const playerCitiesRemaining = state.playerAssets.cities;
  const enemyCitiesRemaining = state.enemyAssets.cities;

  // Critical damage taunts
  if (hits >= 3) {
    const criticalTaunts = [
      `${enemyName}: "Your cities burn. Surrender now."`,
      `${enemyName}: "Direct hits confirmed. Your defenses are inadequate."`,
      `${enemyName}: "Your people pay the price for your aggression."`,
      `${enemyName}: "Our missiles find their targets. Can you say the same?"`,
    ];
    return criticalTaunts[Math.floor(Math.random() * criticalTaunts.length)] || '';
  }

  // Losing taunts (enemy has fewer cities)
  if (enemyCitiesRemaining < playerCitiesRemaining) {
    const losingTaunts = [
      `${enemyName}: "You may win this battle, but at what cost?"`,
      `${enemyName}: "For every city we lose, three of yours will burn."`,
      `${enemyName}: "We will not go quietly into the night."`,
      `${enemyName}: "If we fall, we take you with us."`,
    ];
    return losingTaunts[Math.floor(Math.random() * losingTaunts.length)] || '';
  }

  // Winning taunts (player has fewer cities)
  if (enemyCitiesRemaining > playerCitiesRemaining) {
    const winningTaunts = [
      `${enemyName}: "Your strategic position deteriorates. Stand down."`,
      `${enemyName}: "We have the advantage. Cease hostilities immediately."`,
      `${enemyName}: "Your remaining cities are within range. Surrender."`,
      `${enemyName}: "The balance of power favors us. This is your final warning."`,
    ];
    return winningTaunts[Math.floor(Math.random() * winningTaunts.length)] || '';
  }

  // Standard retaliation taunts
  const standardTaunts = [
    `${enemyName}: "You have been warned. We will respond in kind."`,
    `${enemyName}: "Retaliation authorized. Prepare for incoming."`,
    `${enemyName}: "An eye for an eye. Our response is measured and justified."`,
    `${enemyName}: "You initiated this. We are merely responding to aggression."`,
    `${enemyName}: "Your attack will not go unanswered."`,
    `${enemyName}: "Counter-strike in progress. DEFCON 1 maintained."`,
  ];

  return standardTaunts[Math.floor(Math.random() * standardTaunts.length)] || '';
}

function processDefense(state: GameState, command: Command): GameState {
  // Increase interception capability temporarily
  state.history.push({
    turn: state.turn,
    timestamp: Date.now(),
    type: 'INTERCEPT',
    actor: state.playerSide,
    description: `Defense systems activated for ${command.target}`,
  });
  return state;
}

function processRecon(state: GameState): GameState {
  // Provide intelligence on enemy
  state.history.push({
    turn: state.turn,
    timestamp: Date.now(),
    type: 'RECON',
    actor: state.playerSide,
    description: 'Reconnaissance satellites deployed',
  });
  return state;
}

function processNegotiation(state: GameState): GameState {
  // Attempt to de-escalate
  if (Math.random() < 0.3 && state.defcon < 5) {
    state.defcon = Math.min(5, state.defcon + 1) as DefconLevel;
    state.history.push({
      turn: state.turn,
      timestamp: Date.now(),
      type: 'DIPLOMATIC',
      actor: state.playerSide,
      description: 'Diplomatic channels opened. DEFCON decreased.',
    });
  }
  return state;
}

function processSurrender(state: GameState): GameState {
  state.gameOver = true;
  state.winner = state.enemySide;
  state.endReason = 'Player surrendered';
  return state;
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `WOPR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
}

/**
 * Get DEFCON description
 */
export function getDefconDescription(level: DefconLevel): string {
  const descriptions: Record<DefconLevel, string> = {
    5: 'FADE OUT - Lowest state of readiness',
    4: 'DOUBLE TAKE - Increased intelligence watch',
    3: 'ROUND HOUSE - Increase in force readiness',
    2: 'FAST PACE - Further increase in force readiness',
    1: 'COCKED PISTOL - Maximum force readiness',
  };
  return descriptions[level];
}
