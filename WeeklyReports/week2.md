
# Týždenný report - Týždeň 2

## Peter Trenčanský - Zobrazovač akordov

### Pôvodný plán

1. Vytvoriť základné controllery
2. Vyčistiť vygenerovaný frontendový projekt
3. Vytvoriť jednotné rozhranie pre všetky zobrazovače

### Splnené ciele

1. Vytvorené základné controllery
2. Pridaný SwaggerUI pre testovanie endpointov
3. Vytvorené IdentityStores pre správne fungovanie Identity vo .NET
4. Vyčistený vygenerovaný frontendový projekt
5. Vytvorené jednotné rozhranie pre všetky zobrazovače

### Zdôvodnenie rozdielov oproti pôvodnému plánu

Pridal som SwaggerUI pretože som zvyknutý ho využívať na testovanie endpointov.  
vytvoril som UserStore a RoleStore, pretože mi bez nich nefungoval Swagger

### Riešené problémy

Vytvoril som UserStore a RoleStore ktoré sú nutné pre fungovanie identity v .NET. Mockujú niektoré veci, ktoré .NET pri identite vyžaduje, pretože ich vyždovanie v tomto projekte nepovažujem za nutné (ako napríklad email používateľa).

Projektu bolo dovedna venovaných 8 hodín čistého času.

### Plány na najbližší týždeň

1. Prepis frontendového projektu do TypeScriptu
2. Implementovať zobrazovač notovej osnovy pomocou canvasu. Zobrazovač bude implementovať rozhranie bytvorené v tomto týždni.
