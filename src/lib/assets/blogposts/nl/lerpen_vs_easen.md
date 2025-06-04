---
title: 'Lerp vs Easing'
description: 'De Juiste Keuze voor Soepele Animaties'
publish_date: '2025-05-28'
modify_date: '2025-05-28'
keywords: 'JavaScript, animation, coding'
header_image: '/images/lerp_vs_easing.png'
---

<script>
import CodePenEmbed from '$lib/utils/CodePenEmbed.svelte'
</script>

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
```typescript
function animate() {
  box.style.top = lerp(current, target, 0.1) + 'px';
  requestAnimationFrame(animate);
}
animate();
```
<CodePenEmbed 
  slugHash="EajNjXM"
  penTitle="Lerp vs Easing 1"
  user="ZunCreative"
/>
Hier zie je dat tijdens het scrollen de waarde nooit het eindgetal wordt. Dit kan gevolgen hebben op performance, in dit geval blijft het element animeren terwijl het stil staat.

-- oplossing lerp volgt -- 

-- ease volgt -- 
