---
title: 'Een CRM dat draait op Google Sheets'
description: "Na een frustrerende zoektocht langs dure CRM's en de verborgen limieten van Zapier, besloot ik het anders te doen."
publish_date: '2025-07-07'
modify_date: '2025-07-07'
keywords: 'crm, google sheets, n8n'
header_image: '../../../assets/images/customer-cold-calls.jpg'
header_image_position: right
---

Voor elke zzp'er, freelancer of kleine ondernemer is het een bekend verhaal: je contacten beheren. Wat begint als een handjevol klanten en partners, groeit al snel uit tot een onoverzichtelijk netwerk. Ook ik liep hier tegenaan en besloot dat het tijd was voor een CRM-systeem. Mijn wens was simpel: één centrale plek om mijn klant- en partnercontacten te onderhouden, gevoed door mijn e-mail en het liefst ook WhatsApp. Meer niet.

En dus begon mijn zoektocht. Wat ik vond, was op z'n zachtst gezegd verbazingwekkend.

#### De dure wereld van veredelde Excel-sheets

Ik dook in de wereld van CRM-systemen en stuitte op een markt vol dure abonnementen en complexe software. Voor tientallen, soms honderden euro's per maand kreeg je toegang tot tools die in essentie niets meer waren dan een veredeld Excel-sheet met wat extra toeters en bellen. Begrijp me niet verkeerd, ze zagen er gelikt uit, maar de kernfunctionaliteit was vaak basic. Waarom was deze markt, zelfs voor freelancers met een simpele behoefte, zo ontzettend duur?

Als developer besloot ik verder te kijken en kwam ik uit bij **Twenty**. Voor een tientje per maand kreeg je een compleet pakket waar je... eigenlijk alles zelf mocht inrichten. Het bood een prima basis, zoals een automatisch klantenregister op basis van je e-mails, maar veel verder dan dat ging het niet. Het was een kale, maar veelbelovende start.

#### Het standaardantwoord: “Gebruik gewoon Zapier!”

En hier stuitte ik op een patroon. Zowel bij Twenty als bij veel andere CRM-pakketten die ik had onderzocht, was het antwoord op een ontbrekende feature steevast hetzelfde: "Dat los je toch op met Zapier!". Het leek de universele oplossing voor elke beperking. Wilde je een specifieke connectie of een stukje automatisering dat niet standaard in het pakket zat? Dan werd je vriendelijk doorverwezen naar deze externe tool.

En zo kwam ik dus bij **Zapier** uit. Zapier is simpelgezegd een platform dat je duizenden verschillende applicaties met elkaar laat praten. Mijn plan was eenvoudig: ik wilde mijn CRM bouwen in het meest flexibele programma dat er is: Google Sheets. Met Zapier zou ik vervolgens mijn Gmail-berichten automatisch laten verwerken. Wanneer er een nieuwe e-mail binnenkwam, moest Zapier een contactpersoon toevoegen of bijwerken in mijn spreadsheet.

Ik ging aan de slag en bouwde precies wat ik nodig had:

*   **Een Google Sheet met vier tabbladen:**
    *   `Bedrijven`: Een overzicht van alle organisaties.
    *   `Contacten`: Alle individuele contactpersonen.
    *   `Prospect Outreach`: Een lijst met potentiële klanten (automatisch gefilterd uit 'Bedrijven').
    *   `Keeping in Touch`: Een lijst van bestaande klanten/partners die ik periodiek wil benaderen (ook gefilterd).

Zowel de bedrijven als contacten werden automatisch bijgewerkt op basis van mijn inkomende en uitgaande e-mails. Het werkte perfect! Ik had mijn eigen, georganiseerde en simpele CRM. Totdat de koude douche kwam.

#### De ontnuchtering: de verborgen limieten

Zapier promoot zichzelf groots, maar in hun gratis en goedkopere abonnementen zitten flinke addertjes onder het gras. Hoewel ze pochen met "oneindig veel Zaps" (hun term voor een automatisering), mag je er per maand maar 100 laten *runnen*. Elke e-mail die mijn systeem zou moeten verwerken, telt als één 'run'. Met een beetje mailverkeer zit je daar binnen een paar dagen aan. En hun eigen database-oplossing, Zapier Tables, had een limiet van 100 connecties naar een ander tabblad. Kortom: waardeloos voor wat ik wilde bouwen.

#### De open-source redding: [n8n](https://n8n.io)

![Mijn Gmail n8n flow](/img/n8n-flow.webp)

De zoektocht ging verder, maar nu gericht op een open-source alternatief voor Zapier. En toen ontdekte ik **n8n** (spreek uit: nodemation). Blijkbaar had ik onder een steen geleefd, want dit project heeft al meer dan 100.000 sterren op GitHub en een enorme community.

Het mooiste? Omdat ik mijn hele workflow al had uitgedacht en gebouwd in Zapier, was de overstap een fluitje van een cent. **Binnen twee uur had ik mijn volledige automatisering overgezet naar n8n.**

Het enige verschil zit in de opzet. Waar Zapier je bij de hand neemt, moet je bij n8n zelf een 'developer project' aanmaken bij Google om de connectie met Gmail te leggen. Dit klinkt misschien ingewikkeld, maar de documentatie van n8n is zo helder en stapsgewijs dat elke developer dit kan.

#### Mijn setup voor nu (en de toekomst)

En dat is het eigenlijk. Mijn zoektocht eindigde met een perfecte, bijna gratis oplossing:

*   **Frontend:** Een simpele Google Sheet die fungeert als mijn CRM-dashboard.
*   **Backend:** n8n als de motor die op de achtergrond draait en alles automatiseert.
*   **Data:** Gmail levert de data voor nieuwe en bijgewerkte contacten.

Nu heb ik een simpel, op maat gemaakt CRM dat precies doet wat ik wil, zonder onverwachte kosten of frustrerende limieten. De volgende stap? WhatsApp-integratie. En laat n8n dat nu ook gewoon ondersteunen. Een CRM voor een zzper is een vrij persoonlijke aanpak, en misschien past deze ook bij jou!