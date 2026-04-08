---
title: 'Gaussian Splatting: Makkelijker dan je denkt'
description: 'Een stap-voor-stap gids om je eigen 3D Gaussian Splats te maken, van video tot web-ready model.'
publish_date: '2025-11-24'
modify_date: '2025-11-24'
keywords: 'gaussian splatting, 3d, tutorial, realityscan, brush, playcanvas, webgl'
header_image: '../../../assets/images/gaussian_splat.jpg'
header_image_position: right
---

Gaussian Splatting klinkt misschien als een ingewikkelde wiskundige term, en hoewel de techniek erachter dat zeker is, is het maken van je eigen "splat" verrassend eenvoudig. Het is een fantastische manier om echte omgevingen of objecten naar de digitale wereld te brengen met een fotorealistische kwaliteit.

Op <a href="https://gs-test.pages.dev/" target="_blank">https://gs-test.pages.dev/</a> heb ik een test gemaakt, check hem vooral even! Je kan bewegen met de muis en scroll of door te swipen op je telefoon.

### Wat is Gaussian Splatting eigenlijk?

Voordat we de diepte in duiken, is het goed om te begrijpen wat we precies maken. Traditioneel gebruiken we in 3D graphics **meshes** (gemaakt van driehoeken) of **point clouds** (losse punten).

*   **Meshes** zijn geweldig voor harde oppervlakken en gedefinieerde vormen, maar worstelen met complexe details zoals haar, rook of transparantie.
*   **Point clouds** kunnen veel detail bevatten, maar zien er vaak "korrelig" uit als je inzoomt; er zitten gaten tussen de punten.

Gaussian Splatting zit hier tussenin, maar dan op steroïden. In plaats van harde punten, bestaat je scene uit miljoenen "splats": 3D-ellipsoïden (denk aan uitgerekte bollen) die zacht in elkaar overlopen. Elke splat heeft een positie, rotatie, grootte, kleur en transparantie.

**Waarom is dit cool voor het web?**
1.  **Fotorealisme:** Het vangt reflecties en details die met meshes bijna onmogelijk na te maken zijn.
2.  **Snelheid:** De rendering techniek (rasterization) is razendsnel, waardoor je zelfs op mobiele apparaten 60fps kunt halen.
3.  **Workflow:** Je hoeft niet uren te modelleren. Een video is genoeg om een scene te "vangen".

Het is een techniek die de kloof tussen video en interactieve 3D dicht.

In dit artikel neem ik je mee door de flow om zelf aan de slag te gaan.

### De Basis: Video

Alles begint met goede beelden. Je hebt een video nodig van het object of de omgeving die je wilt vastleggen. Loop er rustig omheen en zorg dat je alles goed in beeld brengt.

**Belangrijke tip:** Draai niet te snel! Als je te snel beweegt, krijgt de software het moeilijk om referentiepunten te vinden, wat resulteert in een slechte reconstructie. Doe het rustig aan.

### Stap 1: Van Video naar Afbeeldingen

De eerste technische stap is het omzetten van je video naar een reeks losse afbeeldingen. Hiervoor gebruiken we `ffmpeg`, een krachtige tool voor videobewerking via de command line.

Het doel is om ongeveer **300 tot 600 afbeeldingen** te krijgen. Dit geeft genoeg data voor een goed resultaat zonder dat de verwerkingstijd extreem lang wordt.

Gebruik het volgende commando:

```bash
ffmpeg -i video.mp4 -vf "fps=2,scale=iw:ih:flags=lanczos" -c:v mjpeg -q:v 2 -y ./img/frame_%%05d.jpg
```

Wat doet dit commando?
*   `-i video.mp4`: Je invoerbestand.
*   `fps=2`: Haalt 2 frames per seconde uit de video. Pas dit aan als je video heel kort of heel lang is om rond die 300-600 beelden uit te komen.
*   `scale=iw:ih`: Behoudt de originele resolutie.
*   `-q:v 2`: Zorgt voor hoge kwaliteit JPEGs.

### Stap 2: Camera Poses Bepalen

Nu we de beelden hebben, moeten we weten waar de camera zich bevond voor elke foto. Dit heet "camera pose estimation".

Ik gebruik hiervoor **RealityScan** van Unreal Engine. Deze tool werkt erg snel en is gebruiksvriendelijk.
Na het verwerken in RealityScan exporteer je het resultaat als een **colmap** export. Zorg dat je zowel de data als de afbeeldingen meeneemt.

![RealityScan](/img/realityscan.webp)

### Stap 3: Trainen met Brush

Nu komt het echte werk: het maken van de Gaussian Splat. Hiervoor gebruiken we **Brush**, een geweldige tool die je hier kunt vinden: [https://github.com/ArthurBrussee/brush](https://github.com/ArthurBrussee/brush).

1.  Open Brush.
2.  Laad je colmap data in.
3.  Start het trainen.

![Brush Training](/img/brush_training.webp)

**Performance tip:** Minder punten zorgt voor betere performance in de browser. Probeer een balans te vinden tussen kwaliteit en het aantal punten, zeker als je het op het web wilt tonen.

### Stap 4: Comprimeren

De laatste stap is het optimaliseren van je bestand. De output van Brush is een `.ply` bestand, dat behoorlijk groot kan zijn.

Om het geschikt te maken voor het web, comprimeren we het met **Splat transform**: [https://github.com/playcanvas/splat-transform](https://github.com/playcanvas/splat-transform).

Dit verkleint de bestandsgrootte aanzienlijk, waardoor je splat sneller laadt voor je bezoekers.

### Conclusie

En dat is het! Met deze vier stappen kun je van een simpele video naar een indrukwekkende 3D-weergave gaan. De tools worden steeds beter en toegankelijker, dus dit is het perfecte moment om te experimenteren met Gaussian Splatting.

Succes met splatten!
