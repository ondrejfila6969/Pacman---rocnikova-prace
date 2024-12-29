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

