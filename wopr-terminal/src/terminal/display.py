"""Terminal display and ASCII rendering"""
import time
import sys
import os
from typing import List, Optional
from config import config

class Display:
    """Handles all terminal display operations"""
    
    def __init__(self):
        self.width = 80
        self.height = 24
        self.color_code = '\033[92m'  # Green
        self.reset_code = '\033[0m'
        self.bold_code = '\033[1m'
        
    def clear(self):
        """Clear the terminal screen"""
        os.system('clear' if os.name == 'posix' else 'cls')
    
    def type_text(self, text: str, speed: Optional[float] = None):
        """
        Print text with typing animation effect
        
        Args:
            text: The text to display
            speed: Typing speed (seconds per character)
        """
        if config.skip_animations:
            print(f"{self.color_code}{text}{self.reset_code}")
            return
            
        speed = speed or config.typing_speed
        for char in text:
            sys.stdout.write(f"{self.color_code}{char}{self.reset_code}")
            sys.stdout.flush()
            time.sleep(speed)
        print()  # Newline after typing
    
    def print_line(self, text: str = "", bold: bool = False):
        """Print a line of text in terminal color"""
        style = self.bold_code if bold else ""
        print(f"{self.color_code}{style}{text}{self.reset_code}")
    
    def print_ascii_file(self, filename: str, typing: bool = False):
        """Load and display ASCII art from file"""
        filepath = os.path.join('src', 'assets', 'ascii', filename)
        try:
            with open(filepath, 'r') as f:
                content = f.read()
                if typing:
                    self.type_text(content, speed=0.001)
                else:
                    self.print_line(content)
        except FileNotFoundError:
            self.print_line(f"[ERROR: ASCII file not found: {filename}]")
    
    def print_box(self, text: str, width: int = 76):
        """Print text in a box"""
        lines = text.split('\n')
        self.print_line("╔" + "═" * width + "╗")
        for line in lines:
            padding = width - len(line)
            self.print_line(f"║ {line}{' ' * padding}║")
        self.print_line("╚" + "═" * width + "╝")
    
    def print_defcon_level(self, level: int):
        """Display current DEFCON level with visual indicator"""
        levels = {
            5: ("DEFCON 5 - PEACE CONDITION", "░░░░░"),
            4: ("DEFCON 4 - INCREASED INTELLIGENCE", "▒▒▒▒░"),
            3: ("DEFCON 3 - INCREASE IN FORCE READINESS", "▓▓▓▒░"),
            2: ("DEFCON 2 - FURTHER INCREASE IN FORCE READINESS", "████▒"),
            1: ("DEFCON 1 - MAXIMUM READINESS", "█████")
        }
        
        text, bar = levels.get(level, ("UNKNOWN", "?????"))
        
        self.print_line()
        self.print_line("    ╭─────────────────────────────────────────────────╮")
        if level == 1:
            self.print_line(f"    │  ⚠️  {text}  ⚠️  │", bold=True)
        else:
            self.print_line(f"    │     {text:<40} │")
        self.print_line(f"    │  [{bar}]                                     │")
        self.print_line("    ╰─────────────────────────────────────────────────╯")
        self.print_line()
    
    def animate_boot_sequence(self):
        """Display WOPR boot sequence"""
        self.clear()
        
        boot_messages = [
            "INITIALIZING WOPR SYSTEM...",
            "LOADING STRATEGIC DEFENSE PROTOCOLS...",
            "CONNECTING TO NORAD MAINFRAME...",
            "ESTABLISHING SECURE COMMUNICATION LINK...",
            "LOADING NUCLEAR RESPONSE SCENARIOS...",
            "INITIALIZING WAR SIMULATION ALGORITHMS...",
            "SYSTEM READY."
        ]
        
        for msg in boot_messages:
            self.type_text(msg, speed=0.02)
            time.sleep(0.3)
        
        time.sleep(0.5)
        self.clear()
        
    def animate_missile_launch(self, source: str, target: str):
        """ASCII animation of missile launch"""
        frames = [
            """
                     *
                    /|\\
                   / | \\
                     |
                     |
            """,
            """
                         *
                        /|\\
                       / | \\
                         |
                         ↓
            """,
            """
                             *
                            /|\\
                           / | \\
                             ↓
                             ↓
            """,
            """
                                 💥
                                /|\\
                               / | \\
                                 ↓
            """
        ]
        
        self.print_line(f"\nLAUNCHING STRIKE: {source} → {target}\n", bold=True)
        
        if not config.skip_animations:
            for frame in frames:
                self.clear()
                self.print_line(frame)
                time.sleep(0.5)
        
        self.print_line("\n⚠️  IMPACT DETECTED  ⚠️\n", bold=True)
    
    def prompt(self, text: str = "") -> str:
        """Display prompt and get user input"""
        prompt_text = f"{self.color_code}> {text}{self.reset_code}"
        return input(prompt_text)
