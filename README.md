# Ročníková práce

## 🗓️ 14.10.2024
- Základní mapa je uložená ve formě JSON souboru a vyrenderovaná v canvasu.
- Přidal jsem inicializační soubor `tsconfig.json` (pomocí `tsc --init`). Obrovskou výhodou je, že jakmile budu mít více TypeScriptových souborů, můžu je automaticky kompilovat všechny najednou.
- Spuštění v režimu sledování: `tsc -w`.

---

## 🗓️ 21.10.2024
- Jídlo pro Pacmana je vytvořeno společně s mapou, pomocí `ctx.ellipse()`.
- Logika pro vykreslení je v podstatě stejná jako u mapy.

Takhle momentálně vypadá mapa:

![Mapa](https://github.com/user-attachments/assets/9811f803-afd5-4e8f-82e3-7ff54e8c08fb)

---

## 🗓️ 26.10.2024
- Přidání herní smyčky, která se provádí podle FPS (frames per second). Viz dokumentace kódu pro podrobnosti.

---

## 🗓️ 29.10.2024
- Vytvoření Pacmana jako objektu a jeho vykreslení do mapy.
- Vytvořeny koncové body: levý horní roh, pravý horní roh, levý dolní roh, pravý dolní roh a střed Pacmana, které se budou hodit pro pohyb v budoucnu.

Takhle momentálně vypadá Pacman s vyznačenými body:

![Pacman](https://github.com/user-attachments/assets/96bfe026-df95-4fca-a49d-869e0c48b648)

---

## 🗓️ 03.11.2024
- Obyčejný pohyb pomocí W, A, S, D nebo šipek.
- Zatím nebere v potaz kolize se zdí.

---

## 🗓️ 25.12.2024
- Po dlouhé přestávce pokračuji v práci (ani během svátků si nedopřeji odpočinek! 😊).
- Pacman se momentálně dokáže plynule pohybovat po mapě, vyřešená logika ohledně narážení do zdi při stiknutí klávesy pro změnu směru.
- Zítra již Pacman bude moct jíst jídlo a sbírat skóre.

---

## 🗓️ 26.12.2024
- Pacman nyní dokáže sbírat skóre, logika je dost podobná kolizím se zdí.
- Herní smyčka je vylepšená a přidání `h2` tagu pro ukládání stavu hry.

![Vylepšená mapa](https://github.com/user-attachments/assets/16c2e7aa-0e8a-4dd6-8645-eb0a38bf7491)

---

## 🗓️ 29.12.2024
- Lepší organizace kódu, vytvoření abstraktní třídy pro třídu Pacman.
- Abstraktní třída slouží jako šablona, co by daná třída měla obsahovat, a zároveň díky tomu nemusím mít zahlcený konstruktor v třídě Pacman.

---

## 🗓️ 4.1.2025
- Vytvoření třídy Ghost + vykreslení 4 základních duchů, které jsou v originální hře (Inky, Blinky, Pinky, Clyde)
  
![Ghosti](https://github.com/user-attachments/assets/b389c00b-69ef-4b2c-afdd-8878387348dd)

## 🗓️ 3.2.2025
- Příprava na pohyb ducha, zatím to funguje tak, že duch se posouvá doprava, dokud nenarazí na zeď
- Metoda na zachycení kolize se zdí funguje na způsob toho, že získám index na mapě daného rohu a porovnávám, jestli se nachází na poli s číslem 1 nebo ne

![before](https://github.com/user-attachments/assets/633af69a-8df5-4d33-8f6d-621606b5e7b3)
![after](https://github.com/user-attachments/assets/9e4e2b15-d3fb-4be4-96f2-c93f4f0830e8)
- Na druhém obrázku se duchové samozřejmě překrývají, jsou tam všichni 4, nikdo nezmizel :)

## 🗓️ 15.2.2025
- Přidaný výpočet pro vzdálenost pacmana od ducha  => Pythagorova věta (pravoúhlý trojúhelník), jakmile se pacman objeví poblíž ducha v rozmezí 5 bloků, začne na něj útočit / pronásledovat ho, ale to ještě není
- Přidané 2 metody získávající souřadnice jejich středů pro tento výpočet
- Duchové náhodně mění směr, je-li pacman daleko od nich (to je zatím účel)
  
![img3](https://github.com/user-attachments/assets/675b323e-f978-4103-a411-00d68c5d6f96)

## 🗓️ 16.2.2025
- Malý update
- Lepší organizace kódu, vytvoření abstraktní třídy pro třídu Ghost, stejně jako v minulosti pro třídu Pacman + zformátování

## 🗓️ 22.2.2025
- Zlepšení náhodného pohybu, duchové se odteď pohybují spíše jiným směrem, než opačným (když se pohybují doprava, tak například zvolí nahoru nebo dolu), důkazem toho je, že duchové se nyní pohybují ve své základně v kruhu
- Pacman se nyní může teleportovat - teleport bude nejspíš pouze na této první mapě
- Menší úprava mapy
- Změna rozměrů canvasu tak, aby rozměry jednoho bloku byl dokonalý čtverec 24x24, ale díky CSS to nejde poznat
- Zítra už se bude pracovat na algoritmu pro vyhledání nejideálnější cesty k Pacmanovi + chycení Pacmana => životy
- Mále bych ještě zapomněl, vylepšená metoda moveGhost, která řeší i zastavení ducha najednou

## 🗓️ 23.2.2025
- Vytvořen algoritmus pro hledání nejideálnější cesty k Pacmanovi, nazývá se A* algoritmus a vychází z Dijkstrova algoritmu
- Dijkstrův algoritmus se například používá v oblasti počítačových sítí v routovacím protokolu OSPF, kde se neřeší vzdálenost, ale také "kvalita / výhodnost" té trasy
- To stejné platí i v tomto případě, A* algoritmus narozdíl od Dijkstrova algoritmu používá Heuristickou funkci, nebo také Manhattanovu vzdálenost, která odhaduje zbývající vzdálenost k cílovému bodu a která je užitečná v 2D grafech
- Zároveň je to také užitečné pro dynamické pronásledování Pacmana
- Menší úprava v metodách získávající souřadnice jednotlivých rohů - vynásobením 0.9 u daných souřadnic došlo k tomu, že duchové se můžou pohybovat náhodně po celé mapě, předtím to bylo možné pouze v základně

P.S. Jestli v následující době dojde k jakémukoliv problému, tak na to řeknu snad jedině tohle: 
![bug-feature](https://github.com/user-attachments/assets/b85c41a8-6612-46d0-9dcc-32f3926dcddf)

## 🗓️ 25.2.2025
- Přidání 4 originálních map do hry (celkem jich je 5)
- Přidání způsob spawnování duchů pro příslušnou mapu (např. na druhé mapě bude mít počáteční souřadnice jiné než na třetí mapě atd...)

<p align="center">
  <img src="https://github.com/user-attachments/assets/25cf06b2-6f2b-4e9e-ae6b-abb2128e590a" width="300" height="300">
  <img src="https://github.com/user-attachments/assets/d71cd027-e113-4a2a-ac09-1c05aa3a56cf" width="300" height="300">
  <br>
  <img src="https://github.com/user-attachments/assets/242ee48d-77b6-4ddf-a537-34a538694abb" width="300" height="300">
  <img src="https://github.com/user-attachments/assets/8d7d2747-1438-4ea1-a3f2-fe941f820391" width="300" height="300">
</p>

## 🗓️ 26.2.2025
- Duchové nyní dokážou pacmana chytit, uberou mu život, přidání HTML elementu pro zobrazení životů pacmana
- Zítra bude na pořadu dne stylování v CSS + dodělání toho, že uživatel nebude moct hrát, bude-li mít 0 životů

## 🗓️ 27.2.2025
- Pacman dokáže po požití speciální schopnosti chytat duchy po dobu 5 sekund
- Využití logiky A* algoritmu, který jsem implementovat v poslední době, kdy byl přidán i scénář pro duchy ve frightened modu
- Chytí-li ducha, tak ten daný duch se vrátí zpět na své počáteční souřadnice
- CSS zatím odloženo
![frightenedDuchove](https://github.com/user-attachments/assets/8849f95d-6d69-4a13-a215-b084a68c244e)

## 🗓️ 1.3.2025
- Necelé 2 měsíce do odevzdání
- Přidání teleportu pro duchy, dokáží se teleportovat stejně jako pacman
- Opravení pohybu pacmana, když jste drželi dlouze například šipku nahoru, tak se pacman pohybovat rychleji a rychleji (Nyní držení klávesy nemá na rychlost efekt)
- Změna struktury kodu do jednotlivých podsložek pro lepší organizaci
- Předchystané HTML, později bude následovat CSS
<img src="https://github.com/user-attachments/assets/cccad2d3-6434-4bc8-9f05-b4ab1cf45177" alt="structure" width="200" height="650">

## 🗓️ 2.3.2025
 - Hotové CSS + responzivita (možná bude třeba ještě responzivitu pozměnit)
 - Přidání úvodního menu
 - Dále bude potřeba vytvořit instructions pro uživatele
![menu](https://github.com/user-attachments/assets/a4da8876-2dcc-47ec-b1bf-63d4e7efe9fc)

## 🗓️ 13.3.2025
 - Instructions pro uživatele jsou hotové (jak HTML, tak CSS + napojení na TS)
 - Vyobrazení na konci hry skore, kterého hráč dosáhl
 - Úprava jednoho bodu zlomu v responzivitě (576px)
 - Zítra bude třeba vytvořit vlastní grafické návrhy pro hru, ať se vyhnu citacím

   ![dalsiukazka](https://github.com/user-attachments/assets/4a7a9069-b0b9-4240-9d66-f1249663bea3)
   ![dalsiukazka2](https://github.com/user-attachments/assets/5c00da20-3b49-4bfe-b6e6-cf00317322d6)

## 🗓️ 14.3.2025
 - Assety pro hru už jsou vlastní a vypracované, použil jsem editor Piskel, který je dostupný na těchto stránkách `https://www.piskelapp.com/`
 - Duchové mění obrázek podle směru, ve kterém se pohybují (chvílema se obrázky problikávaly, což bylo okem postřehnutelné, tento problém byl vyřešen intervalem, který běží každých 100 milisekund)
 - Zbývají už jenom tyto věci: Audio do pozadí (na tom se momentálně pracuje přes editor Suno, ale potřebuji si ještě něco ověřit)
 - Animace pusy pacmana, aby to bylo více fancy :)
 - A to je asi tak vše pro ročníkovou práci (DOUFÁM) <3 Pak už jenom psaníčko a prezentace k obhajobě

## 🗓️ 21.3.2025
- Vytvoření animace pro pacmanovu pusu, vypadá to realisticky jako v originální hře
- Do všeho musím dávat matiku pomooooc :( :( :(
- Zítra přidám audio a asi už začnu psát, ať se nestresuji na poslední chvíli <3
  
## 🗓️ 22.3.2025
- Přidání audia pro hru pomocí editoru SUNO
- Upravení jedné mapy a změna počátečních souřadnic pro jednoho ducha
- Tím pádem asi poslední hlavní commit před psací částí

## 🗓️ 6.4.2025
- Na 99.9% poslední update před odevzdáním písemné části a prezentace
- Změna fontu v projektu, čímž nyní neporušuji autorská práva
- Přizpůsobení responzivity pro nový font§
- Změněny 2 songy pro předposlední a poslední mapu

## 🗓️ 7.4.2025
 - Druhý díl skládačky hotový - hotová dokumentace
 - Teď už jen prezentace k obhajobě <3
   
 ## 🗓️ 21.4.2025
 - Týden do odevzdání, začíná se pracovat na prezentaci
 - Při kompletní analýze mého projektu jsem narazil na menší chybu: Když hráč sní speciální schopnost na konci dané úrovně, načte se nová mapa, začne nová úroveň, ale duchové nachviličku probliknou v canvasu
 - Tento problém byl odstraněn smazáním jediného řádku XDDDD

 ## 🗓️ 14.5.2025
 <h2>VÝSLEDNÉ HODNOCENÍ ROČNÍKOVKY</h2>
 <p>Praktická část - 1</p> 
 <p>Písemná část - 1</p>
 <p>Obhajoba - 1</p>
 <h5>Pravděpodobně dlouhodobka, ale ještě si nejsem jistý na 100%</h5>

![wisers-slow-clap](https://github.com/user-attachments/assets/04402397-0901-467b-a0a2-d2eeb34ebf20)
