---
title: 'Lerp vs Easing'
description: 'De Juiste Keuze voor Soepele Animaties'
publish_date: '2025-05-14'
modify_date: '2025-05-14'
keywords: 'JavaScript, animation, coding'
header_image: '../../../assets/images/lerp_vs_easing.png'
---

Als je werkt met animaties, games of UI-transities, heb je vast gehoord van `lerp()` en easing-functies. Maar wanneer gebruik je welke? Laten we deze krachtige technieken ontrafelen.

## Wat is een Lerp?  
**Lerp** staat voor *Linear Interpolation*. Het is een wiskundige techniek om een waarde tussen twee punten te berekenen op basis van een verhouding (`t`). Simpel gezegd: "Geef me een punt dat X% van de weg ligt van A naar B."

```javascript
function lerp(start, end, t) {
  return start + (end - start) * t;
}

// Output: 0.5 (precies halverwege)
console.log(lerp(0, 1, 0.5)); 
```

## Wat is Easing?  
**Easing** regelt hoe een animatie versnelt of vertraagt. In plaats van lineaire beweging (lerp), kun je natuurlijkere effecten creëren zoals versnellen, vertragen of veren.

```javascript
function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

// Output: 0.75 (precies halverwege)
console.log(easeOutQuad(0.5)); 
```

## Waar is Lerp Perfect Voor?  
Het is geweldig voor bijvoorbeeld kleurtransities, als je een waarde tussen de 0 en 1 hebt, kan je een verloop maken aan de hand van een lerp door de `r`, `g` en `b` waardes te lerpen:  
```javascript
function colorLerp(color1, color2, t) {
  return {
    r: lerp(color1.r, color2.r, t),
    g: lerp(color1.g, color2.g, t),
    b: lerp(color1.b, color2.b, t)
  };
}

// Voorbeeld
const red = { r: 1, g: 0, b: 0 };
const blue = { r: 0, g: 0, b: 1 };
const purple = colorLerp(red, blue, 0.5);
console.log(purple); // { r: 0.5, g: 0, b: 0.5 }
```

## Het probleem met een `lerp()` in een update
Het ziet er elegant uit om met een enkele regel een vloeiende animatie te maken, maar het kan problemen opleveren.

Een `lerp()` pakt een fragment van een start en eind waarde, wat betekent dat het **nooit** het eind zal bereiken (wiskundige asymptoot). Hierdoor heb je geen controle over de duur van je animatie.

Stel je hebt een update methode die je elke frame runt:
```javascript
function animate() {
  box.style.top = lerp(current, target, 0.1) + 'px';
  requestAnimationFrame(animate);
}
animate();
```

<iframe class="codepen-embed" src="https://codepen.io/ZunCreative/embed/EajNjXM"></iframe>

Hier zie je dat tijdens het scrollen de waarde nooit het eindgetal wordt. Dit kan gevolgen hebben op performance, in dit geval blijft het element animeren terwijl het stil staat.

De makkelijkste oplossing hiervoor is het getal af te ronden voordat het toegepast word, in de achtergrond is de `current` waarde nog steeds hetzelfde, maar de toegepaste waarde bereikt het eindgetal dankzij een afronding naar boven.

<iframe class="codepen-embed" src="https://codepen.io/ZunCreative/embed/wBaoVKO"></iframe>

Als we het fundamentele probleem willen verhelpen, kunnen we niet meer telkens een fragment tot in de oneindigheid gebruiken. De oplossing: een vaste duratie van de animatie.
Wat we moeten doen om te kunnen werken met een vaste duratie moeten we:
1. Een animatie starten bij iedere scroll met `requestAnimationFrame`
2. De vorige animatie stoppen als die bestaat met `cancelAnimationFrame`
3. Met `performance.now()` de tijd voor de duratie bijhouden
4. De duratie bepalen op basis van de afstand en snelheid
5. Een minimale en maximale duratie vastleggen

<iframe class="codepen-embed" src="https://codepen.io/ZunCreative/embed/ZYGBgOW"></iframe>

Fijn, het werkt, we hebben superveel controle over de animatie, maar het is absoluut niet zo soepel als de `lerp()` van eerst, wat nu?

Hier komt *easing* in het spel.

1. In plaats van een `lerp()`, gebruiken we de easing functie `easeOutQuint()` over de `progress` variabele.
2. Deze `easedT` output vermenigvuldigen we met het verschil tussen de eind en start positie.

That's it!

<iframe class="codepen-embed" src="https://codepen.io/ZunCreative/embed/emNgOyj"></iframe>

Op (easings.net)[https://easings.net/] kan je allemaal easings outproberen om te kijken welke je het mooiste vind door de `easeOutQuint()` vervangen.

## Conclusie  
Lerp en easing zijn beide krachtige tools voor animaties, maar ze hebben elk hun eigen toepassingen en beperkingen. 

Lerp is ideaal voor eenvoudige, lineaire interpolaties zoals kleurtransities, terwijl easing zorgt voor meer natuurlijke bewegingen die versnellen en vertragen bij een vaste duratie. 

Het is belangrijk om de juiste techniek te kiezen op basis van je behoeften en om rekening te houden met de beperkingen van lerp, zoals het asymptotische gedrag. Door beide technieken te combineren, kun je animaties maken die zowel soepel als gecontroleerd zijn, waardoor je projecten een professionele uitstraling krijgen.
