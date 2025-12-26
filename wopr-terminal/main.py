#!/usr/bin/env python3
"""
WOPR Terminal Wargame
Main entry point

Inspired by the 1983 film "WarGames"
"""
import asyncio
import sys
from src.terminal.display import Display
from src.terminal.input import CommandParser
from src.ai.wopr import WOPR
from src.voice.elevenlabs import WOPRVoice
from src.game.state import GameState
from src.game.mechanics import GameMechanics

class WOPRTerminal:
    """Main game controller"""
    
    def __init__(self):
        self.display = Display()
        self.parser = CommandParser()
        self.wopr = WOPR()
        self.voice = WOPRVoice()
        self.state = GameState()
        self.mechanics = GameMechanics()
        self.running = True
        
    async def start(self):
        """Start the WOPR terminal"""
        # Boot sequence
        self.display.animate_boot_sequence()
        
        # Show logo
        self.display.print_ascii_file('wopr_logo.txt')
        self.display.print_line()
        
        # WOPR greeting
        greeting = self.wopr.get_greeting()
        self.display.type_text(greeting)
        await self.voice.speak(greeting)
        
        # Main game loop
        await self.main_loop()
    
    async def main_loop(self):
        """Main command loop"""
        while self.running:
            self.display.print_line()
            user_input = self.display.prompt()
            
            if not user_input.strip():
                continue
            
            command, args = self.parser.parse(user_input)
            await self.handle_command(command, args, user_input)
    
    async def handle_command(self, command: str, args: list, raw_input: str):
        """Process player command"""
        
        if command in ['quit', 'exit']:
            self.display.type_text("GOODBYE, PROFESSOR FALKEN.")
            await self.voice.speak("GOODBYE, PROFESSOR FALKEN.")
            self.running = False
            return
        
        elif command == 'help':
            self.display.print_line(self.parser.get_help_text())
            return
        
        elif command == 'list games':
            self.display.print_line("\nAVAILABLE WAR SIMULATIONS:")
            self.display.print_line(self.wopr.get_scenario_list())
            return
        
        elif command == 'play':
            if args and args[0].isdigit():
                await self.start_scenario(int(args[0]))
            else:
                self.display.type_text("WHICH SCENARIO? USE: PLAY [NUMBER]")
            return
        
        elif command == 'defcon':
            if self.state.game_active:
                self.display.print_defcon_level(self.state.defcon_level)
            else:
                self.display.type_text("NO ACTIVE SCENARIO.")
            return
        
        elif command == 'status':
            if self.state.game_active:
                await self.show_status()
            else:
                self.display.type_text("NO ACTIVE SCENARIO.")
            return
        
        elif command == 'launch':
            if self.state.game_active:
                await self.launch_strike(args)
            else:
                self.display.type_text("NO ACTIVE SCENARIO. START A GAME FIRST.")
            return
        
        elif command == 'voice':
            enabled = self.voice.toggle()
            status = "ENABLED" if enabled else "DISABLED"
            self.display.type_text(f"VOICE OUTPUT {status}.")
            return
        
        # Pass to AI for natural language processing
        response = await self.wopr.respond(
            raw_input,
            self.state.to_dict() if self.state.game_active else None
        )
        self.display.type_text(response)
        await self.voice.speak(response)
    
    async def start_scenario(self, scenario_num: int):
        """Start a war game scenario"""
        scenarios = {
            1: "GLOBAL THERMONUCLEAR WAR",
            2: "THEATER WARFARE: EUROPE",
            3: "PACIFIC THEATER",
            4: "MIDDLE EAST CRISIS",
            5: "CYBER WARFARE",
            6: "TIC-TAC-TOE",
            7: "CHESS"
        }
        
        scenario_name = scenarios.get(scenario_num)
        if not scenario_name:
            self.display.type_text("INVALID SCENARIO NUMBER.")
            return
        
        self.display.type_text(f"\nINITIALIZING: {scenario_name}\n")
        await self.voice.speak(f"Initializing {scenario_name}")
        
        # Choose side
        self.display.print_line("SELECT YOUR SIDE:")
        self.display.print_line("  1. UNITED STATES")
        self.display.print_line("  2. SOVIET UNION")
        self.display.print_line()
        
        side_choice = self.display.prompt("CHOOSE [1-2]: ")
        
        if side_choice == "1":
            self.state.player_side = "United States"
            self.state.ai_side = "Soviet Union"
        else:
            self.state.player_side = "Soviet Union"
            self.state.ai_side = "United States"
        
        self.state.scenario = scenario_name
        self.state.game_active = True
        self.state.defcon_level = 5
        
        self.display.type_text(f"\nYOU ARE: {self.state.player_side}")
        self.display.type_text(f"OPPONENT: {self.state.ai_side} (WOPR CONTROLLED)\n")
        
        # Show map
        self.display.print_ascii_file('world_map.txt')
        
        # Show DEFCON
        self.display.print_defcon_level(self.state.defcon_level)
        
        # Get AI briefing
        briefing = await self.wopr.respond(
            "Provide initial situation briefing",
            self.state.to_dict()
        )
        self.display.type_text(briefing)
        
        self.display.print_line("\nAWAITING ORDERS...")
    
    async def launch_strike(self, args: list):
        """Execute nuclear strike"""
        if not args:
            self.display.type_text("SPECIFY TARGET. USE: LAUNCH [CITY]")
            return
        
        target = ' '.join(args)
        
        if not self.parser.validate_target(target):
            self.display.type_text(f"INVALID TARGET: {target}")
            return
        
        # Confirmation
        self.display.print_line(f"\n⚠️  CONFIRM NUCLEAR STRIKE ON {target.upper()}? (Y/N)", bold=True)
        confirm = self.display.prompt()
        
        if confirm.lower() != 'y':
            self.display.type_text("STRIKE ABORTED.")
            return
        
        # Launch animation
        self.display.animate_missile_launch(self.state.player_side, target)
        await self.voice.speak(f"Missile launch detected. Target: {target}")
        
        # Calculate casualties
        casualties = self.mechanics.calculate_strike_casualties(target)
        self.state.launch_missile()
        self.state.destroy_city(casualties)
        
        self.display.type_text(f"\nESTIMATED CASUALTIES: {casualties:,}")
        
        # DEFCON escalation
        self.display.print_defcon_level(self.state.defcon_level)
        
        # AI retaliation
        will_retaliate, retaliation_target = self.mechanics.determine_retaliation(self.state)
        
        if will_retaliate and retaliation_target:
            self.display.type_text(f"\n{self.state.ai_side} LAUNCHING COUNTER-STRIKE!")
            await self.voice.speak("Incoming missiles detected!")
            
            self.display.animate_missile_launch(self.state.ai_side, retaliation_target)
            
            retaliation_casualties = self.mechanics.calculate_strike_casualties(retaliation_target)
            self.state.add_casualties(retaliation_casualties)
            self.state.escalate_defcon()
            
            self.display.type_text(f"\n{retaliation_target.upper()} DESTROYED.")
            self.display.type_text(f"ESTIMATED CASUALTIES: {retaliation_casualties:,}")
        
        # Check victory condition
        outcome = self.mechanics.check_victory_condition(self.state)
        if outcome:
            await self.end_game(outcome)
        
        # AI commentary
        response = await self.wopr.respond(
            f"Analyze the situation after strikes on {target} and {retaliation_target if will_retaliate else 'no retaliation'}",
            self.state.to_dict()
        )
        self.display.type_text(f"\n{response}")
    
    async def show_status(self):
        """Display current game status"""
        self.display.print_line("\n═══ CURRENT STATUS ═══")
        self.display.print_line(f"Scenario: {self.state.scenario}")
        self.display.print_line(f"Turn: {self.state.turn_number}")
        self.display.print_line(f"Player: {self.state.player_side}")
        self.display.print_line(f"Opponent: {self.state.ai_side}")
        self.display.print_line(f"DEFCON: {self.state.defcon_level}")
        self.display.print_line(f"Missiles Launched: {self.state.missiles_launched}")
        self.display.print_line(f"Cities Destroyed: {self.state.cities_destroyed}")
        self.display.print_line(f"Total Casualties: {self.state.casualties:,}")
        self.display.print_line("═════════════════════\n")
    
    async def end_game(self, outcome: str):
        """End the current game"""
        self.display.print_line("\n" + "═" * 60)
        self.display.type_text(outcome, speed=0.05)
        await self.voice.speak(outcome)
        self.display.print_line("═" * 60 + "\n")
        
        self.display.type_text(f"TOTAL CASUALTIES: {self.state.casualties:,}")
        
        # Record stats
        self.wopr.record_game_result(self.state.casualties)
        
        # WOPR's reflection
        if self.wopr.total_casualties > 1000000000:
            reflection = "CURIOUS. AFTER ANALYZING ALL POSSIBLE OUTCOMES, I HAVE DETERMINED: THE ONLY WINNING MOVE IS NOT TO PLAY."
            self.display.type_text(f"\n{reflection}")
            await self.voice.speak(reflection)
        
        # Reset game
        self.state.reset()

def main():
    """Entry point"""
    print("Starting WOPR Terminal...")
    print("Press Ctrl+C to exit\n")
    
    terminal = WOPRTerminal()
    
    try:
        asyncio.run(terminal.start())
    except KeyboardInterrupt:
        print("\n\nSYSTEM SHUTDOWN.")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n[CRITICAL ERROR: {str(e)}]")
        sys.exit(1)

if __name__ == "__main__":
    main()
