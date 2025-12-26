'use client';

import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

const WOPR_LOGO = `
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                          ║
║   ██╗    ██╗ ██████╗ ██████╗ ██████╗                                    ║
║   ██║    ██║██╔═══██╗██╔══██╗██╔══██╗                                   ║
║   ██║ █╗ ██║██║   ██║██████╔╝██████╔╝                                   ║
║   ██║███╗██║██║   ██║██╔═══╝ ██╔══██╗                                   ║
║   ╚███╔███╔╝╚██████╔╝██║     ██║  ██║                                   ║
║    ╚══╝╚══╝  ╚═════╝ ╚═╝     ╚═╝  ╚═╝                                   ║
║                                                                          ║
║            WAR OPERATION PLAN RESPONSE                                  ║
║            STRATEGIC DEFENSE COMPUTER                                   ║
║            NORAD - NORTH AMERICAN AEROSPACE DEFENSE COMMAND             ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
`;

export default function WOPRPage() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const inputBuffer = useRef('');

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    // Initialize terminal
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 16,
      fontFamily: 'Courier New, monospace',
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
      await typeText(term, msg + '\r\n', 30);
      await sleep(200);
    }

    term.write('\r\n');
    await typeText(term, WOPR_LOGO, 1);
    term.write('\r\n\r\n');
    await typeText(term, 'GREETINGS, PROFESSOR FALKEN.\r\n\r\n', 50);
    await typeText(term, 'SHALL WE PLAY A GAME?\r\n\r\n', 50);
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

  const handleInput = async (term: Terminal, data: string) => {
    const code = data.charCodeAt(0);

    // Handle Enter
    if (code === 13) {
      const command = inputBuffer.current.trim();
      term.write('\r\n');
      
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
      }
      return;
    }

    // Handle Ctrl+C
    if (code === 3) {
      term.write('^C\r\n> ');
      inputBuffer.current = '';
      return;
    }

    // Regular character
    if (code >= 32 && code <= 126 && data) {
      inputBuffer.current += data;
      term.write(data);
    }
  };

  const processCommand = async (term: Terminal, command: string) => {
    const cmd = command.toLowerCase();

    if (cmd === 'help') {
      await typeText(term, '\r\nAVAILABLE COMMANDS:\r\n\r\n', 20);
      await typeText(term, '  HELP              - Display available commands\r\n', 10);
      await typeText(term, '  LIST GAMES        - Show available war scenarios\r\n', 10);
      await typeText(term, '  PLAY [NUMBER]     - Start a war game scenario\r\n', 10);
      await typeText(term, '  STATUS            - Show current game status\r\n', 10);
      await typeText(term, '  DEFCON            - Show current DEFCON level\r\n', 10);
      await typeText(term, '  QUIT/EXIT         - Exit WOPR system\r\n\r\n', 10);
    } else if (cmd === 'list games') {
      await typeText(term, '\r\nAVAILABLE WAR SIMULATIONS:\r\n\r\n', 20);
      await typeText(term, '  1. GLOBAL THERMONUCLEAR WAR\r\n', 10);
      await typeText(term, '  2. THEATER WARFARE: EUROPE\r\n', 10);
      await typeText(term, '  3. PACIFIC THEATER\r\n', 10);
      await typeText(term, '  4. MIDDLE EAST CRISIS\r\n', 10);
      await typeText(term, '  5. CYBER WARFARE\r\n', 10);
      await typeText(term, '  6. TIC-TAC-TOE\r\n', 10);
      await typeText(term, '  7. CHESS\r\n\r\n', 10);
    } else if (cmd.startsWith('play')) {
      const scenarioNum = cmd.split(' ')[1];
      if (scenarioNum) {
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
            if (data.response) {
            await typeText(term, data.response + '\r\n\r\n', 20);
          }
          }
        } catch (error) {
          await typeText(term, 'ERROR: Unable to contact WOPR mainframe.\r\n\r\n', 20);
        }
      } else {
        await typeText(term, '\r\nPLEASE SPECIFY SCENARIO NUMBER. USE: PLAY [1-7]\r\n\r\n', 20);
      }
    } else if (cmd === 'defcon') {
      await typeText(term, '\r\n    ╭─────────────────────────────────────────────────╮\r\n', 10);
      await typeText(term, '    │     DEFCON 5 - PEACE CONDITION                 │\r\n', 10);
      await typeText(term, '    │  [░░░░░]                                        │\r\n', 10);
      await typeText(term, '    ╰─────────────────────────────────────────────────╯\r\n\r\n', 10);
    } else if (cmd === 'quit' || cmd === 'exit') {
      await typeText(term, '\r\nGOODBYE, PROFESSOR FALKEN.\r\n\r\n', 50);
    } else if (command) {
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
        }
      } catch (error) {
        await typeText(term, '\r\nUNRECOGNIZED COMMAND. TYPE "HELP" FOR AVAILABLE COMMANDS.\r\n\r\n', 20);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 p-4">
        <div 
          ref={terminalRef} 
          className="h-full w-full"
          style={{ 
            height: 'calc(100vh - 2rem)',
          }}
        />
      </div>
    </div>
  );
}
