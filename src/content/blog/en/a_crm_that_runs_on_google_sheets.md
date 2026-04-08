---
title: 'A CRM that runs on Google Sheets'
description: "After a frustrating search for expensive CRMs and discovering the hidden limits of Zapier, I decided to do things differently."
publish_date: '2025-07-07'
modify_date: '2025-07-07'
keywords: 'crm, google sheets, n8n'
header_image: '../../../assets/images/customer-cold-calls.jpg'
header_image_position: right
---

For every self-employed professional, freelancer, or small business owner, it's a familiar story: managing your contacts. What starts as a handful of clients and partners quickly grows into an unmanageable network. I ran into this problem myself and decided it was time for a CRM system. My wish was simple: a single, central place to maintain my client and partner contacts, fed by my email and, preferably, WhatsApp too. Nothing more.

And so, my search began. What I found was, to say the least, astonishing.

#### The Expensive World of Glorified Excel Sheets

I delved into the world of CRM systems and encountered a market full of expensive subscriptions and complex software. For tens, sometimes hundreds of euros per month, you got access to tools that were essentially nothing more than a glorified Excel sheet with some extra bells and whistles. Don't get me wrong, they looked slick, but the core functionality was often basic. Why was this market, even for freelancers with simple needs, so incredibly expensive?

As a developer, I decided to look further and came across **Twenty**. For ten euros a month, you got a complete package where you... had to set up basically everything yourself. It offered a solid foundation, like an automatic client registry based on your emails, but it didn't go much further than that. It was a bare-bones, but promising start.

#### The Standard Answer: "Just Use Zapier!"

And this is where I encountered a pattern. With Twenty, as with many other CRM packages I had researched, the answer to a missing feature was invariably the same: "You can solve that with Zapier!" It seemed to be the universal solution for every limitation. If you wanted a specific connection or a piece of automation that wasn't included in the package, you were kindly referred to this external tool.

And so, I ended up with **Zapier**. Zapier is, simply put, a platform that lets you connect thousands of different applications. My plan was simple: I wanted to build my CRM in the most flexible program out there: Google Sheets. With Zapier, I would then have my Gmail messages processed automatically. When a new email arrived, Zapier was supposed to add or update a contact in my spreadsheet.

I got to work and built exactly what I needed:

*   **A Google Sheet with four tabs:**
    *   `Companies`: An overview of all organizations.
    *   `Contacts`: All individual contacts.
    *   `Prospect Outreach`: A list of potential clients (automatically filtered from 'Companies').
    *   `Keeping in Touch`: A list of existing clients/partners I want to contact periodically (also filtered).

Both the companies and contacts were automatically updated based on my incoming and outgoing emails. It worked perfectly! I had my own, organized, and simple CRM. Until the cold shower came.

#### The Sobering Reality: The Hidden Limits

Zapier promotes itself heavily, but its free and cheaper plans have some major catches. Although they boast about "unlimited Zaps" (their term for an automation), you're only allowed to *run* 100 of them per month. Every email my system was supposed to process counts as one 'run'. With even a moderate amount of email traffic, you'll hit that limit in a few days. And their own database solution, Zapier Tables, had a limit of 100 connections to another tab. In short: useless for what I wanted to build.

#### The Open-Source Rescue: [n8n](https://n8n.io)

![My Gmail n8n flow](/img/n8n-flow.webp)

The search continued, but this time focused on an open-source alternative to Zapier. And then I discovered **n8n** (pronounced: nodemation). Apparently, I had been living under a rock, because this project already has over 100,000 stars on GitHub and a huge community.

The best part? Because I had already thought out and built my entire workflow in Zapier, the switch was a piece of cake. **Within two hours, I had migrated my entire automation setup to n8n.**

The only difference is the setup. Where Zapier holds your hand, with n8n, you have to create a 'developer project' yourself with Google to establish the connection with Gmail. This might sound complicated, but the n8n documentation is so clear and step-by-step that any developer can do it.

#### My Setup for Now (and the Future)

And that's basically it. My search ended with a perfect, nearly free solution:

*   **Frontend:** A simple Google Sheet that acts as my CRM dashboard.
*   **Backend:** n8n as the engine that runs in the background and automates everything.
*   **Data:** Gmail provides the data for new and updated contacts.

Now I have a simple, custom-built CRM that does exactly what I want, without unexpected costs or frustrating limits. The next step? WhatsApp integration. And as it turns out, n8n supports that too. A CRM for a freelancer is a very personal thing, and maybe this approach will work for you too