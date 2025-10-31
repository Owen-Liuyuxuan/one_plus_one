// Game translations
const translations = {
  en: {
    title: '🖐️ 1+1 Hand Game 🖐️',
    subtitle: 'A Classic Two-Hand Strategy Game',
    'mode-pvp': 'Two Players',
    'mode-pvc': 'vs Computer',
    'choose-order': 'You play as:',
    'first-move': 'First (Player 1)',
    'second-move': 'Second (Player 2)',
    player1: 'Player 1',
    player2: 'Player 2',
    computer: 'Computer',
    you: 'You',
    winner: 'WINNER',
    rules: '📖 Game Rules',
    'rules-1': 'Both players start with [1, 1] on their hands',
    'rules-2': 'On your turn, select one of your hands, then select one of opponent\'s hands',
    'rules-3': 'Add the opponent\'s hand value to your selected hand',
    'rules-4': 'If the result equals 10, that hand is "finished" (shows ✗)',
    'rules-5': 'If the result exceeds 10, it resets to 1',
    'rules-6': 'Win by getting both of your hands finished',
    'rules-7': 'Strategy tip: Force your opponent into difficult positions!',
    'turn-select-own': '\'s turn: Select one of your hands',
    'turn-select-target': '\'s turn: Select opponent\'s hand to add',
    wins: ' Wins!',
    'new-game': 'New Game',
    'show-rules': 'Rules'
  },
  zh: {
    title: '🖐️ 1+1 手指游戏 🖐️',
    subtitle: '经典双手策略游戏',
    'mode-pvp': '两个玩家',
    'mode-pvc': '对战电脑',
    'choose-order': '你作为:',
    'first-move': '先手 (玩家 1)',
    'second-move': '后手 (玩家 2)',
    player1: '玩家 1',
    player2: '玩家 2',
    computer: '电脑',
    you: '你',
    winner: '获胜者',
    rules: '📖 游戏规则',
    'rules-1': '两位玩家开始时每只手都是1',
    'rules-2': '轮到你时，选择你的一只手，然后选择对手的一只手',
    'rules-3': '把你选择的手的数值加到对手选择的手上',
    'rules-4': '如果结果等于10，则该手完成并退出(显示✗)',
    'rules-5': '如果结果超过10，则重置为1',
    'rules-6': '通过让自己的两只手都完成来获胜',
    'rules-7': '策略提示：迫使对手进入困难境地！',
    'turn-select-own': '的回合：选择你的一只手',
    'turn-select-target': '的回合：选择对手的手进行加法',
    wins: ' 获胜！',
    'new-game': '新游戏',
    'show-rules': '规则'
  }
};

// Game State
let gameState = {
  mode: 'pvp', // 'pvp' or 'pvc'
  currentPlayer: 1,
  humanPlayer: 1, // In PvC mode, which player is human (1 or 2)
  players: {
    1: [1, 1],
    2: [1, 1]
  },
  selectedHand: null,
  phase: 'select-own', // 'select-own' or 'select-target'
  winner: null
};

let currentLanguage = 'en';

// Initialize game
function initGame() {
  gameState = {
    mode: gameState.mode,
    currentPlayer: 1,
    humanPlayer: gameState.humanPlayer,
    players: {
      1: [1, 1],
      2: [1, 1]
    },
    selectedHand: null,
    phase: 'select-own',
    winner: null
  };
  
  // Hide winner badges
  document.getElementById('winner1Badge').classList.remove('show');
  document.getElementById('winner2Badge').classList.remove('show');
  
  // Remove winner classes
  document.getElementById('player1Area').classList.remove('winner');
  document.getElementById('player2Area').classList.remove('winner');
  
  updateUI();
  attachHandlers();
}

function setLanguage(lang) {
  currentLanguage = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  updateUI();
  updatePlayerNames();
}

function setMode(mode) {
  gameState.mode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  const orderSelection = document.getElementById('playerOrderSelection');
  if (mode === 'pvc') {
    orderSelection.classList.add('show');
  } else {
    orderSelection.classList.remove('show');
  }
  
  updatePlayerNames();
  startGame();
}

function setPlayerOrder(player) {
  gameState.humanPlayer = player;
  document.querySelectorAll('.order-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  updatePlayerNames();
  startGame();
}

function startGame() {
  document.getElementById('gameBoard').classList.add('active');
  initGame();
}

function attachHandlers() {
  document.querySelectorAll('.hand').forEach(hand => {
    hand.onclick = () => handleHandClick(hand);
  });
}

function handleHandClick(hand) {
  if (gameState.winner) return; // Game over
  
  const player = parseInt(hand.dataset.player);
  const handIndex = parseInt(hand.dataset.hand);
  
  // Check if hand is out
  if (gameState.players[player][handIndex] === 0) return;

  // In PvC mode, prevent clicking computer's hands during selection phase
  if (gameState.mode === 'pvc' && player !== gameState.humanPlayer && gameState.phase === 'select-own') {
    return;
  }

  if (gameState.phase === 'select-own') {
    // Select own hand
    if (player !== gameState.currentPlayer) return;
    
    gameState.selectedHand = handIndex;
    gameState.phase = 'select-target';
    updateUI();
  } else if (gameState.phase === 'select-target') {
    // Select opponent's hand
    if (player === gameState.currentPlayer) {
      // Reselect own hand
      gameState.selectedHand = handIndex;
      updateUI();
      return;
    }
    
    // Perform the addition
    performMove(gameState.selectedHand, player, handIndex);
  }
}

function performMove(ownHandIndex, opponentPlayer, opponentHandIndex) {
  const currentValue = gameState.players[gameState.currentPlayer][ownHandIndex];
  const opponentValue = gameState.players[opponentPlayer][opponentHandIndex];
  
  let newValue = currentValue + opponentValue;
  
  if (newValue === 10) {
    newValue = 0; // Hand is out
  } else if (newValue > 10) {
    newValue = 1; // Reset to 1
  }
  
  gameState.players[gameState.currentPlayer][ownHandIndex] = newValue;
  
  // Check for winner
  if (checkCurrentPlayerWinner()) {
    console.log("Get Winner");
    
    const opponent = gameState.currentPlayer === 1 ? 2 : 1;
    gameState.winner = gameState.currentPlayer;
    
    // Show winner badge
    const winnerBadge = document.getElementById(`winner${gameState.currentPlayer}Badge`);
    const winnerArea = document.getElementById(`player${gameState.currentPlayer}Area`);
    winnerBadge.classList.add('show');
    winnerArea.classList.add('winner');
    
    updateUI();
    setTimeout(() => showWinner(gameState.currentPlayer), 1000);
    return;
  }
  
  // Switch turn
  gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
  gameState.selectedHand = null;
  gameState.phase = 'select-own';
  
  updateUI();
  
  // Computer's turn
  if (gameState.mode === 'pvc' && gameState.currentPlayer !== gameState.humanPlayer) {
    setTimeout(computerMove, 800);
  }
}

function computerMove() {
  if (gameState.winner) return;
  
  // Naive AI: Random valid move
  const computerPlayer = gameState.currentPlayer;
  const availableHands = gameState.players[computerPlayer]
    .map((val, idx) => val > 0 ? idx : -1)
    .filter(idx => idx !== -1);
  
  if (availableHands.length === 0) return;
  
  const ownHand = availableHands[Math.floor(Math.random() * availableHands.length)];
  
  const opponent = computerPlayer === 1 ? 2 : 1;
  const opponentHands = gameState.players[opponent]
    .map((val, idx) => val > 0 ? idx : -1)
    .filter(idx => idx !== -1);
  
  if (opponentHands.length === 0) return;
  
  const targetHand = opponentHands[Math.floor(Math.random() * opponentHands.length)];
  
  gameState.selectedHand = ownHand;
  gameState.phase = 'select-target';
  updateUI();
  
  setTimeout(() => {
    performMove(ownHand, opponent, targetHand);
  }, 500);
}

// Fixed victory detection - check if ALL opponent's hands are out
function checkCurrentPlayerWinner() {
  // Check if opponent has no hands left (both hands are 0)
  // const opponent = gameState.currentPlayer === 1 ? 2 : 1;
  return gameState.players[gameState.currentPlayer].every(val => val === 0);
}

function showWinner(player) {
  const t = translations[currentLanguage];
  let playerName;
  
  if (gameState.mode === 'pvc') {
    playerName = (player === gameState.humanPlayer) ? t.you : t.computer;
  } else {
    playerName = player === 1 ? t.player1 : t.player2;
  }
  
  document.getElementById('winnerText').textContent = playerName + t.wins;
  document.getElementById('winnerModal').classList.add('show');
}

function closeWinnerModal() {
  document.getElementById('winnerModal').classList.remove('show');
  startGame();
}

function updateUI() {
  const t = translations[currentLanguage];
  
  // Update hands display
  for (let player = 1; player <= 2; player++) {
    for (let hand = 0; hand < 2; hand++) {
      const handEl = document.getElementById(`p${player}h${hand === 0 ? 1 : 2}`);
      const value = gameState.players[player][hand];
      
      handEl.textContent = value === 0 ? '✗' : value;
      handEl.classList.remove('active', 'selectable', 'target', 'out');
      
      if (value === 0) {
        handEl.classList.add('out');
      } else if (gameState.phase === 'select-own' && player === gameState.currentPlayer) {
        // Only make hands selectable if it's human's turn in PvC mode
        if (gameState.mode === 'pvp' || player === gameState.humanPlayer) {
          handEl.classList.add('selectable');
        }
      } else if (gameState.phase === 'select-target' && player === gameState.currentPlayer && hand === gameState.selectedHand) {
        handEl.classList.add('active');
      } else if (gameState.phase === 'select-target' && player !== gameState.currentPlayer) {
        handEl.classList.add('target');
      }
    }
  }
  
  // Update player areas (only if no winner)
  if (!gameState.winner) {
    document.getElementById('player1Area').classList.toggle('active', gameState.currentPlayer === 1);
    document.getElementById('player1Area').classList.toggle('inactive', gameState.currentPlayer !== 1);
    document.getElementById('player2Area').classList.toggle('active', gameState.currentPlayer === 2);
    document.getElementById('player2Area').classList.toggle('inactive', gameState.currentPlayer !== 2);
  }
  
  // Update status message
  let playerName;
  if (gameState.mode === 'pvc') {
    playerName = (gameState.currentPlayer === gameState.humanPlayer) ? t.you : t.computer;
  } else {
    playerName = gameState.currentPlayer === 1 ? t.player1 : t.player2;
  }
  
  const action = gameState.phase === 'select-own' ? t['turn-select-own'] : t['turn-select-target'];
  document.getElementById('statusMessage').textContent = playerName + action;
  
  // Update button texts
  document.querySelector('[data-i18n="mode-pvp"]').textContent = t['mode-pvp'];
  document.querySelector('[data-i18n="mode-pvc"]').textContent = t['mode-pvc'];
  document.querySelector('[data-i18n="choose-order"]').textContent = t['choose-order'];
  document.querySelector('[data-i18n="first-move"]').textContent = t['first-move'];
  document.querySelector('[data-i18n="second-move"]').textContent = t['second-move'];
  document.querySelector('[data-i18n="player1"]').textContent = t.player1;
  document.querySelector('[data-i18n="player2"]').textContent = t.player2;
  document.querySelector('[data-i18n="winner"]').textContent = t.winner;
  document.querySelector('[data-i18n="rules"]').textContent = t.rules;
  document.querySelector('[data-i18n="rules-1"]').textContent = t['rules-1'];
  document.querySelector('[data-i18n="rules-2"]').textContent = t['rules-2'];
  document.querySelector('[data-i18n="rules-3"]').textContent = t['rules-3'];
  document.querySelector('[data-i18n="rules-4"]').textContent = t['rules-4'];
  document.querySelector('[data-i18n="rules-5"]').textContent = t['rules-5'];
  document.querySelector('[data-i18n="rules-6"]').textContent = t['rules-6'];
  document.querySelector('[data-i18n="rules-7"]').textContent = t['rules-7'];
  document.querySelector('[data-i18n="new-game"]').textContent = t['new-game'];
  document.querySelector('[data-i18n="show-rules"]').textContent = t['show-rules'];
  document.querySelector('h1').textContent = t.title;
  document.querySelector('.subtitle').textContent = t.subtitle;
}

function updatePlayerNames() {
  const t = translations[currentLanguage];
  
  if (gameState.mode === 'pvc') {
    document.getElementById('player1Name').textContent = 
      gameState.humanPlayer === 1 ? t.you : t.computer;
    document.getElementById('player2Name').textContent = 
      gameState.humanPlayer === 2 ? t.you : t.computer;
  } else {
    document.getElementById('player1Name').textContent = t.player1;
    document.getElementById('player2Name').textContent = t.player2;
  }
}

function toggleRules() {
  const rules = document.getElementById('rules');
  rules.style.display = rules.style.display === 'none' ? 'block' : 'none';
}

// Initialize on load
window.onload = () => {
  updatePlayerNames();
  startGame();
};