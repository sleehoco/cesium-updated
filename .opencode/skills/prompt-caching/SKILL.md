---
name: prompt-caching-ops
description: Use this skill when planning or reviewing prompts where cached prefixes can cut token costs, reduce latency, or improve throughput while working in OpenCode.
version: 0.1.0
---

# Prompt Caching Operations Playbook

Adopt the caching model described in ngrok's “Prompt caching: 10x cheaper LLM tokens, but how?” to keep OpenCode conversations cheap and fast.

## Objectives
- Minimize input-token spend by reusing cached KV pairs for long, stable prefixes.
- Keep turnaround time predictable when iterating on similar tasks or multi-file reviews.
- Track cache hit rates so expensive prompts can be refactored early.

## When to Invoke This Skill
- Re-running analyses/tests with the same system instructions plus minor user edits.
- Sweeping through many files using a constant checklist or diagnostic block.
- Preparing batched agent workflows that include heavy context (schemas, docs, logs).

## Core Tactics
1. **Split prompts into cacheable + live sections**
   - `[[SYSTEM + policies + shared refs]] [[Case-specific instructions]] [[User delta]]`
   - Keep cached part byte-identical between calls; even whitespace changes bust caches.
2. **Anthropic (Claude API)**
   - Use `cache_control: {"type":"ephemeral"}` on messages that should persist 10 minutes.
   - Assign human-readable `cache_id` values so different tasks can reuse the same prefix.
   - Inspect `usage.cached_input_tokens` to confirm hits.
3. **OpenAI (GPT APIs)**
   - Align prompts behind a deterministic preamble; the platform autobinds cached prefixes.
   - Resend requests quickly to stay within their ~5 minute window; misses rise after that.
   - Watch `usage.prompt_cache_hit_tokens` / `prompt_tokens_details.cached_tokens`.
4. **Partial reuse**
   - Organize documentation into modular chunks (`tooling`, `schema`, `style-guide`). Cache each chunk separately so edits invalidate only one block.
   - For looping workflows, stream file-specific content after the cached block so only the suffix changes per iteration.
5. **Temperature-safe**
   - Caching happens before sampling; tweak `temperature`, `top_p`, `top_k` freely without losing the hit.

## Operational Checklist
- [ ] Identify static context ≥1k tokens that repeats within a session.
- [ ] Encapsulate it as the first assistant/system message and request caching (Anthropic) or keep the wording fixed (OpenAI).
- [ ] Send a dry-run request, log token usage, and verify cached-token counters increment.
- [ ] Automate verification (e.g., CI task) when templates change to avoid silent cache busts.
- [ ] Document cache expiry assumptions when handing off to teammates.

## Troubleshooting
- **Low hit rate (<50%)**: compare serialized prompts, normalize whitespace, and ensure markdown tables/lists haven’t drifted.
- **Latency still high**: long suffixes may dominate cost; consider caching secondary blocks or shrinking live context.
- **Invalidated caches after edits**: version your cached blocks (`v42`) so old tasks keep referencing the previous prefix until they finish.

## Metrics to Track
- Cached vs non-cached input tokens per provider.
- Cost per successful call before/after caching (should drop ~10x for long prefixes).
- Time-to-first-token distribution—goal is ≤15% of uncached latency once KV data hits GPU memory.

Use this skill proactively whenever OpenCode work involves repeated heavyweight context. Locking in cache-friendly prompts early delivers immediate token savings and smoother interactive sessions.
