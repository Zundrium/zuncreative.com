---
title: 'Smooth Scroll Meditation: GSAP ScrollSmoother vs Lenis'
description: 'Een ervaring met het bouwen van een meditatie-app en het vergelijken van twee moderne scroll-animatiebibliotheken'
publish_date: '2025-07-28'
modify_date: '2025-07-28'
keywords: 'gsap, lenis, scrolltrigger, scrollsmoother, parallax, animatie, webontwikkeling'
header_image: '../../../assets/images/meditate.jpg'
header_image_position: right
---
Bij het bouwen van [een minimalistische meditatie-app](/showcase/meditate-concept/) belandde ik diep in de wereld van scrollgedrag en animatiebibliotheken. De app was nooit bedoeld om complex te zijn. Een paar parallax-bomen, zachte ambientgeluiden en een rustige achtergrond. Maar wat begon als een klein ontwerpbesluit, werd al snel een technisch onderzoek.

Ik wilde vloeiende scrolls. Niet het standaardgevoel van de browser. Iets zachters, vloeienders, alsof je door stil water glijdt. GSAP’s ScrollSmoother leek perfect. Tegenwoordig volledig gratis en met indrukwekkende functies. Ik had eerder met ScrollTrigger gewerkt en waardeerde hoe eenvoudig het was om scroll-gebonden animaties te maken. ScrollSmoother beloofde nog meer. Natuurlijke momentum, naadloze overgangen, betere beleving.

Mijn opzet was relatief eenvoudig. Absoluut gepositioneerde afbeeldingen van verschillende hoogtes, allemaal uitgelijnd aan de onderkant van het scherm. Die vormden samen het gewenste parallax-effect. Omdat ze buiten het scherm vielen, plaatste ik ze in een grote container. Dat veroorzaakte het eerste probleem.

ScrollSmoother rekent op een centraal origineelpunt. Maar met absoluut gepositioneerde elementen in een hoge container verschuift dat middelpunt. ScrollSmoother herberekent de layout op basis van dat veranderende centrum, en dat brak de hele ervaring. Animaties waren niet meer uitgelijnd, posities versprongen, en het scrollgedrag werd onvoorspelbaar.

Ik probeerde het op te lossen. Geneste containers. Handmatige hoogtes. Geforceerde centrering. Niets werkte echt soepel. Het voelde alsof ik tegen het gereedschap aan het vechten was. Uiteindelijk liet ik ScrollSmoother vallen en schakelde ik terug naar ScrollTrigger met fixed-position elementen. Daarmee kreeg ik weer controle, maar verloor ik de vloeiendheid waar ik op mikte.

## Lenis Doet Minder, Maar Werkt Beter

Lenis is een lichte scroll-smoother die minder probeert te doen, en daardoor juist meer oplevert. Het laat je de native DOM-structuur behouden. Werkt perfect samen met ScrollTrigger. Je hoeft enkel hun scrollposities te synchroniseren en het resultaat voelt natuurlijk en modern. Geen ingewikkelde markup. Geen verschoven origin-punten. Mijn layout bleef intact. Mijn absoluut gepositioneerde lagen bleven zoals ik ze wilde. En ik kreeg het gewenste momentum terug.

Door Lenis te combineren met ScrollTrigger kreeg ik precies wat ik nodig had. Een soepele scrollervaring zonder dat ik mijn hele layout moest herstructureren voor een tool. Het resultaat was vloeiend en beheersbaar. Animaties liepen synchroon. De structuur bleef behouden.

## Wat Ik Leerde uit de Scroll-loopgraven

- ScrollSmoother is krachtig als je je aan de regels houdt, maar star wanneer je afwijkt.
- Lenis biedt flexibiliteit met minimale setup, vooral bij niet-standaard of gelaagde layouts.
- Lenis in combinatie met ScrollTrigger geeft je vrijheid en vloeiendheid zonder structurele opofferingen.

Voor een meditatie-app maakt dat gevoel het verschil. Je wil niet alleen dat het werkt. Je wil dat het ademt.
