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
const screens = {
    login: document.getElementById('loginScreen'),
    loading: document.getElementById('loadingScreen'),
    bugMenu: document.getElementById('bugMenuScreen'),
    accountCreation: document.getElementById('accountCreationScreen')
};

const videos = {
    login: document.getElementById('loginVideo'),
    loading: document.getElementById('loadingVideo'),
    bug: document.getElementById('bugVideo'),
    account: document.getElementById('accountVideo')
};

// BGM Players for different pages
const bgmPlayers = {
    login: document.getElementById('bgmLogin'),
    bugMenu: document.getElementById('bgmBugMenu'),
    accountCreation: document.getElementById('bgmAccountCreation')
};

const logBox = document.getElementById('logBox');
const popup = document.getElementById('popup');

// ================ BGM SYSTEM - MULTI TRACK ================
function stopAllBGM() {
    // Stop all BGM players
    Object.values(bgmPlayers).forEach(player => {
        if (player) {
            player.pause();
            player.currentTime = 0;
        }
    });
}

function playBGM(page) {
    if (!soundStates.bgm) return;
    
    stopAllBGM();
    
    const player = bgmPlayers[page];
    if (player) {
        player.volume = 0.3;
        player.play()
            .then(() => console.log(`BGM playing for ${page}`))
            .catch(error => {
                console.log(`BGM play failed for ${page}:`, error);
            });
    }
}

function toggleBGM() {
    soundStates.bgm = !soundStates.bgm;
    
    if (soundStates.bgm) {
        // Determine which page is active
        let activePage = 'login';
        if (!screens.login.classList.contains('hidden')) activePage = 'login';
        else if (!screens.bugMenu.classList.contains('hidden')) activePage = 'bugMenu';
        else if (!screens.accountCreation.classList.contains('hidden')) activePage = 'accountCreation';
        
        playBGM(activePage);
    } else {
        stopAllBGM();
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

function initAccounts() {
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

let accounts = initAccounts();

// ================ VIDEO AUTOPLAY FIX ================
function forceVideoPlay(video) {
    if (!video) return;
    
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Video autoplay failed:', video.id, error);
            
            const playOnInteraction = () => {
                video.play().catch(e => {});
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('touchstart', playOnInteraction);
            };
            
            document.addEventListener('click', playOnInteraction, { once: true });
            document.addEventListener('touchstart', playOnInteraction, { once: true });
        });
    }
}

// ================ SOUND CONTROLS ================
function toggleLoginSound() {
    if (!videos.login) return;
    
    soundStates.login = !soundStates.login;
    videos.login.muted = !soundStates.login;
    videos.login.volume = soundStates.login ? 0.7 : 0;
    
    const btn = document.querySelector('.sound-toggle');
    if (btn) {
        btn.textContent = `Sound: ${soundStates.login ? 'ON' : 'OFF'}`;
    }
    
    if (videos.login.paused) {
        forceVideoPlay(videos.login);
    }
}

function toggleLoadingSound() {
    if (!videos.loading) return;
    
    soundStates.loading = !soundStates.loading;
    videos.loading.muted = !soundStates.loading;
    videos.loading.volume = soundStates.loading ? 0.7 : 0;
    
    const btn = document.querySelector('.loading-sound-toggle');
    if (btn) {
        btn.textContent = `Sound: ${soundStates.loading ? 'ON' : 'OFF'}`;
    }
    
    if (videos.loading.paused) {
        forceVideoPlay(videos.loading);
    }
}

function toggleBugSound() {
    if (!videos.bug) return;
    
    soundStates.bug = !soundStates.bug;
    videos.bug.muted = !soundStates.bug;
    videos.bug.volume = soundStates.bug ? 0.7 : 0;
    
    const btn = document.querySelectorAll('.sound-toggle')[0];
    if (btn) {
        btn.textContent = `Sound: ${soundStates.bug ? 'ON' : 'OFF'}`;
    }
    
    if (videos.bug.paused) {
        forceVideoPlay(videos.bug);
    }
}

function toggleAccountSound() {
    if (!videos.account) return;
    
    soundStates.account = !soundStates.account;
    videos.account.muted = !soundStates.account;
    videos.account.volume = soundStates.account ? 0.7 : 0;
    
    const btn = document.querySelectorAll('.sound-toggle')[1];
    if (btn) {
        btn.textContent = `Sound: ${soundStates.account ? 'ON' : 'OFF'}`;
    }
    
    if (videos.account.paused) {
        forceVideoPlay(videos.account);
    }
}

// ================ LOGIN FUNCTION ================
function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
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
    
    console.log('Login attempt:', username);
    
    accounts = JSON.parse(localStorage.getItem('darkside_accounts')) || defaultAccounts;
    
    const account = accounts.find(acc => acc.username === username);
    
    if (!account) {
        showPopup("Login gagal! Username tidak ditemukan.");
        return;
    }
    
    if (account.password !== password) {
        showPopup("Login gagal! Password salah.");
        return;
    }
    
    if (!account.isPermanent && account.expiresAt) {
        const now = new Date();
        const expiry = new Date(account.expiresAt);
        if (expiry < now) {
            showPopup("Akun telah kadaluarsa!");
            return;
        }
    }
    
    currentUser = username;
    isMaker = account.isMaker || account.role === 'maker';
    
    screens.login.classList.add('hidden');
    screens.loading.classList.remove('hidden');
    
    videos.loading.currentTime = 0;
    videos.loading.muted = true;
    videos.loading.volume = 0;
    
    setTimeout(() => {
        forceVideoPlay(videos.loading);
    }, 50);
    
    const LOADING_DURATION = 10000;
    let loadingTimer = null;
    
    const proceed = () => {
        if (loadingTimer) clearTimeout(loadingTimer);
        screens.loading.classList.add('hidden');
        screens.bugMenu.classList.remove('hidden');
        
        // Switch BGM to bug menu
        playBGM('bugMenu');
        
        videos.bug.currentTime = 0;
        setTimeout(() => {
            forceVideoPlay(videos.bug);
        }, 50);
        
        updateLog(`User: ${currentUser}`);
        updateLog(`Role: ${account.role.toUpperCase()}`);
        if (account.isPermanent) {
            updateLog(`Status: PERMANENT ACCOUNT`);
        } else if (account.expiresAt) {
            const expiryDate = new Date(account.expiresAt);
            updateLog(`Expires: ${expiryDate.toLocaleDateString('id-ID')}`);
        }
        updateLog(`System: READY`);
        
        setTimeout(() => {
            const targetInput = document.getElementById('targetNumber');
            if (targetInput) targetInput.focus();
        }, 100);
    };
    
    loadingTimer = setTimeout(proceed, LOADING_DURATION);
    
    videos.loading.addEventListener('ended', proceed, { once: true });
    
    const skipBtn = document.querySelector('.skip-btn');
    if (skipBtn) {
        skipBtn.disabled = true;
        skipBtn.style.opacity = '0.5';
        
        setTimeout(() => {
            skipBtn.disabled = false;
            skipBtn.style.opacity = '1';
            skipBtn.onclick = () => {
                if (!skipBtn.disabled) {
                    proceed();
                }
            };
        }, 8000);
    }
}

// ================ ACCOUNT CREATION ================
function selectRole(role) {
    selectedRole = role;
    
    document.querySelectorAll('.role-option').forEach(el => {
        el.classList.remove('selected');
    });
    
    const selectedEl = document.querySelector(`[data-role="${role}"]`);
    if (selectedEl) {
        selectedEl.classList.add('selected');
    }
}

function selectDuration(days) {
    selectedDuration = days;
    
    document.querySelectorAll('.duration-option').forEach(el => {
        el.classList.remove('selected');
    });
    
    const selectedEl = document.querySelector(`[data-days="${days}"]`);
    if (selectedEl) {
        selectedEl.classList.add('selected');
    }
}

function goToCreateAccount() {
    if (!isMaker) {
        showPopup("Hanya akun Maker yang bisa membuat akun baru!");
        return;
    }
    
    screens.bugMenu.classList.add('hidden');
    screens.accountCreation.classList.remove('hidden');
    
    // Switch BGM to account creation
    playBGM('accountCreation');
    
    const newUsername = document.getElementById('newUsername');
    const newPassword = document.getElementById('newPassword');
    if (newUsername) newUsername.value = '';
    if (newPassword) newPassword.value = '';
    
    selectRole('user');
    selectDuration(30);
    
    videos.account.currentTime = 0;
    setTimeout(() => {
        forceVideoPlay(videos.account);
    }, 50);
    
    setTimeout(() => {
        if (newUsername) newUsername.focus();
    }, 100);
}

function backToBugMenu() {
    screens.accountCreation.classList.add('hidden');
    screens.bugMenu.classList.remove('hidden');
    
    // Switch BGM back to bug menu
    playBGM('bugMenu');
    
    videos.bug.currentTime = 0;
    setTimeout(() => {
        forceVideoPlay(videos.bug);
    }, 50);
    
    const targetInput = document.getElementById('targetNumber');
    if (targetInput) targetInput.focus();
}

function createNewAccount() {
    if (!isMaker) {
        showPopup("Hanya akun Maker yang bisa membuat akun baru!");
        return;
    }
    
    const newUsernameInput = document.getElementById('newUsername');
    const newPasswordInput = document.getElementById('newPassword');
    
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
    
    if (!selectedRole) {
        showPopup("Pilih role untuk akun baru!");
        return;
    }
    
    if (selectedDuration === undefined || selectedDuration === null) {
        showPopup("Pilih durasi untuk akun baru!");
        return;
    }
    
    accounts = JSON.parse(localStorage.getItem('darkside_accounts')) || defaultAccounts;
    
    if (accounts.some(acc => acc.username === newUsername)) {
        showPopup("Username sudah terdaftar!");
        return;
    }
    
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
    
    accounts.push(newAccount);
    saveAccounts(accounts);
    
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
        const durationText = selectedDuration === 1 ? '1 hari' : 
                           selectedDuration + ' hari';
        message += `Durasi: ${durationText}\n`;
        message += `Kadaluarsa: ${expiresAt.toLocaleDateString('id-ID')}\n`;
    }
    
    message += `\n⚠️ SIMPAN INFORMASI INI!`;
    
    showPopup(message);
    
    newUsernameInput.value = '';
    newPasswordInput.value = '';
    
    selectRole('user');
    selectDuration(30);
    
    setTimeout(() => {
        newUsernameInput.focus();
    }, 100);
}

// ================ BUG SYSTEM ================
function sendBug() {
    const targetInput = document.getElementById('targetNumber');
    const bugTypeSelect = document.getElementById('bugType');
    
    if (!targetInput || !bugTypeSelect) return;
    
    const targetNumber = targetInput.value.trim();
    const bugTypeText = bugTypeSelect.options[bugTypeSelect.selectedIndex].text;
    
    if (!targetNumber || targetNumber.length < 10 || !targetNumber.startsWith('08')) {
        showPopup("Masukkan nomor target yang valid!\n(minimal 10 digit, dimulai dengan 08)");
        targetInput.focus();
        return;
    }
    
    logBox.innerHTML = '';
    updateLog(`🚀 Starting bug delivery...`);
    updateLog(`📱 Target: ${targetNumber}`);
    updateLog(`🔧 Type: ${bugTypeText}`);
    
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
            updateLog(`🕒 Time: ${new Date().toLocaleTimeString()}`);
            
            showPopup("✅ BUG TERKIRIM!");
            targetInput.value = '';
            
            setTimeout(() => {
                targetInput.focus();
            }, 100);
        }
    }, 800);
}

function skipLoading() {
    const skipBtn = document.querySelector('.skip-btn');
    if (skipBtn && skipBtn.disabled) {
        showPopup("Tunggu sebentar, video hampir selesai...");
        return;
    }
    
    screens.loading.classList.add('hidden');
    screens.bugMenu.classList.remove('hidden');
    
    // Switch BGM to bug menu
    playBGM('bugMenu');
    
    videos.bug.currentTime = 0;
    setTimeout(() => {
        forceVideoPlay(videos.bug);
    }, 100);
    
    const account = accounts.find(acc => acc.username === currentUser);
    const role = account ? account.role : 'Unknown';
    
    logBox.innerHTML = '';
    updateLog(`User: ${currentUser}`);
    updateLog(`Role: ${role.toUpperCase()}`);
    updateLog(`System: READY (Loading skipped)`);
    
    setTimeout(() => {
        const targetInput = document.getElementById('targetNumber');
        if (targetInput) targetInput.focus();
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

// ================ INITIALIZATION ================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DARKSIDE v1.2 - Multi BGM Initializing...');
    
    // Initialize all videos
    Object.values(videos).forEach(video => {
        if (video) {
            video.muted = true;
            video.playsInline = true;
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            
            video.addEventListener('error', function(e) {
                console.log('Video error:', video.id, e);
                setTimeout(() => {
                    video.load();
                    forceVideoPlay(video);
                }, 1000);
            });
            
            video.addEventListener('loadeddata', function() {
                console.log('Video loaded:', video.id);
                forceVideoPlay(video);
            });
        }
    });
    
    // Initialize BGM players
    Object.values(bgmPlayers).forEach(player => {
        if (player) {
            player.volume = 0;
            player.loop = true;
        }
    });
    
    // Start login BGM
    if (soundStates.bgm) {
        playBGM('login');
    }
    
    // Initialize sound buttons
    const soundButtons = document.querySelectorAll('.sound-toggle, .loading-sound-toggle');
    soundButtons.forEach(btn => {
        if (btn) btn.textContent = 'Sound: OFF';
    });
    
    // Set default selections for account creation
    setTimeout(() => {
        selectRole('user');
        selectDuration(30);
    }, 500);
    
    // Force play login video
    setTimeout(() => {
        forceVideoPlay(videos.login);
    }, 300);
    
    // Unlock audio on first user interaction
    const unlockAudio = () => {
        console.log('Audio unlocked by user interaction');
        
        Object.values(videos).forEach(video => {
            if (video && video.paused) {
                forceVideoPlay(video);
            }
        });
        
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
    };
    
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', u
