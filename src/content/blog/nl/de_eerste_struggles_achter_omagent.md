---
title: 'De eerste echte struggles achter Omagent: waarom ik eindigde met LiveKit'
description: 'Bij het bouwen van Omagent liep ik al vroeg tegen fundamentele keuzes aan rond agentic frameworks, realtime audio, toolcalls en architectuur.'
publish_date: '2026-05-01'
modify_date: '2026-05-01'
keywords: 'omagent, livekit, livekit agents, fastapi, mcp, rpc, webrtc, websockets, ai agents'
header_image: '../../../assets/images/omagent-livekit-hero.jpg'
header_image_position: center
---

Toen ik begon aan **Omagent**, dacht ik dat de grootste uitdaging zou zitten in de intelligentie van de agent zelf. Welk model kies je? Hoe laat je een agent goed redeneren? Hoe zorg je dat toolcalls betrouwbaar werken? Maar in de praktijk begon de echte uitdaging veel eerder: **wat is een stevig fundament voor een agent platform dat niet alleen vandaag werkt, maar over een jaar nog steeds logisch en onderhoudbaar is?**

En precies daar begonnen de eerste serieuze struggles.

## De eerste zoektocht: welk agentic framework kies je?

Zoals veel developers begon ik met het verkennen van bestaande agentic frameworks. Er is op papier veel keuze, maar zodra je een platform wilt bouwen dat langer mee moet gaan, ga je anders kijken. Dan zoek je niet alleen iets dat "werkt", maar iets dat ook **begrijpelijk, uitbreidbaar en toekomstbestendig** is.

Ik heb meerdere opties geprobeerd. **LangChain** was krachtig, maar voor mijn use case voelde het al snel omslachtig. Er zit veel in, maar juist daardoor kreeg ik het gevoel dat ik te veel moest meebewegen met het framework, in plaats van andersom. Voor experimenten kan dat prima zijn, maar voor een platform dat je als product wilt doorontwikkelen, begon het zwaar aan te voelen.

Daarna keek ik naar **PydanticAI**. Dat vond ik op zich een prettige stap vooruit. Het is schoner, duidelijker en voelt in veel gevallen moderner aan. Voor tekstgebaseerde agents is dat absoluut interessant. Maar zodra je serieus audio-first wilt werken, merk je dat de keuze ineens een stuk kleiner wordt. Niet elk framework is gebouwd met realtime spraakinteractie als kern.

En dat was precies het punt waarop ik uitkwam bij **LiveKit** en later **LiveKit Agents**.

## Waarom LiveKit uiteindelijk de logische keuze werd

LiveKit staat in eerste instantie bekend als een sterk platform voor **WebRTC**. En dat is meteen belangrijk om even simpel te duiden.

**WebSockets** zijn een techniek waarmee client en server continu berichten naar elkaar kunnen sturen. Dat is heel handig voor realtime updates, events en statusinformatie. Maar WebSockets zijn niet per se de ideale basis voor hoogwaardige audio- en video-interactie.

**WebRTC** is daar juist wel specifiek voor ontworpen. Het is gemaakt voor realtime media: lage latency, stabiele audioverbindingen en ondersteuning voor vloeiende audio- en videosessies. Als je een agent bouwt waarmee gebruikers natuurlijk moeten kunnen praten, dan maakt dat een enorm verschil.

Dat was voor mij de grote kracht van LiveKit. Niet alleen omdat het technisch sterk is, maar omdat het je dwingt om het probleem bij de kern aan te pakken. Als je conversational agents bouwt die met audio moeten werken, dan wil je niet achteraf ontdekken dat je fundament eigenlijk meer geschikt was voor chatberichten dan voor gesprekken.

LiveKit gaf mij dus niet alleen een infrastructuurkeuze, maar ook een duidelijke architectuurrichting.

## Audio-first agents zijn in de praktijk veel ingewikkelder dan ze lijken

Toen de basis duidelijker werd, kwam de volgende realiteit naar voren: **hoe laat je zo'n agent eigenlijk luisteren, nadenken en terugpraten?**

In grote lijnen zijn daar momenteel twee routes voor.

De eerste route is de klassieke opbouw met drie losse modellen:

1. **speech-to-text**
2. **een tekstmodel**
3. **text-to-speech**

Dat werkt in de praktijk vaak prima. Het heeft ook voordelen, want je kunt per stap de beste provider kiezen. Je hebt dus relatief veel flexibiliteit. Maar daar zit meteen ook het nadeel: je introduceert meer latency, meer integraties en meestal ook meer kosten. In feite ben je dan drie AI-diensten tegelijk aan het orkestreren.

LiveKit ondersteunt dit soort flows ook prima, dus technisch is het goed te doen. Maar als je naar schaal, kosten en onderhoud kijkt, merk je snel dat dit zwaar kan worden. Niet alleen financieel, maar ook operationeel.

De tweede route is werken met een **realtime model** dat meerdere stappen combineert. Dat klinkt als de ideale oplossing, en op papier is het dat ook. Alleen is de markt daar nog beperkt. Op dit moment zijn er eigenlijk maar een paar serieuze realtime-opties van grote spelers. In mijn ervaring ging het vooral om **OpenAI Realtime** en een **Gemini realtime model van Google**.

Daar begon opnieuw een belangrijke les.

## Realtime modellen zijn indrukwekkend, maar nog niet altijd volwassen genoeg

Realtime modellen zien er in demo's vaak fantastisch uit. Lage latency, natuurlijke respons, een veel directere conversational flow. Maar zodra je ze in een agent platform probeert te gebruiken dat ook echt iets moet uitvoeren, kom je bij een ander criterium uit: **hoe goed gaat het model om met toolcalls?**

En daar liep ik met name bij **Gemini** tegen serieuze beperkingen aan. In mijn use case bleek dat gewoon niet sterk genoeg te werken. En als toolcalls niet betrouwbaar genoeg zijn, dan kun je moeilijk spreken van een agent die echt bruikbaar is in productie.

Dat was een frustrerende fase, omdat de belofte groot is. Je ziet dat de technologie dichtbij voelt, maar in de praktijk wil je geen platform bouwen op aannames. Zeker niet als je een product wilt maken dat klanten echt gaan gebruiken.

Dus ondanks alle potentie van voice, moesten we op een bepaald moment een nuchtere keuze maken.

## Waarom we tijdelijk teruggingen naar tekst

Een van de belangrijkste beslissingen in de ontwikkeling van Omagent was dat we **tijdelijk teruggingen naar tekst als primaire interactievorm**.

Niet omdat audio niet waardevol is. Integendeel. Ik geloof nog steeds dat audio een enorm belangrijke rol gaat spelen in agent platforms. Maar als de toolcalling-laag nog niet stabiel genoeg is binnen realtime modellen, dan moet je soms een stap terug doen om later twee stappen vooruit te kunnen zetten.

Dat was een heel leerzaam moment. Want juist dan merk je dat productontwikkeling niet draait om "het coolste bouwen", maar om **de juiste laag op het juiste moment volwassen maken**.

Tekst was in deze fase simpelweg de betrouwbaardere keuze.

## De architectuur die uiteindelijk wel goed voelde

Toen die keuze eenmaal gemaakt was, werd ook de totale architectuur veel helderder.

Voor de traditionele applicatielaag -- dus alles rondom **accounts, authenticatie, database en businesslogica** -- hebben we gekozen voor **FastAPI**. Dat is een logische en snelle backendlaag voor alles wat je in een klassiek platform nodig hebt.

Daarnaast hebben we **LiveKit** ingezet als realtime infrastructuurlaag voor audio en video, met **LiveKit Agents** als aparte agentlaag voor sessies en conversaties.

Die scheiding werkte erg goed. Je krijgt dan grofweg deze opzet:

- **FastAPI** voor accounts, auth, data en algemene backendlogica
- **LiveKit** voor realtime verbindingen
- **LiveKit Agents** voor agentgedrag en sessieafhandeling
- **MCP-servers** voor toolcalls buiten de agent zelf

Wat ik daar prettig aan vond, is dat de verantwoordelijkheden duidelijk blijven. Je hoeft niet alles in een applicatie te forceren. En juist dat maakt een platform op langere termijn beter onderhoudbaar.

## Toolcalls maakten van het model pas echt een agent

Een model dat alleen antwoord geeft, is nog geen volwaardige agent. Pas wanneer een systeem **iets kan doen**, begint het interessant te worden.

Daarom waren **toolcalls** een essentieel onderdeel van Omagent. In ons geval werkten die via losse **MCP-servers**. Dat bleek een hele fijne keuze, omdat het LiveKit agentic framework dit goed ondersteunt. Je kunt tools daardoor modulair opzetten, apart beheren en gericht uitbreiden.

Dat is veel prettiger dan een monolithische aanpak waarin alle functionaliteit ergens diep in dezelfde backend verstopt raakt.

Deze losse toolarchitectuur gaf meteen ook veel rust in het ontwerp. We konden veel duidelijker nadenken over wat de agent mocht doen, hoe tools aanspreekbaar werden gemaakt en hoe we die later konden vervangen of uitbreiden.

## De onverwachte gamechanger: RPC methods

Een ander onderdeel dat uiteindelijk misschien nog interessanter werd, waren de **RPC methods**.

Conceptueel lijken die op toolcalls, maar ze richten zich op een ander domein. Waar MCP-tools vaak server-side of extern iets uitvoeren, maken RPC methods gebruik van de bestaande **WebRTC-verbinding** om acties in de eigen client uit te voeren.

Dat maakt de agent ineens veel interactiever.

Een simpel voorbeeld: stel dat de AI in de browser een alert moet tonen. Dan kun je een functie zoals `displayAlert` beschikbaar maken, en de agent kan die aanroepen alsof het een gewone tool is.

Dat klinkt misschien klein, maar het opent een veel grotere wereld. Want dan praat de agent niet alleen tegen de gebruiker, maar kan hij ook **gericht de interface beïnvloeden**.

En precies daar begon Omagent voor mij echt interessant te worden.

## Van generieke interfaces naar maatwerk deliverables

Veel moderne AI-producten bewegen richting een soort **canvas-achtige ervaring**. Dat zie je terug bij verschillende grote partijen. Het idee is aantrekkelijk: de AI toont niet alleen tekst, maar bouwt ook dynamische output, mini-apps of samengestelde resultaten op.

Alleen is daar in mijn ogen vaak een probleem mee: het blijft snel te generiek.

Bij Omagent wilden we juist een andere kant op. Niet een generiek canvas dat "een beetje van alles" kan, maar **maatwerk tools die aansluiten op concrete deliverables van klanten**.

Dus niet zomaar een blok output, maar bijvoorbeeld een specifieke `displayQuote` of `displayOffer` RPC tool die een offerte exact toont op de manier die voor die klant logisch is. Met de juiste velden, de juiste opmaak en de juiste context.

Dat klinkt misschien als een detail, maar daar zit een fundamenteel verschil in denkwijze. Je bouwt dan niet alleen een AI-interface, maar een **AI-gedreven werkomgeving** die aansluit op echte processen.

Daardoor kan de agent veel helderder communiceren. Niet meer vaag of generiek, maar direct binnen de context van het werk dat de gebruiker op dat moment probeert af te ronden.

## Wat deze fase me vooral leerde

Als ik terugkijk op deze eerste fase van Omagent, dan ging het eigenlijk veel minder over prompts of modelkwaliteit dan ik vooraf dacht. Natuurlijk zijn die belangrijk. Maar de echte struggles zaten dieper:

- welk framework is echt houdbaar;
- welke realtime technologie is sterk genoeg;
- hoe betrouwbaar zijn toolcalls in de praktijk;
- wanneer kies je voor flexibiliteit en wanneer voor eenvoud;
- en wanneer moet je durven terugschakelen van voice naar tekst.

Dat zijn geen flashy keuzes, maar wel precies de keuzes die bepalen of je iets bouwt dat een demo blijft, of iets dat kan doorgroeien tot een echt platform.

Voor mij kwam de voorlopige uitkomst neer op een duidelijke combinatie: **FastAPI voor de klassieke backend, LiveKit als realtime hart, LiveKit Agents voor de agentlaag, MCP-servers voor externe tools en RPC methods voor client-side interactie.**

Dat is uiteindelijk de basis geworden waarop Omagent verder kon groeien.

## Slot

De eerste versie van een agent platform bouwen gaat zelden over alleen AI. Het gaat minstens zoveel over infrastructuur, interactie, betrouwbaarheid en productkeuzes. En juist die laag vond ik achteraf misschien nog wel interessanter dan de modellen zelf.

Omagent begon voor mij dus niet met een perfecte architectuur, maar met veel uitproberen, veel afwegen en ook accepteren dat sommige delen van de markt nog niet volwassen genoeg zijn voor wat je uiteindelijk wilt bouwen.

En misschien is dat ook precies wat bouwen aan agent platforms vandaag zo interessant maakt: je werkt niet alleen aan een product, maar ook op de grens van wat nu al echt werkt.

**Wil je meer weten over hoe Omagent is opgebouwd, waar ik precies tegenaan liep, of waarom bepaalde keuzes uiteindelijk beter werkten dan andere? Stuur me gerust een bericht op LinkedIn.** Ik deel daar graag meer over, en ik ga de komende tijd meer schrijven over mijn ervaringen met het bouwen van agent platforms.
