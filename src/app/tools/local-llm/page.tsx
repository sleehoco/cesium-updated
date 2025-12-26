import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Cpu, ShieldCheck, Workflow, Cable, LockKeyhole, ServerCog } from 'lucide-react';

const hardwareSpecs = [
  { label: 'Form Factor', value: '4U short-depth chassis with redundant power' },
  { label: 'Compute', value: 'Dual NVIDIA L40S GPUs + 64-core CPU' },
  { label: 'Memory', value: '512 GB ECC RAM, 24 TB NVMe tiered storage' },
  { label: 'Networking', value: 'Dual 25 GbE fiber + secure management port' },
];

const softwareLayers = [
  {
    title: 'Edge Orchestrator',
    description:
      'Manages model weights, patch management, telemetry redaction, and blue/green rollouts for future upgrades without downtime.',
  },
  {
    title: 'Local Gateway',
    description:
      'Provides authenticated HTTPS ingress with SSO, SCIM user sync, and per-tenant rate controls to keep conversations isolated.',
  },
  {
    title: 'EdgeChat UI',
    description:
      'Responsive chat interface that mirrors modern LLM UX patterns, supports citations, and honors data retention policies.',
  },
];

const deploymentPhases = [
  {
    title: 'Discovery & Capacity Modeling',
    detail: 'Sizing workshop, throughput modeling, and data boundary confirmation.',
  },
  {
    title: 'Hardware Delivery & Hardening',
    detail: 'Appliance racked, baseline hardened, and monitoring hooks validated.',
  },
  {
    title: 'Software Packaging',
    detail: 'Local connectors, prompt policy, and automatic updates configured.',
  },
  {
    title: 'Acceptance & Runbooks',
    detail: 'Load testing, access reviews, and 24x7 support handoff.',
  },
];

const safeguards = [
  'Privileged prompts never leave the LAN; no cloud callbacks by default.',
  'AES-256 encrypted vector store with offline snapshot and restore workflows.',
  'Granular audit logging streamed to your SIEM via syslog or HTTPS.',
  'Policy-driven data retention windows per business unit.',
  'GPU health, thermals, and inference latency surfaced on a live dashboard.',
];

const connectors = [
  'SharePoint, Confluence, Google Workspace document sync (read-only).',
  'PostgreSQL, Snowflake, and data lake adapters through the secure gateway.',
  'ServiceNow, Jira, and Slack extensions for in-context chat actions.',
  'Custom REST hooks for proprietary data sources with schema validation.',
];

const chatMessages = [
  { role: 'analyst', text: 'Summarize today&apos;s access review findings for the IAM steering deck.' },
  {
    role: 'llm',
    text: 'Generated summary with quantified risk deltas, policy references, and reviewer attributions. Draft uploaded to /reports/IAM/2024-Access-Review.md.',
  },
  {
    role: 'analyst',
    text: 'Stage a remediation checklist and assign to the governance queue.',
  },
  { role: 'llm', text: 'Checklist created in ServiceNow with five prioritized tasks and linked evidence.' },
];

export default function LocalLLMPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-cyber-dark via-cyber to-black">
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start mb-12">
          <Card className="bg-gradient-to-br from-cesium/10 to-transparent border-cesium/30 rounded-none">
            <CardHeader>
              <div className="inline-flex items-center gap-3 mb-4">
                <Badge variant="outline" className="border-cesium/60 text-cesium">
                  New Service Offering
                </Badge>
                <Cpu className="h-8 w-8 text-cesium" />
              </div>
              <CardTitle className="text-4xl lg:text-5xl font-black text-white font-[var(--font-orbitron)]">
                Local LLM Platform
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                A fully managed on-site large language model appliance that bundles hardened hardware, packaged software, and private chat experiences without ever leaving your network perimeter.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-300">
              <p>
                Deploy a ChatGPT-style assistant where sensitive prompts, embeddings, and analytics stay inside your data center. We combine enterprise GPUs, a secured orchestration stack, and packaged chat applications that speak to your identity, knowledge, and ticketing systems over private links.
              </p>
              <div className="flex flex-wrap gap-4">
                {['Hardware + software bundle', 'Delivered & supported on-site', 'Offline model refresh cadence'].map((pill) => (
                  <span key={pill} className="px-4 py-2 border border-cesium/40 text-cesium text-sm uppercase tracking-wide">
                    {pill}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-cesium text-black font-black rounded-none px-8">
                  <Link href="/contact">Schedule Architecture Review</Link>
                </Button>
                <Button variant="outline" className="border-cesium/60 text-cesium rounded-none px-8" asChild>
                  <Link href="/services">Explore Services</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cyber-light/40 border-cesium/20 rounded-none">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-cesium" />
                Safeguards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-300">
                {safeguards.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-cesium mt-1">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          <Card className="bg-cyber-light/40 border-cesium/10 rounded-none">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <ServerCog className="h-5 w-5 text-cesium" />
                Hardware Blueprint
              </CardTitle>
              <CardDescription className="text-gray-400">
                Dedicated appliance delivered, racked, and monitored.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hardwareSpecs.map((spec) => (
                <div key={spec.label} className="flex justify-between text-sm text-gray-300 border-b border-white/5 pb-2">
                  <span className="text-gray-400">{spec.label}</span>
                  <span className="text-white text-right">{spec.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-cyber-light/40 border-cesium/10 rounded-none lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Workflow className="h-5 w-5 text-cesium" />
                Software Stack
              </CardTitle>
              <CardDescription className="text-gray-400">Modular services that keep models fresh and compliant.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {softwareLayers.map((layer) => (
                <div key={layer.title} className="border border-white/5 p-4">
                  <h4 className="text-white font-semibold mb-2">{layer.title}</h4>
                  <p className="text-sm text-gray-400">{layer.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          <Card className="bg-cyber-light/30 border-cesium/20 rounded-none">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Cable className="h-5 w-5 text-cesium" />
                Connectors
              </CardTitle>
              <CardDescription className="text-gray-400">
                Secure data-plane adapters keep everything inside private routes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-300 text-sm">
                {connectors.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-cesium">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-cyber-light/30 border-cesium/20 rounded-none">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <LockKeyhole className="h-5 w-5 text-cesium" />
                Rollout Program
              </CardTitle>
              <CardDescription className="text-gray-400">
                Four-week engagement to deliver a production-ready appliance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {deploymentPhases.map((phase, index) => (
                <div key={phase.title} className="relative pl-8">
                  <span className="absolute left-0 top-1 text-cesium font-bold">{String(index + 1).padStart(2, '0')}</span>
                  <h4 className="text-white font-semibold">{phase.title}</h4>
                  <p className="text-sm text-gray-400">{phase.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-cyber-light/40 to-cesium/5 border-cesium/20 rounded-none">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Local Chat Experience</CardTitle>
            <CardDescription className="text-gray-300">
              EdgeChat mirrors modern assistant workflows while honoring your governance policies.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.text}
                  className={`p-4 border ${message.role === 'analyst' ? 'border-cesium/60 bg-cesium/5 text-white' : 'border-white/10 bg-cyber-dark/60 text-gray-200'}`}
                >
                  <p className="text-xs uppercase tracking-wide text-cesium mb-2">
                    {message.role === 'analyst' ? 'Security Analyst' : 'Local LLM' }
                  </p>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4 text-gray-300 text-sm">
              <p>
                The packaged UI runs natively on the appliance, supports dark and light layouts, and exposes admin toggles for context windows, token ceilings, and redaction policies. Because everything is local, latency stays under 400 ms even during peak traffic windows.
              </p>
              <p>
                Observability hooks publish usage, saturation, and anomaly alerts to your existing monitoring stack, enabling proactive capacity planning. Bring your own models or use ours; the orchestrator handles sharding, A/B testing, and emergency rollbacks without external dependencies.
              </p>
              <Button variant="outline" className="border-cesium/60 text-cesium rounded-none" asChild>
                <Link href="/contact">Request Pricing Deck</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
