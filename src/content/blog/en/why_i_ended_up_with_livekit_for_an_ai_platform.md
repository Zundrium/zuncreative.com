---
title: 'Why I ended up with LiveKit for an AI platform'
description: 'While building OomAgent, I ran into foundational decisions around agentic frameworks, real-time audio, tool calls, and architecture much earlier than I expected.'
publish_date: '2026-05-01'
modify_date: '2026-05-01'
keywords: 'oomagent, livekit, livekit agents, fastapi, mcp, rpc, webrtc, websockets, ai agents'
header_image: '../../../assets/images/oomagent-livekit-hero.jpg'
header_image_position: center
---

When I started building **OomAgent**, I assumed the hardest part would be the intelligence of the agent itself. Which model do you choose? How do you make an agent reason well? How do you make tool calls reliable? In practice, though, the real challenge started much earlier: **what is a solid foundation for an agent platform that not only works today, but still makes sense a year from now?**

That was where the first serious struggles began.

## The first search: which agentic framework do you choose?

Like many developers, I started by exploring existing agentic frameworks. On paper, there is a lot of choice, but as soon as you want to build a platform that needs to last, you start looking differently. You are no longer looking for something that merely "works", but for something that is also **understandable, extensible, and future-proof**.

I tried several options. **LangChain** was powerful, but for my use case it quickly felt too cumbersome. There is a lot in it, but that was also the issue: I felt like I had to adapt too much to the framework instead of the framework adapting to the product I wanted to build. That can be fine for experiments, but for a platform you want to evolve as a product, it started to feel heavy.

Then I looked at **PydanticAI**. I actually liked that a lot more. It feels cleaner, clearer, and in many cases more modern. For text-based agents, it is absolutely an interesting option. But once you want to go truly audio-first, your choices shrink fast. Not every framework is built around real-time voice interaction as a core experience.

That was exactly the point where I ended up with **LiveKit**, and later **LiveKit Agents**.

## Why LiveKit became the logical choice

LiveKit is first and foremost known as a strong **WebRTC** platform. That is worth defining simply.

**WebSockets** are a way for the client and server to continuously send messages to each other. They are great for real-time updates, events, and status information. But they are not necessarily the ideal foundation for high-quality audio and video interaction.

**WebRTC** is specifically designed for that. It is built for real-time media: low latency, stable audio transport, and much better support for smooth audio and video sessions. If you are building an agent that people should be able to talk to naturally, that distinction matters a lot.

That became the biggest strength of LiveKit for me. Not only because it is technically strong, but because it forces you to solve the right problem at the right layer. If you are building conversational agents around audio, you do not want to discover too late that your foundation was better suited to chat messages than actual conversations.

So LiveKit did not just give me an infrastructure choice; it gave me a clear architectural direction.

## Audio-first agents are much more complicated in practice than they seem

Once the foundation became clearer, the next reality showed up: **how do you actually make an agent listen, think, and speak back?**

At a high level, there are currently two routes.

The first route is the classic three-model pipeline:

1. **speech-to-text**
2. **a text model**
3. **text-to-speech**

This often works quite well in practice. It also has advantages, because you can choose the best provider for each step. That gives you a lot of flexibility. But that is also where the downside starts: more latency, more integrations, and usually more cost. In effect, you are orchestrating three AI services at the same time.

LiveKit supports these kinds of flows well, so technically this is very doable. But when you look at scale, cost, and maintenance, it quickly becomes heavier than it first appears. Not just financially, but operationally too.

The second route is using a **real-time model** that combines multiple steps. On paper, that sounds like the ideal answer. In practice, though, the market is still limited. At the moment, there are really only a few serious real-time options from major providers. In my experience, that mainly meant **OpenAI Realtime** and a **Gemini real-time model from Google**.

That led to the next important lesson.

## Real-time models are impressive, but not always mature enough yet

Real-time models often look fantastic in demos. Lower latency, more natural responses, a much more direct conversational flow. But as soon as you try to use them in an agent platform that actually has to do things, a different question becomes more important: **how well does the model handle tool calls?**

That was where I hit serious limitations, especially with **Gemini**. In my use case, it simply was not strong enough there. And if tool calls are not reliable enough, it becomes hard to call the result a truly usable production agent.

That phase was frustrating because the promise is so compelling. The technology feels close, but in practice you do not want to build a platform on assumptions, especially not if real customers are going to rely on it.

So despite all the potential of voice, we eventually had to make a more pragmatic decision.

## Why we temporarily went back to text

One of the most important decisions in the development of OomAgent was that we **temporarily went back to text as the primary interface**.

Not because audio is unimportant. Quite the opposite. I still believe audio will play a major role in agent platforms. But if the tool-calling layer is not stable enough yet inside real-time models, sometimes you need to take one step back so you can take two forward later.

That turned out to be a very useful lesson. It reminded me that product development is not about building the coolest thing first, but about **maturing the right layer at the right moment**.

At that stage, text was simply the more reliable choice.

## The architecture that finally felt right

Once that choice was made, the overall architecture became much clearer.

For the traditional application layer -- everything around **accounts, authentication, the database, and business logic** -- we chose **FastAPI**. That gave us a fast and sensible backend for the classic parts of the platform.

Alongside that, we used **LiveKit** as the real-time infrastructure layer for audio and video, with **LiveKit Agents** as a separate agent layer for sessions and conversations.

That separation worked very well. The architecture roughly became:

- **FastAPI** for accounts, auth, data, and backend logic
- **LiveKit** for real-time connections
- **LiveKit Agents** for agent behavior and session handling
- **MCP servers** for tool calls outside the agent itself

What I liked about that setup is that responsibilities stay clear. You do not have to force everything into one application, and that makes the platform much easier to maintain in the long run.

## Tool calls are what made it a real agent

A model that only responds is not really an agent yet. It only becomes interesting once the system can **do things**.

That is why **tool calls** became such an essential part of OomAgent. In our case, they ran through separate **MCP servers**. That turned out to be a very clean approach, especially because the LiveKit agentic framework supports it well. It let us keep tools modular, manageable, and easy to extend.

That is far more comfortable than a monolithic setup where every bit of functionality disappears somewhere deep inside the same backend.

This modular tool architecture also gave us much more clarity in the design. We could think more deliberately about what the agent was allowed to do, how tools should be exposed, and how we might replace or expand them later.

## The unexpected game changer: RPC methods

Another piece that became even more interesting than I expected was **RPC methods**.

Conceptually, they are similar to tool calls, but they solve a different problem. Where MCP tools often execute something server-side or externally, RPC methods use the existing **WebRTC connection** to trigger actions inside the client itself.

That suddenly makes the agent much more interactive.

A simple example: imagine the AI wants to show an alert in the browser. You can expose a function like `displayAlert`, and the agent can call it just like any other tool.

That may sound small, but it opens up a much bigger space. Now the agent is not only talking to the user; it can also **directly influence the interface**.

That was the point where OomAgent started to feel genuinely exciting to me.

## From generic interfaces to tailored deliverables

Many modern AI products are moving toward a kind of **canvas-like experience**. You can see that direction in several major products already. The idea is appealing: the AI does not just return text, but also builds dynamic output, mini apps, or structured results.

The problem, at least in my view, is that these experiences often stay too generic.

With OomAgent, we wanted the opposite. Not a generic canvas that can do "a bit of everything", but **custom tools that map directly to the deliverables customers actually care about**.

So not just a generic output block, but for example a dedicated `displayQuote` or `displayOffer` RPC tool that shows a quote exactly the way a customer needs it -- with the right fields, the right structure, and the right presentation.

That may sound like a small difference, but it reflects a very different design philosophy. You are no longer just building an AI interface; you are building an **AI-driven work environment** aligned with real processes.

That allows the agent to communicate much more clearly. Not vaguely or generically, but directly inside the context of the work the customer is actually trying to complete.

## What this phase taught me most

Looking back on this first phase of OomAgent, it was much less about prompts or model quality than I originally expected. Those things matter, of course. But the real struggles were deeper:

- which framework is actually sustainable;
- which real-time technology is strong enough;
- how reliable tool calls really are in practice;
- when you should choose flexibility and when you should choose simplicity;
- and when you need to be willing to scale back from voice to text.

These are not flashy decisions, but they are exactly the ones that determine whether you are building a demo, or something that can grow into a real platform.

For me, the current answer became a clear combination: **FastAPI for the traditional backend, LiveKit as the real-time core, LiveKit Agents as the agent layer, MCP servers for external tools, and RPC methods for client-side interaction.**

That is the foundation OomAgent was able to grow on.

## Closing thought

The first version of an agent platform is rarely only about AI. It is just as much about infrastructure, interaction, reliability, and product decisions. Looking back, that layer may have been even more interesting to me than the models themselves.

OomAgent did not start with a perfect architecture. It started with a lot of experimentation, a lot of trade-offs, and an acceptance that some parts of the market are simply not mature enough yet for what you want to build.

And maybe that is exactly what makes building agent platforms today so interesting: you are not just building a product, you are working right at the edge of what is already truly usable.

**If you want to know more about how OomAgent is built, what I ran into, or why some choices worked better than others, feel free to message me on LinkedIn.** I am happy to share more, and I will be writing more articles based on my experience building agent platforms.
