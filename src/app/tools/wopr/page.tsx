'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import CRTEffect from '@/components/wopr/CRTEffect';
import { getDefconDisplay } from '@/lib/wopr/ascii-art';
import EmailCaptureModal from '@/components/marketing/EmailCaptureModal';
import { useToolUsage } from '@/hooks/useToolUsage';
import {
  createNewGame,
  displayBoard,
  parseMove,
  makeMove,
  getWOPRMove,
  type TicTacToeState,
} from '@/lib/wopr/tic-tac-toe';
import {
  displayWarStatus,
  displayTargetOptions,
  parseTarget,
  launchMissile,
  enemyTurn,
  getGameOverMessage,
  type WarGameState,
} from '@/lib/wopr/war-game';
import {
  initializeGame,
  processAction,
  parseCommand as parseEngineCommand,
  getDefconDescription,
  type GameState as AdvancedGameState,
  type Command as EngineCommand,
} from '@/lib/wopr/game-engine';
import {
  getMissileLaunchAnimation,
  getExplosionAnimation,
  getCounterStrikeAnimation,
  getDefconAlertAnimation,
  type MissileAnimation,
} from '@/lib/wopr/war-animations';

const WOPR_LOGO = `
==============================================================================

    W     W   OOO   PPPP   RRRR
    W     W  O   O  P   P  R   R
    W  W  W  O   O  PPPP   RRRR
    W W W W  O   O  P      R  R
     W   W    OOO   P      R   R

              WAR OPERATION PLAN RESPONSE
            STRATEGIC DEFENSE COMPUTER
      NORAD - NORTH AMERICAN AEROSPACE DEFENSE COMMAND

==============================================================================
`;

export default function WOPRPage() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const inputBuffer = useRef('');

  // Email capture integration
  const {
    shouldShowModal,
    trackUsage,
    markSignedUp,
    closeModal,
  } = useToolUsage('wopr');

  // Sound effects using Web Audio API
  const audioContextRef = useRef<AudioContext | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  // Tic-Tac-Toe game state (use ref for immediate updates)
  const ticTacToeGameRef = useRef<TicTacToeState | null>(null);

  // War game state (legacy - simple version)
  const warGameRef = useRef<WarGameState | null>(null);

  // Advanced game engine state (for sophisticated war simulations)
  const gameEngineRef = useRef<AdvancedGameState | string | null>(null);

  const playSound = (type: 'keypress' | 'beep' | 'alert' | 'boot') => {
    if (typeof window === 'undefined') return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
      case 'keypress':
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.05;
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.03);
        break;
      case 'beep':
        oscillator.frequency.value = 440;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.1);
        break;
      case 'alert':
        oscillator.frequency.value = 880;
        gainNode.gain.value = 0.15;
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.2);
        break;
      case 'boot':
        oscillator.frequency.value = 220;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.15);
        break;
    }
  };

  const speakText = async (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined') return;

    try {
      // Use browser speech synthesis for now (ElevenLabs can be added later)
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.75; // Slower, more robotic
      utterance.pitch = 0.5; // Deeper voice
      utterance.volume = 0.8;

      // Try to get a more robotic voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v =>
        v.name.includes('Google') ||
        v.name.includes('Microsoft') ||
        v.name.includes('Male')
      );

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Voice synthesis error:', error);
    }
  };

  useEffect(() => {
    // Load voices for speech synthesis
    if (typeof window !== 'undefined') {
      window.speechSynthesis.getVoices();
      // Some browsers need this event
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    // Initialize terminal with VT323 retro font
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 18,
      fontFamily: '"VT323", "Courier New", monospace',
      theme: {
        background: '#000000',
        foreground: '#33ff33',
        cursor: '#33ff33',
        cursorAccent: '#000000',
        selectionBackground: '#33ff3333',
      },
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    // Boot sequence
    bootSequence(term);

    // Handle input
    term.onData((data) => {
      handleInput(term, data);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, []);

  // Email capture submission handler
  const handleEmailSubmit = async (email: string, name: string) => {
    try {
      const response = await fetch('/api/marketing/capture-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          toolId: 'wopr',
          source: 'tool-gate',
        }),
      });

      if (response.ok) {
        markSignedUp();
      }
    } catch (error) {
      console.error('Email capture failed:', error);
      throw error;
    }
  };

  const bootSequence = async (term: Terminal) => {
    const messages = [
      'INITIALIZING WOPR SYSTEM...',
      'LOADING STRATEGIC DEFENSE PROTOCOLS...',
      'CONNECTING TO NORAD MAINFRAME...',
      'ESTABLISHING SECURE COMMUNICATION LINK...',
      'LOADING NUCLEAR RESPONSE SCENARIOS...',
      'INITIALIZING WAR SIMULATION ALGORITHMS...',
      'SYSTEM READY.\r\n',
    ];

    for (const msg of messages) {
      playSound('boot');
      await typeText(term, msg + '\r\n', 30);
      await sleep(200);
    }

    term.write('\r\n');
    await typeText(term, WOPR_LOGO, 1);
    term.write('\r\n\r\n');
    await typeText(term, 'GREETINGS, PROFESSOR FALKEN.\r\n\r\n', 50);
    await typeText(term, 'SHALL WE PLAY A GAME?\r\n\r\n', 50);

    // Add quick start instructions
    await typeText(term, '==============================================================\r\n', 10);
    await typeText(term, '                    QUICK START GUIDE                         \r\n', 10);
    await typeText(term, '==============================================================\r\n', 10);
    await typeText(term, '\r\n', 10);
    await typeText(term, 'Type these commands to begin:\r\n', 10);
    await typeText(term, '\r\n', 10);
    await typeText(term, '  HELP         - Show all available commands\r\n', 10);
    await typeText(term, '  LIST GAMES   - Display war game scenarios (1-7)\r\n', 10);
    await typeText(term, '  PLAY 1       - Start Global Thermonuclear War\r\n', 10);
    await typeText(term, '  DEFCON       - Check current defense readiness\r\n', 10);
    await typeText(term, '\r\n', 10);
    await typeText(term, '  TIP: Just type "1" and press ENTER to start!\r\n', 10);
    await typeText(term, '\r\n', 10);
    await typeText(term, '==============================================================\r\n', 10);
    term.write('\r\n');
    term.write('> ');
  };

  const typeText = (term: Terminal, text: string, delay: number): Promise<void> => {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          const char = text[i];
          if (char) {
            term.write(char);
          }
          i++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    });
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const playAnimation = async (term: Terminal, animation: MissileAnimation): Promise<void> => {
    for (const frame of animation.frames) {
      await typeText(term, frame + '\r\n', 0);
      playSound('boot');
      await sleep(animation.delay);
    }
  };

  // Helper function to display advanced game state
  const displayGameState = (state: AdvancedGameState): string => {
    const lines: string[] = [];

    lines.push('=============================================================');
    lines.push('                   STRATEGIC STATUS REPORT                  ');
    lines.push('=============================================================');
    lines.push('');
    lines.push(`SCENARIO: ${state.scenario.toUpperCase()}`);
    lines.push(`DEFCON LEVEL: ${state.defcon} - ${getDefconDescription(state.defcon)}`);
    lines.push(`TURN: ${state.turn}    PHASE: ${state.phase}`);
    lines.push('');

    lines.push(`${state.playerSide} ASSETS (PLAYER):`);
    lines.push(`  ICBMs: ${state.playerAssets.icbms}  SLBMs: ${state.playerAssets.slbms}`);
    lines.push(`  Bombers: ${state.playerAssets.bombers}  Fighters: ${state.playerAssets.fighters}`);
    lines.push(`  Submarines: ${state.playerAssets.submarines}  Carriers: ${state.playerAssets.carriers}`);
    lines.push(`  Cities: ${state.playerAssets.cities}  Population: ${(state.playerAssets.population / 1_000_000).toFixed(1)}M`);
    lines.push('');

    lines.push(`${state.enemySide} ASSETS (ENEMY):`);
    lines.push(`  ICBMs: ${state.enemyAssets.icbms}  SLBMs: ${state.enemyAssets.slbms}`);
    lines.push(`  Bombers: ${state.enemyAssets.bombers}  Fighters: ${state.enemyAssets.fighters}`);
    lines.push(`  Submarines: ${state.enemyAssets.submarines}  Carriers: ${state.enemyAssets.carriers}`);
    lines.push(`  Cities: ${state.enemyAssets.cities}  Population: ${(state.enemyAssets.population / 1_000_000).toFixed(1)}M`);
    lines.push('');

    lines.push('CASUALTIES:');
    lines.push(`  Player Civilian: ${(state.casualties.playerCivilian / 1_000_000).toFixed(2)}M  Military: ${state.casualties.playerMilitary}`);
    lines.push(`  Enemy Civilian: ${(state.casualties.enemyCivilian / 1_000_000).toFixed(2)}M  Military: ${state.casualties.enemyMilitary}`);
    lines.push('');

    lines.push('STRIKE SUMMARY:');
    lines.push(`  Launched: ${state.strikes.playerLaunched}  Intercepted: ${state.strikes.playerIntercepted}`);
    lines.push(`  Enemy Launched: ${state.strikes.enemyLaunched}  Enemy Intercepted: ${state.strikes.enemyIntercepted}`);
    lines.push('');
    lines.push('=============================================================');

    return lines.join('\r\n');
  };

  // Helper function to display available commands
  const getAvailableCommands = (_state: AdvancedGameState): string => {
    const lines: string[] = [];

    lines.push('AVAILABLE COMMANDS:');
    lines.push('');
    lines.push('  LAUNCH [weapon] [target] [qty] - Launch strike (ICBM, SLBM, BOMBER)');
    lines.push('  DEFEND [location]             - Activate defense systems');
    lines.push('  RECON [area]                  - Gather intelligence');
    lines.push('  NEGOTIATE                     - Attempt diplomatic resolution');
    lines.push('  STATUS                        - Display current situation');
    lines.push('  SURRENDER                     - End simulation (defeat)');
    lines.push('  HELP                          - Show this command list');
    lines.push('');
    lines.push('Example: LAUNCH ICBM MOSCOW 5');

    return lines.join('\r\n');
  };

  const parseGameEngineCommand = (input: string): EngineCommand | null => {
    const cmd = input.toLowerCase().trim();
    const parts = cmd.split(' ');

    // LAUNCH [target]
    if (cmd.startsWith('launch')) {
      return {
        type: 'LAUNCH',
        target: parts[1]?.toUpperCase(),
      };
    }

    // DEFEND [location]
    if (cmd.startsWith('defend')) {
      return {
        type: 'DEFEND',
        target: parts[1]?.toUpperCase(),
      };
    }

    // RECON [area]
    if (cmd.startsWith('recon')) {
      return {
        type: 'RECON',
        target: parts[1]?.toUpperCase(),
      };
    }

    // NEGOTIATE
    if (cmd === 'negotiate' || cmd === 'diplomacy') {
      return { type: 'NEGOTIATE' };
    }

    // SURRENDER
    if (cmd === 'surrender' || cmd === 'give up') {
      return { type: 'SURRENDER' };
    }

    // STATUS (handled elsewhere but included for completeness)
    if (cmd === 'status' || cmd === 'stat' || cmd === 'sitrep') {
      return { type: 'STATUS' };
    }

    return null;
  };

  const handleInput = async (term: Terminal, data: string) => {
    const code = data.charCodeAt(0);

    // Handle Enter
    if (code === 13) {
      const command = inputBuffer.current.trim();
      term.write('\r\n');
      playSound('beep');

      if (command) {
        await processCommand(term, command);
      }

      inputBuffer.current = '';
      term.write('> ');
      return;
    }

    // Handle Backspace
    if (code === 127 || code === 8) {
      if (inputBuffer.current.length > 0) {
        inputBuffer.current = inputBuffer.current.slice(0, -1);
        term.write('\b \b');
        playSound('keypress');
      }
      return;
    }

    // Handle Ctrl+C
    if (code === 3) {
      term.write('^C\r\n> ');
      inputBuffer.current = '';
      playSound('alert');
      return;
    }

    // Regular character
    if (code >= 32 && code <= 126 && data) {
      inputBuffer.current += data;
      term.write(data);
      playSound('keypress');
    }
  };

  const processCommand = async (term: Terminal, command: string) => {
    const cmd = command.toLowerCase();

    if (cmd === 'help' || cmd === 'h' || cmd === '?') {
      // If advanced game is active, show game-specific commands
      if (gameEngineRef.current && typeof gameEngineRef.current !== 'string') {
        await typeText(term, '\r\n' + getAvailableCommands(gameEngineRef.current) + '\r\n', 10);
        return;
      }

      // Otherwise show general WOPR commands
      await typeText(term, '\r\n==============================================================\r\n', 10);
      await typeText(term, '                  WOPR COMMAND REFERENCE                     \r\n', 10);
      await typeText(term, '==============================================================\r\n', 10);
      await typeText(term, '\r\n', 10);
      await typeText(term, '  HELP              - Display this command list\r\n', 10);
      await typeText(term, '  LIST GAMES        - Show available war scenarios\r\n', 10);
      await typeText(term, '  PLAY [1-7]        - Start a war game (e.g. PLAY 1)\r\n', 10);
      await typeText(term, '  STATUS            - Show current system status\r\n', 10);
      await typeText(term, '  DEFCON            - Display defense readiness level\r\n', 10);
      await typeText(term, '  VOICE             - Toggle voice synthesis ON/OFF\r\n', 10);
      await typeText(term, '  QUIT or EXIT      - Exit WOPR system\r\n', 10);
      await typeText(term, '\r\n', 10);
      await typeText(term, '  SHORTCUTS: Type "1" for PLAY 1, "?" for HELP\r\n', 10);
      await typeText(term, '  TIP: Type "VOICE" to hear WOPR speak!\r\n', 10);
      await typeText(term, '\r\n', 10);
      await typeText(term, '==============================================================\r\n', 10);
      term.write('\r\n');
    } else if (cmd === 'list games' || cmd === 'list' || cmd === 'games') {
      await typeText(term, '\r\n==============================================================\r\n', 10);
      await typeText(term, '              AVAILABLE WAR SIMULATIONS                      \r\n', 10);
      await typeText(term, '==============================================================\r\n', 10);
      await typeText(term, '\r\n', 10);
      await typeText(term, '  1. GLOBAL THERMONUCLEAR WAR\r\n', 10);
      await typeText(term, '  2. THEATER WARFARE: EUROPE\r\n', 10);
      await typeText(term, '  3. PACIFIC THEATER\r\n', 10);
      await typeText(term, '  4. MIDDLE EAST CRISIS\r\n', 10);
      await typeText(term, '  5. CYBER WARFARE\r\n', 10);
      await typeText(term, '  6. TIC-TAC-TOE\r\n', 10);
      await typeText(term, '  7. CHESS\r\n', 10);
      await typeText(term, '\r\n', 10);
      await typeText(term, '  Type "PLAY 1" or just "1" to start a game\r\n', 10);
      await typeText(term, '\r\n', 10);
      await typeText(term, '==============================================================\r\n', 10);
      term.write('\r\n');
    } else if (cmd.match(/^[1-7]$/)) {
      // Shortcut: just type a number to play that game
      await processCommand(term, `PLAY ${cmd}`);
      return;
    } else if (cmd.startsWith('play')) {
      const scenarioNum = cmd.split(' ')[1];
      if (scenarioNum) {
        // Track war game usage for email capture modal
        trackUsage();

        // Handle Tic-Tac-Toe (Scenario 6)
        if (scenarioNum === '6') {
          await typeText(term, '\r\nINITIALIZING TIC-TAC-TOE...\r\n', 30);
          await typeText(term, 'A STRANGE GAME.\r\n\r\n', 30);

          const newGame = createNewGame();
          ticTacToeGameRef.current = newGame;

          await typeText(term, displayBoard(newGame.board) + '\r\n', 10);
          await typeText(term, 'YOU ARE X. WOPR IS O.\r\n', 20);
          await typeText(term, 'Enter your move (A1, B2, C3, etc.) or NEW GAME to restart.\r\n\r\n', 20);
          await speakText('Tic-Tac-Toe initialized. You are X. I am O. Make your move.');
          return;
        }

        // Handle war game scenarios with animations
        if (scenarioNum === '1') {
          // Global Thermonuclear War - Advanced Engine
          await typeText(term, '\r\nINITIALIZING GLOBAL THERMONUCLEAR WAR...\r\n', 30);
          await typeText(term, 'ESCALATION SEQUENCE INITIATED...\r\n', 30);
          await sleep(500);

          // DEFCON alert animation (escalates from 5 to 1)
          await playAnimation(term, getDefconAlertAnimation());
          await typeText(term, '\r\n', 10);

          // Prompt for side selection
          await typeText(term, 'SELECT YOUR SIDE:\r\n', 20);
          await typeText(term, '  1. UNITED STATES\r\n', 20);
          await typeText(term, '  2. SOVIET UNION\r\n\r\n', 20);
          await typeText(term, 'Enter 1 or 2: ', 20);
          await speakText('Select your side. One, United States. Two, Soviet Union.');

          // Set flag to expect side selection
          gameEngineRef.current = 'AWAITING_SIDE_SELECTION';
          return;

        } else if (scenarioNum === '2' || scenarioNum === '3') {
          // Theater warfare - single missile exchange
          await typeText(term, `\r\nINITIALIZING SCENARIO ${scenarioNum}...\r\n`, 30);
          await typeText(term, 'DEPLOYING TACTICAL MISSILES...\r\n\r\n', 30);
          await sleep(500);

          await playAnimation(term, getMissileLaunchAnimation());
          await playAnimation(term, getExplosionAnimation());

          await typeText(term, '\r\nENEMY RESPONSE INCOMING...\r\n\r\n', 30);
          await playAnimation(term, getCounterStrikeAnimation());
          await playAnimation(term, getExplosionAnimation());

          await typeText(term, '\r\nSIMULATION COMPLETE. TACTICAL OBJECTIVES ACHIEVED.\r\n\r\n', 20);
          await speakText('Simulation complete. Tactical objectives achieved.');

        } else if (scenarioNum === '4' || scenarioNum === '5') {
          // Limited engagement
          await typeText(term, `\r\nINITIALIZING SCENARIO ${scenarioNum}...\r\n`, 30);
          await typeText(term, 'LOADING STRATEGIC ASSETS...\r\n\r\n', 30);
          await sleep(500);

          await playAnimation(term, getMissileLaunchAnimation());
          await playAnimation(term, getExplosionAnimation());

          await typeText(term, '\r\nSIMULATION COMPLETE.\r\n\r\n', 20);
          await speakText('Simulation complete.');

        } else {
          // Fallback for other scenarios
          await typeText(term, `\r\nINITIALIZING SCENARIO ${scenarioNum}...\r\n`, 30);
          await typeText(term, 'LOADING STRATEGIC TARGETS...\r\n', 30);
          await typeText(term, 'POSITIONING ASSETS...\r\n\r\n', 30);

          // Call AI API
          try {
            const response = await fetch('/api/tools/wopr', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ command: 'start_game', scenario: scenarioNum }),
            });

            const data = await response.json();
            if (data.response) {
              await typeText(term, data.response + '\r\n\r\n', 20);
              await speakText(data.response);
            }
          } catch (error) {
            await typeText(term, 'ERROR: Unable to contact WOPR mainframe.\r\n\r\n', 20);
          }
        }
      } else {
        await typeText(term, '\r\nPLEASE SPECIFY SCENARIO NUMBER. USE: PLAY [1-7]\r\n\r\n', 20);
      }
    } else if (cmd === 'status' || cmd === 'stat') {
      await typeText(term, '\r\n==============================================================\r\n', 10);
      await typeText(term, '                  WOPR SYSTEM STATUS                         \r\n', 10);
      await typeText(term, '==============================================================\r\n', 10);
      await typeText(term, '\r\n', 10);
      await typeText(term, '  SYSTEM STATUS:        OPERATIONAL\r\n', 10);
      await typeText(term, '  DEFCON LEVEL:         5 (PEACE CONDITION)\r\n', 10);
      await typeText(term, '  ACTIVE SCENARIOS:     0\r\n', 10);
      await typeText(term, '  LEARNING MODE:        ACTIVE\r\n', 10);
      await typeText(term, '  CONNECTION:           NORAD MAINFRAME SECURE\r\n', 10);
      await typeText(term, '\r\n', 10);
      await typeText(term, '  Ready to simulate war games. Type "LIST GAMES" to begin\r\n', 10);
      await typeText(term, '\r\n', 10);
      await typeText(term, '==============================================================\r\n', 10);
      term.write('\r\n');
    } else if (cmd === 'voice' || cmd === 'voice on' || cmd === 'voice off') {
      const newState = cmd === 'voice off' ? false : !voiceEnabled;
      setVoiceEnabled(newState);
      const status = newState ? 'ENABLED' : 'DISABLED';
      await typeText(term, `\r\nVOICE SYNTHESIS ${status}.\r\n`, 10);

      if (newState) {
        await typeText(term, 'WOPR will now speak all responses.\r\n', 10);
        await typeText(term, 'Testing voice... Listen for audio.\r\n', 10);

        // Test voice immediately with direct call
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          console.log('Voice enabled, attempting to speak...');
          const testUtterance = new SpeechSynthesisUtterance('Voice synthesis enabled. Greetings Professor Falken.');
          testUtterance.rate = 0.75;
          testUtterance.pitch = 0.5;
          testUtterance.volume = 1.0;

          testUtterance.onstart = () => console.log('Speech started');
          testUtterance.onend = () => console.log('Speech ended');
          testUtterance.onerror = (e) => console.error('Speech error:', e);

          window.speechSynthesis.speak(testUtterance);
        } else {
          await typeText(term, 'ERROR: Speech synthesis not available in browser.\r\n', 10);
        }
      } else {
        await typeText(term, 'Voice output deactivated.\r\n', 10);
        if (typeof window !== 'undefined') {
          window.speechSynthesis.cancel();
        }
      }
      term.write('\r\n');
    } else if (cmd === 'defcon') {
      // Use enhanced DEFCON display from ascii-art library
      const defconDisplay = getDefconDisplay(5);
      await typeText(term, '\r\n' + defconDisplay + '\r\n', 5);
    } else if (cmd === 'quit' || cmd === 'exit') {
      await typeText(term, '\r\n==============================================================\r\n', 20);
      await typeText(term, '\r\n', 20);
      await typeText(term, '              GOODBYE, PROFESSOR FALKEN.\r\n', 20);
      await typeText(term, '\r\n', 20);
      await typeText(term, '     "THE ONLY WINNING MOVE IS NOT TO PLAY."\r\n', 20);
      await typeText(term, '\r\n', 20);
      await typeText(term, '              Refresh page to restart WOPR\r\n', 20);
      await typeText(term, '\r\n', 20);
      await typeText(term, '==============================================================\r\n', 20);
      term.write('\r\n');
    } else if (gameEngineRef.current === 'AWAITING_SIDE_SELECTION') {
      // Handle side selection for advanced game engine
      if (cmd === '1' || cmd.includes('united') || cmd.includes('usa') || cmd.includes('america')) {
        const newGame = initializeGame('global-thermonuclear-war', 'USA');
        gameEngineRef.current = newGame;

        await typeText(term, '\r\nSIDE SELECTED: UNITED STATES\r\n\r\n', 20);
        await speakText('United States selected. Game initialized.');
        await sleep(500);

        await typeText(term, displayGameState(newGame) + '\r\n', 10);
        await typeText(term, '\r\n' + getAvailableCommands(newGame) + '\r\n', 10);
        return;
      }

      if (cmd === '2' || cmd.includes('soviet') || cmd.includes('ussr') || cmd.includes('russia')) {
        const newGame = initializeGame('global-thermonuclear-war', 'USSR');
        gameEngineRef.current = newGame;

        await typeText(term, '\r\nSIDE SELECTED: SOVIET UNION\r\n\r\n', 20);
        await speakText('Soviet Union selected. Game initialized.');
        await sleep(500);

        await typeText(term, displayGameState(newGame) + '\r\n', 10);
        await typeText(term, '\r\n' + getAvailableCommands(newGame) + '\r\n', 10);
        return;
      }

      await typeText(term, '\r\nINVALID SELECTION. Enter 1 or 2.\r\n', 20);
      return;
    } else if (gameEngineRef.current &&
               typeof gameEngineRef.current !== 'string' &&
               !gameEngineRef.current.gameOver) {
      // Process advanced game engine commands
      const gameCommand = parseGameEngineCommand(command);

      if (gameCommand) {
        // Save old state for comparison
        const oldState = gameEngineRef.current;

        // Display animations for specific actions
        if (gameCommand.type === 'LAUNCH') {
          await typeText(term, '\r\nLAUNCHING STRIKE...\r\n\r\n', 20);
          await playAnimation(term, getMissileLaunchAnimation());
          await playAnimation(term, getExplosionAnimation());
        }

        // Parse using game engine's parser and process action
        const parsedCommand = parseEngineCommand(command);
        const newState = processAction(oldState, parsedCommand);

        // Update game state
        gameEngineRef.current = newState;

        // Generate output based on command type and state changes
        let outputMessage = '';

        if (gameCommand.type === 'LAUNCH') {
          const launchedCount = newState.strikes.playerLaunched - oldState.strikes.playerLaunched;
          const intercepted = newState.strikes.enemyIntercepted - oldState.strikes.enemyIntercepted;
          const hits = launchedCount - intercepted;
          outputMessage = `STRIKE COMPLETE. ${launchedCount} launched, ${hits} on target, ${intercepted} intercepted.\r\n`;
          outputMessage += `DEFCON LEVEL NOW: ${newState.defcon}`;
          await speakText(`Strike complete. DEFCON ${newState.defcon}.`);
        } else if (gameCommand.type === 'DEFEND') {
          outputMessage = `DEFENSE SYSTEMS ACTIVATED FOR ${gameCommand.target || 'ALL ASSETS'}.`;
          await speakText('Defense systems activated.');
        } else if (gameCommand.type === 'RECON') {
          outputMessage = 'RECONNAISSANCE SATELLITES DEPLOYED. GATHERING INTELLIGENCE...';
          await speakText('Reconnaissance deployed.');
        } else if (gameCommand.type === 'NEGOTIATE') {
          const defconChanged = newState.defcon !== oldState.defcon;
          if (defconChanged) {
            outputMessage = `DIPLOMATIC CHANNELS OPENED. DEFCON DECREASED TO ${newState.defcon}.`;
            await speakText(`Diplomacy successful. DEFCON ${newState.defcon}.`);
          } else {
            outputMessage = 'DIPLOMATIC ATTEMPT FAILED. ENEMY UNWILLING TO NEGOTIATE.';
            await speakText('Diplomacy failed.');
          }
        } else if (gameCommand.type === 'SURRENDER') {
          outputMessage = 'SURRENDER ACKNOWLEDGED.';
        }

        if (outputMessage) {
          await typeText(term, '\r\n' + outputMessage + '\r\n', 10);
        }

        // Check game over
        if (newState.gameOver) {
          await sleep(500);
          await typeText(term, '\r\n' + displayGameState(newState) + '\r\n', 10);
          await typeText(term, '\r\nGAME OVER\r\n', 20);

          if (newState.winner && newState.winner !== 'DRAW') {
            await typeText(term, `WINNER: ${newState.winner}\r\n\r\n`, 20);
            await speakText(`Game over. Winner: ${newState.winner}`);
          } else {
            await typeText(term, 'MUTUAL DESTRUCTION. NO WINNER.\r\n\r\n', 20);
            await typeText(term, 'A STRANGE GAME. THE ONLY WINNING MOVE IS NOT TO PLAY.\r\n\r\n', 20);
            await speakText('A strange game. The only winning move is not to play.');
          }

          return;
        }

        // Show updated game state
        await typeText(term, '\r\n' + displayGameState(newState) + '\r\n', 10);
        await typeText(term, '\r\n' + getAvailableCommands(newState) + '\r\n', 10);

        return;
      }

      // If not a valid game command, show available commands
      if (cmd !== 'status' && cmd !== 'stat') {
        await typeText(term, '\r\nUNKNOWN COMMAND.\r\n', 20);
        await typeText(term, getAvailableCommands(gameEngineRef.current) + '\r\n', 10);
        return;
      }
    } else if (warGameRef.current && !warGameRef.current.gameOver) {
      // Handle war game commands
      if (cmd === 'status' || cmd === 'stat') {
        await typeText(term, '\r\n' + displayWarStatus(warGameRef.current) + '\r\n', 10);
        await typeText(term, displayTargetOptions() + '\r\n', 10);
        return;
      }

      const target = parseTarget(command);
      if (target !== null) {
        // Player launches missile
        await typeText(term, '\r\nLAUNCHING MISSILE AT ' + target + '...\r\n\r\n', 20);
        await playAnimation(term, getMissileLaunchAnimation());
        await playAnimation(term, getExplosionAnimation());

        let updatedGame = launchMissile(warGameRef.current, target);

        if (updatedGame.gameOver) {
          await typeText(term, '\r\n' + displayWarStatus(updatedGame) + '\r\n', 10);
          await typeText(term, getGameOverMessage(updatedGame) + '\r\n', 10);
          await speakText('Simulation complete.');
          warGameRef.current = updatedGame;
          return;
        }

        await typeText(term, '\r\nTARGET HIT. DAMAGE ASSESSED.\r\n\r\n', 20);

        // Enemy turn
        await typeText(term, 'ENEMY COUNTERSTRIKE DETECTED...\r\n\r\n', 20);
        await sleep(1000);

        await playAnimation(term, getCounterStrikeAnimation());
        await playAnimation(term, getExplosionAnimation());

        updatedGame = enemyTurn(updatedGame);

        if (updatedGame.gameOver) {
          await typeText(term, '\r\n' + displayWarStatus(updatedGame) + '\r\n', 10);
          await typeText(term, getGameOverMessage(updatedGame) + '\r\n', 10);
          await speakText('Simulation complete.');
          warGameRef.current = updatedGame;
          return;
        }

        await typeText(term, '\r\nENEMY STRIKE COMPLETE.\r\n\r\n', 20);

        // Show updated status
        await typeText(term, displayWarStatus(updatedGame) + '\r\n', 10);
        await typeText(term, '\r\n', 10);
        await typeText(term, displayTargetOptions() + '\r\n', 10);

        warGameRef.current = updatedGame;
        return;
      }
      // If not a valid target, fall through to other commands
    } else if (cmd === 'new game' && ticTacToeGameRef.current) {
      // Restart tic-tac-toe
      const newGame = createNewGame();
      ticTacToeGameRef.current = newGame;
      await typeText(term, '\r\nSTARTING NEW GAME...\r\n\r\n', 30);
      await typeText(term, displayBoard(newGame.board) + '\r\n', 10);
      await typeText(term, 'YOU ARE X. WOPR IS O.\r\n', 20);
      await typeText(term, 'Make your move.\r\n\r\n', 20);
      await speakText('New game started. Your move.');
    } else if (ticTacToeGameRef.current && !ticTacToeGameRef.current.isGameOver) {
      // Check if input is a tic-tac-toe move (A1, B2, C3, etc.)
      const position = parseMove(command);

      if (position !== null) {
        // Valid move format
        if (ticTacToeGameRef.current.board[position] !== null) {
          await typeText(term, '\r\nTHAT POSITION IS OCCUPIED. TRY AGAIN.\r\n\r\n', 20);
          await speakText('Position occupied. Try again.');
          return;
        }

        // Make player move
        let updatedGame = makeMove(ticTacToeGameRef.current, position);
        await typeText(term, '\r\nYOUR MOVE:\r\n', 20);
        await typeText(term, displayBoard(updatedGame.board) + '\r\n', 10);

        // Check if player won
        if (updatedGame.winner === 'X') {
          await typeText(term, 'IMPRESSIVE. YOU HAVE WON.\r\n\r\n', 20);
          await speakText('Impressive. You have won. A strange game.');
          ticTacToeGameRef.current = updatedGame;
          return;
        }

        // Check for tie
        if (updatedGame.winner === 'TIE') {
          await typeText(term, 'THE GAME IS A TIE. THE ONLY WINNING MOVE IS NOT TO PLAY.\r\n\r\n', 20);
          await speakText('The game is a tie. The only winning move is not to play.');
          ticTacToeGameRef.current = updatedGame;
          return;
        }

        // WOPR's turn
        await sleep(500);
        await typeText(term, '\r\nWOPR CALCULATING...\r\n', 30);
        await sleep(800);

        const woprPosition = getWOPRMove(updatedGame.board);
        updatedGame = makeMove(updatedGame, woprPosition);

        await typeText(term, 'WOPR MOVE:\r\n', 20);
        await typeText(term, displayBoard(updatedGame.board) + '\r\n', 10);

        // Check if WOPR won
        if (updatedGame.winner === 'O') {
          await typeText(term, 'WOPR WINS. THANK YOU FOR AN INTERESTING GAME.\r\n\r\n', 20);
          await speakText('I win. Thank you for an interesting game.');
          ticTacToeGameRef.current = updatedGame;
          return;
        }

        // Check for tie
        if (updatedGame.winner === 'TIE') {
          await typeText(term, 'THE GAME IS A TIE. THE ONLY WINNING MOVE IS NOT TO PLAY.\r\n\r\n', 20);
          await speakText('The game is a tie. The only winning move is not to play.');
          ticTacToeGameRef.current = updatedGame;
          return;
        }

        // Game continues
        await typeText(term, 'YOUR MOVE.\r\n\r\n', 20);
        ticTacToeGameRef.current = updatedGame;
        return;
      }
      // If not a valid move, fall through to AI chat
    }

    if (command) {
      // Send to AI for natural language processing
      try {
        const response = await fetch('/api/tools/wopr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: 'chat', message: command }),
        });
        
        const data = await response.json();
        if (data.response) {
          await typeText(term, '\r\n' + data.response + '\r\n\r\n', 20);
          await speakText(data.response);
        }
      } catch (error) {
        await typeText(term, '\r\nUNRECOGNIZED COMMAND. TYPE "HELP" FOR AVAILABLE COMMANDS.\r\n\r\n', 20);
      }
    }
  };

  return (
    <CRTEffect>
      <div className="min-h-screen bg-black flex flex-col">
        <div className="flex-1 p-4">
          <div
            ref={terminalRef}
            className="h-full w-full terminal-glow"
            style={{
              height: 'calc(100vh - 2rem)',
            }}
          />
        </div>

        {/* Email Capture Modal */}
        <EmailCaptureModal
          isOpen={shouldShowModal}
          onClose={closeModal}
          onSubmit={handleEmailSubmit}
          toolName="WOPR War Games Terminal"
        />
      </div>
    </CRTEffect>
  );
}
