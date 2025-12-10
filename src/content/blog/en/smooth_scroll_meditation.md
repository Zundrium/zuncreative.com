---
title: 'Smooth Scroll Meditation: GSAP ScrollSmoother vs Lenis'
description: 'A developer’s experience building a meditation app and comparing two modern scroll animation libraries'
publish_date: '2025-07-28'
modify_date: '2025-07-28'
keywords: 'gsap, lenis, scrolltrigger, scrollsmoother, parallax, animation, webdev'
header_image: '../../../assets/images/meditate.jpg'
header_image_position: right
---
In building [a minimalist meditation app](/showcase/meditate-concept/), I found myself deep in the world of scroll behavior and animation libraries. The app was never supposed to be complicated. A few parallax trees, soft ambient sounds, and a quiet background. But what began as a small design decision quickly turned into a technical investigation.

I wanted smooth scrolling. Not the default browser feel. Something softer, more fluid, like gliding through still water. GSAP’s ScrollSmoother caught my eye. It’s now entirely free, and the feature set is impressive. I had used ScrollTrigger before and appreciated how easy it made scroll-linked animations. ScrollSmoother promised that and more. Natural momentum, seamless transitions, better feel.

My setup was relatively straightforward. I used absolutely positioned images of different heights, each aligned to the bottom of the viewport. These created the layered parallax effect I wanted. Because they extended beyond the screen, I wrapped them in a large container. That caused the first problem.

ScrollSmoother relies on a central origin. But when you use absolutely positioned elements inside a tall container, that center shifts. ScrollSmoother recalculates its layout based on that shifting origin, and that broke the whole experience. Animations were no longer aligned, positions drifted, and the scroll behavior became unpredictable.

I tried restructuring. Nested containers. Manual height calculations. Forcing center alignment. Nothing worked cleanly. It felt like fighting the tool. Eventually I dropped ScrollSmoother and switched back to ScrollTrigger with fixed-position elements. That gave me back control but cost me the smoothness I had wanted in the first place.

## Lenis Does Less but Delivers More

Lenis is a lightweight scroll smoother that does less and ends up doing more. It lets you keep your native DOM structure. It plays well with ScrollTrigger. All you do is sync their scroll positions and the result feels natural and modern. No complicated markup. No broken origins. I kept my layout. I kept my absolutely positioned elements. I got my momentum.

Using Lenis with ScrollTrigger gave me what I needed. A smooth scroll experience without redesigning my layout around a tool’s expectations. The result was fluid and controllable. Animations synced. Layouts remained intact.

## Lessons From the Scroll Trench

- ScrollSmoother is powerful if you follow its rules, but rigid when you don’t.
- Lenis offers flexibility with minimal setup, especially for non-standard or layered layouts.
- Pairing Lenis with ScrollTrigger gives you freedom and fluidity without architectural sacrifices.

For a meditation app, that difference in feel matters. You don’t just want it to work. You want it to breathe.
