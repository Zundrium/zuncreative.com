---
title: 'Lerp vs. Easing'
description: 'Making the Right Choice for Smooth Animations'
publish_date: '2025-05-14'
modify_date: '2025-05-14'
keywords: 'JavaScript, animation, coding'
header_image: '../../../assets/images/lerp_vs_easing.png'
---

If you work with animations, games, or UI transitions, you've probably heard of `lerp()` and easing functions. But when do you use which? Let's unravel these powerful techniques.

## What is a Lerp?
**Lerp** stands for *Linear Interpolation*. It's a mathematical technique to calculate a value between two points based on a ratio (`t`). Simply put: "Give me a point that is X% of the way from A to B."

```javascript
function lerp(start, end, t) {
  return start + (end - start) * t;
}

// Output: 0.5 (exactly halfway)
console.log(lerp(0, 1, 0.5)); 
```

## What is Easing?
**Easing** controls how an animation accelerates or decelerates. Instead of linear motion (lerp), you can create more natural effects like speeding up, slowing down, or bouncing.

```javascript
function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

// Output: 0.75 (not halfway, it has eased)
console.log(easeOutQuad(0.5)); 
```

## What is Lerp Perfect For?
It's great for things like color transitions. If you have a value between 0 and 1, you can create a gradient by lerping the `r`, `g`, and `b` values:
```javascript
function colorLerp(color1, color2, t) {
  return {
    r: lerp(color1.r, color2.r, t),
    g: lerp(color1.g, color2.g, t),
    b: lerp(color1.b, color2.b, t)
  };
}

// Example
const red = { r: 1, g: 0, b: 0 };
const blue = { r: 0, g: 0, b: 1 };
const purple = colorLerp(red, blue, 0.5);
console.log(purple); // { r: 0.5, g: 0, b: 0.5 }
```

## The problem with `lerp()` in an update loop
It looks elegant to create a smooth animation with a single line, but it can cause problems.

A `lerp()` takes a fraction of the distance between a start and end value, which means it will **never** reach the end (a mathematical asymptote). This means you have no control over the duration of your animation.

Imagine you have an update method that you run every frame:
```javascript
function animate() {
  box.style.top = lerp(current, target, 0.1) + 'px';
  requestAnimationFrame(animate);
}
animate();
```

<iframe class="codepen-embed" src="https://codepen.io/ZunCreative/embed/EajNjXM"></iframe>

Here you can see that while scrolling, the value never reaches the final number. This can have performance implications; in this case, the element continues to animate even when it should be stationary.

The easiest solution for this is to round the number before applying it. In the background, the `current` value is still the same, but the applied value reaches the final number thanks to rounding.

<iframe class="codepen-embed" src="https://codepen.io/ZunCreative/embed/wBaoVKO"></iframe>

If we want to fix the fundamental problem, we can no longer use a fraction into infinity. The solution: a fixed animation duration.
To work with a fixed duration, we need to:
1. Start an animation with `requestAnimationFrame` on every scroll.
2. Stop the previous animation if it exists with `cancelAnimationFrame`.
3. Keep track of the time for the duration with `performance.now()`.
4. Determine the duration based on the distance and speed.
5. Set a minimum and maximum duration.

<iframe class="codepen-embed" src="https://codepen.io/ZunCreative/embed/ZYGBgOW"></iframe>

Great, it works, we have a lot of control over the animation, but it's definitely not as smooth as the `lerp()` from before. What now?

This is where *easing* comes into play.

1. Instead of a `lerp()`, we use the `easeOutQuint()` easing function on the `progress` variable.
2. We multiply this `easedT` output by the difference between the end and start positions.

That's it!

<iframe class="codepen-embed" src="https://codepen.io/ZunCreative/embed/emNgOyj"></iframe>

On [easings.net](https://easings.net/), you can try out all sorts of easings to see which one you like best by replacing `easeOutQuint()`.

## Conclusion
Lerp and easing are both powerful tools for animation, but they each have their own applications and limitations.

Lerp is ideal for simple, linear interpolations like color transitions, while easing provides more natural movements that accelerate and decelerate over a fixed duration.

It's important to choose the right technique based on your needs and to be aware of lerp's limitations, such as its asymptotic behavior. By combining both techniques, you can create animations that are both smooth and controlled, giving your projects a professional look and feel.
