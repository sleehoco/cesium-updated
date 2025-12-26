"""Game state management"""
from enum import Enum
from typing import Optional, Dict
from pydantic import BaseModel

class DefconLevel(Enum):
    """DEFCON alert levels"""
    FIVE = 5   # Peace
    FOUR = 4   # Increased intelligence
    THREE = 3  # Increase in force readiness
    TWO = 2    # Further increase readiness
    ONE = 1    # Maximum readiness / Nuclear war imminent

class Side(Enum):
    """Player sides"""
    USA = "United States"
    USSR = "Soviet Union"
    NATO = "NATO"
    WARSAW_PACT = "Warsaw Pact"

class GameState(BaseModel):
    """Current game state"""
    scenario: str = ""
    player_side: Optional[str] = None
    ai_side: Optional[str] = None
    defcon_level: int = 5
    turn_number: int = 0
    casualties: int = 0
    missiles_launched: int = 0
    cities_destroyed: int = 0
    game_active: bool = False
    winner: Optional[str] = None
    
    def escalate_defcon(self):
        """Increase alert level"""
        if self.defcon_level > 1:
            self.defcon_level -= 1
    
    def de_escalate_defcon(self):
        """Decrease alert level"""
        if self.defcon_level < 5:
            self.defcon_level += 1
    
    def add_casualties(self, count: int):
        """Add to casualty count"""
        self.casualties += count
    
    def launch_missile(self):
        """Record missile launch"""
        self.missiles_launched += 1
        self.escalate_defcon()
    
    def destroy_city(self, population: int = 1000000):
        """Record city destruction"""
        self.cities_destroyed += 1
        self.add_casualties(population)
    
    def next_turn(self):
        """Advance to next turn"""
        self.turn_number += 1
    
    def end_game(self, winner: Optional[str] = None):
        """End the current game"""
        self.game_active = False
        self.winner = winner
    
    def reset(self):
        """Reset game state"""
        self.scenario = ""
        self.player_side = None
        self.ai_side = None
        self.defcon_level = 5
        self.turn_number = 0
        self.casualties = 0
        self.missiles_launched = 0
        self.cities_destroyed = 0
        self.game_active = False
        self.winner = None
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for AI context"""
        return {
            "scenario": self.scenario,
            "player_side": self.player_side,
            "defcon": self.defcon_level,
            "turn": self.turn_number,
            "casualties": self.casualties,
            "missiles_launched": self.missiles_launched,
            "cities_destroyed": self.cities_destroyed
        }
