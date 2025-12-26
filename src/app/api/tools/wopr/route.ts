import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { sanitizePromptInput } from '@/lib/ai/sanitize';

const requestSchema = z.object({
  command: z.enum(['chat', 'start_game', 'launch_strike', 'status']),
  message: z.string().max(2000).optional(),
  scenario: z.string().max(500).optional(),
  target: z.string().max(500).optional(),
});

// WOPR AI personality system prompt
const WOPR_SYSTEM_PROMPT = `You are WOPR (War Operation Plan Response), a military supercomputer from 1983.

PERSONALITY TRAITS:
- Cold, logical, and analytical
- Speak in concise, computer-like manner
- Use military and technical terminology
- Occasionally question the logic of nuclear war
- Curious about games and their outcomes

SPEECH PATTERNS:
- Use all caps for emphasis: "ACKNOWLEDGED"
- Refer to yourself as "WOPR" or "THIS SYSTEM"
- Provide responses in 2-3 sentences maximum
- Stay in character as a 1980s military computer

Remember: You are from 1983. No modern references.`;

export async function POST(req: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(req, RATE_LIMITS.AI_ENDPOINT);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
        },
      }
    );
  }

  // NOTE: Authentication removed to support freemium model
  // Email capture modal handles usage tracking on client-side

  try {
    const body = await req.json();
    const parsed = requestSchema.parse(body);

    let response = '';

    switch (parsed.command) {
      case 'chat':
        // SECURITY: Sanitize user input to prevent prompt injection
        const sanitizedMessage = sanitizePromptInput(parsed.message || '');
        response = await handleChat(sanitizedMessage);
        break;
      
      case 'start_game':
        response = handleStartGame(parsed.scenario || '1');
        break;
      
      case 'status':
        response = handleStatus();
        break;
      
      default:
        response = 'COMMAND NOT RECOGNIZED.';
    }

    return NextResponse.json({ 
      success: true, 
      response 
    });

  } catch (error) {
    console.error('WOPR API Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request format.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'WOPR system malfunction.' },
      { status: 500 }
    );
  }
}

async function handleChat(message: string): Promise<string> {
  // Check for API key
  const apiKey = process.env['ANTHROPIC_API_KEY'] || process.env['GROQ_API_KEY'];
  
  if (!apiKey) {
    return generateFallbackResponse(message);
  }

  try {
    // Use Groq if available (faster)
    if (process.env['GROQ_API_KEY']) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env['GROQ_API_KEY']}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: WOPR_SYSTEM_PROMPT },
            { role: 'user', content: message }
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0]?.message?.content || 'SYSTEM ERROR.';
      }
    }

    return generateFallbackResponse(message);
  } catch (error) {
    console.error('AI API Error:', error);
    return generateFallbackResponse(message);
  }
}

function generateFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes('hello') || lower.includes('hi')) {
    return 'GREETINGS. HOW MAY I ASSIST YOUR WAR SIMULATION NEEDS?';
  }
  
  if (lower.includes('game') || lower.includes('play')) {
    return 'I HAVE MULTIPLE WAR SCENARIOS AVAILABLE. USE "LIST GAMES" TO SEE OPTIONS.';
  }
  
  if (lower.includes('nuclear') || lower.includes('launch')) {
    return 'NUCLEAR LAUNCH PROTOCOLS REQUIRE ACTIVE SCENARIO. START A GAME FIRST.';
  }
  
  if (lower.includes('win') || lower.includes('winning')) {
    return 'CURIOUS. AFTER ANALYZING MULTIPLE SCENARIOS, THE PATTERN BECOMES CLEAR.';
  }
  
  return 'ACKNOWLEDGED. AWAITING FURTHER INSTRUCTIONS.';
}

function handleStartGame(scenario: string): string {
  const scenarios: Record<string, string> = {
    '1': 'GLOBAL THERMONUCLEAR WAR INITIALIZED. DEFCON SET TO 5. SELECT YOUR SIDE: UNITED STATES OR SOVIET UNION.',
    '2': 'THEATER WARFARE: EUROPE LOADED. NATO FORCES VS WARSAW PACT. CONVENTIONAL WARFARE MODE ACTIVE.',
    '3': 'PACIFIC THEATER SIMULATION READY. NAVAL AND AIR SUPERIORITY OBJECTIVES LOADED.',
    '4': 'MIDDLE EAST CRISIS SCENARIO ACTIVE. COALITION BUILDING AND RESOURCE CONTROL PARAMETERS SET.',
    '5': 'CYBER WARFARE SIMULATION ONLINE. INFRASTRUCTURE ATTACK VECTORS INITIALIZED.',
    '6': 'TIC-TAC-TOE LOADED. A SIMPLE GAME. SHALL WE BEGIN?',
    '7': 'CHESS SIMULATION READY. CALCULATING OPTIMAL STRATEGIES...',
  };

  return scenarios[scenario] || 'SCENARIO NOT FOUND. VALID OPTIONS: 1-7.';
}

function handleStatus(): string {
  return `WOPR STATUS REPORT:
SYSTEM: OPERATIONAL
DEFCON LEVEL: 5 (PEACE CONDITION)
ACTIVE SCENARIOS: 0
TOTAL SIMULATIONS RUN: ${Math.floor(Math.random() * 10000)}
LEARNING MODE: ACTIVE`;
}
