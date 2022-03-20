
# Týždenný report - Týždeň 1

## Peter Trenčanský - Zobrazovač akordov

### Pôvodný plán

1. Vytvoriť projekt pre serverovú časť
2. Spojazdniť spojenie s databázou
3. Vytvoriť modely znázorňujúce databázové tabuľky a pomocou Entity Framework z nich vygenerovať tabuľky
4. Vytvoriť väčšinu API controllerov

### Splnené ciele

1. Vytvorený projekt pre serverovú aj front-endovú časť
2. Spojazdnené spojenie s databázou
3. Vytvorené modely znázorňujúce databázové tabuľky a pomocou Entity Framework z nich vygenerované tabuľky

### Zdôvodnenie rozdielov oproti pôvodnému plánu

Vytvoril som naraz obe časti projektu vďaka templatu pre Visual Studio, ktoré vytvorilo oba projekty a vzájomne ich prepojilo.  
Nestihol som vytvoriť API controllery, lebo som neodhadol správne čas potrebný na spojazdnenie spojenia s databázou a vytvorenie projektu z vhodného templatu.

### Riešené problémy

Pôvodne som chcel použiť template, ktorý mi vygeneruje aj Autorizáciu. Tento template využíval predpracované triedy pre identitu. To spôsobilo, že sa mi vygenerovala trieda pre používateľa, ktorá dedila od Triedy IdentityUser. To malo za následok vygenerovanie veľkého množstva atribútov do tabuľky navyše. Tiež toto dedenie nebolo možné jednoducho odstrániť, pretože bolo nutné mať takúto triedu pri registrácií identity. Nakoniec som to vyriešil odstránením tohto dedenia aj póvodne vygenerovaného Identity systému, ktorý bude dorobený ručne neskôr.

Projektu bolo dovedna venovaných 5 hodín čistého času.

### Plány na najbližší týždeň

1. Vytvoriť základné controllery
2. Vyčistiť vygenerovaný frontendový projekt
3. Vytvoriť jednotné rozhranie pre všetky zobrazovače