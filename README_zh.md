# 🖐️ 1+1 手指游戏

[![GitHub Pages](https://img.shields.io/badge/demo-在线演示-success)](https://owen-liuyuxuan.github.io/one_plus_one/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Language](https://img.shields.io/badge/languages-EN%20%7C%20中文-orange)](README.md)

[English](README.md) | [中文](README_zh.md)

经典童年策略游戏的网页版！与朋友对战或挑战电脑，体验这个引人入胜的双手数字游戏。

## 🚀 在线游玩

**[立即开始游戏！](https://owen-liuyuxuan.github.io/one_plus_one/)**

无需安装 - 只需在浏览器中打开即可开始游戏！

## 🎮 游戏简介

**1+1 手指游戏**（在我小时候就叫"1+1"）是一款双人策略游戏，玩家通过手上的数字来智胜对手。目标很简单：在对手之前让自己的两只手的数字到达10完成！

## 🎯 游戏规则

### 基本设置
- 双方玩家初始手势为 **[1, 1]**
- 玩家轮流进行操作
- 每只手显示 1-9 的数字，或赢时显示 ✗

### 游戏玩法

1. **选择你的手**：在你的回合，点击你的一只活跃的手（不是 ✗）
2. **选择目标**：点击对手的一只活跃的手
3. **加法运算**：对手手上的数字会加到你选择的手上
4. **特殊规则**：
   - 如果结果 **= 10**：该手被**退出**（显示 ✗）
   - 如果结果 **> 10**：手上的数字**重置为 1**
   - 如果结果 **< 10**：手保持新的数值

### 获胜条件
**退出自己的两只手**（都显示 ✗）即可获胜！

### 策略提示 💡
- 提前规划：考虑你的行动如何影响未来的可能性
- 制造困境：让对手陷入没有好选择的局面
- 保护你的手：不要让对手两只手都接近 10
- 利用重置规则：有时超过 10（重置为 1）反而有利

## ✨ 功能特色

### 🎲 两种游戏模式
- **双人对战 (PvP)**：在同一设备上与朋友本地对战
- **对战电脑 (PvC)**：单人模式挑战 AI
  - 可选择先手或后手
  - **六种 AI 难度等级**：
    - **随机**：完全随机的有效移动
    - **贪心**：选择即时效果最好的移动
    - **聪明**：使用1-2步前瞻和启发式策略
    - **专家**：使用3-6层可变深度极小化极大搜索和α-β剪枝，增加游戏不可预测性
    - **大师**：高级6-12层可变深度极小化极大搜索，挑战性极高且深度动态变化
    - **完美**：近乎完美的30层深度搜索玩法

### 🌐 双语支持
- **English** 和 **中文** 语言选项
- 即时语言切换
- 所有 UI 元素完全翻译

### 🎨 精美界面
- 现代渐变设计与流畅动画
- 所有操作的直观视觉反馈
- 响应式布局，支持移动端和桌面端
- 清晰的状态消息引导每个回合

### 🏆 游戏特性
- 获胜者庆祝动画徽章
- 胜利弹窗与特效
- 新游戏和重新开始选项
- 内置规则参考

## 💻 本地开发

### 快速开始

1. **克隆仓库**
   ```bash
   git clone https://github.com/Owen-Liuyuxuan/one_plus_one.git
   cd one_plus_one
   ```

2. **在浏览器中打开**
   ```bash
   # 直接在浏览器中打开 index.html
   open index.html  # macOS
   xdg-open index.html  # Linux
   start index.html  # Windows
   ```

就这么简单！无需构建过程或依赖项。

## 📦 部署

### GitHub Pages

1. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/Owen-Liuyuxuan/one_plus_one.git
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库 **Settings** → **Pages**
   - 选择 **main** 分支作为源
   - 点击 **Save**
   - 你的游戏将在 `https://owen-liuyuxuan.github.io/one_plus_one/` 上线

### 其他托管选项
- **Netlify**：拖放 `index.html`
- **Vercel**：从 GitHub 导入
- **任何静态托管**：上传 `index.html`

### 游戏序列示例
```
开始:      P1[1,1] vs P2[1,1]
P1 移动:   P1[2,1] vs P2[1,1]  (P1 将 P2 的 1 加到自己手上)
P2 移动:   P1[2,1] vs P2[3,1]  (P2 将 P1 的 2 加到自己手上)
P1 移动:   P1[5,1] vs P2[3,1]  (P1 将 P2 的 3 加到自己手上)
...
```

## 🙏 致谢

- 灵感来自广雅初中和同学玩的经典游戏

## 📞 联系方式

- **作者**: Owen
- **GitHub**: [@Owen-Liuyuxuan](https://github.com/Owen-Liuyuxuan)
- **问题反馈**: [报告 Bug](https://github.com/Owen-Liuyuxuan/one_plus_one/issues)

---

<p align="center">
  为全世界怀旧的玩家用 ❤️ 制作
</p>

<p align="center">
  <a href="#-11-手指游戏">返回顶部 ⬆️</a>
</p>