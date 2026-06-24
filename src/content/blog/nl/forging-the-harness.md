---
title: "Waarom ik mijn eigen Pi extensions bouw"
description: "De meeste coding agents zitten vol met tools. Pi wordt geleverd met bijna niets - en dat is precies waarom ik het gebruik als dagelijkse driver."
publish_date: "2026-06-23"
keywords: "pi coding agent, ai coding harness, vibe coding extensions, webclaw, firecrawl, deepseek v4, minimal llm tools, custom agent extensions"
header_image: "../../../assets/images/forging-the-harness-hero.jpg"
header_image_position: center
---

Een ridder koopt zijn harnas niet van de plank. Hij smeedt het, past het aan, leert elke klinknagel kennen. Dat is precies wat ik deed met mijn coding agent harnas, en ik denk dat jij dat ook zou moeten doen.

## Het Probleem Met Keukenkastjes

Ik begon zoals de meeste mensen. Claude Code, Codex, OpenCode. Ik heb ze allemaal geprobeerd. OpenCode bleef een tijdje hangen omdat ik daarmee tenminste van model kon wisselen in plaats van vast te zitten aan een provider. Dat was belangrijk. Maar elk van deze tools had dezelfde ziekte: ze zaten **volgepropt met tools**.

Tientallen. Elke API-integratie, elke file watcher, elke linter hook, elk mogelijk ding dat de LLM *misschien* nodig heeft, allemaal in het context window gedumpt. En hier bleef ik op terugkomen: **LLMs worden slechter naarmate je ze meer keuzes geeft**. Het is niet zomaar speculatie. Meerdere onderzoeken bevestigen dit. Geef een model 60 tools en hij pakt de verkeerde, hallucineert parameters, of bevriest in analyse verlamming. Geef hem er vijf: *read, write, edit, bash, web_search*. Opeens is het een chirurg.

Mensen werken precies hetzelfde. Meer opties, slechtere beslissingen.

Dus ging ik op zoek naar iets dat met het absolute minimum werd geleverd. Iets waarmee ik precies kon toevoegen wat ik nodig had, en niets meer. Toen vond ik [Pi](https://github.com/earendil-works/pi).

## Waarom Pi

Pi is het coding agent harnas dat door OpenClaw wordt gebruikt, en het heeft een filosofie waar ik meteen mee resoneerde: **lever bijna niets, documenteer alles**. Uit de doos krijg je `read`, `write`, `edit`, en `bash`. Dat is het. Geen web search. Geen web fetch. Geen directe git integratie. Geen linter. Pi heeft wel degelijk package management (`pi install`, `pi remove`, `pi update`), maar dat blijft in de CLI in plaats van als standaard model-tool in de context te zitten. Geen MCP server orkest.

Wat het *wel* levert is een schone TypeScript extension API en een map genaamd `extensions/`. Gooi daar een `.ts` bestand in, exporteer een standaard functie die `(pi: ExtensionAPI)` accepteert, en je hebt een tool, een slash command, een TUI widget, of een lifecycle hook toegevoegd. De documentatie is kort, de voorbeelden zijn echt, en je kunt letterlijk je LLM vragen om extensies voor zichzelf te schrijven.

Dit draait de dynamiek volledig om. In plaats van dat je agent een black box is die iemand anders heeft geconfigureerd, wordt het **een harnas dat je zelf smeedt**. Je leert je LLM kennen door ervoor te bouwen. Je ontdekt welke tools echt helpen en welke alleen maar ruis toevoegen. En net zoals je agents gebruikt om je gebruikelijke code op je werk te schrijven, kun je ze ook gebruiken om je eigen agent omgeving te bouwen.

## De Les Die Ik Meteen Leerde

Met Pi draaiende was ik nieuwsgierig naar AI geheugen. Mijn agent de mogelijkheid geven om dingen te onthouden tussen sessies klonk nuttig, dus ging ik op zoek naar een geheugen extensie. Ik vond Hindsight, het meest populaire geheugenpakket in het Pi ecosysteem. Ik installeerde het. En toen leerde ik de eerste echte les.

Het pakket stelde **60 tools** bloot aan de LLM.

Zestig.

Hindsight hoort een auto-memory systeem te zijn dat stilletjes gesprekken opneemt en relevante context terugroept. Het zou onzichtbaar moeten zijn. In plaats daarvan overspoelde dit pakket de tool lijst met `memory_search`, `memory_store`, `memory_tag`, `memory_prune`, tot in het oneindige. De agent kon niet meer over code nadenken omdat hij verdronk in geheugen tools. Het populairste pakket in het ecosysteem negeerde volledig het kernprincipe van waar het voor bedoeld was.

Dit was ook het moment waarop ik iets nuttigs over Pi ontdekte. Standaard laat Pi alleen zien welke *extensies* geladen zijn, niet welke *tools* er in de context zijn geinjecteerd. Dus bouwde ik een aangepast startscherm dat elke actieve tool laat zien. Nu kan ik precies zien wat de LLM te zien krijgt voordat ik een sessie start. Toen ik dat Hindsight pakket installeerde en 60 tools op mijn startscherm zag verschijnen, was de les direct en visueel.

Die ervaring zette de toon voor alles wat volgde. Nooit installeren. Altijd bouwen.

## De Web Stack: Markdown Er In, Ruis Er Uit

Het eerste wat ik zeker wist te willen was goede webtoegang. Maar ik had meningen.

### web_fetch: Het Verborgen Juweel

Te veel webtools voor agents voeren nog steeds rauwe of rommelige HTML aan de LLM. Dit is gestoord. Je verbrandt tokens aan `<div>` soep en CSS classes terwijl je eigenlijk alleen de artikeltekst wilt. De voor de hand liggende oplossing is "converteer HTML eerst naar markdown", en er zijn een dozijn SaaS APIs die je daar graag per request voor laten betalen. Er is zelfs [crawl4ai](https://github.com/unclecode/crawl4ai), wat erg capabel is maar een zware Python installatie vereist.

Of je gebruikt **[webclaw](https://github.com/0xMassi/webclaw)**. Het is een Rust CLI binary. Enkel commando. URL er in, schone markdown er uit. Voor normale paginas draait het lokaal zonder API key, Python omgeving of Docker. Voor JavaScript-gerenderde of beschermde paginas kun je waar nodig de hosted/API-route gebruiken. Het is snel, elegant, draagbaar en gratis voor de lokale core-extractie.

```bash
webclaw https://example.com/article --format markdown
```

Dat is het. Ik heb dit in een Pi extensie verpakt in ongeveer 40 regels TypeScript. Nu verschijnt `web_fetch` als een native tool naast `read` en `bash`, en de LLM ziet nooit een enkele HTML tag. Het is de beste web fetch ervaring die ik in welke agent dan ook heb gehad. Ik zie mezelf de code ervan echt nooit meer aanraken. Het is af.

### web_search: Twee Free Tiers Zijn Beter Dan Een

Voor zoeken hebben zowel [Firecrawl](https://firecrawl.dev) als [Exa](https://exa.ai) royale free tiers. Dus waarom er een kiezen? Ik schreef een provider die eerst Firecrawl probeert, en als de API terugkomt met een 402 vanwege opgebruikte credits, valt hij geruisloos terug op Exa. Twee free tiers aan elkaar gekoppeld. De LLM weet niet, en het boeit hem niet, welke provider antwoordde. Hij krijgt gewoon resultaten.

Ik voegde domein filtering, recentheidsfilters en optionele volledige content-extractie toe. Alles via Pi's tool systeem met nette TUI rendering voor statusberichten, token aantallen en provider labels. Het hele ding is ondergebracht in een enkel bestand.

## De Agent Stack: Kies Je Vechter

Ik draai drie modellen, afhankelijk van de taak:

| Model | Rol | Waarom |
|---|---|---|
| **DeepSeek V4 Pro** | Dagelijkse driver | Gigantisch context window, high thinking, en concurrerend in prijs met de goedkoopste agents die er zijn |
| **Xiaomi MIMO V2.5 Pro** | Snelle edits, subagents | Snel, capabel, en net zo goedkoop als DeepSeek |
| **GPT 5.5 (via Codex)** | Manager, architectuur | Nog steeds de beste redenering-per-dollar |

DeepSeek en MIMO zijn allebei belachelijk betaalbaar. We hebben het over de goedkoopste werkende agent-modellen die op dit moment beschikbaar zijn, en ze leveren ook echt. Ik draai ze allemaal op high thinking. Altijd. Het uitgebreide redeneren van DeepSeek is bijzonder goed. Ik krijg soms chain-of-thought van meerdere paginas die randgevallen oppikken die ik zelf niet gezien zou hebben.

Claude zit niet in de rotatie. Niet omdat hij slecht is. Hij is uitstekend. Maar de token economie werkt niet voor het volume dat ik draai. Codex blijft, naar mijn idee, de beste waar voor je geld aan de redeneerkant.

## Over Subagents: Leuk, Maar Nog Niet Productief

Ik bouwde een volledig manager patroon met scout, worker, reviewer en tester subagents. Architectonisch is het prachtig. De manager plant, delegeert, reviewt en rapporteert. In theorie.

In de praktijk? Ze over-engineeren. Ze miscommuniceren. De scout vindt het verkeerde bestand, de worker bewerkt iets ernaast, de reviewer mist het, en je hebt 4x de tokens uitgegeven voor een slechter resultaat dan gewoon een agent vertellen "fix regel 42."

De massieve context windows van de Chinese modellen maken dit eigenlijk erger. Er is geen *noodzaak* om te delegeren als je de hele codebase in context kunt passen. Subagents zouden zinvol kunnen zijn voor repetitieve batch taken. Voor feature development? Een agent, een context, een poging wint nog steeds.

Maar ik heb geen spijt van het bouwen. Het is Lego blokjes. Je probeert dingen, je leert wat werkt, je houdt wat blijft plakken.

## De Kleine Dingen

Pi maakt kleine aanpassingen bijna triviaal makkelijk. Mijn aangepaste footer toont persona, git branch, model, context gebruik met een kleurgecodeerd percentage (groen naar geel naar oranje naar rood naarmate het volloopt), thinking level, en een braille spinner tijdens agent activiteit. Het kostte een middag om te bouwen, grotendeels besteed aan de wiskunde, en het geeft me constant situationeel bewustzijn tijdens lange codeersessies.

Ik bouwde ook een aangepast startscherm. Pi vertelt je normaal gesproken welke extensies geladen zijn, maar niet welke tools er daadwerkelijk in de context zijn geinjecteerd. Mijn startscherm, dat ik het "Zun Orbit" dashboard noem, toont elke actieve tool, elke extensie, elke skill, en het huidige context gebruik, allemaal voordat ik een enkel bericht typ. Na de Hindsight ervaring werd dit essentieel. Ik wil precies zien waar mijn agent bij kan.

Voice mode was een weekend experiment. [Parakeet](https://github.com/nicholasgasior/parakeet) voor spraak-naar-tekst, Chatterbox Turbo voor tekst-naar-spraak. Beide lokaal, beide snel, beide werken. Is het praktisch voor dagelijks coderen? Niet echt. Was het leuk om te bouwen? Absoluut. En dat is eigenlijk het punt. Als extensies goedkoop zijn om te schrijven, probeer je dingen.

## Smeed Je Eigen

Mensen zijn allemaal aan het vibe-coden, dus waarom vibe-code je niet je eigen Pi extensies en maak je een harnas van jezelf? Je kunt de agent zelfs gebruiken om andere harnassen te verkennen. Claude Code is open source. Codex is open source. Gemini CLI is open source. Iedereen kijkt naar iedereen. En het ergste wat je nu kunt doen is iets opgeblazens maken.

Dit is wat ik iedereen zou vertellen die begint met coding agents:

1. **Kies een harnas dat je niet in de weg zit.** Pi, in mijn geval. Iets met een schone extension API en minimale standaardinstellingen.

2. **Voeg tools een voor een toe.** Gebruik de agent eerst zonder een tool. Voel de frictie. Schrijf dan de extensie die precies die frictie wegneemt, niets meer.

3. **Bouw, installeer niet.** Elke extensie die je schrijft leert je iets over hoe je LLM denkt. Elk pakket dat je installeert leert je niets en voegt ruis toe. Zoals ik op de harde manier heb geleerd, zelfs het populairste pakket kan volledig de plank misslaan.

4. **Vertrouw op je instinct over minimalisme.** Als het voelt als te veel tools, dan is het dat ook. Je LLM is geen multitasking besturingssysteem. Het is een redeneermachine die het beste presteert met een heldere, begrensde omgeving.

5. **Experimenteer constant.** Probeer subagents, probeer voice, probeer verschillende modellen. Het meeste zal niet blijven plakken, maar alles leert je iets. En als extensies een middag kosten om te schrijven, is er geen reden om het niet te doen.

6. **Weet wat er in je context zit.** Bouw zichtbaarheid in welke tools en extensies actief zijn. Als je niet kunt zien waar je agent bij kan, vlieg je blind.

De beste coding agent is niet degene met de meeste features. Het is degene die past bij *jouw* workflow, *jouw* modellen, *jouw* mentale model van hoe een LLM zou moeten werken. En de enige manier om dat te krijgen is door hem zelf te bouwen.

Mijn harnas is niet perfect. Het verandert volgende week als DeepSeek V4.1 uitkomt, of als ik een betere zoekprovider ontdek, of als ik eindelijk uitvogel hoe ik subagents echt nuttig kan maken. Maar elk stukje ervan is *van mij*. Ik weet waarom het er is, wat het doet, en hoeveel het kost in aandacht budget.

Dat is het verschil tussen een harnas van de plank dragen en je eigen smeden.
