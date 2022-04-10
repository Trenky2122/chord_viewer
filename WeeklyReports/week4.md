
# Týždenný report - Týždeň 4

## Peter Trenčanský - Zobrazovač akordov

### Pôvodný plán

1. Výpočet tone key z názvu akordu pre možné odprezentovanie v betaverzii, následné prepojenie so zatiaľ fungujúcimi zobrazovačmi.
2. Zobrazovač klaviatúry implementujúci zaužívané rozhranie.

### Splnené ciele


1. Prerobená identity aby nevyužívalo MS Identity framework - bd1dca69ebe05f5277758273fe055677bd0b0d18
2. Pridaný generický base model controller - f52f53ba567f6bc00d74696242ad7cb5144da0fb
3. Implementovaný zobrazovač názvu akordu - 52a18578136c67b7884fe1ddc02123b9e7e1d50f, 8c45b852bcfa1b7f17b324431155c6c6d1c007be
4. Implementované prepojenie backendu a frontendu, login a logout - 178a80604a941c69292bfb3c6874d5979896050a
5. Pokus o deployment na Azure cloud

### Zdôvodnenie rozdielov oproti pôvodnému plánu

Prerobil som Identity, pretože som konečne zistil ako sa má robiť tak, ako som ju chcel pôvodne robiť. Pridal som generický base model controller pre zamedzenie zbytočnému opakovaniu kódu. Implementoval som login, pretože som zistil, že je to nutné pre beta verziu projektu.

### Riešené problémy

Deployment na Azure cloud. Bug v knižnici Vex Flow s nesprávnymi predznamenaniami.

Projektu bolo dovedna venovaných 19 hodín čistého času.

### Plány na najbližší týždeň

1. Zobrazovač klaviatúry implementujúci zaužívané rozhranie. 
