# 🖐️ 1+1 Hand Game

[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://owen-liuyuxuan.github.io/one_plus_one/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Language](https://img.shields.io/badge/languages-EN%20%7C%20中文-orange)](README.md)

[English](README.md) | [中文](README_zh.md)

A classic childhood strategy game brought to the web! Challenge your friends or test your skills against the computer in this engaging two-hand number game.


## 🚀 Play Online

**[Play Now!](https://owen-liuyuxuan.github.io/one_plus_one/)**

No installation required - just open in your browser and start playing!


## 🎮 Game Overview

**1+1 Hand Game** (also known as "Finger Game" or "Number Hands") is a traditional two-player strategy game where players use numbers on their hands to outmaneuver their opponent. The goal is simple: get both of your hands **finished** (showing ✗) to win before your opponent's hands are finished.

## 🎯 Game Rules

### Basic Setup
- Both players start with **[1, 1]** on their two hands
- Players take turns making moves
- Each hand displays a number from 1-9, or ✗ when finished

### How to Play

1. **Select Your Hand**: On your turn, click one of your active hands (not ✗)
2. **Choose Target**: Click one of your opponent's active hands
3. **Addition**: The opponent's hand value is added to your selected hand
4. **Special Rules**:
   - If result **= 10**: That hand is **finished** (shows ✗)
   - If result **> 10**: Hand value **resets to 1**
   - If result **< 10**: Hand keeps the new value

### Winning Condition
**Finish both of your hands** (both showing ✗) to win!

### Strategy Tips 💡
- Plan ahead: Consider how your move affects future possibilities
- Force difficult choices: Put your opponent in positions with no good moves
- Protect your hands: Don't let opponent's both hands get close to 10
- Use the reset rule: Sometimes going over 10 (resetting to 1) is advantageous

## ✨ Features

### 🎲 Two Game Modes
- **Two Players (PvP)**: Play locally with a friend on the same device
- **vs Computer (PvC)**: Challenge the AI in single-player mode
  - Choose to play first or second
  - **Six AI Difficulty Levels**:
    - **Random**: Makes completely random valid moves
    - **Greedy**: Chooses moves with the best immediate outcome
    - **Smart**: Looks ahead 1-2 moves with strategic heuristics
    - **Expert**: Uses variable 3-6 ply minimax with alpha-beta pruning for unpredictable gameplay
    - **Master**: Advanced variable 6-12 ply minimax for serious challenges with dynamic depth
    - **Perfect**: Near-perfect play with deep 30-ply search

### 🌐 Bilingual Support
- **English** and **中文 (Chinese)** language options
- Instant language switching
- All UI elements fully translated

### 🎨 Beautiful Interface
- Modern gradient design with smooth animations
- Intuitive visual feedback for all actions
- Responsive layout for mobile and desktop
- Clear status messages guide you through each turn

### 🏆 Game Features
- Winner celebration with animated badges
- Victory modal with confetti effect
- New game and restart options
- Built-in rules reference

## 💻 Local Development

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Owen-Liuyuxuan/one_plus_one.git
   cd one_plus_one
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   ```

That's it! No build process or dependencies needed.

## 📦 Deployment

### GitHub Pages

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/Owen-Liuyuxuan/one_plus_one.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository **Settings** → **Pages**
   - Select **main** branch as source
   - Click **Save**
   - Your game will be live at `https://owen-liuyuxuan.github.io/one_plus_one/`

### Other Hosting Options
- **Netlify**: Drag and drop `index.html`
- **Vercel**: Import from GitHub
- **Any static hosting**: Upload `index.html`

### Example Game Sequence
```
Start:     P1[1,1] vs P2[1,1]
P1 moves:  P1[2,1] vs P2[1,1]  (P1 adds P2's 1 to own hand)
P2 moves:  P1[2,1] vs P2[3,1]  (P2 adds P1's 2 to own hand)
P1 moves:  P1[5,1] vs P2[3,1]  (P1 adds P2's 3 to own hand)
...
```


## 📱 Browser Compatibility

Works on all modern browsers:
- ✅ Chrome/Edge (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)


## 🙏 Acknowledgments

- Inspired by the classic childhood game played in GY

## 📞 Contact

- **Author**: Owen
- **GitHub**: [@Owen-Liuyuxuan](https://github.com/Owen-Liuyuxuan)
- **Issues**: [Report a bug](https://github.com/Owen-Liuyuxuan/one_plus_one/issues)

---

<p align="center">
  Made with ❤️ for nostalgic gamers everywhere
</p>

<p align="center">
  <a href="#-11-hand-game">Back to Top ⬆️</a>
</p>
