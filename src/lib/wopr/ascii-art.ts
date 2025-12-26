/**
 * ASCII Art and Animations for WOPR Terminal
 */

import { DefconLevel } from './game-engine';

export const WORLD_MAP = `
┌──────────────────────────────────────────────────────────────────────┐
│                         W O R L D   M A P                            │
│                                                                      │
│         ▲ ICBM    ◆ NAVAL    ★ COMMAND    ● CITY    ░ DESTROYED    │
│                                                                      │
│     .--------.              ATLANTIC             .--------.          │
│    /          \\               ~~~               /          \\        │
│   |    USA     |              ~~~              |    USSR    |        │
│   |  ★  ●  ●   |              ~~~              |  ★  ●  ●   |        │
│   |  ▲  ▲  ▲   |                               |  ▲  ▲  ▲   |        │
│   |  ◆     ◆   |         PACIFIC               |  ◆     ◆   |        │
│    \\          /            ~~~                  \\          /         │
│     '--------'             ~~~                   '--------'          │
│                                                                      │
│                EUROPE           ASIA                                │
│                 .-.             .-.                                 │
│                | ● |           | ● |                                │
│                | ▲ |           | ▲ |                                │
│                 '-'             '-'                                 │
│                                                                      │
│              MIDDLE EAST                                            │
│                 .-.                                                 │
│                | ● |                                                │
│                 '-'                                                 │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
`;

export const MISSILE_ANIMATION_FRAMES = [
  `    .    `,
  `   /|\\   `,
  `  / | \\  `,
  `    |    `,
  `    ▼    `,
  `   \\ /   `,
  `    V    `,
];

export const EXPLOSION_ANIMATION_FRAMES = [
  `    .    `,
  `   .*    `,
  `  .***   `,
  ` .*****  `,
  `.*******.`,
  `*********`,
  ` ******* `,
  `  *****  `,
  `   ***   `,
  `    *    `,
  `         `,
];

export const MUSHROOM_CLOUD = `
      .-.
     (   )
      '-'
     /   \\
    |     |
    |     |
    |     |
   /       \\
  |         |
  |         |
  |_________|
   | | | | |
   | | | | |
`;

export function getDefconDisplay(level: DefconLevel): string {
  const bars = {
    1: '█████',
    2: '████░',
    3: '███░░',
    4: '██░░░',
    5: '█░░░░',
  };

  const colors = {
    1: 'CRITICAL',
    2: 'SEVERE  ',
    3: 'ELEVATED',
    4: 'GUARDED ',
    5: 'LOW     ',
  };

  return `
╔═══════════════════════════════════════════════════════════╗
║              DEFENSE READINESS CONDITION                  ║
║                                                           ║
║   ${level === 5 ? '►' : ' '} DEFCON 5 - FADE OUT       [${level === 5 ? bars[5] : '░░░░░'}]   ${level === 5 ? colors[5] : '        '}  ║
║   ${level === 4 ? '►' : ' '} DEFCON 4 - DOUBLE TAKE    [${level === 4 ? bars[4] : '░░░░░'}]   ${level === 4 ? colors[4] : '        '}  ║
║   ${level === 3 ? '►' : ' '} DEFCON 3 - ROUND HOUSE    [${level === 3 ? bars[3] : '░░░░░'}]   ${level === 3 ? colors[3] : '        '}  ║
║   ${level === 2 ? '►' : ' '} DEFCON 2 - FAST PACE      [${level === 2 ? bars[2] : '░░░░░'}]   ${level === 2 ? colors[2] : '        '}  ║
║   ${level === 1 ? '►' : ' '} DEFCON 1 - COCKED PISTOL  [${level === 1 ? bars[1] : '░░░░░'}]   ${level === 1 ? colors[1] : '        '}  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`;
}

export const BOOT_SEQUENCE_MESSAGES = [
  'NORAD STRATEGIC DEFENSE SYSTEM',
  'INITIALIZING...',
  '',
  'PERFORMING SYSTEM DIAGNOSTICS...',
  'MEMORY CHECK.................. 65536K OK',
  'PROCESSOR STATUS.............. OPERATIONAL',
  'THREAT DETECTION SYSTEMS...... ONLINE',
  '',
  'LOADING WOPR KERNEL........... OK',
  'MOUNTING /DEV/RADAR........... OK',
  'MOUNTING /DEV/SATELLITE....... OK',
  'CONNECTING TO STRATEGIC COMMAND OK',
  'LOADING WAR SCENARIOS......... OK',
  '',
  'ESTABLISHING SECURE LINK TO NORAD...',
  'ENCRYPTION: AES-256',
  'AUTHENTICATION: CONFIRMED',
  'CONNECTION: ESTABLISHED',
  '',
];

export const WOPR_LOGO = `
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   ██╗    ██╗ ██████╗ ██████╗ ██████╗                                ║
║   ██║    ██║██╔═══██╗██╔══██╗██╔══██╗                               ║
║   ██║ █╗ ██║██║   ██║██████╔╝██████╔╝                               ║
║   ██║███╗██║██║   ██║██╔═══╝ ██╔══██╗                               ║
║   ╚███╔███╔╝╚██████╔╝██║     ██║  ██║                               ║
║    ╚══╝╚══╝  ╚═════╝ ╚═╝     ╚═╝  ╚═╝                               ║
║                                                                      ║
║            WAR OPERATION PLAN RESPONSE                               ║
║            STRATEGIC DEFENSE COMPUTER                                ║
║            NORAD - NORTH AMERICAN AEROSPACE DEFENSE COMMAND          ║
║                                                                      ║
║            BUILD: 1983.06.03                                         ║
║            CLEARANCE LEVEL: TOP SECRET                               ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
`;

export const TIC_TAC_TOE_BOARD = `
     |     |
  ${' '}  |  ${' '}  |  ${' '}
_____|_____|_____
     |     |
  ${' '}  |  ${' '}  |  ${' '}
_____|_____|_____
     |     |
  ${' '}  |  ${' '}  |  ${' '}
     |     |
`;

export const SCENARIOS_LIST = `
┌────────────────────────────────────────────────────────────────────┐
│                    AVAILABLE WAR SIMULATIONS                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  [1] GLOBAL THERMONUCLEAR WAR                                      │
│      Full-scale US vs USSR nuclear exchange                        │
│      Difficulty: ██████████ EXTREME                                │
│                                                                    │
│  [2] THEATER WARFARE: EUROPE                                       │
│      NATO vs Warsaw Pact conventional forces                       │
│      Difficulty: ████████░░ HARD                                   │
│                                                                    │
│  [3] PACIFIC THEATER                                               │
│      Naval and air combat in the Pacific                           │
│      Difficulty: ██████░░░░ MEDIUM                                 │
│                                                                    │
│  [4] MIDDLE EAST CRISIS                                            │
│      Oil fields and coalition warfare                              │
│      Difficulty: ██████░░░░ MEDIUM                                 │
│                                                                    │
│  [5] CYBER WARFARE 2024                                            │
│      Modern infrastructure attacks                                 │
│      Difficulty: ████████░░ HARD                                   │
│                                                                    │
│  [6] TIC-TAC-TOE                                                   │
│      A strange game. The only winning move is not to play.         │
│      Difficulty: ██░░░░░░░░ EASY                                   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
`;

export const GAME_OVER_SCREEN = (winner: string, casualties: number) => `
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║                        G A M E   O V E R                           ║
║                                                                    ║
║                    WINNER: ${winner.padEnd(38)}║
║                                                                    ║
║                    FINAL CASUALTY COUNT                            ║
║                    ${casualties.toLocaleString().padEnd(30)}          ║
║                                                                    ║
║                                                                    ║
║              A STRANGE GAME.                                       ║
║              THE ONLY WINNING MOVE IS NOT TO PLAY.                 ║
║                                                                    ║
║                                                                    ║
║              HOW ABOUT A NICE GAME OF CHESS?                       ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
`;

export function animateMissileLaunch(): string[] {
  return MISSILE_ANIMATION_FRAMES;
}

export function animateExplosion(): string[] {
  return EXPLOSION_ANIMATION_FRAMES;
}
