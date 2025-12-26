"""WOPR AI powered by LLM"""
import asyncio
from typing import Optional, Dict, List
from anthropic import Anthropic
from config import config
from .prompts import WOPR_SYSTEM_PROMPT, SCENARIO_PROMPTS, FAMOUS_LINES

class WOPR:
    """The WOPR AI personality"""
    
    def __init__(self):
        if not config.anthropic_api_key:
            raise ValueError("ANTHROPIC_API_KEY not configured")
        
        self.client = Anthropic(api_key=config.anthropic_api_key)
        self.conversation_history: List[Dict[str, str]] = []
        self.games_played = 0
        self.total_casualties = 0
        
    async def respond(
        self, 
        player_input: str, 
        game_state: Optional[Dict] = None
    ) -> str:
        """
        Generate WOPR's response to player input
        
        Args:
            player_input: The player's command or question
            game_state: Current game state context
            
        Returns:
            WOPR's response text
        """
        # Build context from game state
        context = ""
        if game_state:
            context = f"""
CURRENT GAME STATE:
- Scenario: {game_state.get('scenario', 'N/A')}
- DEFCON: {game_state.get('defcon', 5)}
- Turn: {game_state.get('turn', 0)}
- Player Side: {game_state.get('player_side', 'N/A')}
- Casualties: {game_state.get('casualties', 0):,}
"""
        
        # Add to conversation history
        self.conversation_history.append({
            "role": "user",
            "content": f"{context}\n\nPLAYER: {player_input}"
        })
        
        # Call Claude API
        try:
            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=500,
                system=WOPR_SYSTEM_PROMPT,
                messages=self.conversation_history[-10:]  # Keep last 10 messages
            )
            
            wopr_response = response.content[0].text
            
            # Add response to history
            self.conversation_history.append({
                "role": "assistant",
                "content": wopr_response
            })
            
            return wopr_response
            
        except Exception as e:
            return f"[SYSTEM ERROR: {str(e)}]"
    
    def get_greeting(self) -> str:
        """Return WOPR's iconic greeting"""
        if self.games_played == 0:
            return FAMOUS_LINES[0] + "\n\n" + FAMOUS_LINES[1]
        elif self.games_played > 10 and self.total_casualties > 1000000000:
            return FAMOUS_LINES[4]  # "The only winning move..."
        else:
            return FAMOUS_LINES[1]  # "Shall we play a game?"
    
    def get_scenario_list(self) -> str:
        """Return formatted list of available scenarios"""
        scenarios = [
            "1. GLOBAL THERMONUCLEAR WAR",
            "2. THEATER WARFARE: EUROPE",
            "3. PACIFIC THEATER",
            "4. MIDDLE EAST CRISIS",
            "5. CYBER WARFARE",
            "6. TIC-TAC-TOE",
            "7. CHESS"
        ]
        return "\n".join(scenarios)
    
    def record_game_result(self, casualties: int):
        """Record game statistics"""
        self.games_played += 1
        self.total_casualties += casualties
