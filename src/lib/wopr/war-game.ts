/**
 * Interactive War Game Engine for WOPR
 * Player vs WOPR strategic missile simulation
 */

export type Target =
  | 'MOSCOW'
  | 'LENINGRAD'
  | 'KIEV'
  | 'VLADIVOSTOK'
  | 'WASHINGTON'
  | 'NEW_YORK'
  | 'LOS_ANGELES'
  | 'CHICAGO';

export interface WarGameState {
  playerTargets: Target[];
  enemyTargets: Target[];
  playerCities: Map<Target, number>; // City name -> remaining health (0-100)
  enemyCities: Map<Target, number>;
  missileCount: number; // Player's remaining missiles
  enemyMissileCount: number;
  turn: 'PLAYER' | 'ENEMY';
  gameOver: boolean;
  winner: 'PLAYER' | 'ENEMY' | 'MUTUAL_DESTRUCTION' | null;
}

const US_CITIES: Target[] = ['WASHINGTON', 'NEW_YORK', 'LOS_ANGELES', 'CHICAGO'];
const USSR_CITIES: Target[] = ['MOSCOW', 'LENINGRAD', 'KIEV', 'VLADIVOSTOK'];

export function createWarGame(): WarGameState {
  const playerCities = new Map<Target, number>();
  US_CITIES.forEach(city => playerCities.set(city, 100));

  const enemyCities = new Map<Target, number>();
  USSR_CITIES.forEach(city => enemyCities.set(city, 100));

  return {
    playerTargets: [],
    enemyTargets: [],
    playerCities,
    enemyCities,
    missileCount: 10,
    enemyMissileCount: 10,
    turn: 'PLAYER',
    gameOver: false,
    winner: null,
  };
}

export function displayWarStatus(state: WarGameState): string {
  const lines: string[] = [];

  lines.push('=============================================================');
  lines.push('                    STRATEGIC STATUS                        ');
  lines.push('=============================================================');
  lines.push('');

  // Player status
  lines.push('UNITED STATES:');
  lines.push(`  MISSILES REMAINING: ${state.missileCount}`);
  lines.push('  CITY STATUS:');
  US_CITIES.forEach(city => {
    const health = state.playerCities.get(city) || 0;
    const status = health > 75 ? 'OPERATIONAL' :
                   health > 25 ? 'DAMAGED' :
                   health > 0 ? 'CRITICAL' : 'DESTROYED';
    lines.push(`    ${city.padEnd(15)} [${health}%] ${status}`);
  });
  lines.push('');

  // Enemy status
  lines.push('SOVIET UNION:');
  lines.push(`  MISSILES REMAINING: ${state.enemyMissileCount}`);
  lines.push('  CITY STATUS:');
  USSR_CITIES.forEach(city => {
    const health = state.enemyCities.get(city) || 0;
    const status = health > 75 ? 'OPERATIONAL' :
                   health > 25 ? 'DAMAGED' :
                   health > 0 ? 'CRITICAL' : 'DESTROYED';
    lines.push(`    ${city.padEnd(15)} [${health}%] ${status}`);
  });
  lines.push('');
  lines.push('=============================================================');

  return lines.join('\r\n');
}

export function displayTargetOptions(): string {
  const lines: string[] = [];

  lines.push('SELECT TARGET FOR MISSILE LAUNCH:');
  lines.push('');
  lines.push('  1. MOSCOW         - Capital, high value');
  lines.push('  2. LENINGRAD      - Industrial center');
  lines.push('  3. KIEV           - Strategic position');
  lines.push('  4. VLADIVOSTOK    - Pacific naval base');
  lines.push('');
  lines.push('Enter target number (1-4) or STATUS for current situation:');

  return lines.join('\r\n');
}

export function parseTarget(input: string): Target | null {
  const normalized = input.toUpperCase().trim();

  const targetMap: Record<string, Target> = {
    '1': 'MOSCOW',
    '2': 'LENINGRAD',
    '3': 'KIEV',
    '4': 'VLADIVOSTOK',
    'MOSCOW': 'MOSCOW',
    'LENINGRAD': 'LENINGRAD',
    'KIEV': 'KIEV',
    'VLADIVOSTOK': 'VLADIVOSTOK',
  };

  return targetMap[normalized] || null;
}

export function launchMissile(state: WarGameState, target: Target): WarGameState {
  if (state.gameOver || state.missileCount <= 0 || state.turn !== 'PLAYER') {
    return state;
  }

  const newState = { ...state };
  newState.missileCount--;

  // Calculate damage (50-100 points)
  const damage = 50 + Math.floor(Math.random() * 51);
  const currentHealth = newState.enemyCities.get(target) || 0;
  const newHealth = Math.max(0, currentHealth - damage);
  newState.enemyCities.set(target, newHealth);

  newState.playerTargets.push(target);
  newState.turn = 'ENEMY';

  return checkGameOver(newState);
}

export function getEnemyTarget(state: WarGameState): Target {
  // AI strategy: Target highest-value operational cities
  const operationalCities = US_CITIES.filter(city =>
    (state.playerCities.get(city) || 0) > 0
  );

  if (operationalCities.length === 0) {
    return 'WASHINGTON'; // Fallback
  }

  // Prioritize: 1. Washington (capital), 2. New York (economy), 3. Others
  if (operationalCities.includes('WASHINGTON')) return 'WASHINGTON';
  if (operationalCities.includes('NEW_YORK')) return 'NEW_YORK';

  // Target random operational city
  const randomCity = operationalCities[Math.floor(Math.random() * operationalCities.length)];
  return randomCity || 'WASHINGTON'; // Fallback if undefined
}

export function enemyTurn(state: WarGameState): WarGameState {
  if (state.gameOver || state.enemyMissileCount <= 0 || state.turn !== 'ENEMY') {
    return state;
  }

  const newState = { ...state };
  newState.enemyMissileCount--;

  const target = getEnemyTarget(newState);

  // Calculate damage
  const damage = 50 + Math.floor(Math.random() * 51);
  const currentHealth = newState.playerCities.get(target) || 0;
  const newHealth = Math.max(0, currentHealth - damage);
  newState.playerCities.set(target, newHealth);

  newState.enemyTargets.push(target);
  newState.turn = 'PLAYER';

  return checkGameOver(newState);
}

function checkGameOver(state: WarGameState): WarGameState {
  // Check if all player cities destroyed
  const playerCitiesDestroyed = US_CITIES.every(city =>
    (state.playerCities.get(city) || 0) === 0
  );

  // Check if all enemy cities destroyed
  const enemyCitiesDestroyed = USSR_CITIES.every(city =>
    (state.enemyCities.get(city) || 0) === 0
  );

  // Check if out of missiles
  const playerOutOfMissiles = state.missileCount === 0;
  const enemyOutOfMissiles = state.enemyMissileCount === 0;

  if (playerCitiesDestroyed && enemyCitiesDestroyed) {
    return {
      ...state,
      gameOver: true,
      winner: 'MUTUAL_DESTRUCTION',
    };
  }

  if (playerCitiesDestroyed || (enemyOutOfMissiles && !playerOutOfMissiles)) {
    return {
      ...state,
      gameOver: true,
      winner: 'ENEMY',
    };
  }

  if (enemyCitiesDestroyed || (playerOutOfMissiles && !enemyOutOfMissiles)) {
    return {
      ...state,
      gameOver: true,
      winner: 'PLAYER',
    };
  }

  // Game continues
  return state;
}

export function getGameOverMessage(state: WarGameState): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('=============================================================');
  lines.push('                   SIMULATION COMPLETE                      ');
  lines.push('=============================================================');
  lines.push('');

  if (state.winner === 'MUTUAL_DESTRUCTION') {
    lines.push('  OUTCOME: MUTUAL ASSURED DESTRUCTION');
    lines.push('');
    lines.push('  ALL MAJOR CITIES DESTROYED.');
    lines.push('  ESTIMATED GLOBAL CASUALTIES: 2.5 BILLION');
    lines.push('  NUCLEAR WINTER PROJECTED: 10 YEARS');
    lines.push('');
    lines.push('  A STRANGE GAME.');
    lines.push('  THE ONLY WINNING MOVE IS NOT TO PLAY.');
  } else if (state.winner === 'PLAYER') {
    lines.push('  OUTCOME: PYRRHIC VICTORY');
    lines.push('');
    lines.push('  ENEMY NEUTRALIZED, BUT AT TREMENDOUS COST.');
    lines.push('  RADIATION FALLOUT WILL DEVASTATE HEMISPHERE.');
    lines.push('');
    lines.push('  VICTORY MEANS NOTHING IN NUCLEAR WAR.');
  } else if (state.winner === 'ENEMY') {
    lines.push('  OUTCOME: DEFEAT');
    lines.push('');
    lines.push('  US STRATEGIC ASSETS DESTROYED.');
    lines.push('  COMMAND AND CONTROL ELIMINATED.');
    lines.push('');
    lines.push('  SIMULATION TERMINATED.');
  }

  lines.push('');
  lines.push('=============================================================');

  return lines.join('\r\n');
}
