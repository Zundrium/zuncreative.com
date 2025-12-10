---
title: '2D punten matrix met BabylonJS'
description: 'Een CPU gefocuste oplossing voor het maken van een 2D puntenmatrix'
publish_date: '2025-05-20'
modify_date: '2025-05-20'
keywords: 'babylonjs, 2D matrix, dots, SolidParticleSystem'
header_image: '../../../assets/images/2d_matrix.png'
header_image_position: right
---

In dit artikel bouwen we stap voor stap een simpele, geanimeerde 3D-matrix. We laten alle complexe zaken zoals texturen en verschillende states achterwege. We focussen ons op de kern: een grid van punten en een mooie, golvende animatie met een simpele wiskundige functie.

**Wat gaan we bouwen?**
Een plat vlak van duizenden puntjes dat tot leven komt met een zachte, golvende beweging, volledig in 3D.

<iframe class="babylonjs-embed" src="https://playground.babylonjs.com/#MKRY0F"></iframe>

[Link naar de playground](https://playground.babylonjs.com/#MKRY0F)

#### Voordat we Beginnen: De Setup

Zorg ervoor dat je een basisproject hebt opgezet met Babylon.js. Het enige wat je nodig hebt is een `index.html` met een `<canvas>`-element en een JavaScript- of TypeScript-bestand waarin je de Babylon.js-packages importeert.

Installeer de benodigde packages:
```bash
npm install @babylonjs/core
```

Je HTML-bestand is minimaal:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Babylon.js Dot Matrix</title>
    <style>
        html, body {
            overflow: hidden;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            touch-action: none;
        }
        #renderCanvas {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <canvas id="renderCanvas"></canvas>
    <script src="jouw-script.js"></script> 
</body>
</html>
```

### Stap 1: De Scene Opzetten

Elk Babylon.js-project begint met een `Engine`, een `Scene` en een `Camera`. We maken een simpel script dat dit voor ons regelt.

```typescript
// Importeer de benodigde klassen
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import "@babylonjs/core/Loading/loadingScreen"; // Nodig voor de laadschermen

// Pak het canvas element uit de HTML
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

// Maak de Babylon.js engine
const engine = new Engine(canvas, true);

// Maak een functie om de scene te creëren
const createScene = (): Scene => {
    const scene = new Scene(engine);

    // Maak een camera en positioneer deze
    const camera = new FreeCamera("camera1", new Vector3(0, 1.5, -4), scene);
    camera.attachControl(canvas, true);

    // Hier voegen we straks onze dot matrix toe!

    return scene;
};

// Maak de scene
const scene = createScene();

// Start de render loop
engine.runRenderLoop(() => {
    scene.render();
});

// Zorg dat de engine zich aanpast aan het vensterformaat
window.addEventListener("resize", () => {
    engine.resize();
});
```

Als je dit uitvoert, zie je een leeg, donkerblauw scherm. Perfect! Onze 3D-wereld is klaar om gevuld te worden.

### Stap 2: De Puntjeswolk (PointsCloudSystem)

Om duizenden punten efficiënt te tekenen, gebruiken we de `PointsCloudSystem` (PCS) van Babylon.js. Dit is een object dat speciaal is ontworpen om grote hoeveelheden deeltjes te beheren zonder de performance te kelderen.

Laten we de PCS aan onze `createScene`-functie toevoegen.

```typescript
// Voeg deze imports toe bovenaan je bestand
import { PointsCloudSystem } from "@babylonjs/core/Particles/pointsCloudSystem";
import type { CloudPoint } from "@babylonjs/core/Particles";

// ... in je `createScene` functie ...

// --- CONFIGURATIE ---
const particleCount = 20000; // Hoeveel puntjes willen we?
const matrixSize = 3;       // Hoe groot is ons grid?
// --- EINDE CONFIGURATIE ---

// Maak de PointsCloudSystem
const pcs = new PointsCloudSystem("pcs", 3, scene); // De '3' is de grootte van de deeltjes

// Functie om de positie van een deeltje te berekenen
const initializeParticle = (particle: CloudPoint) => {
    // We willen de deeltjes in een vierkant grid plaatsen.
    // Hiervoor berekenen we 'genormaliseerde' coördinaten (u, v) die van 0 tot 1 gaan.
    const columns = Math.ceil(Math.sqrt(particleCount));
    const u = (particle.idx % columns) / (columns - 1);
    const v = Math.floor(particle.idx / columns) / (columns - 1);

    // Converteer de (u, v) coördinaten naar 3D-posities
    particle.position.x = u * matrixSize - matrixSize * 0.5;
    particle.position.y = 0; // Begin plat op de y-as
    particle.position.z = v * matrixSize - matrixSize * 0.5;
};

// Voeg de deeltjes toe aan de PCS met onze initialisatiefunctie
pcs.addPoints(particleCount, initializeParticle);

// Bouw de mesh zodat de deeltjes zichtbaar worden
pcs.buildMeshAsync();
```

Wat gebeurt hier?
1.  We maken een `PointsCloudSystem`.
2.  We definiëren een functie `initializeParticle` die voor elk deeltje één keer wordt uitgevoerd.
3.  In die functie berekenen we `u` en `v` coördinaten. Zie dit als de X en Y op een 2D-plaatje, maar dan voor ons grid. Ze lopen van 0.0 tot 1.0. Dit maakt de volgende stap (animatie) veel makkelijker.
4.  We plaatsen elk deeltje op zijn `(x, y, z)`-positie. De `y`-waarde is 0, dus ze vormen een perfect plat vlak.
5.  `pcs.addPoints` creëert de deeltjes en `pcs.buildMeshAsync` zorgt ervoor dat ze getekend worden.

Als je de code nu uitvoert, zie je een plat, statisch vierkant van puntjes. Tijd voor de magie!

### Stap 3: Breng het tot Leven met een Sinusgolf

Animatie in de PCS werkt door een speciale functie te definiëren: `pcs.updateParticle`. Deze functie wordt voor **elk deeltje, elke frame** uitgevoerd. Hier kunnen we de positie (en kleur) van de deeltjes aanpassen.

We gaan de `y`-positie van elk deeltje aanpassen met `Math.sin()`.

```typescript
// ... in je `createScene` functie, na het aanmaken van de PCS ...

let elapsedTime = 0;
scene.onBeforeRenderObservable.add(() => {
    elapsedTime += engine.getDeltaTime() / 1000;
    // Vertel de PCS dat het de deeltjes moet bijwerken voor de volgende frame
    pcs.setParticles();
});

// Definieer de update-logica voor de deeltjes
pcs.updateParticle = (particle) => {
    // Pak dezelfde (u, v) coördinaten als bij de initialisatie
    const columns = Math.ceil(Math.sqrt(particleCount));
    const u = (particle.idx % columns) / (columns - 1) - 0.5; // -0.5 om het midden op 0,0 te krijgen
    const v = Math.floor(particle.idx / columns) / (columns - 1) - 0.5; // -0.5 om het midden op 0,0 te krijgen

    // --- DE MAGIE VAN DE SINUSGOLF ---
    // Bereken de afstand van het deeltje tot het centrum van de matrix
    const distance = Math.sqrt(u * u + v * v);

    // Bereken de hoogte (y-positie) met een sinusgolf
    // - `distance * 10`: Creëert ringen. Verander '10' om de golven breder/smaller te maken.
    // - `elapsedTime * 2`: Zorgt dat de golf animeert over tijd. Verander '2' voor de snelheid.
    const waveHeight = Math.sin(distance * 10 - elapsedTime * 2);

    // Update de y-positie van het deeltje
    particle.position.y = waveHeight * 0.2; // * 0.2 is de amplitude (hoogte) van de golf
    
    return particle;
};
```

Analyse van de `updateParticle` functie:
1.  We berekenen opnieuw de `u` en `v` coördinaten, maar trekken er nu 0.5 af. Hierdoor ligt het coördinatensysteem in het midden `(0,0)`, wat handig is voor effecten die vanuit het centrum komen.
2.  We berekenen de `distance` van het deeltje tot dit centrum met de stelling van Pythagoras.
3.  We gebruiken `Math.sin()` met deze afstand en de `elapsedTime`. Dit creëert een rimpel-effect dat vanuit het midden naar buiten beweegt.
4.  We updaten `particle.position.y` met het resultaat.

We hebben ook een `elapsedTime` variabele toegevoegd die in de `scene.onBeforeRenderObservable` wordt bijgewerkt. Dit is onze "klok" voor de animatie. `pcs.setParticles()` triggert de `updateParticle` functie voor alle deeltjes.

### Stap 4: Een Kleurtje Geven

Een witte golf is mooi, maar een gekleurde golf is nog mooier! We kunnen de kleur van elk deeltje aanpassen op basis van zijn hoogte. Hoge pieken krijgen een andere kleur dan diepe dalen.

Voeg bovenaan je script de `Color4`-import toe:
```typescript
import { Color4 } from "@babylonjs/core/Maths/math.color";
```

En pas de `updateParticle`-functie aan:

```typescript
// ... in de `pcs.updateParticle` functie ...

// (Na het berekenen van `waveHeight`)

// Update de y-positie
particle.position.y = waveHeight * 0.2;

// --- KLEUR LOGICA ---
// De sinusgolf gaat van -1 naar 1. We converteren dit naar een 0 tot 1 range.
const normalizedHeight = (waveHeight + 1) / 2; // Nu van 0 (dal) naar 1 (piek)

// Definieer een start- en eindkleur
const bottomColor = { r: 0.5, g: 0, b: 1 }; // Paars
const topColor = { r: 1, g: 0.5, b: 0 };  // Oranje

// Interpoleren tussen de twee kleuren
// particle.color is een Color4 (r, g, b, alpha)
if (!particle.color) particle.color = new Color4(0, 0, 0, 1);

particle.color.r = bottomColor.r + (topColor.r - bottomColor.r) * normalizedHeight;
particle.color.g = bottomColor.g + (topColor.g - bottomColor.g) * normalizedHeight;
particle.color.b = bottomColor.b + (topColor.b - bottomColor.b) * normalizedHeight;

return particle;
```

Nu zal elk deeltje een kleur krijgen die soepel overloopt van paars (in de dalen) naar oranje (op de pieken).

### Conclusie en Volgende Stappen

Gefeliciteerd! Je hebt een prachtige, geanimeerde 3D dot matrix gemaakt met maar een paar regels Babylon.js-logica. Je hebt de basisprincipes geleerd van de `PointsCloudSystem`, het positioneren van deeltjes in een grid en het animeren ervan met een simpele wiskundige functie.

Wat kun je nu proberen?
*   **Speel met de getallen:** Verander de `particleCount`, `matrixSize`, of de getallen in de `Math.sin()`-functie. Wat gebeurt er als je de frequentie (`* 10`) of de snelheid (`* 2`) aanpast?
*   **Andere golven:** Vervang `distance` door `u` of `v` om golven te krijgen die in één richting bewegen. Of combineer meerdere `sin()`-functies voor complexere patronen.
*   **Andere kleuren:** Kies je eigen `topColor` en `bottomColor` voor een unieke look.

Nu je deze basis begrijpt, kun je je voorstellen hoe de complexere versie uit je originele code werkte: in plaats van een simpele `Math.sin()` waarde, las die code de helderheid van een pixel uit een afbeelding om de hoogte te bepalen. Maar de onderliggende structuur is precies hetzelfde!

Happy coding
