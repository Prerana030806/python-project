// ==========================================
// LearnoHub AI - Application Logic
// ==========================================

const modulesData = [
    {
        id: 'mod-1',
        title: 'Introduction to AI',
        level: 'Beginner',
        description: 'Understand the fundamental concepts of Artificial Intelligence and what makes machines "smart".',
        content: `
            <p><strong>Artificial Intelligence (AI)</strong> is the broad concept of machines being able to carry out tasks in a way that we would consider "smart". It is the simulation of human intelligence processes by computer systems.</p>
            <p>These processes include learning (the acquisition of information and rules for using the information), reasoning (using the rules to reach approximate or definite conclusions) and self-correction.</p>
        `,
        example: 'Voice assistants like Siri and Alexa use AI to understand your voice commands and fetch the requested information or perform tasks.',
        questions: [
            { q: "What does AI stand for?", options: ["Automated Intelligence", "Artificial Intelligence", "Algorithmic Intuition", "Advanced Information"], answer: 1 },
            { q: "Which of the following is NOT a core process of AI?", options: ["Learning", "Reasoning", "Digesting", "Self-correction"], answer: 2 },
            { q: "Is a simple calculator considered AI?", options: ["Yes", "No", "Only on mobile", "Sometimes"], answer: 1 },
            { q: "Which real-world application uses AI heavily?", options: ["A mechanical watch", "A light switch", "Self-driving cars", "A bicycle"], answer: 2 },
            { q: "Narrow AI refers to systems that:", options: ["Can do anything a human can do", "Are exceptionally small", "Can perform only a specific task", "Are broken"], answer: 2 },
        ]
    },
    {
        id: 'mod-2',
        title: 'Machine Learning 101',
        level: 'Intermediate',
        description: 'Dive into how machines learn from data without being explicitly programmed.',
        content: `
            <p><strong>Machine Learning (ML)</strong> is a subset of AI that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.</p>
            <p>Instead of writing code that tells the computer exactly what to do step-by-step, we feed the computer data and let it recognize patterns and make decisions based on that data. There are three main types: Supervised, Unsupervised, and Reinforcement Learning.</p>
        `,
        example: 'Email platforms use Machine Learning algorithms to analyze thousands of emails, learning to automatically filter out Spam messages from your inbox.',
        questions: [
            { q: "What is Machine Learning?", options: ["Writing explicit rules", "Learning from data", "Building hardware", "A new programming language"], answer: 1 },
            { q: "Which type of learning uses labeled data?", options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "None of the above"], answer: 0 },
            { q: "What is the primary input for a Machine Learning model?", options: ["Keyboards", "Data", "Monitors", "CSS"], answer: 1 },
            { q: "Which is a common application of ML?", options: ["Email spam filtering", "Boiling water", "Typing a document manually", "A mechanical clock"], answer: 0 },
            { q: "If an ML model learns by trial and error driven by rewards, it is using:", options: ["Supervised learning", "Reinforcement learning", "Unsupervised learning", "Deep learning"], answer: 1 },
        ]
    },
    {
        id: 'mod-3',
        title: 'Neural Networks & Deep Learning',
        level: 'Advanced',
        description: 'Explore the brain-inspired architecture that powers the most advanced AI today.',
        content: `
            <p><strong>Neural Networks</strong> are computing systems inspired by the biological neural networks that constitute human brains. They consist of layers of interconnected "nodes" or "neurons".</p>
            <p><strong>Deep Learning</strong> is a specialized form of machine learning that utilizes complex, multi-layered neural networks. The "deep" refers to the number of layers the network has. It is exceptionally good at processing unstructured data like images, audio, and text.</p>
        `,
        example: 'Facial recognition systems on modern smartphones use deep learning neural networks to analyze and map your facial features securely in milliseconds.',
        questions: [
            { q: "What biological system inspired Neural Networks?", options: ["The human digestive system", "The skeletal system", "The human brain", "Plant roots"], answer: 2 },
            { q: "What does 'Deep' refer to in Deep Learning?", options: ["Deep philosophical concepts", "Many hidden layers in the network", "Deep sea exploration", "The amount of data"], answer: 1 },
            { q: "What are the individual processing units in a neural network called?", options: ["CPUs", "Receptors", "Neurons/Nodes", "Switches"], answer: 2 },
            { q: "Which data type is Deep Learning particularly good at handling?", options: ["Excel spreadsheets", "Unstructured data like images/audio", "Small text files", "Simple math equations"], answer: 1 },
            { q: "Facial recognition primarily utilizes:", options: ["Basic 'If/Else' rules", "Deep Learning Neural Networks", "Manual data entry", "Bluetooth"], answer: 1 },
        ]
    }
];

const app = {
    user: null, // { email, progress: { 'mod-1': { score: 4, completed: true } } }
    views: ['login', 'dashboard', 'modules', 'module-detail', 'quiz', 'quiz-results'],
    
    // Quiz state
    currentModuleId: null,
    currentQuizIndex: 0,
    currentScore: 0,

    init() {
        this.bindEvents();
        this.checkAuth();
    },

    bindEvents() {
        document.getElementById('auth-form').addEventListener('submit', (e) => this.handleAuth(e));
        document.getElementById('start-quiz-btn').addEventListener('click', () => this.startQuiz());
        document.getElementById('quiz-next-btn').addEventListener('click', () => this.nextQuestion());
    },

    // --- Navigation ---
    navigate(viewId) {
        if (!this.user && viewId !== 'login') {
            this.navigate('login');
            return;
        }

        this.views.forEach(v => {
            document.getElementById(`view-${v}`).classList.add('hide');
        });
        document.getElementById(`view-${viewId}`).classList.remove('hide');
        
        window.scrollTo(0, 0);

        if (viewId === 'dashboard') this.renderDashboard();
        if (viewId === 'modules') this.renderModulesList();
        
        this.updateNavUI();
    },

    updateNavUI() {
        const navActions = document.getElementById('nav-actions');
        if (this.user) {
            navActions.innerHTML = `
                <span class="text-sm font-medium text-slate-500 hidden sm:inline-block">${this.user.email}</span>
                <button onclick="app.navigate('dashboard')" class="text-slate-600 hover:text-brand-600 font-medium transition-colors">Dashboard</button>
                <button onclick="app.logout()" class="text-red-500 hover:text-red-700 font-medium transition-colors ml-4">Logout</button>
            `;
        } else {
            navActions.innerHTML = `
                <button onclick="app.navigate('login')" class="text-brand-600 font-medium">Log In</button>
            `;
        }
    },

    // --- Auth ---
    checkAuth() {
        const stored = localStorage.getItem('learnohub_user');
        if (stored) {
            this.user = JSON.parse(stored);
            this.navigate('dashboard');
        } else {
            this.navigate('login');
        }
    },

    handleAuth(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorEl = document.getElementById('auth-error');

        if (!email || !password) {
            errorEl.textContent = 'Please fill out all fields.';
            errorEl.classList.remove('hidden');
            return;
        }
        
        errorEl.classList.add('hidden');

        // Mock auth logic
        let users = JSON.parse(localStorage.getItem('learnohub_users_db')) || {};
        
        if (!users[email]) {
            users[email] = { email, password, progress: {} };
        } 
        
        if (users[email].password !== password) {
            errorEl.textContent = 'Invalid credentials.';
            errorEl.classList.remove('hidden');
            return;
        }

        localStorage.setItem('learnohub_users_db', JSON.stringify(users));
        this.user = users[email];
        this.saveSession();
        
        // Reset form
        document.getElementById('auth-form').reset();
        this.navigate('dashboard');
    },

    logout() {
        this.user = null;
        localStorage.removeItem('learnohub_user');
        this.navigate('login');
    },

    saveSession() {
        localStorage.setItem('learnohub_user', JSON.stringify(this.user));
        // Sync to DB
        let users = JSON.parse(localStorage.getItem('learnohub_users_db')) || {};
        users[this.user.email] = this.user;
        localStorage.setItem('learnohub_users_db', JSON.stringify(users));
    },

    // --- Dashboard ---
    renderDashboard() {
        document.getElementById('dash-user').textContent = this.user.email.split('@')[0];

        let totalScore = 0;
        let quizzesTaken = 0;
        let modulesCompleted = 0;
        
        let scoresHtml = '';

        modulesData.forEach(mod => {
            const prog = this.user.progress[mod.id];
            if (prog && prog.completed) {
                modulesCompleted++;
                totalScore += prog.score;
                quizzesTaken++;
                
                scoresHtml += `
                    <div class="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div>
                            <p class="font-semibold text-slate-900">${mod.title}</p>
                            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">${mod.level}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-xl font-bold ${prog.score >= 4 ? 'text-green-600' : 'text-brand-600'}">${prog.score}/5</span>
                        </div>
                    </div>
                `;
            } else {
                scoresHtml += `
                    <div class="px-6 py-4 flex items-center justify-between opacity-50">
                        <div>
                            <p class="font-medium text-slate-700">${mod.title}</p>
                        </div>
                        <div class="text-right">
                            <span class="text-sm font-medium text-slate-400">Not taken</span>
                        </div>
                    </div>
                `;
            }
        });

        document.getElementById('stat-modules').textContent = `${modulesCompleted} / ${modulesData.length}`;
        
        const avgScore = quizzesTaken > 0 ? ((totalScore / (quizzesTaken * 5)) * 100).toFixed(0) : 0;
        document.getElementById('stat-score').textContent = `${avgScore}%`;

        const totalProgress = ((modulesCompleted / modulesData.length) * 100).toFixed(0);
        document.getElementById('stat-progress-text').textContent = `${totalProgress}%`;
        
        // Timeout to allow DOM paint for CSS transition to work
        setTimeout(() => {
            document.getElementById('stat-progress-bar').style.width = `${totalProgress}%`;
        }, 100);

        document.getElementById('dashboard-scores-list').innerHTML = scoresHtml;
    },

    // --- Modules Handling ---
    renderModulesList() {
        const grid = document.getElementById('modules-grid');
        let html = '';

        modulesData.forEach(mod => {
            const prog = this.user.progress[mod.id] || { completed: false };
            const statusHtml = prog.completed 
                ? `<span class="inline-flex items-center text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded"><svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg> Completed</span>`
                : `<span class="inline-flex items-center text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">Pending</span>`;

            html += `
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-200 cursor-pointer transition-all flex flex-col h-full" onclick="app.openModuleDetail('${mod.id}')">
                    <div class="flex justify-between items-start mb-4">
                        <span class="text-xs font-bold uppercase tracking-wider text-brand-600">${mod.level}</span>
                        ${statusHtml}
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">${mod.title}</h3>
                    <p class="text-sm text-slate-500 leading-relaxed flex-grow">${mod.description}</p>
                    <div class="mt-6 pt-4 border-t border-slate-100 flex items-center text-brand-600 font-semibold text-sm group">
                        Start Module
                        <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;
    },

    openModuleDetail(id) {
        const mod = modulesData.find(m => m.id === id);
        if (!mod) return;
        
        this.currentModuleId = mod.id;

        document.getElementById('detail-level').textContent = mod.level;
        document.getElementById('detail-title').textContent = mod.title;
        document.getElementById('detail-desc').textContent = mod.description;
        document.getElementById('detail-content').innerHTML = mod.content;
        document.getElementById('detail-example').textContent = mod.example;

        this.navigate('module-detail');
    },

    // --- Quiz Handling ---
    startQuiz() {
        this.currentQuizIndex = 0;
        this.currentScore = 0;
        const mod = modulesData.find(m => m.id === this.currentModuleId);
        document.getElementById('quiz-title').textContent = `${mod.title} Quiz`;
        
        this.navigate('quiz');
        this.renderQuizQuestion();
    },

    renderQuizQuestion() {
        const mod = modulesData.find(m => m.id === this.currentModuleId);
        const qData = mod.questions[this.currentQuizIndex];

        document.getElementById('quiz-progress-text').textContent = `Question ${this.currentQuizIndex + 1} of ${mod.questions.length}`;
        document.getElementById('quiz-progress-bar').style.width = `${((this.currentQuizIndex) / mod.questions.length) * 100}%`;
        
        document.getElementById('quiz-question').textContent = qData.q;
        
        const optsContainer = document.getElementById('quiz-options');
        optsContainer.innerHTML = '';

        qData.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = "w-full text-left px-5 py-4 rounded-xl border-2 border-slate-100 font-medium text-slate-700 hover:border-brand-500 hover:bg-brand-50 transition-colors focus:outline-none";
            btn.textContent = opt;
            btn.onclick = () => this.selectAnswer(idx, btn, qData.answer);
            optsContainer.appendChild(btn);
        });

        document.getElementById('quiz-feedback').classList.add('hidden');
        document.getElementById('quiz-next-btn').classList.add('hidden');
    },

    selectAnswer(selectedIndex, btnNode, correctIndex) {
        // Disable all buttons to prevent multiple clicks
        const allBtns = document.getElementById('quiz-options').querySelectorAll('button');
        allBtns.forEach(b => b.disabled = true);

        const feedbackBlock = document.getElementById('quiz-feedback');
        const feedbackIcon = document.getElementById('quiz-feedback-icon');
        const feedbackText = document.getElementById('quiz-feedback-text');

        if (selectedIndex === correctIndex) {
            btnNode.classList.remove('border-slate-100', 'hover:border-brand-500', 'hover:bg-brand-50');
            btnNode.classList.add('border-green-500', 'bg-green-50', 'text-green-800');
            this.currentScore++;
            
            feedbackBlock.classList.remove('hidden', 'bg-red-50', 'text-red-800', 'border', 'border-red-200');
            feedbackBlock.classList.add('bg-green-50', 'text-green-800', 'border', 'border-green-200');
            feedbackIcon.textContent = '✅';
            feedbackText.textContent = 'Correct answer!';
        } else {
            btnNode.classList.remove('border-slate-100', 'hover:border-brand-500', 'hover:bg-brand-50');
            btnNode.classList.add('border-red-500', 'bg-red-50', 'text-red-800');
            
            // Highlight correct one
            allBtns[correctIndex].classList.remove('border-slate-100');
            allBtns[correctIndex].classList.add('border-green-500', 'bg-green-50');

            feedbackBlock.classList.remove('hidden', 'bg-green-50', 'text-green-800', 'border', 'border-green-200');
            feedbackBlock.classList.add('bg-red-50', 'text-red-800', 'border', 'border-red-200');
            feedbackIcon.textContent = '❌';
            feedbackText.textContent = 'Incorrect. The highlighted answer was correct.';
        }

        document.getElementById('quiz-next-btn').classList.remove('hidden');
        
        if (this.currentQuizIndex === modulesData.find(m => m.id === this.currentModuleId).questions.length - 1) {
            document.getElementById('quiz-next-btn').textContent = "Finish Quiz";
        } else {
            document.getElementById('quiz-next-btn').textContent = "Next Question";
        }
    },

    nextQuestion() {
        const modLength = modulesData.find(m => m.id === this.currentModuleId).questions.length;
        this.currentQuizIndex++;
        
        if (this.currentQuizIndex >= modLength) {
            this.finishQuiz();
        } else {
            this.renderQuizQuestion();
        }
    },

    finishQuiz() {
        // Save progress to user state
        const prog = this.user.progress[this.currentModuleId] || { score: 0 };
        // Save highest score
        if (this.currentScore > (prog.score || 0)) {
            prog.score = this.currentScore;
        }
        prog.completed = true;
        this.user.progress[this.currentModuleId] = prog;
        this.saveSession();

        const modLength = modulesData.find(m => m.id === this.currentModuleId).questions.length;
        document.getElementById('result-score').textContent = this.currentScore;
        
        const pcnt = this.currentScore / modLength;
        let icon = '🏆';
        let msg = 'Excellent work!';
        
        if (pcnt < 0.5) {
            icon = '📚';
            msg = 'Good attempt. Consider re-reading the module!';
        } else if (pcnt < 0.8) {
            icon = '👍';
            msg = 'Well done! A solid understanding.';
        }
        
        document.getElementById('result-icon').textContent = icon;
        document.getElementById('result-message').textContent = msg;

        this.navigate('quiz-results');
    }
};

// Start app
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
