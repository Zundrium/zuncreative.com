---
title: "Forging The Harness: Why I Made My Own Instead of Installing Someone Else's"
description: "Most coding agents ship with a kitchen sink of tools. Pi ships with almost nothing - and that's exactly why I chose it as my daily driver."
publish_date: "2026-06-23"
keywords: "pi coding agent, ai coding harness, vibe coding extensions, webclaw, firecrawl, deepseek v4, minimal llm tools, custom agent extensions"
header_image: "../../../assets/images/forging-the-harness-hero.jpg"
header_image_position: center
---

A knight doesn't buy their armor off the rack. They forge it, fit it, learn every rivet. That's what I did with my coding agent harness, and I think you should too.

## The Problem With Kitchen Sinks

I started like most people. Claude Code, Codex, OpenCode. I tried them all. OpenCode stuck for a while because at least it let me switch models instead of being locked to one provider. That mattered. But every one of these tools had the same disease: they were **stuffed with tools**.

Dozens of them. Every API integration, every file watcher, every linter hook, every possible thing the LLM *might* need, all dumped into the context window. And here's the thing I kept coming back to: **LLMs get worse the more choices you give them**. It's not just speculation. Multiple studies back this up. Present a model with 60 tools and it'll pick the wrong one, hallucinate parameters, or freeze in analysis paralysis. Give it five: *read, write, edit, bash, web_search*. Suddenly it's a surgeon.

Humans work the same way. More options, worse decisions.

So I went looking for something that shipped with the bare minimum. Something that let me add exactly what I needed, nothing more. That's when I found [Pi](https://github.com/earendil-works/pi).

## Why Pi

Pi is the coding agent harness used by OpenClaw, and it has a philosophy I resonated with immediately: **ship almost nothing, document everything**. Out of the box you get `read`, `write`, `edit`, and `bash`. That's it. No web search. No web fetch. No git integration. No linter, no package manager, no MCP server orchestra.

What it *does* ship is a clean TypeScript extension API and a folder called `extensions/`. Drop a `.ts` file in there, export a default function that takes `(pi: ExtensionAPI)`, and you've added a tool, a slash command, a TUI widget, or a lifecycle hook. The docs are short, the examples are real, and you can literally ask your LLM to write extensions for itself.

This flips the dynamic entirely. Instead of your agent being a black box someone else configured, it becomes **a harness you forge yourself**. You learn your LLM by building for it. You discover what tools actually help and which ones just add noise. And similar to how you use agents for writing your usual code at work, you can also use them to build your own agent environment.

## The Lesson I Learned Right Away

With Pi set up, I was curious about AI memory. Giving my agent the ability to remember things across sessions sounded useful, so I went looking for a memory extension. I found Hindsight, the most popular memory package in the Pi ecosystem. I installed it. And that's when I learned the first real lesson.

The package exposed **60 tools** to the LLM.

Sixty.

Hindsight is supposed to be an auto-memory system that silently records conversations and recalls relevant context. It should be invisible. Instead, this package flooded the tool list with `memory_search`, `memory_store`, `memory_tag`, `memory_prune`, ad infinitum. The agent couldn't reason about code because it was drowning in memory tools. The most popular package in the ecosystem completely neglected the core principle of what it was supposed to do.

This is also when I discovered something useful about Pi. By default, Pi only shows you which *extensions* are loaded, not which *tools* are injected into the context. So I built a custom start screen that lists every active tool. Now I can see exactly what's being fed to the LLM before I start a session. When I installed that Hindsight package and watched 60 tools appear on my start screen, the lesson was immediate and visual.

That experience set the tone for everything that followed. Never install. Always build.

## The Web Stack: Markdown In, Noise Out

The first thing I knew I wanted was proper web access. But I had opinions.

### web_fetch: The Hidden Gem

Every other agent feeds raw HTML to the LLM. This is insane. You're burning tokens on `<div>` soup and CSS classes when what you actually want is the article text. The obvious fix is "convert HTML to markdown first", and there are a dozen SaaS APIs that'll charge you per request for this. There's even [crawl4ai](https://github.com/unclecode/crawl4ai), which is very capable but requires a heavy Python installation.

Or you can use **[webclaw](https://github.com/0xMassi/webclaw)**. It's a Go binary. Single command. URL goes in, clean markdown comes out. No API key. No Python environment. No Docker. It handles JavaScript-rendered pages. It's fast, elegant, portable, and completely free.

```bash
webclaw https://example.com/article --format markdown
```

That's it. I wrapped this in a Pi extension in about 40 lines of TypeScript. Now `web_fetch` appears as a native tool alongside `read` and `bash`, and the LLM never sees a single HTML tag. It's the best web fetch experience I've had in any agent. I genuinely don't see myself ever touching that code again. It's done.

### web_search: Two Free Tiers Are Better Than One

For search, [Firecrawl](https://firecrawl.dev) and [Exa](https://exa.ai) both have generous free tiers. So why pick one? I wrote a provider that tries Firecrawl first, and if the API comes back with a credit-exhausted 402, it silently falls through to Exa. Two free tiers chained together. The LLM doesn't know or care which provider responded. It just gets results.

I added domain filtering, recency filters, and optional full-content extraction. All of it surfaced through Pi's tool system with proper TUI rendering for status messages, token counts, and provider labels. The whole thing is self-contained in a single file.

## The Agent Stack: Choose Your Fighter

I run three models depending on the task:

| Model | Role | Why |
|---|---|---|
| **DeepSeek V4 Pro** | Daily driver | Massive context window, high thinking, and rivaling in price with the cheapest agents out there |
| **Xiaomi MIMO V2.5 Pro** | Quick edits, subagents | Fast, capable, and just as cheap as DeepSeek |
| **GPT 5.5 (via Codex)** | Manager, architecture | Still the best reasoning-per-dollar |

DeepSeek and MIMO are both ridiculously affordable. We're talking about some of the cheapest working agent-capable models available right now, and they genuinely deliver. I run them all at high thinking. Always. The extended reasoning on DeepSeek is particularly good. I'll sometimes get multi-page chain-of-thought that catches edge cases I wouldn't have spotted myself.

Claude isn't in the rotation. Not because it's bad. It's excellent. But the token economics don't work for the volume I run. Codex remains, to my mind, the best bang for your buck on the reasoning side.

## On Subagents: Fun, But Not Yet Productive

I built a full manager pattern with scout, worker, reviewer, and tester subagents. It's architecturally beautiful. The manager plans, delegates, reviews, and reports. In theory.

In practice? They over-engineer. They miscommunicate. The scout finds the wrong file, the worker edits something adjacent, the reviewer misses it, and you've spent 4x the tokens for a worse result than just telling one agent "fix line 42."

The Chinese models' massive context windows actually make this worse. There's no *need* to delegate when you can fit the entire codebase in context. Subagents might make sense for repetitive batch tasks. For feature development? One agent, one context, one shot still wins.

But I don't regret building it. It's Lego blocks. You try things, you learn what works, you keep what sticks.

## The Little Things

Pi makes small customizations almost trivially easy. My custom footer shows persona, git branch, model, context usage with a color-coded percentage (green to yellow to orange to red as it fills up), thinking level, and a braille spinner during agent activity. It took an afternoon to build, most of it spent on the math, and it gives me constant situational awareness during long coding sessions.

I also built a custom start screen. Pi normally tells you which extensions are loaded, but not which tools are actually being injected into the context. My start screen, which I call the "Zun Orbit" dashboard, lists every active tool, every extension, every skill, and the current context usage, all before I type a single message. After the Hindsight experience, this became essential. I want to see exactly what my agent can touch.

Voice mode was a weekend experiment. [Parakeet](https://github.com/nicholasgasior/parakeet) for speech-to-text, Chatterbox Turbo for text-to-speech. Both are local, both are fast, both work. Is it practical for daily coding? Not really. Was it fun to build? Absolutely. And that's kind of the point. When extensions are cheap to write, you try things.

## Forge Your Own

People are all vibe-coding left and right, so why not vibe-code your own Pi extensions and make a harness of your own? You can even use the agent to explore other harnesses. Claude Code is open source. Codex is open source. Gemini CLI is open source. Everyone is looking at everyone. And the worst thing you can do right now is make something bloated.

Here's what I'd tell anyone starting with coding agents:

1. **Pick a harness that stays out of your way.** Pi, in my case. Something with a clean extension API and minimal defaults.

2. **Add tools one at a time.** Use the agent without a tool first. Feel the friction. Then write the extension that removes exactly that friction, nothing more.

3. **Build, don't install.** Every extension you write teaches you something about how your LLM thinks. Every package you install teaches you nothing and adds noise. As I learned the hard way, even the most popular package can completely miss the mark.

4. **Trust your instincts about minimalism.** If it feels like too many tools, it is. Your LLM is not a multitasking operating system. It's a reasoning engine that performs best with a clear, constrained environment.

5. **Experiment constantly.** Try subagents, try voice, try different models. Most of it won't stick, but everything teaches you something. And when extensions cost an afternoon to write, there's no reason not to.

6. **Know what's in your context.** Build visibility into what tools and extensions are active. If you can't see what your agent can touch, you're flying blind.

The best coding agent isn't the one with the most features. It's the one that fits *your* workflow, *your* models, *your* mental model of how an LLM should operate. And the only way to get that is to build it yourself.

My harness isn't perfect. It'll change next week when DeepSeek V4.1 drops or when I discover a better search provider or when I finally figure out how to make subagents actually useful. But every piece of it is *mine*. I know why it's there, what it does, and how much it costs in attention budget.

That's the difference between wearing armor off the rack and forging your own.
