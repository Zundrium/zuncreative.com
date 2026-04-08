---
title: 'ComfyUI: The Good, the Bad, and the Ugly.'
description: 'Setting up a ComfyUI server with Runpod'
publish_date: '2025-06-02'
modify_date: '2025-06-02'
keywords: 'ai, photobooth, catvton, comfyui'
header_image: '../../../assets/images/ai_photobooth_testimages.jpg'
header_image_position: right
---
When we at VideOrbit Studio decided to develop an AI Photobooth, we knew we needed a powerful, flexible, and user-friendly system. It had to generate, personalize, and print quickly—a challenge for which ComfyUI seemed perfectly suited as the backbone of our workflow. But as with any technical adventure, there were highs, challenges, and... frustrations.

## **The Good: ComfyUI Makes Complex Workflows Accessible**

ComfyUI is a visual interface for building AI workflows with nodes. For non-technical users, this is a blessing: instead of writing code, you drag and connect blocks like digital Lego. This allowed us to quickly build an automated pipeline—from photo intake to AI generation and virtual try-on.

The beauty is that you can design a unique flow without deep programming knowledge. Want to combine Stable Diffusion with an upscaler, a masking algorithm, and a virtual try-on? No problem. You drag the nodes onto the canvas, connect them, and you have a working prototype. For a project like our AI Photobooth, where rapid iteration was essential, this proved to be a game-changer.

## **The Bad: Docker, Nodes, and the Runpod Challenge**

But not everything was smooth sailing. ComfyUI runs on nodes, and these nodes often need to be installed separately. When we wanted to move our workflow to Runpod for cloud-based processing, we ran into a practical problem: each node had to be manually built into a Docker image.

That sounds simple, but in practice, it means you have to arrange a separate installation for every dependency—whether it's an upscaler, a pose detector, or a virtual try-on model. And since Runpod doesn't offer permanent storage between sessions, you have to start from scratch with every update. It became a time-consuming process of trial-and-error, where we sometimes spent hours debugging missing packages or version conflicts.

## **The Ugly: The Wild West of Community Nodes**

ComfyUI has a vibrant community, which is both a blessing and a curse. On the one hand, there are countless useful nodes available, from advanced image processors to complete virtual try-on systems like CatVTON. On the other hand, the quality—and compatibility—of these nodes is highly variable.

Some nodes are optimized for speed, others consume resources as if it's their last day. Some only work with specific versions of libraries, others crash without a clear error message. And because each node is created by a different developer, there is little uniformity in how they perform. The result? A workflow that should theoretically run smoothly but in practice regularly gets stuck due to one poorly implemented node.

## **Conclusion: Was It Worth It? Absolutely.**

Despite the challenges, ComfyUI has enabled us to build something cool: an AI Photobooth that generates personalized images within seconds, complete with virtual try-on functionality. It's flexible, powerful, and—if you invest the necessary time—manageable.

But it's not a magic box. Anyone who starts with ComfyUI must be prepared to dive deep into the technical details, debug Docker images, and occasionally get frustrated with nodes that don't do what they're supposed to. Still, if you overcome these hurdles, you can create amazing things with it. And that's exactly what we did.

So yes: ComfyUI is *good*, sometimes *bad*, and occasionally *ugly*. But above all? It works.
