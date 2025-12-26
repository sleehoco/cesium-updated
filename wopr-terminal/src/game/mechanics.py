"""Core game mechanics and rules"""
import random
from typing import Tuple, Optional
from .state import GameState

class GameMechanics:
    """Handles game rules and combat resolution"""
    
    CITY_POPULATIONS = {
        'moscow': 8500000,
        'washington': 700000,
        'new york': 8300000,
        'los angeles': 4000000,
        'leningrad': 5000000,
        'kiev': 2900000,
        'london': 8900000,
        'paris': 2200000,
        'chicago': 2700000,
        'beijing': 21500000
    }
    
    @staticmethod
    def calculate_strike_casualties(target: str) -> int:
        """Calculate casualties from a nuclear strike"""
        base_population = GameMechanics.CITY_POPULATIONS.get(
            target.lower(), 
            1000000
        )
        # 40-80% casualties from nuclear strike
        casualty_rate = random.uniform(0.4, 0.8)
        return int(base_population * casualty_rate)
    
    @staticmethod
    def determine_retaliation(
        state: GameState
    ) -> Tuple[bool, Optional[str]]:
        """
        Determine if AI retaliates and what target
        
        Returns:
            (will_retaliate, target)
        """
        # Higher DEFCON = more likely to retaliate
        retaliation_chance = {
            5: 0.2,
            4: 0.4,
            3: 0.6,
            2: 0.9,
            1: 1.0
        }
        
        if random.random() < retaliation_chance[state.defcon_level]:
            # Pick a target
            if state.player_side == "United States":
                targets = ['washington', 'new york', 'los angeles', 'chicago']
            else:
                targets = ['moscow', 'leningrad', 'kiev']
            
            return (True, random.choice(targets))
        
        return (False, None)
    
    @staticmethod
    def check_victory_condition(state: GameState) -> Optional[str]:
        """
        Check if game has ended
        
        Returns:
            Winner or None if game continues
        """
        # Mutual Assured Destruction
        if state.missiles_launched > 10:
            return "MUTUAL ASSURED DESTRUCTION - NO WINNER"
        
        # Surrender threshold
        if state.casualties > 100000000:  # 100 million
            return "PYRRHIC VICTORY - CIVILIZATION DESTROYED"
        
        return None
    
    @staticmethod
    def calculate_scenario_outcome(
        state: GameState,
        player_action: str
    ) -> str:
        """Generate outcome description for player action"""
        outcomes = {
            'launch': [
                "MISSILE LAUNCH DETECTED. TRAJECTORY CONFIRMED.",
                "STRATEGIC FORCES ENGAGING TARGET.",
                "ICBM SYSTEMS ACTIVATED. TIME TO IMPACT: 18 MINUTES.",
            ],
            'defend': [
                "DEFENSIVE SYSTEMS ACTIVATED.",
                "EARLY WARNING RADAR AT MAXIMUM SENSITIVITY.",
                "INTERCEPTOR MISSILES ON STANDBY.",
            ],
            'intel': [
                "ANALYZING ENEMY FORCE POSITIONS...",
                "SATELLITE RECONNAISSANCE IN PROGRESS...",
                "INTELLIGENCE BRIEFING PREPARED.",
            ]
        }
        
        return random.choice(outcomes.get(player_action, ["COMMAND ACKNOWLEDGED."]))
