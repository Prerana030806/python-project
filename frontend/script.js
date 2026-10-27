/* =============================================
   AI CODELAB — script.js
   Features: Section nav, Modules, Game, Quiz
   ============================================= */

// ─── GLOBAL STATE ───────────────────────────
let xp = 0;
let user = null;

function initAuth() {
  const savedUser = localStorage.getItem('aicodelab_user');
  if (savedUser) {
    user = JSON.parse(savedUser);
    if (!user.quizScores) user.quizScores = {};
    xp = user.xp || 0;
    updateNavForUser();
  } else {
    // Show login by default if not logged in
    showSection('home');
  }
  document.getElementById('xp-display').textContent = xp;
}

function updateNavForUser() {
  const authBtn = document.getElementById('auth-btn');
  const navDash = document.getElementById('nav-dashboard');
  if (user) {
    authBtn.textContent = 'Logout';
    navDash.classList.remove('hidden');
  } else {
    authBtn.textContent = 'Login';
    navDash.classList.add('hidden');
  }
}

let authMode = 'login';
function toggleAuthModal() {
  if (user && document.getElementById('auth-btn').textContent === 'Logout') {
    // Logout
    user = null;
    xp = 0;
    localStorage.removeItem('aicodelab_user');
    updateNavForUser();
    document.getElementById('xp-display').textContent = xp;
    showSection('home');
    showFeedbackToast('Logged out successfully');
    return;
  }
  const modal = document.getElementById('auth-modal');
  modal.classList.toggle('hidden');
}

function handleExplicitLogout() {
  user = null;
  xp = 0;
  localStorage.removeItem('aicodelab_user');
  updateNavForUser();
  document.getElementById('xp-display').textContent = xp;
  showSection('home');
  showFeedbackToast('Logged out successfully');
}

function toggleAuthMode() {
  authMode = authMode === 'login' ? 'register' : 'login';
  document.getElementById('auth-title').textContent = authMode === 'login' ? 'Login' : 'Create Account';
  document.getElementById('auth-toggle-text').textContent = authMode === 'login' ? "Don't have an account?" : "Already have an account?";
}

function handleAuth(e) {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;

  const errorDiv = document.getElementById('auth-error');
  errorDiv.classList.add('hidden');
  errorDiv.textContent = '';

  if (!email || !password) {
    errorDiv.textContent = 'Please fill all fields.';
    errorDiv.classList.remove('hidden');
    return;
  }
  if (!email.includes('@') || !email.includes('.')) {
    errorDiv.textContent = 'Please enter a valid email address.';
    errorDiv.classList.remove('hidden');
    return;
  }

  let usersDB = JSON.parse(localStorage.getItem('learnohub_users_db')) || {};

  if (authMode === 'register') {
    if (usersDB[email]) {
      errorDiv.textContent = 'User already exists. Please login.';
      errorDiv.classList.remove('hidden');
      return;
    }
    user = { email, password, xp: 0, completedModules: [], quizScores: {} };
    usersDB[email] = user;
    localStorage.setItem('learnohub_users_db', JSON.stringify(usersDB));
    showFeedbackToast('Account created successfully!');
  } else {
    // Login
    if (!usersDB[email]) {
      errorDiv.textContent = 'No account found with this email.';
      errorDiv.classList.remove('hidden');
      return;
    }
    if (usersDB[email].password !== password) {
      errorDiv.textContent = 'Incorrect password.';
      errorDiv.classList.remove('hidden');
      return;
    }
    user = usersDB[email];
    showFeedbackToast('Welcome back to LearnoHub AI!');
  }

  xp = user.xp || 0;
  localStorage.setItem('aicodelab_user', JSON.stringify(user));
  updateNavForUser();
  document.getElementById('xp-display').textContent = xp;
  document.getElementById('auth-modal').classList.add('hidden');
  showFeedbackToast('Welcome to LearnoHub AI!');
  showSection('dashboard');
}

function addXP(amount) {
  xp += amount;
  document.getElementById('xp-display').textContent = xp;
  if (user) {
    user.xp = xp;
    localStorage.setItem('aicodelab_user', JSON.stringify(user));
    let usersDB = JSON.parse(localStorage.getItem('learnohub_users_db')) || {};
    if (usersDB[user.email]) {
        usersDB[user.email].xp = xp;
        localStorage.setItem('learnohub_users_db', JSON.stringify(usersDB));
    }
  }
}

// Call initAuth on load
document.addEventListener('DOMContentLoaded', initAuth);

// ─── NAVIGATION ─────────────────────────────
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
  if (id === 'dashboard') {
    updateDashboard();
  }
}

// ─── MODULE DATA ────────────────────────────
const modules = [
  {
    title: "🧠 What is AI?",
    pages: [
      {
        heading: "Artificial Intelligence — The Big Idea",
        body: `
          <p>Artificial Intelligence (AI) is the ability of a computer program to perform tasks that normally require human intelligence — like understanding language, recognising images, or making decisions.</p>
          <div class="callout">💡 Simple Definition: AI = Making computers smart enough to do human-like thinking.</div>
          <h3>A Brief History</h3>
          <ul>
            <li><strong>1950s:</strong> Alan Turing asks "Can machines think?" — the birth of AI as a concept.</li>
            <li><strong>1980s:</strong> Expert systems — rule-based programs that mimic human experts.</li>
            <li><strong>2010s:</strong> Deep Learning explosion — AI beats humans at chess, Go, image recognition.</li>
            <li><strong>2020s:</strong> ChatGPT, image generation, self-driving cars — AI is mainstream.</li>
          </ul>
        `
      },
      {
        heading: "Types of AI",
        body: `
          <h3>Narrow AI (Weak AI)</h3>
          <p>Designed for one specific task. Examples: Siri, spam filters, face unlock. This is <strong>all AI we have today.</strong></p>
          <h3>General AI (Strong AI)</h3>
          <p>AI that can do ANY intellectual task a human can. This <strong>does not exist yet</strong> — it's theoretical.</p>
          <h3>Super AI</h3>
          <p>AI smarter than all humans combined. Currently science fiction. Think Skynet or HAL 9000.</p>
          <div class="callout">📌 Key Insight: Everything you use today — Google, Netflix, Alexa — uses Narrow AI.</div>
        `
      }
    ]
  },
  {
    title: "📈 Machine Learning 101",
    pages: [
      {
        heading: "What is Machine Learning?",
        body: `
          <p>Machine Learning (ML) is a subset of AI where machines <strong>learn from data</strong> instead of being explicitly programmed with rules.</p>
          <div class="callout">🔑 Traditional Programming: Input + Rules → Output<br/>🤖 Machine Learning: Input + Output → Rules (learned!)</div>
          <h3>A Simple Example</h3>
          <p>Instead of writing rules like "if the email contains 'lottery winner', it's spam" — you show the ML model thousands of spam and non-spam emails. It <em>figures out the rules itself.</em></p>
        `
      },
      {
        heading: "3 Types of Machine Learning",
        body: `
          <h3>1. Supervised Learning</h3>
          <p>The model learns from <strong>labelled data</strong> (question + correct answer). Like a student learning from solved examples.</p>
          <p>Examples: Email spam detection, house price prediction.</p>
          <h3>2. Unsupervised Learning</h3>
          <p>The model finds <strong>hidden patterns</strong> in data with no labels. Like sorting books without being told the categories.</p>
          <p>Examples: Customer segmentation, anomaly detection.</p>
          <h3>3. Reinforcement Learning</h3>
          <p>The model <strong>learns by trial and error</strong> — gets rewards for good decisions, penalties for bad ones.</p>
          <p>Examples: Game-playing AI (AlphaGo), self-driving cars.</p>
          <div class="callout">🏆 AlphaGo used Reinforcement Learning to beat the world Go champion in 2016 — a milestone in AI history.</div>
        `
      }
    ]
  },
  {
    title: "🕸️ Neural Networks",
    pages: [
      {
        heading: "The Brain-Inspired Algorithm",
        body: `
          <p>A Neural Network is a computing system inspired by how neurons in the human brain work. It's the engine behind most modern AI breakthroughs.</p>
          <h3>How It Works</h3>
          <ul>
            <li><strong>Input Layer:</strong> Receives raw data (pixels, words, numbers).</li>
            <li><strong>Hidden Layers:</strong> Process and find patterns in the data.</li>
            <li><strong>Output Layer:</strong> Gives the final answer (cat or dog? spam or not?).</li>
          </ul>
          <div class="callout">🧠 A human brain has ~86 billion neurons. A modern AI model like GPT-4 has ~1.8 trillion parameters — the AI equivalent.</div>
        `
      },
      {
        heading: "Deep Learning = Many Layers",
        body: `
          <p><strong>Deep Learning</strong> is just a neural network with many hidden layers ("deep" layers). More layers = learns more complex patterns.</p>
          <h3>Real-World Impact</h3>
          <ul>
            <li>🖼️ <strong>Image Recognition:</strong> Identifying objects, faces, diseases in X-rays.</li>
            <li>🗣️ <strong>Natural Language:</strong> ChatGPT, Google Translate, voice assistants.</li>
            <li>🎮 <strong>Game AI:</strong> AlphaGo, OpenAI Five beating Dota 2 pros.</li>
            <li>🎵 <strong>Generation:</strong> DALL-E creating art, Suno generating music.</li>
          </ul>
          <div class="callout">📌 You've used deep learning today — every Google search, YouTube recommendation, and autocorrect uses it.</div>
        `
      }
    ]
  },
  {
    title: "🌍 AI in the Real World",
    pages: [
      {
        heading: "AI Is Already Everywhere",
        body: `
          <p>AI isn't a future technology — it's running in the background of your daily life right now.</p>
          <h3>Examples You Use Every Day</h3>
          <ul>
            <li>📧 <strong>Gmail:</strong> Spam filter, Smart Reply, email categorisation.</li>
            <li>🎬 <strong>Netflix/YouTube:</strong> Recommendation engine (what to watch next).</li>
            <li>📱 <strong>Face ID:</strong> Deep learning recognises your face to unlock your phone.</li>
            <li>🗺️ <strong>Google Maps:</strong> Predicts traffic, estimates arrival time.</li>
            <li>🛍️ <strong>Amazon:</strong> "Customers who bought this also bought..." — recommendation AI.</li>
          </ul>
        `
      },
      {
        heading: "The Future of AI",
        body: `
          <h3>High-Impact Areas</h3>
          <ul>
            <li>🏥 <strong>Healthcare:</strong> AI diagnosing cancer earlier than doctors.</li>
            <li>🚗 <strong>Transport:</strong> Self-driving cars (Tesla, Waymo).</li>
            <li>🌾 <strong>Agriculture:</strong> AI drones monitoring crop health.</li>
            <li>🎓 <strong>Education:</strong> Personalised tutoring systems adapting to each student.</li>
          </ul>
          <div class="callout">🚀 India's AI market is projected to reach $6 billion by 2025. AI skills are among the most in-demand globally.</div>
          <h3>Ethical Challenges</h3>
          <p>AI bias, data privacy, job displacement, and deepfakes are real challenges the field must address responsibly.</p>
        `
      }
    ]
  }
];

// ─── MODULE LOGIC ────────────────────────────
let currentModule = 0;
let currentPage = 0;

function openModule(index) {
  currentModule = index;
  currentPage = 0;
  document.querySelectorAll('.module-card').forEach(c => c.style.display = 'none');
  document.getElementById('module-reader').classList.remove('hidden');
  renderModulePage();
  addXP(5);
}

function closeModule() {
  document.getElementById('module-reader').classList.add('hidden');
  document.querySelectorAll('.module-card').forEach(c => c.style.display = 'block');
}

function renderModulePage() {
  const mod = modules[currentModule];
  const page = mod.pages[currentPage];
  document.getElementById('module-content').innerHTML = `
    <h2>${page.heading}</h2>
    ${page.body}
  `;
  document.getElementById('page-indicator').textContent =
    `Page ${currentPage + 1} of ${mod.pages.length}`;
  document.getElementById('prev-page').style.visibility =
    currentPage === 0 ? 'hidden' : 'visible';
  document.getElementById('next-page').textContent =
    currentPage === mod.pages.length - 1 ? '✅ Finish' : 'Next →';
}

function changePage(dir) {
  const mod = modules[currentModule];
  const newPage = currentPage + dir;
  if (newPage < 0) return;
  if (newPage >= mod.pages.length) {
    if (user && !user.completedModules.includes(currentModule)) {
      user.completedModules.push(currentModule);
      localStorage.setItem('aicodelab_user', JSON.stringify(user));
      let usersDB = JSON.parse(localStorage.getItem('learnohub_users_db')) || {};
      if (usersDB[user.email]) {
          usersDB[user.email] = user;
          localStorage.setItem('learnohub_users_db', JSON.stringify(usersDB));
      }
    }
    addXP(20);
    closeModule();
    showFeedbackToast('🎉 Module complete! +20 XP earned!');
    return;
  }
  currentPage = newPage;
  renderModulePage();
}

function showFeedbackToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed;bottom:30px;right:30px;z-index:999;
    background:#f5a623;color:#000;font-family:'Space Mono',monospace;
    font-size:0.85rem;font-weight:700;padding:14px 22px;
    border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,0.3);
    animation:slideIn 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── GAME DATA ───────────────────────────────
const gamePairs = [
  { term: "Algorithm", def: "A set of rules a computer follows to solve a problem" },
  { term: "Neural Network", def: "Brain-inspired layers that learn from data" },
  { term: "Training Data", def: "Examples used to teach a machine learning model" },
  { term: "Overfitting", def: "Model memorizes training data, fails on new data" },
  { term: "NLP", def: "AI that understands and generates human language" },
  { term: "Gradient Descent", def: "Optimization method to minimize model error" },
];

let gameActive = false;
let gameTimerInterval = null;
let gameTimeLeft = 30;
let gameCurrentScore = 0;
let comboCount = 1;
let selectedTerm = null;
let selectedDef = null;
let matchedCount = 0;
let totalPairs = 0;

function startGame() {
  gameActive = true;
  gameCurrentScore = 0;
  comboCount = 1;
  matchedCount = 0;
  gameTimeLeft = 30;
  selectedTerm = null;
  selectedDef = null;

  document.getElementById('game-score').textContent = 0;
  document.getElementById('game-timer').textContent = 30;
  document.getElementById('combo').textContent = 'x1';
  document.getElementById('game-feedback').textContent = '';
  document.getElementById('game-result').classList.add('hidden');
  document.getElementById('start-game-btn').style.display = 'none';
  document.getElementById('game-area').style.display = 'block';

  // Pick 4 random pairs
  const shuffledPairs = [...gamePairs].sort(() => Math.random() - 0.5).slice(0, 4);
  totalPairs = shuffledPairs.length;

  // Shuffle terms and defs independently
  const terms = [...shuffledPairs].sort(() => Math.random() - 0.5);
  const defs = [...shuffledPairs].sort(() => Math.random() - 0.5);

  const termsCol = document.getElementById('terms-col');
  const defsCol = document.getElementById('defs-col');

  termsCol.innerHTML = '<h4>Terms</h4>';
  defsCol.innerHTML = '<h4>Definitions</h4>';

  terms.forEach(pair => {
    const tile = document.createElement('div');
    tile.className = 'game-tile';
    tile.textContent = pair.term;
    tile.dataset.id = pair.term;
    tile.dataset.type = 'term';
    tile.onclick = () => selectTile(tile, 'term', pair.term);
    termsCol.appendChild(tile);
  });

  defs.forEach(pair => {
    const tile = document.createElement('div');
    tile.className = 'game-tile';
    tile.textContent = pair.def;
    tile.dataset.id = pair.term; // same key as term
    tile.dataset.type = 'def';
    tile.onclick = () => selectTile(tile, 'def', pair.term);
    defsCol.appendChild(tile);
  });

  // Start timer
  clearInterval(gameTimerInterval);
  gameTimerInterval = setInterval(() => {
    gameTimeLeft--;
    document.getElementById('game-timer').textContent = gameTimeLeft;
    if (gameTimeLeft <= 0) {
      clearInterval(gameTimerInterval);
      endGame(false);
    }
  }, 1000);
}

function selectTile(tile, type, id) {
  if (!gameActive) return;
  if (tile.classList.contains('matched')) return;

  if (type === 'term') {
    // Deselect previous term
    document.querySelectorAll('.game-tile[data-type="term"].selected')
      .forEach(t => t.classList.remove('selected'));
    tile.classList.add('selected');
    selectedTerm = { el: tile, id };
  } else {
    document.querySelectorAll('.game-tile[data-type="def"].selected')
      .forEach(t => t.classList.remove('selected'));
    tile.classList.add('selected');
    selectedDef = { el: tile, id };
  }

  if (selectedTerm && selectedDef) {
    checkMatch();
  }
}

function checkMatch() {
  const isMatch = selectedTerm.id === selectedDef.id;
  const feedback = document.getElementById('game-feedback');

  if (isMatch) {
    selectedTerm.el.classList.remove('selected');
    selectedTerm.el.classList.add('matched');
    selectedDef.el.classList.remove('selected');
    selectedDef.el.classList.add('matched');
    selectedTerm.el.onclick = null;
    selectedDef.el.onclick = null;

    const points = 10 * comboCount;
    gameCurrentScore += points;
    comboCount++;

    document.getElementById('game-score').textContent = gameCurrentScore;
    document.getElementById('combo').textContent = `x${comboCount}`;
    feedback.style.color = 'var(--green)';
    feedback.textContent = `✅ Correct! +${points} pts | Combo x${comboCount}`;

    matchedCount++;
    if (matchedCount === totalPairs) {
      clearInterval(gameTimerInterval);
      setTimeout(() => endGame(true), 600);
    }
  } else {
    selectedTerm.el.classList.add('wrong');
    selectedDef.el.classList.add('wrong');
    comboCount = 1;
    document.getElementById('combo').textContent = 'x1';
    feedback.style.color = 'var(--red)';
    feedback.textContent = '❌ Wrong match! Combo reset.';
    setTimeout(() => {
      selectedTerm.el.classList.remove('wrong', 'selected');
      selectedDef.el.classList.remove('wrong', 'selected');
    }, 500);
  }

  selectedTerm = null;
  selectedDef = null;
}

function endGame(won) {
  gameActive = false;
  document.getElementById('game-area').style.display = 'none';
  const result = document.getElementById('game-result');
  result.classList.remove('hidden');

  if (won) {
    const bonus = gameTimeLeft * 2;
    const total = gameCurrentScore + bonus;
    document.getElementById('result-title').textContent = `🏆 You Won! ${total} pts`;
    document.getElementById('result-msg').textContent =
      `Matched all pairs! +${bonus} time bonus. +${Math.floor(total/5)} XP`;
    addXP(Math.floor(total / 5));
  } else {
    document.getElementById('result-title').textContent = `⏰ Time's Up! ${gameCurrentScore} pts`;
    document.getElementById('result-msg').textContent =
      `Matched ${matchedCount}/${totalPairs} pairs. Try again!`;
    addXP(gameCurrentScore > 0 ? 5 : 0);
  }
  document.getElementById('start-game-btn').style.display = 'block';
}

// ─── QUIZ DATA ───────────────────────────────
const quizData = {
  Beginner: [
    { q: "What does AI stand for?", options: ["Automated Intelligence", "Artificial Intelligence", "Automated Information", "Analytical Intelligence"], correct: 1, explanation: "AI stands for Artificial Intelligence — simulating human intelligence in machines." },
    { q: "Which of these is an example of Narrow AI?", options: ["A robot that can do any job", "Siri answering questions", "HAL 9000 from 2001", "A conscious computer"], correct: 1, explanation: "Siri is Narrow AI — designed for one specific task (voice assistance). General AI doesn't exist yet." },
    { q: "What is the term for the dataset used to teach an ML model?", options: ["Test Data", "Training Data", "Validation Data", "Sample Data"], correct: 1, explanation: "Training data is the labelled dataset used to teach the model to recognise patterns." },
    { q: "Which type of ML uses labelled training data?", options: ["Unsupervised Learning", "Reinforcement Learning", "Supervised Learning", "Transfer Learning"], correct: 2, explanation: "Supervised Learning trains on labelled data — questions paired with correct answers." },
    { q: "Machine Learning is a subset of ___?", options: ["Deep Learning", "Artificial Intelligence", "Data Science", "Robotics"], correct: 1, explanation: "Machine Learning is a subset of AI where machines learn from data." }
  ],
  Intermediate: [
    { q: "A neural network is inspired by the human ___?", options: ["Heart", "Lungs", "Brain", "Eyes"], correct: 2, explanation: "Neural networks mimic how neurons in the human brain are connected and communicate." },
    { q: "Which algorithm learns by trial and error with rewards?", options: ["Supervised Learning", "Reinforcement Learning", "Clustering", "Regression"], correct: 1, explanation: "Reinforcement Learning agents learn by receiving rewards for good actions and penalties for bad ones." },
    { q: "When a model performs well on training data but poorly on new data, this is called ___?", options: ["Underfitting", "Overfitting", "Normalisation", "Bias"], correct: 1, explanation: "Overfitting: the model memorises training examples instead of learning generalizable patterns." },
    { q: "Which company built the AI that defeated the world Go champion?", options: ["OpenAI", "Meta", "DeepMind", "Microsoft"], correct: 2, explanation: "DeepMind's AlphaGo defeated world champion Lee Sedol in 2016 using reinforcement learning." },
    { q: "What is the role of Hidden Layers in a Neural Network?", options: ["To store data permanently", "To directly output results", "To process and find patterns in data", "To display UI"], correct: 2, explanation: "Hidden layers process the input data and extract complex features/patterns." }
  ],
  Advanced: [
    { q: "What does NLP stand for?", options: ["Neural Learning Protocol", "Non-Linear Processing", "Natural Language Processing", "Numeric Logic Programming"], correct: 2, explanation: "NLP = Natural Language Processing. It enables AI to understand and generate human language." },
    { q: "'Deep' in Deep Learning refers to ___?", options: ["How complex the code is", "Number of hidden layers in neural networks", "Speed of computation", "The size of training data"], correct: 1, explanation: "Deep Learning = neural networks with many hidden layers. More layers = deeper = more complex patterns learned." },
    { q: "Which of the following is NOT a common activation function?", options: ["ReLU", "Sigmoid", "Linear Regression", "Tanh"], correct: 2, explanation: "Linear Regression is an algorithm, not an activation function (like ReLU or Sigmoid)." },
    { q: "What is Gradient Descent used for?", options: ["Increasing data size", "Optimizing and minimizing model error", "Adding layers to networks", "Translating text"], correct: 1, explanation: "Gradient descent is an optimization algorithm used to minimize the cost/error function." },
    { q: "Which type of learning is typically used for clustering data into groups?", options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Transfer Learning"], correct: 1, explanation: "Unsupervised learning finds hidden patterns and clusters unlabelled data." }
  ]
};

// ─── QUIZ LOGIC ──────────────────────────────
let currentQuizLevel = 'Beginner';
let currentQuizQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let quizAnswers = [];

function startQuiz(level) {
  currentQuizLevel = level;
  currentQuizQuestions = quizData[level];
  quizIndex = 0;
  quizScore = 0;
  quizAnswers = [];
  document.getElementById('quiz-start').classList.add('hidden');
  document.getElementById('quiz-result').classList.add('hidden');
  document.getElementById('quiz-active').classList.remove('hidden');
  renderQuestion();
}

function renderQuestion() {
  const q = currentQuizQuestions[quizIndex];
  const progress = ((quizIndex) / currentQuizQuestions.length) * 100;

  document.getElementById('quiz-progress-fill').style.width = progress + '%';
  document.getElementById('q-number').textContent = `Q ${quizIndex + 1} of ${currentQuizQuestions.length}`;
  document.getElementById('q-score-live').textContent = `Score: ${quizScore}`;
  document.getElementById('quiz-question').textContent = q.q;
  document.getElementById('quiz-feedback').className = 'quiz-feedback hidden';
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('next-q-btn').classList.add('hidden');

  const optionsDiv = document.getElementById('quiz-options');
  optionsDiv.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i, btn);
    optionsDiv.appendChild(btn);
  });
}

function selectAnswer(index, btn) {
  const q = currentQuizQuestions[quizIndex];
  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);

  const feedback = document.getElementById('quiz-feedback');
  feedback.classList.remove('hidden');

  if (index === q.correct) {
    btn.classList.add('correct');
    quizScore++;
    feedback.className = 'quiz-feedback correct';
    feedback.textContent = '✅ Correct! ' + q.explanation;
    quizAnswers.push(true);
    addXP(10);
  } else {
    btn.classList.add('incorrect');
    allBtns[q.correct].classList.add('correct');
    feedback.className = 'quiz-feedback incorrect';
    feedback.textContent = '❌ Wrong! ' + q.explanation;
    quizAnswers.push(false);
  }

  document.getElementById('next-q-btn').classList.remove('hidden');
}

function nextQuestion() {
  quizIndex++;
  if (quizIndex >= currentQuizQuestions.length) {
    showQuizResult();
  } else {
    renderQuestion();
  }
}

function showQuizResult() {
  document.getElementById('quiz-active').classList.add('hidden');
  document.getElementById('quiz-result').classList.remove('hidden');
  document.getElementById('quiz-progress-fill').style.width = '100%';

  const pct = Math.round((quizScore / currentQuizQuestions.length) * 100);
  let emoji = '😐', comment = "Keep studying — you'll get there!";
  if (pct >= 80) { emoji = '🏆'; comment = "Outstanding! You're an AI genius!"; }
  else if (pct >= 60) { emoji = '🎉'; comment = "Great work! Strong foundation!"; }
  else if (pct >= 40) { emoji = '👍'; comment = "Good effort! Review the modules."; }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-score-text').textContent = `${quizScore} / ${currentQuizQuestions.length} — ${pct}%`;
  document.getElementById('result-comment').textContent = comment;

  const correct = quizAnswers.filter(Boolean).length;
  const wrong = quizAnswers.length - correct;
  document.getElementById('result-breakdown').innerHTML = `
    <div class="breakdown-item">✅ Correct: <span>${correct}</span></div>
    <div class="breakdown-item">❌ Wrong: <span>${wrong}</span></div>
    <div class="breakdown-item">⚡ XP Earned: <span>${correct * 10}</span></div>
    <div class="breakdown-item">🎯 Accuracy: <span>${pct}%</span></div>
  `;

  // Store quiz score in user profile
  if (user) {
    user.quizScores[currentQuizLevel] = Math.max(user.quizScores[currentQuizLevel] || 0, quizScore);
    localStorage.setItem('aicodelab_user', JSON.stringify(user));
    let usersDB = JSON.parse(localStorage.getItem('learnohub_users_db')) || {};
    if (usersDB[user.email]) {
        usersDB[user.email] = user;
        localStorage.setItem('learnohub_users_db', JSON.stringify(usersDB));
    }
  }
}

function restartQuiz() {
  document.getElementById('quiz-result').classList.add('hidden');
  document.getElementById('quiz-start').classList.remove('hidden');
}

// ─── DASHBOARD ──────────────────────────────
function updateDashboard() {
  if (user) {
    document.getElementById('dash-email').textContent = user.email;
    document.getElementById('dash-xp').textContent = xp;
    document.getElementById('dash-board-xp').textContent = xp + ' XP';
    
    // Modules completion
    const modulesCompleted = user.completedModules ? user.completedModules.length : 0;
    document.getElementById('dash-modules').textContent = `${modulesCompleted} / 4`;

    // Quiz scores
    const quizScores = user.quizScores || {};
    const quizList = document.getElementById('dash-quiz-scores');
    quizList.innerHTML = `
      <li>Beginner: <span style="color: var(--${quizScores['Beginner'] !== undefined ? 'green' : 'accent'});">${quizScores['Beginner'] !== undefined ? quizScores['Beginner'] + '/5' : 'Not taken'}</span></li>
      <li>Intermediate: <span style="color: var(--${quizScores['Intermediate'] !== undefined ? 'green' : 'accent'});">${quizScores['Intermediate'] !== undefined ? quizScores['Intermediate'] + '/5' : 'Not taken'}</span></li>
      <li>Advanced: <span style="color: var(--${quizScores['Advanced'] !== undefined ? 'green' : 'accent'});">${quizScores['Advanced'] !== undefined ? quizScores['Advanced'] + '/5' : 'Not taken'}</span></li>
    `;

    // Overall progress calculation (Modules 40%, Quizzes 60%)
    let quizzesTaken = 0;
    let totalQuizScore = 0;
    ['Beginner', 'Intermediate', 'Advanced'].forEach(level => {
      if (quizScores[level] !== undefined) {
        quizzesTaken++;
        totalQuizScore += quizScores[level];
      }
    });

    const moduleProgress = (modulesCompleted / 4) * 40;
    const quizProgress = quizzesTaken > 0 ? (totalQuizScore / 15) * 60 : 0;
    const overallProgress = Math.round(moduleProgress + quizProgress);

    document.getElementById('dash-progress-text').textContent = `${overallProgress}%`;
    document.getElementById('dash-progress-fill').style.width = `${overallProgress}%`;
  }
}

// ─── PYTHON PLAYGROUND ──────────────────────
let pyodideReady = false;
let pyodideInstance = null;

async function initPyodide() {
  if (pyodideReady) return;
  document.getElementById('python-output').textContent = 'Loading Python engine (Pyodide)...';
  try {
    pyodideInstance = await loadPyodide();
    pyodideReady = true;
    document.getElementById('python-output').textContent = 'Ready! Click "Run Code" to execute.';
  } catch (err) {
    document.getElementById('python-output').textContent = 'Error loading Python engine.';
  }
}

async function runPython() {
  const outputEl = document.getElementById('python-output');
  if (!pyodideReady) {
    await initPyodide();
  }
  
  const code = document.getElementById('python-code').value;
  outputEl.textContent = 'Running...';
  
  try {
    // Capture stdout
    pyodideInstance.runPython(`
import sys
import io
sys.stdout = io.StringIO()
    `);
    
    pyodideInstance.runPython(code);
    
    const stdout = pyodideInstance.runPython("sys.stdout.getvalue()");
    outputEl.textContent = stdout || "Code executed successfully with no output.";
    addXP(5); // Reward for running code
  } catch (err) {
    outputEl.textContent = err;
  }
}

// Initialize Pyodide early if possible, or lazy load
setTimeout(initPyodide, 2000);

// ─── SPAM SIMULATOR ─────────────────────────
function checkSpam() {
  const input = document.getElementById('spam-input').value.toLowerCase();
  const resultEl = document.getElementById('spam-result');
  resultEl.classList.remove('hidden');
  
  if (!input) {
    resultEl.textContent = "Please enter a message.";
    resultEl.style.background = 'var(--surface2)';
    resultEl.style.color = 'var(--text)';
    return;
  }
  
  // Simple heuristic-based naive mock model
  const spamKeywords = ['lottery', 'win', 'free', 'prize', 'urgent', 'click here', 'claim', 'money', 'cash', 'viagra', 'investment'];
  let spamScore = 0;
  
  spamKeywords.forEach(word => {
    if (input.includes(word)) spamScore += 1;
  });
  
  if (spamScore >= 2 || (spamScore === 1 && input.includes('!'))) {
    resultEl.textContent = `🚨 CLASSIFIED AS SPAM (Confidence: ${Math.min(99, 50 + spamScore * 15)}%)`;
    resultEl.style.background = 'rgba(255, 82, 82, 0.1)';
    resultEl.style.color = 'var(--red)';
    resultEl.style.border = '1px solid var(--red)';
  } else {
    resultEl.textContent = `✅ CLASSIFIED AS SAFE (Confidence: ${Math.min(99, 70 + (2 - spamScore) * 10)}%)`;
    resultEl.style.background = 'rgba(0, 230, 118, 0.1)';
    resultEl.style.color = 'var(--green)';
    resultEl.style.border = '1px solid var(--green)';
  }
  
  addXP(2); // Small reward
}
