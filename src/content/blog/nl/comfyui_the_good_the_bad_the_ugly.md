---
title: 'ComfyUI; the good, the bad and the ugly.'
description: 'Het opzetten van een ComfyUI server met Runpod'
publish_date: '2025-06-02'
modify_date: '2025-06-02'
keywords: 'ai, photobooth, catvton, comfyui, '
header_image: '../../../assets/images/ai_photobooth_testimages.jpg'
header_image_position: right
---
Toen we bij VideOrbit Studio besloten om een AI Photobooth te ontwikkelen, wisten we dat we een krachtig, flexibel en gebruiksvriendelijk systeem nodig hadden. Het moest snel kunnen genereren, personaliseren en printen—een uitdaging waarbij ComfyUI als backbone van onze workflow uitermate geschikt leek. Maar zoals bij elk technisch avontuur waren er hoogtepunten, uitdagingen en... frustraties.  

## **The Good: ComfyUI Maakt Complexe Workflows Toegankelijk**  

ComfyUI is een visuele interface voor het opbouwen van AI-workflows met nodes. Voor niet-technische gebruikers is dit een zegen: in plaats van code te schrijven, sleep je blokken in elkaar en verbind je ze als een soort digitale Lego. Dit stelde ons in staat om snel een geautomatiseerde pipeline te bouwen—van foto-inname tot AI-generatie en virtual try-on.  

Het mooie is dat je zonder diepgaande programmeerkennis een unieke flow kunt ontwerpen. Wil je Stable Diffusion combineren met een upscaler, een maskeringsalgoritme en een virtual try-on? Geen probleem. Je sleept de nodes in de canvas, verbindt ze, en je hebt een werkend prototype. Voor een project als onze AI Photobooth, waar snel itereren essentieel was, bleek dit een gamechanger.  

## **The Bad: Docker, Nodes en de Runpod-Uitdaging**  

Maar niet alles was rozengeur en maneschijn. ComfyUI draait op nodes, en die nodes moeten vaak apart geïnstalleerd worden. Toen we onze workflow naar Runpod wilden verplaatsen voor cloud-based verwerking, liepen we tegen een praktisch probleem aan: elke node moest handmatig in een Docker-image worden gebouwd.  

Dat klinkt simpel, maar in de praktijk betekent het dat je voor elke dependency—of het nu om een upscaler, een pose-detector of een virtual try-on model gaat—een aparte installatie moet regelen. En omdat Runpod geen permanente opslag biedt tussen sessies, moet je bij elke update weer van vooraf aan beginnen. Het werd een tijdrovend proces van trial-and-error, waarbij we soms uren bezig waren met het debuggen van ontbrekende packages of versieconflicten.  

## **The Ugly: De Wild West van Community-Nodes**  

ComfyUI heeft een levendige community, en dat is zowel een zegen als een vloek. Aan de ene kant zijn er talloze handige nodes beschikbaar, van geavanceerde image processors tot complete virtual try-on systemen zoals CatVTON. Aan de andere kant is de kwaliteit—en compatibiliteit—van die nodes zeer wisselvallig.  

Sommige nodes zijn geoptimaliseerd voor snelheid, andere slurpen resources alsof het hun laatste dag is. Sommige werken alleen met specifieke versies van libraries, andere crashen zonder duidelijke error message. En omdat elke node door een andere developer is gemaakt, is er weinig uniformiteit in hoe ze presteren. Het resultaat? Een workflow die theoretisch soepel zou moeten lopen, maar in de praktijk regelmatig vastloopt door één slecht geïmplementeerde node.  

## **Conclusie: Was Het Het Waard? Absoluut.**  

Ondanks de uitdagingen heeft ComfyUI ons in staat gesteld om iets cools te bouwen: een AI Photobooth die binnen enkele seconden gepersonaliseerde beelden genereert, compleet met virtual try-on functionaliteit. Het is flexibel, krachtig en—mits je de nodige tijd investeert—goed te beheersen.  

Maar het is geen magische toverdoos. Wie met ComfyUI aan de slag gaat, moet bereid zijn om diep in de technische details te duiken, Docker-images te debuggen en af en toe gefrustreerd te raken over nodes die niet doen wat ze zouden moeten doen. Toch, als je die hindernissen overwint, kun je er verbazingwekkende dingen mee maken. En dat is precies wat wij gedaan hebben.  

Dus ja: ComfyUI is *good*, soms *bad*, en af en toe *ugly*. Maar bovenal? Het werkt.