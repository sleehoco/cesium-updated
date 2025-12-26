"""Configuration management for WOPR Terminal"""
import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

class Config(BaseModel):
    # API Keys
    anthropic_api_key: str = os.getenv('ANTHROPIC_API_KEY', '')
    elevenlabs_api_key: str = os.getenv('ELEVENLABS_API_KEY', '')
    openai_api_key: str = os.getenv('OPENAI_API_KEY', '')
    
    # Voice Settings
    voice_enabled: bool = os.getenv('WOPR_VOICE_ENABLED', 'true').lower() == 'true'
    voice_id: str = os.getenv('WOPR_VOICE_ID', 'adam')
    voice_stability: float = float(os.getenv('VOICE_STABILITY', '0.8'))
    voice_similarity: float = float(os.getenv('VOICE_SIMILARITY', '0.5'))
    
    # Terminal Settings
    terminal_color: str = '#33ff33'
    background_color: str = '#000000'
    typing_speed: float = 0.03  # seconds per character
    
    # Game Settings
    debug_mode: bool = os.getenv('DEBUG_MODE', 'false').lower() == 'true'
    skip_animations: bool = os.getenv('SKIP_ANIMATIONS', 'false').lower() == 'true'

config = Config()
