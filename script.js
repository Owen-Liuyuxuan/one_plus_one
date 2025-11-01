// Game translations
const translations = {
  en: {
    title: '🖐️ 1+1 Hand Game 🖐️',
    subtitle: 'Finish both YOUR hands to win!',
    'mode-pvp': 'Two Players',
    'mode-pvc': 'vs Computer',
    'ai-level': 'AI Difficulty:',
    'ai-random': 'Random',
    'ai-greedy': 'Greedy',
    'ai-smart': 'Smart',
    'ai-expert': 'Expert',
    'ai-master': 'Master',
    'ai-perfect': 'Perfect',
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
    'rules-6': '🏆 WIN: Get BOTH of YOUR hands finished (both = ✗) first!',
    'rules-7': 'Strategy tip: Race to finish your hands while blocking opponent!',
    'turn-select-own': '\'s turn: Select one of your hands',
    'turn-select-target': '\'s turn: Select opponent\'s hand to add',
    'ai-thinking': '🤖 AI is thinking...',
    wins: ' Wins!',
    'new-game': 'New Game',
    'show-rules': 'Rules'
  },
  zh: {
    title: '🖐️ 1+1 手指游戏 🖐️',
    subtitle: '让你的两只手都完成以获胜！',
    'mode-pvp': '两个玩家',
    'mode-pvc': '对战电脑',
    'ai-level': 'AI 难度：',
    'ai-random': '随机',
    'ai-greedy': '贪心',
    'ai-smart': '聪明',
    'ai-expert': '专家',
    'ai-master': '大师',
    'ai-perfect': '完美',
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
    'rules-3': '把对手的手的数值加到你选择的手上',
    'rules-4': '如果结果等于10，则该手完成并退出(显示✗)',
    'rules-5': '如果结果超过10，则重置为1',
    'rules-6': '🏆 获胜：让你自己的两只手都完成（都显示✗）！',
    'rules-7': '策略提示：竞速完成你的手，同时阻止对手！',
    'turn-select-own': '的回合：选择你的一只手',
    'turn-select-target': '的回合：选择对手的手进行加法',
    'ai-thinking': '🤖 AI 正在思考...',
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
  aiDifficulty: 3, // 1-6
  players: {
    1: [1, 1],
    2: [1, 1]
  },
  selectedHand: null,
  phase: 'select-own', // 'select-own' or 'select-target'
  winner: null
};

let currentLanguage = 'en';

// AI Memoization cache
const aiCache = new Map();

// ==================== AI ALGORITHMS ====================

/**
 * Generate all valid moves for current player
 * @param {Object} state - Game state
 * @param {number} player - Player number (1 or 2)
 * @returns {Array} Array of move objects
 */
function generateMoves(state, player) {
  const moves = [];
  const myHands = state.players[player];
  const oppPlayer = player === 1 ? 2 : 1;
  const oppHands = state.players[oppPlayer];

  for (let myHand = 0; myHand < 2; myHand++) {
    if (myHands[myHand] === 0) continue; // Skip finished hands
    
    for (let oppHand = 0; oppHand < 2; oppHand++) {
      if (oppHands[oppHand] === 0) continue; // Skip finished opponent hands
      
      moves.push({
        myHand: myHand,
        oppHand: oppHand,
        oppPlayer: oppPlayer
      });
    }
  }
  
  return moves;
}

/**
 * Apply move and return new state (immutable)
 * @param {Object} state - Current game state
 * @param {Object} move - Move to apply
 * @param {number} player - Player making the move
 * @returns {Object} New game state
 */
function applyMove(state, move, player) {
  const newState = JSON.parse(JSON.stringify(state));
  const myValue = newState.players[player][move.myHand];
  const oppValue = newState.players[move.oppPlayer][move.oppHand];
  
  let newValue = myValue + oppValue;
  if (newValue === 10) {
    newValue = 0; // Finished
  } else if (newValue > 10) {
    newValue = 1; // Reset
  }
  
  newState.players[player][move.myHand] = newValue;
  return newState;
}

/**
 * Check if game is over and who won
 * @param {Object} state - Game state
 * @returns {number|null} Winner (1 or 2) or null if game continues
 */
function checkGameOver(state) {
  const p1Finished = state.players[1].every(h => h === 0);
  const p2Finished = state.players[2].every(h => h === 0);
  
  if (p1Finished) return 1; // Player 1 wins
  if (p2Finished) return 2; // Player 2 wins
  return null; // Game continues
}

/**
 * Convert state to string for memoization
 * @param {Object} state - Game state
 * @param {number} player - Current player
 * @returns {string} State key
 */
function stateToString(state, player) {
  return `${state.players[1].join(',')}-${state.players[2].join(',')}-${player}`;
}

/**
 * Heuristic evaluation function
 * Higher score = better for player
 * @param {Object} state - Game state
 * @param {number} player - Player to evaluate for
 * @returns {number} Evaluation score
 */
function evaluateState(state, player) {
  const opponent = player === 1 ? 2 : 1;
  const winner = checkGameOver(state);
  
  // Terminal states
  if (winner === player) return 10000;
  if (winner === opponent) return -10000;
  
  const myHands = state.players[player];
  const oppHands = state.players[opponent];
  
  let score = 0;
  
  // 1. Count finished hands (WE WANT our hands finished!)
  const myFinished = myHands.filter(h => h === 0).length;
  const oppFinished = oppHands.filter(h => h === 0).length;
  score += myFinished * 1000;  // Huge bonus for finishing our hands
  score -= oppFinished * 1000; // Huge penalty if opponent finishes
  
  // 2. Hands close to finishing (7, 8, 9 can reach 10 easily)
  const myClose = myHands.filter(h => h >= 7 && h <= 9).length;
  const oppClose = oppHands.filter(h => h >= 7 && h <= 9).length;
  score += myClose * 100;
  score -= oppClose * 100;
  
  // 3. Bonus for having one finished + one close (good position)
  if (myFinished === 1 && myClose === 1) score += 200;
  if (oppFinished === 1 && oppClose === 1) score -= 200;
  
  // 4. Hand value sum (lower is better - closer to 10)
  // Hands at 5 are "halfway" to 10
  const mySum = myHands.reduce((a, b) => a + b, 0);
  const oppSum = oppHands.reduce((a, b) => a + b, 0);
  
  // Penalize high totals (far from finishing)
  score -= mySum * 5;
  score += oppSum * 5;
  
  // 5. Bonus for balanced hands (both hands progressing)
  if (myHands[0] > 0 && myHands[1] > 0) {
    const balance = Math.abs(myHands[0] - myHands[1]);
    score -= balance * 2; // Prefer balanced progression
  }
  
  return score;
}

/**
 * Level 1: Random AI - picks any valid move
 * @param {Object} state - Game state
 * @param {number} player - AI player number
 * @returns {Object|null} Selected move
 */
function aiRandom(state, player) {
  const moves = generateMoves(state, player);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

/**
 * Level 2: Greedy AI - picks move with best immediate evaluation
 * @param {Object} state - Game state
 * @param {number} player - AI player number
 * @returns {Object|null} Selected move
 */
function aiGreedy(state, player) {
  const moves = generateMoves(state, player);
  if (moves.length === 0) return null;
  
  let bestMove = null;
  let bestScore = -Infinity;
  
  for (const move of moves) {
    const newState = applyMove(state, move, player);
    const score = evaluateState(newState, player);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}

/**
 * Level 3: Smart AI - 1-2 ply lookahead with heuristics
 * @param {Object} state - Game state
 * @param {number} player - AI player number
 * @returns {Object|null} Selected move
 */
function aiSmart(state, player) {
  const moves = generateMoves(state, player);
  if (moves.length === 0) return null;
  
  let bestMove = null;
  let bestScore = -Infinity;
  
  for (const move of moves) {
    const newState = applyMove(state, move, player);
    
    // Check immediate win
    if (checkGameOver(newState) === player) {
      return move; // Take winning move immediately
    }
    
    let score = evaluateState(newState, player);
    
    // Look ahead one opponent move (1-ply)
    const opponent = player === 1 ? 2 : 1;
    const oppMoves = generateMoves(newState, opponent);
    
    if (oppMoves.length > 0) {
      let worstOppScore = Infinity;
      
      for (const oppMove of oppMoves) {
        const oppState = applyMove(newState, oppMove, opponent);
        
        // Check if opponent can win
        if (checkGameOver(oppState) === opponent) {
          worstOppScore = -10000;
          break;
        }
        
        const oppScore = evaluateState(oppState, player);
        worstOppScore = Math.min(worstOppScore, oppScore);
      }
      
      score = worstOppScore;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove;
}

/**
 * Minimax algorithm with Alpha-Beta Pruning
 * @param {Object} state - Game state
 * @param {number} player - AI player (maximizing player)
 * @param {number} depth - Current search depth
 * @param {number} maxDepth - Maximum search depth
 * @param {number} alpha - Alpha value for pruning
 * @param {number} beta - Beta value for pruning
 * @param {boolean} isMaximizing - True if maximizing, false if minimizing
 * @returns {Object} {score, move}
 */
function minimax(state, player, depth, maxDepth, alpha, beta, isMaximizing) {
  // Check cache
  const cacheKey = stateToString(state, player) + `-${depth}-${isMaximizing}`;
  if (aiCache.has(cacheKey)) {
    return aiCache.get(cacheKey);
  }
  
  // Terminal state check
  const winner = checkGameOver(state);
  if (winner !== null) {
    const score = winner === player ? 10000 - depth : -10000 + depth;
    const result = { score, move: null };
    aiCache.set(cacheKey, result);
    return result;
  }
  
  // Depth limit reached
  if (depth >= maxDepth) {
    const score = evaluateState(state, player);
    const result = { score, move: null };
    aiCache.set(cacheKey, result);
    return result;
  }
  
  const currentPlayer = isMaximizing ? player : (player === 1 ? 2 : 1);
  const moves = generateMoves(state, currentPlayer);
  
  // No valid moves
  if (moves.length === 0) {
    const score = evaluateState(state, player);
    const result = { score, move: null };
    aiCache.set(cacheKey, result);
    return result;
  }
  
  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestMove = moves[0];
    
    for (const move of moves) {
      const newState = applyMove(state, move, currentPlayer);
      const result = minimax(newState, player, depth + 1, maxDepth, alpha, beta, false);
      
      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = move;
      }
      
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) {
        break; // Beta cutoff
      }
    }
    
    const result = { score: maxScore, move: bestMove };
    aiCache.set(cacheKey, result);
    return result;
    
  } else {
    let minScore = Infinity;
    let bestMove = moves[0];
    
    for (const move of moves) {
      const newState = applyMove(state, move, currentPlayer);
      const result = minimax(newState, player, depth + 1, maxDepth, alpha, beta, true);
      
      if (result.score < minScore) {
        minScore = result.score;
        bestMove = move;
      }
      
      beta = Math.min(beta, minScore);
      if (beta <= alpha) {
        break; // Alpha cutoff
      }
    }
    
    const result = { score: minScore, move: bestMove };
    aiCache.set(cacheKey, result);
    return result;
  }
}

/**
 * Get AI move based on difficulty level
 * @param {Object} state - Game state
 * @param {number} player - AI player number
 * @param {number} difficulty - Difficulty level (1-6)
 * @returns {Object|null} Selected move
 */
function getAIMove(state, player, difficulty) {
  aiCache.clear(); // Clear cache for new decision
  
  console.log(`AI (Level ${difficulty}) thinking for Player ${player}...`);
  const startTime = performance.now();
  
  let move;
  switch (difficulty) {
    case 1: // Random
      move = aiRandom(state, player);
      break;
    case 2: // Greedy
      move = aiGreedy(state, player);
      break;
    case 3: // Smart (1-2 ply)
      move = aiSmart(state, player);
      break;
    case 4: // Expert (variable 3-6 ply minimax)
      const expertDepth = Math.floor(Math.random() * 4) + 3; // Random between 3-6
      move = minimax(state, player, 0, expertDepth, -Infinity, Infinity, true).move;
      break;
    case 5: // Master (variable 6-12 ply minimax)
      const masterDepth = Math.floor(Math.random() * 7) + 6; // Random between 6-12
      move = minimax(state, player, 0, masterDepth, -Infinity, Infinity, true).move;
      break;
    case 6: // Perfect (20 ply minimax - near complete)
      move = minimax(state, player, 0, 30, -Infinity, Infinity, true).move;
      break;
    default:
      move = aiSmart(state, player);
  }
  
  const elapsed = (performance.now() - startTime).toFixed(2);
  console.log(`AI decided in ${elapsed}ms. Cache size: ${aiCache.size}`);
  
  return move;
}

// ==================== GAME LOGIC ====================

/**
 * Initialize/reset game state
 */
function initGame() {
  gameState = {
    mode: gameState.mode,
    currentPlayer: 1,
    humanPlayer: gameState.humanPlayer,
    aiDifficulty: gameState.aiDifficulty,
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
  
  // Hide AI thinking indicator
  const aiThinking = document.getElementById('aiThinking');
  if (aiThinking) aiThinking.classList.remove('show');
  
  updateUI();
  attachHandlers();
  
  // If computer goes first
  if (gameState.mode === 'pvc' && gameState.humanPlayer === 2) {
    setTimeout(computerMove, 1000);
  }
}

/**
 * Set language
 */
function setLanguage(lang) {
  currentLanguage = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  updateUI();
  updatePlayerNames();
}

/**
 * Set game mode (PvP or PvC)
 */
function setMode(mode) {
  gameState.mode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  const orderSelection = document.getElementById('playerOrderSelection');
  const aiDifficulty = document.getElementById('aiDifficulty');
  
  if (mode === 'pvc') {
    if (orderSelection) orderSelection.classList.add('show');
    if (aiDifficulty) aiDifficulty.classList.add('show');
  } else {
    if (orderSelection) orderSelection.classList.remove('show');
    if (aiDifficulty) aiDifficulty.classList.remove('show');
  }
  
  updatePlayerNames();
  startGame();
}

/**
 * Set AI difficulty level
 */
function setDifficulty(level) {
  gameState.aiDifficulty = level;
  document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  startGame();
}

/**
 * Set player order in PvC mode
 */
function setPlayerOrder(player) {
  gameState.humanPlayer = player;
  document.querySelectorAll('.order-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  updatePlayerNames();
  startGame();
}

/**
 * Start new game
 */
function startGame() {
  document.getElementById('gameBoard').classList.add('active');
  initGame();
}

/**
 * Attach click handlers to hands
 */
function attachHandlers() {
  document.querySelectorAll('.hand').forEach(hand => {
    hand.onclick = () => handleHandClick(hand);
  });
}

/**
 * Handle hand click
 */
function handleHandClick(hand) {
  if (gameState.winner) return; // Game over
  
  const player = parseInt(hand.dataset.player);
  const handIndex = parseInt(hand.dataset.hand);
  
  // Check if hand is finished
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
    
    // Perform the move
    performMove(gameState.selectedHand, player, handIndex);
  }
}

/**
 * Perform a move
 */
function performMove(ownHandIndex, opponentPlayer, opponentHandIndex) {
  const currentValue = gameState.players[gameState.currentPlayer][ownHandIndex];
  const opponentValue = gameState.players[opponentPlayer][opponentHandIndex];
  
  let newValue = currentValue + opponentValue;
  
  if (newValue === 10) {
    newValue = 0; // Hand is finished
  } else if (newValue > 10) {
    newValue = 1; // Reset to 1
  }
  
  gameState.players[gameState.currentPlayer][ownHandIndex] = newValue;
  
  // Check for winner (current player finished both hands)
  if (checkCurrentPlayerWinner()) {
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

/**
 * Computer makes a move
 */
function computerMove() {
  if (gameState.winner) return;
  
  // Show AI thinking indicator
  const aiThinking = document.getElementById('aiThinking');
  if (aiThinking) {
    aiThinking.classList.add('show');
    const t = translations[currentLanguage];
    aiThinking.textContent = t['ai-thinking'];
  }
  
  // Get AI move
  const move = getAIMove(gameState, gameState.currentPlayer, gameState.aiDifficulty);
  
  if (!move) {
    console.error('AI could not find a valid move!');
    if (aiThinking) aiThinking.classList.remove('show');
    return;
  }
  
  // Visualize AI selection
  gameState.selectedHand = move.myHand;
  gameState.phase = 'select-target';
  updateUI();
  
  setTimeout(() => {
    if (aiThinking) aiThinking.classList.remove('show');
    performMove(move.myHand, move.oppPlayer, move.oppHand);
  }, 600);
}

/**
 * Check if current player won (both hands finished)
 */
function checkCurrentPlayerWinner() {
  return gameState.players[gameState.currentPlayer].every(val => val === 0);
}

/**
 * Show winner modal
 */
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

/**
 * Close winner modal and restart
 */
function closeWinnerModal() {
  document.getElementById('winnerModal').classList.remove('show');
  startGame();
}

/**
 * Update UI based on game state
 */
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
  
  // Update all translatable elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.textContent = t[key];
    }
  });
  
  document.querySelector('h1').textContent = t.title;
  document.querySelector('.subtitle').textContent = t.subtitle;
}

/**
 * Update player names based on mode
 */
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

/**
 * Toggle rules visibility
 */
function toggleRules() {
  const rules = document.getElementById('rules');
  rules.style.display = rules.style.display === 'none' ? 'block' : 'none';
}

// Initialize on load
window.onload = () => {
  updatePlayerNames();
  startGame();
};
