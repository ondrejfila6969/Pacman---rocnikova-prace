<h2>14.10.2024</h2>
<p>Základní mapa je uložená ve formě JSON souboru a vyrenderovaná v canvasu</p>
<p>Hned na začátku jsem přidal inicializační soubor tsconfig.json (tsc --init), obrovskou výhodou je, že jakmile budu mít více typescriptových souborů, tak automaticky můžu kompilovat všechny najednou</p>
<p>tsc -w (watchmode)</p>

<h2>21.10.2024</h2>
<p>Jídlo pro Pacmana je vytvořené společně s mapou, pomocí ctx.ellipse()</p>
<p>Logika pro vykreslení je v podstatě stejná jako u mapy</p>
<p>Takhle momentálně vypadá mapa: </p>

<img src="https://github.com/user-attachments/assets/9811f803-afd5-4e8f-82e3-7ff54e8c08fb" alt="mapa" width="300" height="300">

<h2>26.10.2024</h2>
<p>Přidání herní smyčky, která se provádí podle FPS viz. dokumentace kódu</p>

<h2>29. 10. 2024</h2>
<p>Vytvoření Pacmana, coby objektu + vykreslení do mapy.</p>
<p>Dále byly vytvořeny koncové body (levý horní roh, pravý horní roh, levý dolní roh, pravý dolní roh) + ještě střed pacmana</p>
<p>Bude se to určitě do budoucna hodit kvůli pohybu, takhle momentálně vypadá Pacman s vyznačenými body: </p>
<img src="https://github.com/user-attachments/assets/96bfe026-df95-4fca-a49d-869e0c48b648" alt="pacman" width="150" height="150">

<h2>3.11. 2024</h2>
<p>Obyčejný pohyb pomocí W, A, S, D nebo šipek </p>
<p>Zatím nebere v potaz kolize se zdí</p>
