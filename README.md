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
  
