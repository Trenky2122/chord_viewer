
# Týždenný report - Týždeň 3

## Peter Trenčanský - Zobrazovač akordov

### Pôvodný plán

1. Prepis frontendového projektu do TypeScriptu.  
2. Implementovať zobrazovač notovej osnovy pomocou canvasu. 

### Splnené ciele


1. Prepísaný frontendový projekt do TypeScriptu - a4516525b2aa74640dfb6f15cd3f860ab714318c
2. Implementovný zobrazovač notovej osnovy pomocou canvasu. - a4516525b2aa74640dfb6f15cd3f860ab714318c
3. Implementovaný wraper na všetky zobrazovače - a4516525b2aa74640dfb6f15cd3f860ab714318c
4. Zobrazovač notovej osnovy reimplementovaný pomocou knižnce WexFlow - e6390f9d007abef45ad905435c1030aefa9b35ca

### Zdôvodnenie rozdielov oproti pôvodnému plánu

Implementoval som wrapper na zobrazovače kvôli jednoduchému zapojeniu v rámci React componentov.
Pri hľadaní inšpirácie ako nakresliť husľový kľúč na canvas som objavil knižnicu wex flow, ktorá celý zápis nôt v JavaScripte robí oveľa jednoduchší a výsledok je krajší, preto som riešenie prepísal použitím danej knižnice.

### Riešené problémy

Výpočet nôt z tone key. Výpočet polohy noty na canvase (neskôr irelevantné, knižnica to rieši za mňa). Výroba tsconfig súboru a riešenie problémov v spojitosti s tým.

Projektu bolo dovedna venovaných 11 hodín čistého času.

### Plány na najbližší týždeň

1. Výpočet tone key z názvu akordu pre možné odprezentovanie v betaverzii, následné prepojenie so zatiaľ fungujúcimi zobrazovačmi.
2. Zobrazovač klaviatúry implementujúci zaužívané rozhranie.
