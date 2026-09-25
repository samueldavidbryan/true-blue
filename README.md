# 🐟 True Blue

A fast ocean tapping game built with plain HTML, CSS and JavaScript. No frameworks and no installs.

Sea creatures pop up out of the waves. **Tap only the ones that are true blue!**

| Creature | What to do | Points |
|---|---|---|
| 🐟 🐳 🐬 🐋 | Tap them, they're true blue | +1 |
| 💎 | Rare, tap it fast | +3 |
| 🦀 🐙 🐡 🦞 | Don't tap, they're not blue | −2 |

You have 30 seconds, and the creatures get faster as your score goes up.

## Why this project exists

I made this to show my nephew, a beginner programmer, how to build and publish a real web app with [Claude Code](https://claude.com/claude-code). We described the game in plain English, and Claude Code wrote the code, set up the GitHub repo and published it to GitHub Pages. Everything is kept simple and heavily commented so a beginner can read every line, understand how it works, and start changing it.

## How to run it

Double-click `index.html` to open it in your browser. That's it!

## How the code is organized

| File | What it does |
|---|---|
| `index.html` | The **structure**: title, scoreboard, the 9 waves and the start and game-over screens |
| `style.css` | The **look**: colors, the ocean, and all the animations |
| `game.js` | The **brains**: timers, picking creatures, scoring |

`game.js` is split into 5 numbered sections. Start reading at the top!

## Things to try changing

1. **Make the game longer:** change `GAME_LENGTH` in `game.js`.
2. **Add new creatures:** add emojis to `BLUE_THINGS` or `NOT_BLUE_THINGS`.
3. **Make diamonds more common:** raise `DIAMOND_CHANCE`.
4. **Change the colors:** edit the colors at the top of `style.css` under `:root`.
5. **Challenge:** add a new rare creature worth +5 points.
