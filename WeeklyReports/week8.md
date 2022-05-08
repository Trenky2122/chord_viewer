
# Týždenný report - Týždeň 8

## Peter Trenčanský - Zobrazovač akordov

### Pôvodný plán

1. Kolekcie - tvorba a napĺňanie
2. Prehrávač midi
3. Upraviť rozloženie pre dobré používanie
4. Vylepšiť dizajn pre finálnu verziu
5. Úprava kódu pred finálnou verziou

### Splnené ciele

1. Kolekcie - tvorba a napĺňanie - implementované
2. Sign up stránka
3. Prehrávač midi - implementované
4. Upraviť rozloženie pre dobré používanie - implementované 
5. Vylepšiť dizajn pre finálnu verziu - implementované
6. Úprava kódu pred finálnou verziou - implementované

### Zdôvodnenie rozdielov oproti pôvodnému plánu

Pri tvorbe minulotýždňového reportu som zabudol, že nemám hotovú Sign up page.

Projektu bolo dovedna venovaných 52 hodín čistého času.

### Riešené problémy

Problém so samoprepisovaním pri použití context dependency v useEffect. 

## Celkové zhrnutie

[trencansky.com](https://trencansky.com) - verejná inštancia

### Plánované neimplementované features

1. Kópia zazdieľanej kolekcie - kvôli iným problémom som toto nestihol implementovať

### Najväčšie problémy

Najväčšie problémy som mal pri prvých deploymentoch, trvalo mi to veľmi dlho a stále to nefunguje podľa mojich predstáv. Tiež som póvodne dúfal, že sa mi podarí vytvoriť viac okulahodiaci dizajn. Taktiež som dlho riešil problémy s Microsoft Identity Frameworkom, čo vyústilo do toho, že som prepisoval časť kódu tak, aby ho nepoužíval.

### Čo by som urobil inak

Nezačal by som skúšať pracovať s MS Identity Frameworkom. Použil by som MS SQL databázu pre jednoduchší deployment. 

### Výstup z cloc

Pôvodný commit
```
------------------------------------------------------------------------------------
Language                          files          blank        comment           code
------------------------------------------------------------------------------------
JSON                                  8              0              0          38028
Markdown                              1            693              0           1535
JavaScript                           22            151            102           1029
C#                                    9            170              4            746
C# Designer                           1            104              1            314
Razor                                 3              5              0             60
MSBuild script                        1              6              4             49
CSS                                   2              4              1             27
Visual Studio Solution                1              1              1             23
HTML                                  1              3             20             18
------------------------------------------------------------------------------------
SUM:                                 49           1137            133          41829
------------------------------------------------------------------------------------
```
Posledný commit
```
------------------------------------------------------------------------------------
Language                          files          blank        comment           code
------------------------------------------------------------------------------------
JSON                                 12              0              0          39061
TypeScript                           22            144              5           2057
Markdown                             10            811              0           1694
C#                                   19            203             18           1231
C# Designer                           3            251              3            682
JavaScript                            9             46             66            286
MSBuild script                        1              6              4             60
CSS                                   2             11              1             50
YAML                                  1             11              2             44
XML                                   4              0              0             32
Visual Studio Solution                1              1              1             23
HTML                                  1              3             20             18
------------------------------------------------------------------------------------
SUM:                                 85           1487            120          45238
------------------------------------------------------------------------------------
```

