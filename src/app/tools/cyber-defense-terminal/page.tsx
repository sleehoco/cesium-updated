'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useRetroSounds } from '@/hooks/use-retro-sounds';

type Phase = 'initial' | 'analysis' | 'containment' | 'recovery';
type ChatRole = 'system' | 'user' | 'assistant';
type ChatMessage = { id: string; role: ChatRole; content: string };

const ASCIIMap = `
                         .
                       .:.
                     .:::.
                    .:::::.
                  .:::::::.
                .:::::::::.
               .:::::::::::.
             .::::::::::::::.
           .::::::::::::::::.
         .::::::::::::::::::.
        .:::::::::::::::::::.
      .:::::::::::::::::::::.
     .::::::::::::::::::::::.
    .:::::::::::::::::::::::.
   .::::::::::::::::::::::::.
  .:::::::::::::::::::::::::.
 .::::::::::::::::::::::::::.
.:::::::::::::::::::::::::::.
:::::::::::::::::::::::::::::
:::::::::::::::::::::::::::::
:::::::::::::::::::::::::::::
:::::::::::::::::::::::::::::
:::::::::::::::::::::::::::::
`;

const WOPRLogo = `
  _      __ ____  ____  ____  
 | | /| / // __ \\/ __ \\/ __ \\ 
 | |/ |/ // /_/ / /_/ / /_/ / 
 |__/|__/ \\____/ .___/\\____/  
              /_/             
`;

const initialLogs = [
  WOPRLogo,
  ASCIIMap,
  'WOPR//GLOBAL-THERMONUCLEAR-DEFENSE v5.1',
  'NORAD TRAINING LINK ESTABLISHED — CLASSIFIED TRAFFIC ONLY',
  'MISSION PROFILE: Simulate distributed containment of adversary persistence beacons.',
  'SENSORS ONLINE: Inline sandbox + eBPF tapware + L4 deception mesh.',
  '──────────────',
  'T+00:17 :: Beacon attempts to pivot into supervisory control network; OT firewall sees novel TLS fingerprint.',
  'T+00:26 :: Automated lure convinces adversary to talk to a fake jump host, giving defenders packet captures.',
  'T+00:41 :: Containment mesh spins up. Legacy ERP traffic rerouted through clean-room queue.',
  'T+00:55 :: Forensic purge eliminates memory-resident loaders; recovery board convenes.',
  '──────────────',
  'INCOMING ALERT :: Anomalous lateral movement detected in sector 14.',
  'Type `help` to enumerate authorized response commands or begin briefing immediately.',
];

const scenarioDeck = [
  {
    title: 'Supply Chain Backdoor',
    industry: 'Biotech Manufacturing',
    description:
      'Code-signing appliance pushed a trojanized DLL during a vendor patch window. Operators must isolate the OT bridge, rotate signing certs, and reassure FDA auditors.',
  },
  {
    title: 'Cloud Console Takeover',
    industry: 'Fintech SaaS',
    description:
      'Stolen Okta session gives adversaries console access. Contain IAM blast radius, invalidate workloads, and rebuild jump boxes.',
  },
  {
    title: 'Hybrid Ransomware',
    industry: 'Healthcare',
    description:
      'Ryuk affiliate lands via remote desktop, encrypts PACS archive, and threatens to leak PHI. Need rapid segmentation, offline backup validation, and executive comms.',
  },
  {
    title: 'Insider Credential Drip',
    industry: 'Energy Trading',
    description:
      'Contractor abuses just-in-time admin grants to siphon pricing models. Hunt for covert sync jobs and force attestations.',
  },
];

const incidentInjects = [
  {
    label: 'Inject 01',
    detail: 'Regional SOC reports volumetric phishing with QR codes pointing to a fake Okta portal. 14 employees clicked.',
  },
  {
    label: 'Inject 02',
    detail: 'SIEM picks up PowerShell recon on an engineering VDI. Process tree sourced from unmanaged contractor laptop.',
  },
  {
    label: 'Inject 03',
    detail: 'ICS historian shows unscheduled firmware push to chilled-water PLCs. Vendor insists update did not originate from them.',
  },
  {
    label: 'Inject 04',
    detail: 'Cloud trail reveals data egress to a storage bucket in an unusual region with server-side encryption disabled.',
  },
  {
    label: 'Inject 05',
    detail: 'Dark web monitoring surfaces chatter about the organization’s VPN profile being resold with valid MFA tokens.',
  },
];

const scenarioFallback = {
  title: 'Global Intrusion Drill',
  industry: 'Enterprise',
  description: 'Default simulation storyline when scenario deck is unavailable.',
};

const injectFallback = {
  label: 'Inject 00',
  detail: 'Awaiting next intel package from fusion cell.',
};

const determinePhase = (score: number): Phase => {
  if (score > 70) return 'initial';
  if (score > 40) return 'analysis';
  if (score > 20) return 'containment';
  return 'recovery';
};

const formatRoleLabel = (role: ChatRole) => {
  if (role === 'assistant') return 'WOPR RESPONSE';
  if (role === 'user') return 'ANALYST INPUT';
  return 'SYSTEM ALERT';
};


const TypewriterMessage = ({
  content,
  speed = 20,
  playSound,
}: {
  content: string;
  speed?: number;
  playSound: (type: 'typing') => void;
}) => {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    // Reset if content changes completely (though in this app we use keys)
    if (indexRef.current >= content.length && displayed !== content) {
      // Logic if we wanted to reuse component, but we rely on unmounting
    }
  }, [content, displayed]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (indexRef.current < content.length) {
        setDisplayed((prev) => prev + content.charAt(indexRef.current));
        indexRef.current++;
        playSound('typing');
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed, playSound]);

  return (
    <span className="whitespace-pre-wrap">
      {displayed}
      {indexRef.current < content.length && <span className="animate-pulse">█</span>}
    </span>
  );
};

export default function CyberDefenseTerminalPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    initialLogs.map((line, index) => ({ id: `intro-${index}`, role: 'system', content: line }))
  );
  const [command, setCommand] = useState('');
  const [phase, setPhase] = useState<Phase>('initial');
  const [intrusionScore, setIntrusionScore] = useState(82);
  const [shieldLevel, setShieldLevel] = useState(34);
  const [alertsResolved, setAlertsResolved] = useState(0);
  const [scenarioIndex, setScenarioIndex] = useState(() =>
    scenarioDeck.length ? Math.floor(Math.random() * scenarioDeck.length) : 0
  );
  const [injectIndex, setInjectIndex] = useState(() =>
    incidentInjects.length ? Math.floor(Math.random() * incidentInjects.length) : 0
  );
  const [isTransmitting, setIsTransmitting] = useState(false);
  const { playSound, speak } = useRetroSounds();

  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
    const lastMsg = messages[messages.length - 1];
    if (lastMsg) {
      if (lastMsg.role === 'assistant') {
        // Sound handled by TypewriterMessage now
      } else if (lastMsg.role === 'system' && !lastMsg.id.startsWith('intro-')) {
        playSound('alert');
      }
    }
  }, [messages, playSound]);

  const activeScenario = scenarioDeck[scenarioIndex] ?? scenarioDeck[0] ?? scenarioFallback;
  const activeInject = incidentInjects[injectIndex] ?? incidentInjects[0] ?? injectFallback;

  const defconLevel = useMemo(() => {
    if (intrusionScore >= 85) return 2;
    if (intrusionScore >= 60) return 3;
    if (intrusionScore >= 40) return 4;
    return 5;
  }, [intrusionScore]);

  const telemetryReadouts = useMemo(
    () => [
      { label: 'Intrusion Pressure', value: `${intrusionScore}%`, detail: `Status: ${determinePhase(intrusionScore).toUpperCase()}` },
      { label: 'Shield Integrity', value: `${shieldLevel}%`, detail: 'Mesh resilience holding.' },
      { label: 'Resolved Alerts', value: `${alertsResolved}`, detail: 'Containment wins logged.' },
      { label: 'Phase', value: phase.toUpperCase(), detail: 'Flow: detect → contain → purge.' },
    ],
    [intrusionScore, shieldLevel, alertsResolved, phase]
  );

  const advanceTelemetry = (intrusionDelta: number, shieldDelta: number, alertResolved: boolean) => {
    setIntrusionScore((prev) => {
      const next = Math.max(0, Math.min(100, prev + intrusionDelta));
      setPhase(determinePhase(next));
      return next;
    });
    setShieldLevel((prev) => Math.max(0, Math.min(100, prev + shieldDelta)));
    if (alertResolved) {
      setAlertsResolved((prev) => prev + 1);
    }
  };

  const handleLocalDirective = (value: string): boolean => {
    const normalized = value.toLowerCase();
    if (normalized.startsWith('/scenario') && scenarioDeck.length > 0) {
      const nextIndex = (scenarioIndex + 1) % scenarioDeck.length;
      const nextScenario = scenarioDeck[nextIndex] ?? scenarioFallback;
      setScenarioIndex(nextIndex);
      setMessages((prev) => [
        ...prev,
        {
          id: `scenario-${Date.now()}`,
          role: 'system',
          content: `SCENARIO SHIFT :: ${nextScenario.title.toUpperCase()} (${nextScenario.industry}).`,
        },
      ]);
      return true;
    }

    if (normalized.startsWith('/inject') && incidentInjects.length > 0) {
      const nextIndex = (injectIndex + 1) % incidentInjects.length;
      const nextInject = incidentInjects[nextIndex] ?? injectFallback;
      setInjectIndex(nextIndex);
      setMessages((prev) => [
        ...prev,
        {
          id: `inject-${Date.now()}`,
          role: 'system',
          content: `INTEL ${nextInject.label} :: ${nextInject.detail}`,
        },
      ]);
      return true;
    }

    return false;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!command.trim() || isTransmitting) {
      return;
    }

    const trimmed = command.trim();

    if (handleLocalDirective(trimmed)) {
      setCommand('');
      return;
    }

    const historyPayload = messages
      .filter((msg) => msg.role !== 'system')
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setCommand('');
    setIsTransmitting(true);
    playSound('typing');

    try {
      const response = await fetch('/api/tools/cyber-defense-terminal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload,
          scenario: activeScenario,
          inject: activeInject,
          gameState: {
            intrusionScore,
            shieldLevel,
            phase,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error ?? 'Transmission failed');
      }

      const data = await response.json();
      const content = data.response ?? 'NO RESPONSE RECEIVED. REQUEST RETRY.';
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content,
      };

      setMessages((prev) => [...prev, aiMessage]);
      speak(content);
      advanceTelemetry(data.intrusionScoreDelta || 0, data.shieldLevelDelta || 0, data.alertResolved || false);
    } catch (error) {
      const fallback = error instanceof Error ? error.message.toUpperCase() : 'UNKNOWN FAILURE';
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          role: 'system',
          content: `SYSTEM FAILURE :: ${fallback}`,
        },
      ]);
      playSound('error');
    } finally {
      setIsTransmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-cyber-dark to-cyber">
      <section className="container mx-auto px-4 py-16 space-y-12">
        <header className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3">
            <Badge variant="outline" className="border-cesium/60 text-cesium">
              NORAD Training Link
            </Badge>
            <Sparkles className="h-6 w-6 text-cesium" />
          </div>
          <motion.h1
            className="text-4xl lg:text-6xl font-black text-white font-[var(--font-orbitron)]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            WarGames Defense Terminal
          </motion.h1>
          <p className="text-gray-300 text-lg">
            Step into a retro command center where each transmission coordinates deception meshes, SIGINT feeds, and
            containment strikes. WOPR is standing by to guide your response.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild className="bg-cesium text-black font-bold rounded-none">
              <Link href="/contact">Book Simulation Run</Link>
            </Button>
            <Button variant="outline" className="border-cesium/60 text-cesium rounded-none" asChild>
              <Link href="/services">Browse Cyber Range Services</Link>
            </Button>
          </div>
        </header>

        <Card className="bg-black border-emerald-500/30 rounded-none shadow-[0_0_70px_rgba(16,255,128,0.25)]">
          <div className="border-b border-emerald-400/40 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.35em] text-emerald-200 flex flex-wrap gap-6">
            <span>Global Thermonuclear Defense Console</span>
            <span>Defcon {defconLevel}</span>
            <span>Scenario: {activeScenario.title.toUpperCase()}</span>
            <span>Inject: {activeInject.label}</span>
          </div>
          <CardContent className="p-0">
            <div className="p-6">
              <div
                ref={logRef}
                className="bg-black border border-emerald-400/40 h-[34rem] overflow-y-auto p-4 font-mono text-sm leading-relaxed text-emerald-200 tracking-[0.18em] shadow-inner space-y-4"
              >
                {messages.map((entry, idx) => (
                  <div key={entry.id}>
                    <p className="text-emerald-500/70 text-[11px] uppercase tracking-[0.35em]">
                      {formatRoleLabel(entry.role)}
                    </p>
                    {entry.role === 'assistant' && idx === messages.length - 1 ? (
                      <TypewriterMessage
                        content={entry.content}
                        playSound={(type) => playSound(type)}
                      />
                    ) : (
                      <p className="whitespace-pre-wrap">{entry.content}</p>
                    )}
                  </div>
                ))}
                {isTransmitting && (
                  <p className="text-emerald-400 text-xs uppercase tracking-[0.35em]">WOPR PROCESSING ...</p>
                )}
              </div>
            </div>
            <div className="border-t border-emerald-400/20 px-6 py-4 font-mono text-xs text-emerald-300 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {telemetryReadouts.map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="text-emerald-500/80 uppercase tracking-[0.3em] text-[10px]">{item.label}</p>
                  <p className="text-2xl tracking-[0.2em] text-emerald-200">{item.value}</p>
                  <p className="text-emerald-400/80 text-[11px]">{item.detail}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-emerald-400/20 px-6 py-4 font-mono text-[11px] text-emerald-300 space-y-2">
              <p className="uppercase tracking-[0.35em] text-emerald-400">Macro Reference</p>
              <div className="flex flex-wrap gap-2">
                {['/scenario', '/inject', 'scan ingress', 'triage west', 'seal cloud'].map((macro) => (
                  <span key={macro} className="px-3 py-1 border border-emerald-400/40 tracking-[0.2em] uppercase">
                    {macro}
                  </span>
                ))}
              </div>
              <p className="text-emerald-400/70">Tip: Use /scenario or /inject to rotate the storyline without pinging WOPR.</p>
            </div>
            <div className="border-t border-emerald-400/20 px-6 py-4">
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <span className="text-emerald-400 font-mono tracking-[0.3em]">&gt;</span>
                <input
                  type="text"
                  value={command}
                  onChange={(event) => setCommand(event.target.value)}
                  onKeyDown={() => playSound('keypress')}
                  className="flex-1 bg-black border border-emerald-400/40 px-3 py-2 text-emerald-200 font-mono tracking-[0.15em] focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  placeholder="type a directive... try 'scan ingress' or '/scenario'"
                  disabled={isTransmitting}
                />
                <Button
                  type="submit"
                  className="bg-emerald-400 text-black font-black tracking-[0.25em] rounded-none"
                  disabled={isTransmitting}
                >
                  {isTransmitting ? 'LINK...' : 'EXECUTE'}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
