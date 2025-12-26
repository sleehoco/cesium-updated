"""ElevenLabs voice synthesis for WOPR"""
import asyncio
from typing import Optional
from elevenlabs import generate, play, set_api_key, Voice, VoiceSettings
from config import config

class WOPRVoice:
    """Handles text-to-speech for WOPR"""
    
    def __init__(self):
        if not config.elevenlabs_api_key:
            print("[WARNING: ElevenLabs API key not configured. Voice disabled.]")
            self.enabled = False
            return
        
        set_api_key(config.elevenlabs_api_key)
        self.enabled = config.voice_enabled
        self.voice_id = config.voice_id
        
        # Voice settings for robotic feel
        self.voice_settings = VoiceSettings(
            stability=config.voice_stability,
            similarity_boost=config.voice_similarity
        )
    
    async def speak(self, text: str):
        """
        Convert text to speech and play it
        
        Args:
            text: The text WOPR should speak
        """
        if not self.enabled:
            return
        
        try:
            audio = generate(
                text=text,
                voice=Voice(
                    voice_id=self.voice_id,
                    settings=self.voice_settings
                ),
                model="eleven_monolingual_v1"
            )
            
            # Play audio in separate thread to not block game
            await asyncio.to_thread(play, audio)
            
        except Exception as e:
            print(f"[VOICE ERROR: {str(e)}]")
    
    def toggle(self):
        """Toggle voice on/off"""
        self.enabled = not self.enabled
        return self.enabled
    
    async def speak_async(self, text: str):
        """Speak without blocking (fire and forget)"""
        if self.enabled:
            asyncio.create_task(self.speak(text))
