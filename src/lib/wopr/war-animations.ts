/**
 * ASCII animations for WOPR war games
 */

export interface MissileAnimation {
  frames: string[];
  delay: number; // ms between frames
}

export function getMissileLaunchAnimation(): MissileAnimation {
  return {
    frames: [
      'MISSILE LAUNCH SEQUENCE INITIATED...',
      'T-MINUS 10 SECONDS...',
      'T-MINUS 5 SECONDS...',
      'IGNITION!',
      '     ^',
      '     |',
      '     *',
      '        ^',
      '        |',
      '        *',
      '           ^',
      '           |  ',
      '           *',
      '              ^',
      '              |',
      '              *',
      '                 ^',
      '                 |',
      '                 *',
      '                    *',
      '                    |',
      '                    V',
      'TARGET ACQUIRED...',
      'IMPACT IMMINENT...',
    ],
    delay: 150,
  };
}

export function getExplosionAnimation(): MissileAnimation {
  return {
    frames: [
      'IMPACT!',
      '      *',
      '     ***',
      '    *****',
      '   *******',
      '  *********',
      ' ***********',
      '*************',
      ' ***********',
      '  *********',
      '   *******',
      '    *****',
      '     ***',
      '      *',
      '',
      'DETONATION CONFIRMED.',
    ],
    delay: 100,
  };
}

export function getCounterStrikeAnimation(): MissileAnimation {
  return {
    frames: [
      'ENEMY COUNTERSTRIKE DETECTED!',
      'INCOMING ICBM TRAJECTORY CONFIRMED...',
      'ALERT: DEFENSE SYSTEMS ACTIVATED...',
      '                    *',
      '                 *',
      '              *',
      '           *',
      '        *',
      '     *',
      'INCOMING IMPACT!',
    ],
    delay: 150,
  };
}

export function getMultipleMissilesAnimation(): MissileAnimation {
  return {
    frames: [
      'MULTIPLE LAUNCH DETECTION!',
      'TRACKING 3 INBOUND MISSILES...',
      '   *    *    *',
      '      *    *    *',
      '         *    *    *',
      'MULTIPLE IMPACTS IMMINENT!',
    ],
    delay: 200,
  };
}

export function getDefconAlertAnimation(): MissileAnimation {
  return {
    frames: [
      '!!! WARNING !!!',
      'DEFCON 1 ACTIVATED',
      'NUCLEAR LAUNCH AUTHORIZED',
      '',
      '!!! WARNING !!!',
      'DEFCON 1 ACTIVATED',
      'NUCLEAR LAUNCH AUTHORIZED',
      '',
      '!!! WARNING !!!',
      'DEFCON 1 ACTIVATED',
      'NUCLEAR LAUNCH AUTHORIZED',
    ],
    delay: 200,
  };
}

export const WAR_SCENARIOS = {
  GLOBAL_THERMONUCLEAR: {
    name: 'GLOBAL THERMONUCLEAR WAR',
    intro: [
      'INITIALIZING GLOBAL THERMONUCLEAR WAR SCENARIO...',
      'LOADING ICBM TRAJECTORIES...',
      'SETTING DEFCON LEVEL TO 1...',
      'STRATEGIC AIR COMMAND ON FULL ALERT...',
    ],
    animations: [
      'defcon_alert',
      'missile_launch',
      'explosion',
      'counter_strike',
      'multiple_missiles',
    ],
  },
  THEATER_EUROPE: {
    name: 'THEATER WARFARE: EUROPE',
    intro: [
      'INITIALIZING EUROPEAN THEATER...',
      'NATO FORCES: STANDING BY',
      'WARSAW PACT: MOBILIZING',
      'CONVENTIONAL FORCES ENGAGING...',
    ],
    animations: ['missile_launch', 'counter_strike'],
  },
  PACIFIC: {
    name: 'PACIFIC THEATER',
    intro: [
      'INITIALIZING PACIFIC THEATER...',
      'NAVAL FORCES POSITIONING...',
      'AIR SUPERIORITY CONTESTED...',
      'CARRIER GROUPS ENGAGED...',
    ],
    animations: ['missile_launch', 'explosion'],
  },
};
