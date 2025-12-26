"""Command input and parsing"""
from typing import Dict, List, Optional, Tuple

class CommandParser:
    """Parses and validates player commands"""
    
    def __init__(self):
        self.commands = {
            'help': 'Display available commands',
            'list games': 'Show available war scenarios',
            'play': 'Start a war game scenario',
            'status': 'Show current game status',
            'defcon': 'Show current DEFCON level',
            'launch': 'Launch military strike',
            'defend': 'Deploy defensive measures',
            'intel': 'Request intelligence briefing',
            'quit': 'Exit WOPR system',
            'exit': 'Exit WOPR system',
        }
    
    def parse(self, user_input: str) -> Tuple[str, List[str]]:
        """
        Parse user input into command and arguments
        
        Returns:
            (command, arguments)
        """
        parts = user_input.strip().lower().split()
        if not parts:
            return ('', [])
        
        # Handle multi-word commands
        if len(parts) >= 2:
            two_word = f"{parts[0]} {parts[1]}"
            if two_word in self.commands:
                return (two_word, parts[2:])
        
        command = parts[0]
        args = parts[1:]
        
        return (command, args)
    
    def get_help_text(self) -> str:
        """Generate help text for all commands"""
        lines = ["AVAILABLE COMMANDS:", ""]
        for cmd, desc in self.commands.items():
            lines.append(f"  {cmd.upper():<20} - {desc}")
        return '\n'.join(lines)
    
    def validate_target(self, target: str) -> bool:
        """Validate if target is a valid strategic location"""
        valid_targets = [
            'moscow', 'kiev', 'leningrad', 'washington', 'nyc', 
            'los angeles', 'chicago', 'london', 'paris', 'beijing'
        ]
        return target.lower() in valid_targets
