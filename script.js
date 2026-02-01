// ================ STATE MANAGEMENT ================
let currentUser = null;
let isMaker = false;
let selectedRole = 'user';
let selectedDuration = 30;
let soundStates = {
    login: false,
    loading: false,
    bug: false,
    account: false,
    bgm: false
};

// ================ ELEMENT REFERENCES ================
// Screens
const loginScreen = document.getElementById('loginScreen');
const loadingScreen = document.getElementById('loadingScreen');
const bugMenuScreen = document.getElementById('bugMenuScreen');
const accountCreationScreen = document.getElementById('accountCreationScreen');

// Videos
const loginVideo = document.getElementById('loginVideo');
const loadingVideo = document.getElementById('loadingVideo');
const bugVideo = document.getElementById('bugVideo');
const accountVideo = document.getElementById('accountVideo');

// BGM Players
const bgmLogin = document.getElementById('bgmLogin');
const bgmBugMenu = document.getElementById('bgmBugMenu');
const bgmAccountCreation = document.getElementById('bgmAccountCreation');

// Buttons
const loginBtn = document.getElementById('loginBtn');
const skipBtn = document.getElementById('skipBtn');
const sendBugBtn = document.getElementById('sendBugBtn');
const createAccountBtn = document.getElementById('createAccountBtn');
const createAccBtn = document.getElementById('createAccBtn');
const backBtn = document.getElementById('backBtn');
const musicToggleBtn = document.getElementById('musicToggleBtn');

// Sound toggle buttons
const loginSoundBtn = document.getElementById('loginSoundBtn');
const loadingSoundBtn = document.getElementById('loadingSoundBtn');
const bugSoundBtn = document.getElementById('bugSoundBtn');
const accountSoundBtn = document.getElementById('accountSoundBtn');

// Inputs
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const targetNumberInput = document.getElementById('targetNumber');
const bugTypeSelect = document.getElementById('bugType');
const newUsernameInput = document.getElementById('newUsername');
const newPasswordInput = document.getElementById('newPassword');

// UI Elements
const logBox = document.getElementById('logBox');
const popup = document.getElementById('popup');

// Role options
const roleReseller = document.getElementById('roleReseller');
const roleUser = document.getElementById('roleUser');

// Duration options
const durationOptions = document.querySelectorAll('.duration-option');

// ================ INITIALIZE SYSTEM ================
function init() {
    console.log('DARKSIDE v1.2 Initializing...');
    
    // Initialize BGM players
    [bgmLogin, bgmBugMenu, bgmAccountCreation].forEach(bgm => {
        if (bgm) {
            bgm.volume = 0.3;
            bgm.loop = true;
        }
    });
    
    // Set default selections
    selectRole('user');
    selectDuration(30);
    
    // Initialize videos
    initVideos();
    
    // Setup event listeners
    setupEventListeners();
    
    // Force play login video
    setTimeout(() => {
        if (loginVideo && loginVideo.paused) {
            loginVideo.play().catch(() => {});
        }
    }, 500);
}

// ================ VIDEO INITIALIZATION ================
function initVideos() {
    const videos = [loginVideo, loadingVideo, bugVideo, accountVideo];
    
    videos.forEach(video => {
        if (video) {
            video.muted = true;
            video.playsInline = true;
            
            // Add error handling
            video.addEventListener('error', function() {
                console.log('Video error:', video.id);
                setTimeout(() => {
                    video.load();
                    video.play().catch(() => {});
                }, 1000);
            });
            
            // Try to play when loaded
            video.addEventListener('loadeddata', function() {
                video.play().catch(() => {});
            });
        }
    });
}

// ================ EVENT LISTENERS SETUP ================
function setupEventListeners() {
    // Login button
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }
    
    // Skip button
    if (skipBtn) {
        skipBtn.addEventListener('click', skipLoading);
    }
    
    // Send bug button
    if (sendBugBtn) {
        sendBugBtn.addEventListener('click', sendBug);
    }
    
    // Create account buttons
    if (createAccountBtn) {
        createAccountBtn.addEventListener('click', goToCreateAccount);
    }
    
    if (createAccBtn) {
        createAccBtn.addEventListener('click', createNewAccount);
    }
    
    // Back button
    if (backBtn) {
        backBtn.addEventListener('click', backToBugMenu);
    }
    
    // Music toggle button
    if (musicToggleBtn) {
        musicToggleBtn.addEventListener('click', toggleBGM);
    }
    
    // Sound toggle buttons
    if (loginSoundBtn) {
        loginSoundBtn.addEventListener('click', () => toggleSound('login'));
    }
    
    if (loadingSoundBtn) {
        loadingSoundBtn.addEventListener('click', () => toggleSound('loading'));
    }
    
    if (bugSoundBtn) {
        bugSoundBtn.addEventListener('click', () => toggleSound('bug'));
    }
    
    if (accountSoundBtn) {
        accountSoundBtn.addEventListener('click', () => toggleSound('account'));
    }
    
    // Role selection
    if (roleReseller) {
        roleReseller.addEventListener('click', () => selectRole('reseller'));
    }
    
    if (roleUser) {
        roleUser.addEventListener('click', () => selectRole('user'));
    }
    
    // Duration selection
    if (durationOptions.length > 0) {
        durationOptions.forEach(option => {
            option.addEventListener('click', function() {
                const days = parseInt(this.getAttribute('data-days'));
                selectDuration(days);
            });
        });
    }
    
    // Enter key support for login
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
    
    // Enter key support for account creation
    if (newPasswordInput) {
        newPasswordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                createNewAccount();
            }
        });
    }
    
    // Target number input validation
    if (targetNumberInput) {
        targetNumberInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^\d]/g, '');
            
            if (this.value.length > 2 && !this.value.startsWith('08')) {
                this.value = '08' + this.value.substring(2);
            }
        });
    }
    
    // Unlock audio on first click
    document.addEventListener('click', function unlockAudio() {
        const videos = [loginVideo, loadingVideo, bugVideo, accountVideo];
        videos.forEach(video => {
            if (video && video.paused) {
                video.play().catch(() => {});
            }
        });
        
        // Try to start BGM
        if (soundStates.bgm) {
            playBGM('login');
        }
        
        document.removeEventListener('click', unlockAudio);
    }, { once: true });
}

// ================ BGM SYSTEM ================
function stopAllBGM() {
    [bgmLogin, bgmBugMenu, bgmAccountCreation].forEach(bgm => {
        if (bgm) {
            bgm.pause();
            bgm.currentTime = 0;
        }
    });
}

function playBGM(page) {
    if (!soundStates.bgm) return;
    
    stopAllBGM();
    
    let bgm;
    switch(page) {
        case 'login':
            bgm = bgmLogin;
            break;
        case 'bugMenu':
            bgm = bgmBugMenu;
            break;
        case 'accountCreation':
            bgm = bgmAccountCreation;
            break;
        default:
            bgm = bgmLogin;
    }
    
    if (bgm) {
        bgm.volume = 0.3;
        bgm.play().catch(() => {});
    }
}

function toggleBGM() {
    soundStates.bgm = !soundStates.bgm;
    
    if (soundStates.bgm) {
        // Determine current page
        let currentPage = 'login';
        if (loginScreen && !loginScreen.classList.contains('hidden')) currentPage = 'login';
        else if (bugMenuScreen && !bugMenuScreen.classList.contains('hidden')) currentPage = 'bugMenu';
        else if (accountCreationScreen && !accountCreationScreen.classList.contains('hidden')) currentPage = 'accountCreation';
        
        playBGM(currentPage);
    } else {
        stopAllBGM();
    }
}

// ================ SOUND CONTROLS ================
function toggleSound(type) {
    let video, btn;
    
    switch(type) {
        case 'login':
            video = loginVideo;
            btn = loginSoundBtn;
            soundStates.login = !soundStates.login;
            break;
        case 'loading':
            video = loadingVideo;
            btn = loadingSoundBtn;
            soundStates.loading = !soundStates.loading;
            break;
        case 'bug':
            video = bugVideo;
            btn = bugSoundBtn;
            soundStates.bug = !soundStates.bug;
            break;
        case 'account':
            video = accountVideo;
            btn = accountSoundBtn;
            soundStates.account = !soundStates.account;
            break;
    }
    
    if (video && btn) {
        const isOn = soundStates[type];
        video.muted = !isOn;
        video.volume = isOn ? 0.7 : 0;
        btn.textContent = `Sound: ${isOn ? 'ON' : 'OFF'}`;
        
        if (video.paused) {
            video.play().catch(() => {});
        }
    }
}

// ================ ACCOUNT SYSTEM ================
const defaultAccounts = [
    { 
        username: 'wantzy', 
        password: '123', 
        role: 'user',
        isMaker: false,
        expiresAt: null,
        createdAt: new Date().toISOString(),
        durationDays: 0,
        isPermanent: true
    },
    { 
        username: 'wann', 
        password: 'wan17', 
        role: 'maker',
        isMaker: true,
        expiresAt: null,
        createdAt: new Date().toISOString(),
        durationDays: 0,
        isPermanent: true
    }
];

function loadAccounts() {
    const stored = localStorage.getItem('darkside_accounts');
    if (!stored) {
        localStorage.setItem('darkside_accounts', JSON.stringify(defaultAccounts));
        return defaultAccounts;
    }
    return JSON.parse(stored);
}

function saveAccounts(accounts) {
    localStorage.setItem('darkside_accounts', JSON.stringify(accounts));
}

let accounts = loadAccounts();

// ================ LOGIN FUNCTION ================
function login() {
    if (!usernameInput || !passwordInput) {
        showPopup("System Error: Form not found");
        return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!username || !password) {
        showPopup("Username dan password harus diisi!");
        return;
    }
    
    // Load fresh accounts
    accounts = loadAccounts();
    
    // Find account
    const account = accounts.find(acc => acc.username === username);
    
    if (!account) {
        showPopup("Login gagal! Username tidak ditemukan.");
        return;
    }
    
    // Check password
    if (account.password !== password) {
        showPopup("Login gagal! Password salah.");
        return;
    }
    
    // Check if account expired (only for non-permanent)
    if (!account.isPermanent && account.expiresAt) {
        const now = new Date();
        const expiry = new Date(account.expiresAt);
        if (expiry < now) {
            showPopup("Akun telah kadaluarsa!");
            return;
        }
    }
    
    // Success - set user data
    currentUser = username;
    isMaker = account.isMaker || account.role === 'maker';
    
    // Hide login, show loading
    if (loginScreen) loginScreen.classList.add('hidden');
    if (loadingScreen) loadingScreen.classList.remove('hidden');
    
    // Reset and play loading video
    if (loadingVideo) {
        loadingVideo.currentTime = 0;
        loadingVideo.muted = true;
        loadingVideo.volume = 0;
        
        setTimeout(() => {
            loadingVideo.play().catch(() => {});
        }, 100);
    }
    
    // Set loading duration (10 seconds)
    const LOADING_DURATION = 10000;
    let loadingTimer = null;
    
    // Function to proceed to bug menu
    const proceed = () => {
        if (loadingTimer) clearTimeout(loadingTimer);
        
        if (loadingScreen) loadingScreen.classList.add('hidden');
        if (bugMenuScreen) bugMenuScreen.classList.remove('hidden');
        
        // Switch BGM to bug menu
        playBGM('bugMenu');
        
        // Play bug video
        if (bugVideo) {
            bugVideo.currentTime = 0;
            setTimeout(() => {
                bugVideo.play().catch(() => {});
            }, 100);
        }
        
        // Update log
        if (logBox) {
            logBox.innerHTML = '';
            updateLog(`User: ${currentUser}`);
            updateLog(`Role: ${account.role.toUpperCase()}`);
            if (account.isPermanent) {
                updateLog(`Status: PERMANENT ACCOUNT`);
            }
            updateLog(`System: READY`);
        }
        
        // Focus on target input
        setTimeout(() => {
            if (targetNumberInput) targetNumberInput.focus();
        }, 100);
    };
    
    // Set timeout for auto proceed
    loadingTimer = setTimeout(proceed, LOADING_DURATION);
    
    // Listen for video end
    if (loadingVideo) {
        loadingVideo.addEventListener('ended', proceed, { once: true });
    }
    
    // Skip button setup
    if (skipBtn) {
        skipBtn.disabled = true;
        skipBtn.style.opacity = '0.5';
        
        setTimeout(() => {
            skipBtn.disabled = false;
            skipBtn.style.opacity = '1';
        }, 8000);
    }
}

// ================ ACCOUNT CREATION ================
function selectRole(role) {
    selectedRole = role;
    
    // Update UI
    if (roleReseller) roleReseller.classList.remove('selected');
    if (roleUser) roleUser.classList.remove('selected');
    
    if (role === 'reseller' && roleReseller) {
        roleReseller.classList.add('selected');
    } else if (role === 'user' && roleUser) {
        roleUser.classList.add('selected');
    }
}

function selectDuration(days) {
    selectedDuration = days;
    
    // Update UI
    if (durationOptions.length > 0) {
        durationOptions.forEach(option => {
            option.classList.remove('selected');
            
            const optionDays = parseInt(option.getAttribute('data-days'));
            if (optionDays === days) {
                option.classList.add('selected');
            }
        });
    }
}

function goToCreateAccount() {
    if (!isMaker) {
        showPopup("Hanya akun Maker yang bisa membuat akun baru!");
        return;
    }
    
    if (bugMenuScreen) bugMenuScreen.classList.add('hidden');
    if (accountCreationScreen) accountCreationScreen.classList.remove('hidden');
    
    // Switch BGM to account creation
    playBGM('accountCreation');
    
    // Reset form
    if (newUsernameInput) newUsernameInput.value = '';
    if (newPasswordInput) newPasswordInput.value = '';
    
    // Set default selections
    selectRole('user');
    selectDuration(30);
    
    // Play account video
    if (accountVideo) {
        accountVideo.currentTime = 0;
        setTimeout(() => {
            accountVideo.play().catch(() => {});
        }, 100);
    }
    
    // Focus on username
    setTimeout(() => {
        if (newUsernameInput) newUsernameInput.focus();
    }, 100);
}

function backToBugMenu() {
    if (accountCreationScreen) accountCreationScreen.classList.add('hidden');
    if (bugMenuScreen) bugMenuScreen.classList.remove('hidden');
    
    // Switch BGM back to bug menu
    playBGM('bugMenu');
    
    // Play bug video
    if (bugVideo) {
        bugVideo.currentTime = 0;
        setTimeout(() => {
            bugVideo.play().catch(() => {});
        }, 100);
    }
    
    // Focus on target input
    setTimeout(() => {
        if (targetNumberInput) targetNumberInput.focus();
    }, 100);
}

function createNewAccount() {
    if (!isMaker) {
        showPopup("Hanya akun Maker yang bisa membuat akun baru!");
        return;
    }
    
    if (!newUsernameInput || !newPasswordInput) {
        showPopup("System Error: Form not found");
        return;
    }
    
    const newUsername = newUsernameInput.value.trim();
    const newPassword = newPasswordInput.value.trim();
    
    if (!newUsername || !newPassword) {
        showPopup("Username dan password baru harus diisi!");
        return;
    }
    
    if (newUsername.length < 3) {
        showPopup("Username minimal 3 karakter!");
        return;
    }
    
    if (newPassword.length < 3) {
        showPopup("Password minimal 3 karakter!");
        return;
    }
    
    // Load fresh accounts
    accounts = loadAccounts();
    
    // Check if username exists
    if (accounts.some(acc => acc.username === newUsername)) {
        showPopup("Username sudah terdaftar!");
        return;
    }
    
    // Calculate expiration (0 = permanent)
    let expiresAt = null;
    let isPermanent = false;
    
    if (selectedDuration === 0) {
        isPermanent = true;
        expiresAt = null;
    } else {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + selectedDuration);
        isPermanent = false;
    }
    
    // Create new account
    const newAccount = {
        username: newUsername,
        password: newPassword,
        role: selectedRole,
        isMaker: selectedRole === 'maker',
        createdBy: currentUser,
        createdAt: new Date().toISOString(),
        expiresAt: isPermanent ? null : expiresAt.toISOString(),
        durationDays: selectedDuration,
        isPermanent: isPermanent
    };
    
    // Save account
    accounts.push(newAccount);
    saveAccounts(accounts);
    
    // Success message
    const roleNames = {
        'reseller': 'Reseller',
        'user': 'User',
        'maker': 'Maker'
    };
    
    let message = `✅ AKUN BERHASIL DIBUAT!\n\n`;
    message += `Username: ${newUsername}\n`;
    message += `Password: ${newPassword}\n`;
    message += `Role: ${roleNames[selectedRole]}\n`;
    
    if (isPermanent) {
        message += `Durasi: PERMANENT 🔥\n`;
        message += `Status: TIDAK AKAN KADALUARSA\n`;
    } else {
        const durationText = selectedDuration === 1 ? '1 hari' : selectedDuration + ' hari';
        message += `Durasi: ${durationText}\n`;
        message += `Kadaluarsa: ${expiresAt.toLocaleDateString('id-ID')}\n`;
    }
    
    message += `\n⚠️ SIMPAN INFORMASI INI!`;
    
    showPopup(message);
    
    // Clear form
    newUsernameInput.value = '';
    newPasswordInput.value = '';
    
    // Reset selections
    selectRole('user');
    selectDuration(30);
    
    // Focus back
    setTimeout(() => {
        newUsernameInput.focus();
    }, 100);
}

// ================ BUG SYSTEM ================
function sendBug() {
    if (!targetNumberInput || !bugTypeSelect) return;
    
    const targetNumber = targetNumberInput.value.trim();
    const bugTypeText = bugTypeSelect.options[bugTypeSelect.selectedIndex].text;
    
    if (!targetNumber || targetNumber.length < 10 || !targetNumber.startsWith('08')) {
        showPopup("Masukkan nomor target yang valid!\n(minimal 10 digit, dimulai dengan 08)");
        targetNumberInput.focus();
        return;
    }
    
    // Clear log and start process
    if (logBox) {
        logBox.innerHTML = '';
        updateLog(`🚀 Starting bug delivery...`);
        updateLog(`📱 Target: ${targetNumber}`);
        updateLog(`🔧 Type: ${bugTypeText}`);
    }
    
    // Simulate process
    const steps = [
        "🔍 Validating target...",
        "📡 Establishing connection...",
        "⚙️ Preparing payload...",
        "🔒 Encrypting data...",
        "💉 Injecting into system...",
        "🛡️ Bypassing security...",
        "📤 Delivering payload...",
        "⚡ Activating bug..."
    ];
    
    let stepIndex = 0;
    const processInterval = setInterval(() => {
        if (stepIndex < steps.length) {
            updateLog(steps[stepIndex]);
            stepIndex++;
        } else {
            clearInterval(processInterval);
            updateLog("✅ BUG SUCCESSFULLY DELIVERED!");
            updateLog(`🎯 Target: ${targetNumber}`);
            updateLog(`📊 Status: ACTIVE`);
            
            showPopup("✅ BUG TERKIRIM!");
            targetNumberInput.value = '';
            
            // Focus back
            setTimeout(() => {
                targetNumberInput.focus();
            }, 100);
        }
    }, 800);
}

function skipLoading() {
    if (skipBtn && skipBtn.disabled) {
        showPopup("Tunggu sebentar, video hampir selesai...");
        return;
    }
    
    if (loadingScreen) loadingScreen.classList.add('hidden');
    if (bugMenuScreen) bugMenuScreen.classList.remove('hidden');
    
    // Switch BGM
    playBGM('bugMenu');
    
    // Play bug video
    if (bugVideo) {
        bugVideo.currentTime = 0;
        setTimeout(() => {
            bugVideo.play().catch(() => {});
        }, 100);
    }
    
    // Update log
    if (logBox) {
        const account = accounts.find(acc => acc.username === currentUser);
        const role = account ? account.role : 'Unknown';
        
        logBox.innerHTML = '';
        updateLog(`User: ${currentUser}`);
        updateLog(`Role: ${role.toUpperCase()}`);
        updateLog(`System: READY (Loading skipped)`);
    }
    
    // Focus
    setTimeout(() => {
        if (targetNumberInput) targetNumberInput.focus();
    }, 200);
}

// ================ UTILITY FUNCTIONS ================
function updateLog(message) {
    if (!logBox) return;
    
    const timestamp = new Date().toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    logBox.innerHTML += `[${timestamp}] ${message}<br>`;
    logBox.scrollTop = logBox.scrollHeight;
}

function showPopup(message) {
    if (!popup) return;
    
    popup.textContent = message;
    popup.classList.remove('hidden');
    
    const duration = Math.max(3000, message.length * 50);
    setTimeout(() => {
        popup.classList.add('hidden');
    }, duration);
}

// ================ INITIALIZE ON LOAD ================
// Initialize when page loads
window.addEventListener('DOMContentLoaded', init);

// Mobile support
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        const videos = [loginVideo, loadingVideo, bugVideo, accountVideo];
        videos.forEach(video => {
            if (video && !video.paused) {
                video.play().catch(() => {});
            }
        });
    }, 300);
});

// Tab visibility
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        setTimeout(() => {
            // Resume videos
            const videos = [loginVideo, loadingVideo, bugVideo, accountVideo];
            videos.forEach(video => {
                if (video && video.paused && video.currentTime > 0) {
                    video.play().catch(() => {});
                }
            });
            
            // Resume BGM
            if (soundStates.bgm) {
                let currentPage = 'login';
                if (loginScreen && !loginScreen.classList.contains('hidden')) currentPage = 'login';
                else if (bugMenuScreen && !bugMenuScreen.classList.contains('hidden')) currentPage = 'bugMenu';
                else if (accountCreationScreen && !accountCreationScreen.classList.contains('hidden')) currentPage = 'accountCreation';
                
                playBGM(currentPage);
            }
        }, 300);
    }
});

// Prevent context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});