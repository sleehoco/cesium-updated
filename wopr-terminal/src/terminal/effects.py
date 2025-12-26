"""CRT effects and terminal animations"""
import time
import random
from typing import List

class CRTEffects:
    """Simulates CRT monitor effects"""
    
    @staticmethod
    def flicker(duration: float = 0.1):
        """Simulate screen flicker"""
        print('\033[?25l', end='')  # Hide cursor
        time.sleep(duration)
        print('\033[?25h', end='')  # Show cursor
    
    @staticmethod
    def scan_line_effect(text: str) -> str:
        """Add scan line effect to text (simulated)"""
        # In a real implementation, this would overlay horizontal lines
        return text
    
    @staticmethod
    def glitch_text(text: str, intensity: float = 0.1) -> str:
        """Add random character glitches"""
        chars = list(text)
        glitch_chars = ['█', '▓', '▒', '░', '■', '□']
        
        for i in range(len(chars)):
            if random.random() < intensity:
                chars[i] = random.choice(glitch_chars)
        
        return ''.join(chars)
