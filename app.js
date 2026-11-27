import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAnf5ngoBldbb19QhU5s5EclP6P3ouUdIw",
  authDomain: "nosql-web-application.firebaseapp.com",
  projectId: "nosql-web-application",
  storageBucket: "nosql-web-application.firebasestorage.app",
  messagingSenderId: "128101337608",
  appId: "1:128101337608:web:8294fa120ec34e4c8b5fbd",
  measurementId: "G-C11630GDCW"
};

/**
 * FREE CLOUD STORAGE CONFIGURATION (Cloudinary Free Tier)
 * 1. Create a free account at https://cloudinary.com
 * 2. Go to Settings -> Upload -> Upload Presets -> Add Upload Preset -> Signing Mode: "Unsigned"
 * 3. Replace cloudName and uploadPreset below with your own values.
 */
const FREE_STORAGE_CONFIG = {
  provider: "cloudinary",
  cloudName: "rycdnihd",
  uploadPreset: "sticky-notes-storage"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const notesCollection = collection(db, "sticky_notes");
const messagesCollection = collection(db, "messages");

const DEFAULT_STICKERS = ["📌", "🔥", "💡", "✅", "❤️", "⭐", "🎉"];

const TRANSLATIONS = {
  en: {
    appTitle: "📌 Interactive Group Sticky Notes",
    loginSubtitle: "Please log in to view, post, and message on the board",
    boardSubtitle: "Click a sticker to like it, or switch to Chat to message users & admins",
    settingsBtn: "Settings",
    settingsHeading: "⚙️ System Settings",
    avatarLabel: "Profile Avatar",
    changePasswordLabel: "Change Personal Password",
    themeMode: "Appearance Mode",
    accentColor: "Accent & Interface Theme",
    language: "Language",
    gridSize: "Board Card Size",
    stickerAnim: "Enable interactive sticker bounce on hover",
    notifySound: "Play speaker sound on new notes & messages",
    forgotPassword: "Forgot password?",
    resetHeading: "Reset Password via Gmail / Email",
    resetDesc: "Enter your Gmail/email address (or nickname) and we will send a password reset link.",
    sendLink: "Send Link",
    backToLogin: "Back to Login",
    creatorHeading: "Create Interactive Sticky Note",
    chooseSticker: "Choose a Sticker:",
    colorLabel: "Sticky Note Color (Presets or Manual Custom Color):",
    tiltLabel: "Tilt:",
    submitBtn: "Stick to Board"
  },
  tl: {
    appTitle: "📌 Interactive Group Sticky Notes",
    loginSubtitle: "Mag-login muna upang makita, mag-post, at mag-message sa board",
    boardSubtitle: "I-click ang sticker para i-like o lumipat sa Chat para mag-message",
    settingsBtn: "Mga Setting",
    settingsHeading: "⚙️ Mga Setting ng System",
    avatarLabel: "Avatar ng Profile",
    changePasswordLabel: "Palitan ang Personal na Password",
    themeMode: "Mode ng Hitsura",
    accentColor: "Kulay ng Tema",
    language: "Wika",
    gridSize: "Laki ng Card sa Board",
    stickerAnim: "I-on ang animation ng sticker kapag tinatapatan",
    notifySound: "Magpatunog sa speaker kapag may bagong note o message",
    forgotPassword: "Nakalimutan ang password?",
    resetHeading: "I-reset ang Password gamit ang Gmail / Email",
    resetDesc: "Ilagay ang iyong Gmail/email (o nickname) upang magpadala ng password reset link.",
    sendLink: "Ipadala",
    backToLogin: "Bumalik sa Login",
    creatorHeading: "Gumawa ng Interactive Sticky Note",
    chooseSticker: "Pumili ng Sticker:",
    colorLabel: "Kulay ng Sticky Note (Preset o Sariling Kulay):",
    tiltLabel: "Hilig:",
    submitBtn: "I-post sa Board"
  },
  hil: {
    appTitle: "📌 Interactive Group Sticky Notes",
    loginSubtitle: "Mag-login anay agud makita, maka-post, kag maka-message sa board",
    boardSubtitle: "I-click ang sticker agud i-like ukon magkadto sa Chat agud mag-message",
    settingsBtn: "Mga Setting",
    settingsHeading: "⚙️ Mga Setting sang System",
    avatarLabel: "Avatar sang Profile",
    changePasswordLabel: "Ilisan ang Personal nga Password",
    themeMode: "Hitsura sang Screen",
    accentColor: "Duag sang Tema",
    language: "Lengguwahe",
    gridSize: "Kadakuon sang Card sa Board",
    stickerAnim: "I-on ang hulag sang sticker kon itudlo",
    notifySound: "Patunugon ang speaker kon may bag-o nga note ukon message",
    forgotPassword: "Nalipatan ang password?",
    resetHeading: "I-reset ang Password paagi sa Gmail / Email",
    resetDesc: "Isulod ang imo Gmail/email (ukon nickname) agud padal-an ka sang password reset link.",
    sendLink: "Ipadala",
    backToLogin: "Balik sa Login",
    creatorHeading: "Maghimo sang Interactive Sticky Note",
    chooseSticker: "Magpili sang Sticker:",
    colorLabel: "Duag sang Sticky Note (Preset ukon Kaugalingon nga Duag):",
    tiltLabel: "Hilig:",
    submitBtn: "Ipapilit sa Board"
  },
  ceb: {
    appTitle: "📌 Interactive Group Sticky Notes",
    loginSubtitle: "Pag-login una aron makita, maka-post, ug maka-message sa board",
    boardSubtitle: "I-click ang sticker aron i-like o balhin sa Chat aron mag-message",
    settingsBtn: "Mga Setting",
    settingsHeading: "⚙️ Mga Setting sa System",
    avatarLabel: "Avatar sa Profile",
    changePasswordLabel: "Ilisan ang Personal nga Password",
    themeMode: "Hitsura sa Screen",
    accentColor: "Kolor sa Tema",
    language: "Pinulongan",
    gridSize: "Gidak-on sa Card sa Board",
    stickerAnim: "I-on ang lihok sa sticker kon itudlo",
    notifySound: "Patunugon ang speaker kon adunay bag-ong note o message",
    forgotPassword: "Nakalimot sa password?",
    resetHeading: "I-reset ang Password gamit ang Gmail / Email",
    resetDesc: "Isulod ang imong Gmail/email (o nickname) aron padad-an ka og password reset link.",
    sendLink: "Ipadala",
    backToLogin: "Balik sa Login",
    creatorHeading: "Paghimo og Interactive Sticky Note",
    chooseSticker: "Pagpili og Sticker:",
    colorLabel: "Kolor sa Sticky Note (Preset o Kaugalingong Kolor):",
    tiltLabel: "Hilig:",
    submitBtn: "Ipapilit sa Board"
  }
};

const DEFAULT_SETTINGS = {
  avatar: "😎",
  themeMode: "light",
  accent: "blue",
  language: "en",
  gridSize: "normal",
  stickerAnim: true,
  notifySound: true
};

// DOM Elements - Header & Notifications
const appTitle = document.getElementById("appTitle");
const headerSubtitle = document.getElementById("headerSubtitle");
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const headerNavMenu = document.getElementById("headerNavMenu");
const openNotificationsBtn = document.getElementById("openNotificationsBtn");
const notifBadge = document.getElementById("notifBadge");
const openSettingsBtn = document.getElementById("openSettingsBtn");
const settingsBtnLabel = document.getElementById("settingsBtnLabel");
const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

const notificationsModal = document.getElementById("notificationsModal");
const closeNotificationsBtn = document.getElementById("closeNotificationsBtn");
const enableBrowserNotifBtn = document.getElementById("enableBrowserNotifBtn");
const markAllReadBtn = document.getElementById("markAllReadBtn");
const clearNotifsBtn = document.getElementById("clearNotifsBtn");
const notificationsList = document.getElementById("notificationsList");

const noteToast = document.getElementById("noteToast");
const noteToastText = document.getElementById("noteToastText");
const closeToastBtn = document.getElementById("closeToastBtn");

// DOM Elements - Settings Modal
const settingsModal = document.getElementById("settingsModal");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const resetSettingsBtn = document.getElementById("resetSettingsBtn");

const settingsHeading = document.getElementById("settingsHeading");
const labelAvatar = document.getElementById("labelAvatar");
const avatarPicker = document.getElementById("avatarPicker");

const passwordChangeSection = document.getElementById("passwordChangeSection");
const labelChangePassword = document.getElementById("labelChangePassword");
const currentPasswordInput = document.getElementById("currentPasswordInput");
const newPasswordInput = document.getElementById("newPasswordInput");
const updatePasswordBtn = document.getElementById("updatePasswordBtn");
const passwordStatusMsg = document.getElementById("passwordStatusMsg");

const labelThemeMode = document.getElementById("labelThemeMode");
const themeModeSelect = document.getElementById("themeModeSelect");
const labelAccentColor = document.getElementById("labelAccentColor");
const accentSwatches = document.getElementById("accentSwatches");
const labelLanguage = document.getElementById("labelLanguage");
const languageSelect = document.getElementById("languageSelect");
const labelGridSize = document.getElementById("labelGridSize");
const gridSizeSelect = document.getElementById("gridSizeSelect");
const labelStickerAnim = document.getElementById("labelStickerAnim");
const stickerAnimToggle = document.getElementById("stickerAnimToggle");
const labelNotifySound = document.getElementById("labelNotifySound");
const notifySoundToggle = document.getElementById("notifySoundToggle");

// DOM Elements - Auth & Reset Password
const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");
const userRoleBtn = document.getElementById("userRoleBtn");
const adminRoleBtn = document.getElementById("adminRoleBtn");
const authTabs = document.getElementById("authTabs");
const showLoginTab = document.getElementById("showLoginTab");
const showSignupTab = document.getElementById("showSignupTab");
const adminNotice = document.getElementById("adminNotice");
const socialAuthBlock = document.getElementById("socialAuthBlock");

const authForm = document.getElementById("authForm");
const nameInput = document.getElementById("nameInput");
const signupUsernameInput = document.getElementById("signupUsernameInput");
const loginIdentifierInput = document.getElementById("loginIdentifierInput");
const signupEmailInput = document.getElementById("signupEmailInput");
const passwordInput = document.getElementById("passwordInput");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authMessage = document.getElementById("authMessage");

const forgotPasswordRow = document.getElementById("forgotPasswordRow");
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
const resetPasswordBox = document.getElementById("resetPasswordBox");
const resetHeading = document.getElementById("resetHeading");
const resetDesc = document.getElementById("resetDesc");
const resetEmailInput = document.getElementById("resetEmailInput");
const sendResetBtn = document.getElementById("sendResetBtn");
const cancelResetBtn = document.getElementById("cancelResetBtn");

const googleBtn = document.getElementById("googleBtn");
const logoutBtn = document.getElementById("logoutBtn");

// DOM Elements - Workspace & Board
const userAvatarBadge = document.getElementById("userAvatarBadge");
const roleBadge = document.getElementById("roleBadge");
const userDisplayName = document.getElementById("userDisplayName");
const userHandleWrap = document.getElementById("userHandleWrap");
const userHandle = document.getElementById("userHandle");
const userEmail = document.getElementById("userEmail");

const tabBoardBtn = document.getElementById("tabBoardBtn");
const tabChatBtn = document.getElementById("tabChatBtn");
const chatUnreadPill = document.getElementById("chatUnreadPill");
const boardViewSection = document.getElementById("boardViewSection");
const chatViewSection = document.getElementById("chatViewSection");

const creatorHeading = document.getElementById("creatorHeading");
const chooseStickerLabel = document.getElementById("chooseStickerLabel");
const colorLabel = document.getElementById("colorLabel");
const tiltLabel = document.getElementById("tiltLabel");
const submitBtn = document.getElementById("submitBtn");

const noteForm = document.getElementById("noteForm");
const contentInput = document.getElementById("contentInput");
const noteColorSwatches = document.getElementById("noteColorSwatches");
const customNoteColorInput = document.getElementById("customNoteColorInput");
const selectedColorHex = document.getElementById("selectedColorHex");
const colorSelect = document.getElementById("colorSelect");
const tiltSelect = document.getElementById("tiltSelect");
const stickerOptions = document.getElementById("stickerOptions");
const customStickerInput = document.getElementById("customStickerInput");
const addCustomStickerBtn = document.getElementById("addCustomStickerBtn");
const searchInput = document.getElementById("searchInput");
const filterOwnership = document.getElementById("filterOwnership");
const notesBoard = document.getElementById("notesBoard");

// DOM Elements - Messaging & Camera
const chatChannelFilter = document.getElementById("chatChannelFilter");
const chatMessagesFeed = document.getElementById("chatMessagesFeed");
const replyPreviewBanner = document.getElementById("replyPreviewBanner");
const replyTargetAuthor = document.getElementById("replyTargetAuthor");
const replyTargetText = document.getElementById("replyTargetText");
const cancelReplyBtn = document.getElementById("cancelReplyBtn");

const attachmentPreviewBanner = document.getElementById("attachmentPreviewBanner");
const attachmentImageThumb = document.getElementById("attachmentImageThumb");
const attachmentFileName = document.getElementById("attachmentFileName");
const attachmentFileMeta = document.getElementById("attachmentFileMeta");
const removeAttachmentBtn = document.getElementById("removeAttachmentBtn");

const chatForm = document.getElementById("chatForm");
const openCameraBtn = document.getElementById("openCameraBtn");
const pickImageBtn = document.getElementById("pickImageBtn");
const pickFileBtn = document.getElementById("pickFileBtn");
const imageFileInput = document.getElementById("imageFileInput");
const generalFileInput = document.getElementById("generalFileInput");
const chatMessageInput = document.getElementById("chatMessageInput");
const sendChatBtn = document.getElementById("sendChatBtn");
const uploadProgressMsg = document.getElementById("uploadProgressMsg");

const cameraModal = document.getElementById("cameraModal");
const closeCameraBtn = document.getElementById("closeCameraBtn");
const cameraVideo = document.getElementById("cameraVideo");
const cameraCanvas = document.getElementById("cameraCanvas");
const cameraPreviewImg = document.getElementById("cameraPreviewImg");
const cameraStatusMsg = document.getElementById("cameraStatusMsg");
const switchCameraBtn = document.getElementById("switchCameraBtn");
const capturePhotoBtn = document.getElementById("capturePhotoBtn");
const retakePhotoBtn = document.getElementById("retakePhotoBtn");
const usePhotoBtn = document.getElementById("usePhotoBtn");

// Application State
let settings = loadLocalSettings();
let selectedLoginRole = "user";
let isSignupMode = false;
let currentUser = null;
let currentUserRole = "user";
let currentUsername = "";
let selectedSticker = "📌";
let customStickers = [];
let latestDocs = [];
let unsubscribeNotes = null;
let hasLoadedInitialNotes = false;
let knownNoteIds = new Set();

let latestMessages = [];
let unsubscribeMessages = null;
let hasLoadedInitialMessages = false;
let knownMessageIds = new Set();
let activeWorkspaceTab = "board";
let unreadChatCount = 0;

let activeReplyTo = null; // { id, author, nickname, text }
let pendingAttachment = null; // { file, previewUrl, isImage, name, size }

let notifications = []; // { id, type, title, body, time, read, targetTab }
let toastTimer = null;
let audioCtx = null;

// Camera State
let cameraStream = null;
let cameraFacingMode = "environment";
let capturedBlob = null;
let capturedPreviewUrl = "";

// ==================== AUDIO & NOTIFICATIONS SYSTEM ====================
function unlockAudioSpeaker() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === "suspended") audioCtx.resume();
  } catch {
    // Ignore restricted audio environments
  }
}

["click", "keydown", "touchstart"].forEach((eventName) => {
  window.addEventListener(eventName, unlockAudioSpeaker, { passive: true });
});

function playNotificationChime() {
  if (!settings.notifySound) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const now = audioCtx.currentTime;
    const notes = [587.33, 880];
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.11);

      gain.gain.setValueAtTime(0.001, now + idx * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.11 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.11 + 0.28);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.11);
      osc.stop(now + idx * 0.11 + 0.3);
    });
  } catch {
    // Ignore playback restrictions
  }
}

function pushNotification({ type, title, body, targetTab = "board" }) {
  const notif = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    title,
    body,
    targetTab,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    read: false
  };

  notifications.unshift(notif);
  if (notifications.length > 50) notifications.pop();
  renderNotificationsList();

  // Toast alert
  noteToastText.textContent = `${title}: ${body}`;
  noteToast.classList.remove("hidden");
  playNotificationChime();

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    noteToast.classList.add("hidden");
  }, 4500);

  // Native Browser Notification (if granted and tab hidden)
  if ("Notification" in window && Notification.permission === "granted" && document.hidden) {
    try {
      new Notification(title, { body });
    } catch {
      // Ignore mobile Safari notification edge cases
    }
  }
}

function renderNotificationsList() {
  const unreadCount = notifications.filter((n) => !n.read).length;
  if (unreadCount > 0) {
    notifBadge.textContent = unreadCount > 9 ? "9+" : String(unreadCount);
    notifBadge.classList.remove("hidden");
  } else {
    notifBadge.classList.add("hidden");
  }

  if (notifications.length === 0) {
    notificationsList.innerHTML = `<p class="empty-state">No notifications yet.</p>`;
    return;
  }

  notificationsList.innerHTML = "";
  notifications.forEach((item) => {
    const div = document.createElement("div");
    div.className = `notif-item ${item.read ? "read" : ""}`;
    div.innerHTML = `
      <div class="notif-item-top">
        <strong>${escapeHTML(item.title)}</strong>
        <span>${escapeHTML(item.time)}</span>
      </div>
      <div class="notif-item-body">${escapeHTML(item.body)}</div>
    `;
    div.addEventListener("click", () => {
      item.read = true;
      renderNotificationsList();
      notificationsModal.classList.add("hidden");
      switchWorkspaceTab(item.targetTab);
    });
    notificationsList.appendChild(div);
  });
}

openNotificationsBtn.addEventListener("click", () => {
  closeMobileMenu();
  renderNotificationsList();
  notificationsModal.classList.remove("hidden");
});

closeNotificationsBtn.addEventListener("click", () => {
  notificationsModal.classList.add("hidden");
});

notificationsModal.addEventListener("click", (e) => {
  if (e.target === notificationsModal) notificationsModal.classList.add("hidden");
});

markAllReadBtn.addEventListener("click", () => {
  notifications.forEach((n) => (n.read = true));
  renderNotificationsList();
});

clearNotifsBtn.addEventListener("click", () => {
  notifications = [];
  renderNotificationsList();
});

enableBrowserNotifBtn.addEventListener("click", async () => {
  if (!("Notification" in window)) {
    alert("Browser notifications are not supported on this device.");
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    enableBrowserNotifBtn.textContent = "✅ Browser Alerts Enabled";
  } else {
    alert("Notification permission was not granted.");
  }
});

closeToastBtn.addEventListener("click", () => {
  noteToast.classList.add("hidden");
  if (toastTimer) clearTimeout(toastTimer);
});

// ==================== WORKSPACE TABS (BOARD VS CHAT) ====================
function switchWorkspaceTab(tabName) {
  activeWorkspaceTab = tabName;
  const isBoard = tabName === "board";

  tabBoardBtn.classList.toggle("active", isBoard);
  tabChatBtn.classList.toggle("active", !isBoard);
  boardViewSection.classList.toggle("hidden", !isBoard);
  chatViewSection.classList.toggle("hidden", isBoard);

  if (!isBoard) {
    unreadChatCount = 0;
    chatUnreadPill.classList.add("hidden");
    scrollChatToBottom();
  }
}

tabBoardBtn.addEventListener("click", () => switchWorkspaceTab("board"));
tabChatBtn.addEventListener("click", () => switchWorkspaceTab("chat"));

// ==================== STICKY NOTE EXPANDED & CUSTOM COLOR PICKER ====================
function setNoteBackgroundColor(hexColor) {
  const normalized = hexColor.toUpperCase();
  colorSelect.value = normalized;
  customNoteColorInput.value = normalized;
  selectedColorHex.textContent = normalized;

  document.querySelectorAll(".note-swatch").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.color.toUpperCase() === normalized);
  });
}

noteColorSwatches.addEventListener("click", (e) => {
  const btn = e.target.closest(".note-swatch");
  if (!btn) return;
  setNoteBackgroundColor(btn.dataset.color);
});

customNoteColorInput.addEventListener("input", (e) => {
  setNoteBackgroundColor(e.target.value);
});

function getContrastTextColor(hexColor) {
  const clean = (hexColor || "#fff740").replace("#", "");
  if (clean.length !== 6) return "#1f2937";
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.52 ? "#f8fafc" : "#1f2937";
}

// ==================== SEE / HIDE PASSWORD BUTTONS ====================
document.querySelectorAll(".toggle-password-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const inputId = btn.dataset.target;
    const targetInput = document.getElementById(inputId);
    if (!targetInput) return;

    const isPassword = targetInput.type === "password";
    targetInput.type = isPassword ? "text" : "password";
    btn.textContent = isPassword ? "🙈" : "👁️";
    btn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
  });
});

function resetPasswordVisibilityIcons() {
  document.querySelectorAll(".toggle-password-btn").forEach((btn) => {
    const targetInput = document.getElementById(btn.dataset.target);
    if (targetInput) targetInput.type = "password";
    btn.textContent = "👁️";
  });
}

// ==================== MOBILE NAVIGATION MENU ====================
mobileMenuToggle.addEventListener("click", () => {
  const isOpen = headerNavMenu.classList.toggle("open");
  mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenuToggle.textContent = isOpen ? "✕ Close" : "☰ Menu";
});

function closeMobileMenu() {
  headerNavMenu.classList.remove("open");
  mobileMenuToggle.setAttribute("aria-expanded", "false");
  mobileMenuToggle.textContent = "☰ Menu";
}

// ==================== SETTINGS LOGIC ====================
function loadLocalSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem("sticky_settings_v1"));
    return { ...DEFAULT_SETTINGS, ...(saved || {}) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function applySettings(nextSettings) {
  settings = { ...DEFAULT_SETTINGS, ...nextSettings };
  localStorage.setItem("sticky_settings_v1", JSON.stringify(settings));

  document.body.classList.toggle("theme-dark", settings.themeMode === "dark");
  document.body.classList.remove("accent-blue", "accent-green", "accent-pink", "accent-amber");
  document.body.classList.add(`accent-${settings.accent}`);

  document.body.classList.remove("grid-compact", "grid-large");
  if (settings.gridSize === "compact") document.body.classList.add("grid-compact");
  if (settings.gridSize === "large") document.body.classList.add("grid-large");

  document.body.classList.toggle("sticker-anim", Boolean(settings.stickerAnim));

  userAvatarBadge.textContent = settings.avatar || DEFAULT_SETTINGS.avatar;
  document.querySelectorAll(".avatar-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.avatar === settings.avatar);
  });

  themeModeSelect.value = settings.themeMode;
  languageSelect.value = settings.language;
  gridSizeSelect.value = settings.gridSize;
  stickerAnimToggle.checked = Boolean(settings.stickerAnim);
  notifySoundToggle.checked = Boolean(settings.notifySound);

  document.querySelectorAll(".swatch-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.accent === settings.accent);
  });

  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.en;
  appTitle.textContent = t.appTitle;
  headerSubtitle.textContent = currentUser ? t.boardSubtitle : t.loginSubtitle;
  settingsBtnLabel.textContent = t.settingsBtn;
  settingsHeading.textContent = t.settingsHeading;
  labelAvatar.textContent = t.avatarLabel;
  labelChangePassword.textContent = t.changePasswordLabel;
  labelThemeMode.textContent = t.themeMode;
  labelAccentColor.textContent = t.accentColor;
  labelLanguage.textContent = t.language;
  labelGridSize.textContent = t.gridSize;
  labelStickerAnim.textContent = t.stickerAnim;
  labelNotifySound.textContent = t.notifySound;
  forgotPasswordBtn.textContent = t.forgotPassword;
  resetHeading.textContent = t.resetHeading;
  resetDesc.textContent = t.resetDesc;
  sendResetBtn.textContent = t.sendLink;
  cancelResetBtn.textContent = t.backToLogin;
  creatorHeading.textContent = t.creatorHeading;
  chooseStickerLabel.textContent = t.chooseSticker;
  colorLabel.textContent = t.colorLabel;
  tiltLabel.textContent = t.tiltLabel;
  submitBtn.textContent = t.submitBtn;
}

async function persistSettingsToFirestore() {
  if (!currentUser) return;
  try {
    await updateDoc(doc(db, "users", currentUser.uid), {
      settings,
      avatar: settings.avatar
    });
  } catch {
    // Ignore if user doc not created yet
  }
}

function setPasswordStatus(msg, isSuccess = false) {
  passwordStatusMsg.textContent = msg;
  passwordStatusMsg.style.color = isSuccess ? "#16a34a" : "#ef4444";
}

function syncPasswordSectionVisibility() {
  if (currentUser && hasPasswordProvider(currentUser)) {
    passwordChangeSection.classList.remove("hidden");
  } else {
    passwordChangeSection.classList.add("hidden");
  }
}

openSettingsBtn.addEventListener("click", () => {
  closeMobileMenu();
  passwordStatusMsg.textContent = "";
  currentPasswordInput.value = "";
  newPasswordInput.value = "";
  resetPasswordVisibilityIcons();
  syncPasswordSectionVisibility();
  settingsModal.classList.remove("hidden");
});

closeSettingsBtn.addEventListener("click", () => settingsModal.classList.add("hidden"));

saveSettingsBtn.addEventListener("click", async () => {
  settingsModal.classList.add("hidden");
  await persistSettingsToFirestore();
});

settingsModal.addEventListener("click", async (e) => {
  if (e.target === settingsModal) {
    settingsModal.classList.add("hidden");
    await persistSettingsToFirestore();
  }
});

avatarPicker.addEventListener("click", async (e) => {
  const btn = e.target.closest(".avatar-btn");
  if (!btn) return;
  applySettings({ ...settings, avatar: btn.dataset.avatar });
  await persistSettingsToFirestore();
});

updatePasswordBtn.addEventListener("click", async () => {
  if (!currentUser || !currentUser.email) return;

  const currentPass = currentPasswordInput.value;
  const newPass = newPasswordInput.value;

  if (!currentPass || !newPass) {
    setPasswordStatus("Please fill in both your current password and new password.");
    return;
  }
  if (newPass.length < 6) {
    setPasswordStatus("New password must be at least 6 characters.");
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(currentUser.email, currentPass);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPass);

    currentPasswordInput.value = "";
    newPasswordInput.value = "";
    resetPasswordVisibilityIcons();
    setPasswordStatus("Personal password updated successfully!", true);
  } catch (error) {
    if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
      setPasswordStatus("Current password is incorrect.");
    } else {
      setPasswordStatus(error.message);
    }
  }
});

themeModeSelect.addEventListener("change", () => applySettings({ ...settings, themeMode: themeModeSelect.value }));
accentSwatches.addEventListener("click", (e) => {
  const btn = e.target.closest(".swatch-btn");
  if (btn) applySettings({ ...settings, accent: btn.dataset.accent });
});
languageSelect.addEventListener("change", () => applySettings({ ...settings, language: languageSelect.value }));
gridSizeSelect.addEventListener("change", () => applySettings({ ...settings, gridSize: gridSizeSelect.value }));
stickerAnimToggle.addEventListener("change", () => applySettings({ ...settings, stickerAnim: stickerAnimToggle.checked }));
notifySoundToggle.addEventListener("change", () => {
  unlockAudioSpeaker();
  applySettings({ ...settings, notifySound: notifySoundToggle.checked });
});
resetSettingsBtn.addEventListener("click", async () => {
  applySettings(DEFAULT_SETTINGS);
  await persistSettingsToFirestore();
});

applySettings(settings);

// ==================== AUTH & PASSWORD RESET ====================
function sanitizeUsername(raw) {
  return raw.trim().toLowerCase().replace(/^@+/, "");
}

function isValidUsername(username) {
  return /^[a-z0-9_]{3,20}$/.test(username);
}

function getEffectiveNickname() {
  if (currentUsername) return currentUsername;
  const baseName =
    (currentUser && currentUser.displayName) ||
    (currentUser && currentUser.email ? currentUser.email.split("@")[0] : "user");
  const cleaned = baseName
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  return cleaned || "user";
}

function setAuthStatus(message, isSuccess = false) {
  authMessage.textContent = message;
  authMessage.style.color = isSuccess ? "#16a34a" : "#ef4444";
}

userRoleBtn.addEventListener("click", () => {
  selectedLoginRole = "user";
  userRoleBtn.classList.add("active");
  adminRoleBtn.classList.remove("active");
  authTabs.classList.remove("hidden");
  adminNotice.classList.add("hidden");
  socialAuthBlock.classList.remove("hidden");
  resetPasswordBox.classList.add("hidden");
  setAuthStatus("");
  updateAuthFormUI();
});

adminRoleBtn.addEventListener("click", () => {
  selectedLoginRole = "admin";
  isSignupMode = false;
  adminRoleBtn.classList.add("active");
  userRoleBtn.classList.remove("active");
  authTabs.classList.add("hidden");
  adminNotice.classList.remove("hidden");
  socialAuthBlock.classList.add("hidden");
  resetPasswordBox.classList.add("hidden");
  setAuthStatus("");
  updateAuthFormUI();
});

showLoginTab.addEventListener("click", () => {
  isSignupMode = false;
  showLoginTab.classList.add("active");
  showSignupTab.classList.remove("active");
  resetPasswordBox.classList.add("hidden");
  setAuthStatus("");
  updateAuthFormUI();
});

showSignupTab.addEventListener("click", () => {
  if (selectedLoginRole === "admin") return;
  isSignupMode = true;
  showSignupTab.classList.add("active");
  showLoginTab.classList.remove("active");
  resetPasswordBox.classList.add("hidden");
  setAuthStatus("");
  updateAuthFormUI();
});

function updateAuthFormUI() {
  const signingUpUser = selectedLoginRole === "user" && isSignupMode;

  nameInput.classList.toggle("hidden", !signingUpUser);
  nameInput.required = signingUpUser;

  signupUsernameInput.classList.toggle("hidden", !signingUpUser);
  signupUsernameInput.required = signingUpUser;

  signupEmailInput.classList.toggle("hidden", !signingUpUser);
  signupEmailInput.required = signingUpUser;

  loginIdentifierInput.classList.toggle("hidden", signingUpUser);
  loginIdentifierInput.required = !signingUpUser;

  forgotPasswordRow.classList.toggle("hidden", signingUpUser);
  passwordInput.required = true;

  if (selectedLoginRole === "admin") {
    authSubmitBtn.textContent = "Log In as Admin";
  } else if (isSignupMode) {
    authSubmitBtn.textContent = "Create New User Account";
  } else {
    authSubmitBtn.textContent = "Log In as User";
  }
}

updateAuthFormUI();

forgotPasswordBtn.addEventListener("click", () => {
  resetPasswordBox.classList.remove("hidden");
  if (loginIdentifierInput.value.trim()) {
    resetEmailInput.value = loginIdentifierInput.value.trim();
  }
  setAuthStatus("");
});

cancelResetBtn.addEventListener("click", () => {
  resetPasswordBox.classList.add("hidden");
  setAuthStatus("");
});

sendResetBtn.addEventListener("click", async () => {
  const rawInput = resetEmailInput.value.trim();
  if (!rawInput) {
    setAuthStatus("Please enter your Gmail/email address or nickname first.");
    return;
  }

  try {
    const targetEmail = await resolveEmailFromIdentifier(rawInput);
    await sendPasswordResetEmail(auth, targetEmail);
    setAuthStatus(
      `Password reset link sent to ${targetEmail}. Check your Gmail/email inbox (and spam folder).`,
      true
    );
  } catch (error) {
    setAuthStatus(error.message);
  }
});

function hasPasswordProvider(user) {
  return Boolean(user && user.providerData.some((provider) => provider.providerId === "password"));
}

async function resolveEmailFromIdentifier(identifier) {
  const trimmed = identifier.trim();
  if (trimmed.includes("@")) return trimmed;
  const uname = sanitizeUsername(trimmed);
  if (!isValidUsername(uname)) {
    throw new Error("Enter a valid email address or nickname (3-20 letters, numbers, or _).");
  }
  const unameSnap = await getDoc(doc(db, "usernames", uname));
  if (!unameSnap.exists() || !unameSnap.data().email) {
    throw new Error("No account found with that nickname.");
  }
  return unameSnap.data().email;
}

async function syncUserToFirestore(user, providerName, customName = "", customUsername = "") {
  const userRef = doc(db, "users", user.uid);
  const existingSnap = await getDoc(userRef);
  const existingData = existingSnap.exists() ? existingSnap.data() : {};

  const resolvedName =
    customName.trim() ||
    existingData.fullName ||
    user.displayName ||
    (user.email ? user.email.split("@")[0] : "User");

  if (user.displayName !== resolvedName) {
    await updateProfile(user, { displayName: resolvedName });
  }

  let finalUsername = existingData.username || "";
  if (customUsername) {
    const cleanUname = sanitizeUsername(customUsername);
    if (!isValidUsername(cleanUname)) {
      throw new Error("Nickname must be 3-20 characters (letters, numbers, or underscores).");
    }
    const unameRef = doc(db, "usernames", cleanUname);
    const unameSnap = await getDoc(unameRef);
    if (unameSnap.exists() && unameSnap.data().uid !== user.uid) {
      throw new Error("That nickname is already taken.");
    }
    await setDoc(unameRef, {
      uid: user.uid,
      username: cleanUname,
      email: user.email || "",
      createdAt: serverTimestamp()
    });
    finalUsername = cleanUname;
  }

  if (!existingSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      fullName: resolvedName,
      username: finalUsername,
      email: user.email || "",
      provider: providerName,
      role: "user",
      avatar: settings.avatar,
      settings,
      customStickers: [],
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    });
    return { role: "user", username: finalUsername, savedSettings: settings, customStickers: [] };
  } else {
    const updates = { lastLoginAt: serverTimestamp() };
    if (finalUsername && !existingData.username) {
      updates.username = finalUsername;
    }
    await updateDoc(userRef, updates);
    return {
      role: existingData.role || "user",
      username: finalUsername,
      savedSettings: existingData.settings || settings,
      customStickers: Array.isArray(existingData.customStickers) ? existingData.customStickers : []
    };
  }
}

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  unlockAudioSpeaker();
  setAuthStatus("");

  const password = passwordInput.value;

  try {
    if (isSignupMode) {
      if (selectedLoginRole === "admin") {
        throw new Error("Admin accounts cannot be created here.");
      }
      const fullName = nameInput.value.trim();
      const email = signupEmailInput.value.trim().toLowerCase();
      const uname = sanitizeUsername(signupUsernameInput.value);

      if (!isValidUsername(uname)) {
        throw new Error("Nickname must be 3-20 characters (letters, numbers, or underscores).");
      }

      const unameSnap = await getDoc(doc(db, "usernames", uname));
      if (unameSnap.exists()) {
        throw new Error("That nickname is already taken. Please choose another.");
      }

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await syncUserToFirestore(cred.user, "password", fullName, uname);
    } else {
      const emailToUse = await resolveEmailFromIdentifier(loginIdentifierInput.value);
      const cred = await signInWithEmailAndPassword(auth, emailToUse, password);
      const profile = await syncUserToFirestore(cred.user, "password");

      if (selectedLoginRole === "admin") {
        if (profile.role !== "admin") {
          await signOut(auth);
          throw new Error("Access denied: This account does not have Admin privileges.");
        }
        if (!hasPasswordProvider(cred.user)) {
          await signOut(auth);
          throw new Error("Admin login requires an account with an Email and Password.");
        }
      }
    }
    authForm.reset();
    resetPasswordVisibilityIcons();
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      setAuthStatus("This email already has an account. Switch to 'Log In' or sign in with Gmail (Google).");
    } else {
      setAuthStatus(error.message);
    }
  }
});

googleBtn.addEventListener("click", async () => {
  unlockAudioSpeaker();
  if (selectedLoginRole === "admin") {
    setAuthStatus("Admins must log in with Email and Password.");
    return;
  }
  setAuthStatus("");
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await syncUserToFirestore(result.user, "google");
  } catch (error) {
    setAuthStatus(error.message);
  }
});

async function handleLogout() {
  closeMobileMenu();
  stopCameraStream();
  await signOut(auth);
}

logoutBtn.addEventListener("click", handleLogout);
mobileLogoutBtn.addEventListener("click", handleLogout);

onAuthStateChanged(auth, async (user) => {
  const t = TRANSLATIONS[settings.language] || TRANSLATIONS.en;

  if (user) {
    currentUser = user;
    const userSnap = await getDoc(doc(db, "users", user.uid));
    const userData = userSnap.exists() ? userSnap.data() : {};
    currentUserRole = userData.role || "user";
    currentUsername = userData.username || "";
    customStickers = Array.isArray(userData.customStickers) ? userData.customStickers : [];

    const mergedSettings = {
      ...(userData.settings || {}),
      avatar: userData.avatar || (userData.settings && userData.settings.avatar) || settings.avatar
    };
    applySettings(mergedSettings);

    if (currentUserRole === "admin" && !hasPasswordProvider(user)) {
      await signOut(auth);
      setAuthStatus("Admin accounts must use Email and Password authentication.");
      return;
    }

    if (selectedLoginRole === "admin" && currentUserRole !== "admin") {
      await signOut(auth);
      return;
    }

    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    openNotificationsBtn.classList.remove("hidden");
    mobileLogoutBtn.classList.remove("hidden");
    mobileLogoutBtn.classList.add("visible-logged-in");
    headerSubtitle.textContent = (TRANSLATIONS[settings.language] || TRANSLATIONS.en).boardSubtitle;

    userDisplayName.textContent = user.displayName || "User";
    userEmail.textContent = user.email || "Gmail Account";

    const nickname = getEffectiveNickname();
    userHandle.textContent = nickname;
    userHandleWrap.classList.remove("hidden");

    if (currentUserRole === "admin") {
      roleBadge.textContent = "ADMIN";
      roleBadge.className = "badge badge-admin";
    } else {
      roleBadge.textContent = "USER";
      roleBadge.className = "badge badge-user";
    }

    renderStickerPicker();
    syncPasswordSectionVisibility();
    startListeningToNotes();
    startListeningToMessages();
  } else {
    currentUser = null;
    currentUserRole = "user";
    currentUsername = "";
    customStickers = [];
    latestDocs = [];
    latestMessages = [];
    hasLoadedInitialNotes = false;
    hasLoadedInitialMessages = false;
    knownNoteIds.clear();
    knownMessageIds.clear();
    notifications = [];
    noteToast.classList.add("hidden");
    notesBoard.innerHTML = "";
    chatMessagesFeed.innerHTML = "";
    openNotificationsBtn.classList.add("hidden");
    passwordChangeSection.classList.add("hidden");
    mobileLogoutBtn.classList.add("hidden");
    mobileLogoutBtn.classList.remove("visible-logged-in");

    if (unsubscribeNotes) {
      unsubscribeNotes();
      unsubscribeNotes = null;
    }
    if (unsubscribeMessages) {
      unsubscribeMessages();
      unsubscribeMessages = null;
    }

    appSection.classList.add("hidden");
    authSection.classList.remove("hidden");
    headerSubtitle.textContent = t.loginSubtitle;
  }
});

// ==================== CUSTOM & DEFAULT STICKER PICKER ====================
function isImageSticker(val) {
  return typeof val === "string" && /^https?:\/\/.+/i.test(val.trim());
}

function renderStickerMarkup(stickerVal) {
  if (isImageSticker(stickerVal)) {
    return `<img src="${escapeAttr(stickerVal)}" alt="Custom sticker" class="note-sticker-img" loading="lazy" />`;
  }
  return escapeHTML(stickerVal || "📌");
}

function renderStickerPicker() {
  stickerOptions.innerHTML = "";
  const allStickers = [...DEFAULT_STICKERS, ...customStickers];

  allStickers.forEach((stickerVal) => {
    const isCustom = customStickers.includes(stickerVal);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sticker-choice";
    if (selectedSticker === stickerVal) btn.classList.add("selected");
    btn.dataset.sticker = stickerVal;
    btn.title = isCustom ? "Custom Sticker" : "Sticker";

    if (isImageSticker(stickerVal)) {
      const img = document.createElement("img");
      img.src = stickerVal;
      img.alt = "Custom sticker";
      btn.appendChild(img);
    } else {
      btn.textContent = stickerVal;
    }

    if (isCustom) {
      const removeBadge = document.createElement("span");
      removeBadge.className = "remove-custom-sticker";
      removeBadge.textContent = "×";
      removeBadge.title = "Remove custom sticker";
      removeBadge.addEventListener("click", async (e) => {
        e.stopPropagation();
        await removeCustomSticker(stickerVal);
      });
      btn.appendChild(removeBadge);
    }

    stickerOptions.appendChild(btn);
  });
}

async function addCustomSticker() {
  if (!currentUser) return;
  const raw = customStickerInput.value.trim();
  if (!raw) return;

  if (raw.length > 500) {
    alert("Sticker text or URL is too long.");
    return;
  }

  if (DEFAULT_STICKERS.includes(raw) || customStickers.includes(raw)) {
    selectedSticker = raw;
    customStickerInput.value = "";
    renderStickerPicker();
    return;
  }

  try {
    customStickers.push(raw);
    selectedSticker = raw;
    customStickerInput.value = "";
    renderStickerPicker();

    await updateDoc(doc(db, "users", currentUser.uid), {
      customStickers: arrayUnion(raw)
    });
  } catch (error) {
    console.error("Error saving custom sticker:", error);
    alert("Could not save custom sticker.");
  }
}

async function removeCustomSticker(stickerVal) {
  if (!currentUser) return;
  customStickers = customStickers.filter((item) => item !== stickerVal);
  if (selectedSticker === stickerVal) selectedSticker = DEFAULT_STICKERS[0];
  renderStickerPicker();

  try {
    await updateDoc(doc(db, "users", currentUser.uid), {
      customStickers: arrayRemove(stickerVal)
    });
  } catch (error) {
    console.error("Error removing custom sticker:", error);
  }
}

addCustomStickerBtn.addEventListener("click", addCustomSticker);
customStickerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addCustomSticker();
  }
});

stickerOptions.addEventListener("click", (e) => {
  if (e.target.closest(".remove-custom-sticker")) return;
  const btn = e.target.closest(".sticker-choice");
  if (!btn) return;

  document.querySelectorAll(".sticker-choice").forEach((el) => el.classList.remove("selected"));
  btn.classList.add("selected");
  selectedSticker = btn.dataset.sticker;
});

// ==================== STICKY NOTES ====================
noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return;
  unlockAudioSpeaker();

  const content = contentInput.value.trim();
  const color = colorSelect.value || "#fff740";
  const tilt = tiltSelect.value;
  if (!content) return;

  const nickname = getEffectiveNickname();
  const displayAuthor = `${settings.avatar || "😎"} @${nickname}`;

  try {
    await addDoc(notesCollection, {
      authorId: currentUser.uid,
      author: displayAuthor,
      nickname,
      authorRole: currentUserRole,
      content,
      color,
      sticker: selectedSticker,
      tilt,
      likes: [],
      stickerLikes: [],
      createdAt: serverTimestamp()
    });
    contentInput.value = "";
  } catch (error) {
    console.error("Error adding note:", error);
    alert("Failed to post sticky note.");
  }
});

function startListeningToNotes() {
  if (unsubscribeNotes) unsubscribeNotes();
  hasLoadedInitialNotes = false;
  knownNoteIds.clear();

  const q = query(notesCollection, orderBy("createdAt", "desc"));

  unsubscribeNotes = onSnapshot(q, (snapshot) => {
    if (!hasLoadedInitialNotes) {
      snapshot.docs.forEach((d) => knownNoteIds.add(d.id));
      hasLoadedInitialNotes = true;
    } else {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && !knownNoteIds.has(change.doc.id)) {
          knownNoteIds.add(change.doc.id);
          const addedNote = change.doc.data();
          if (currentUser && addedNote.authorId !== currentUser.uid) {
            const authorLabel = formatDisplayAuthor(addedNote);
            const preview = (addedNote.content || "").trim().slice(0, 50);
            pushNotification({
              type: "note",
              title: `📌 New Sticky Note by ${authorLabel}`,
              body: preview || "Posted a new sticky note",
              targetTab: "board"
            });
          }
        }
      });
    }

    latestDocs = snapshot.docs;
    renderNotes();
  });
}

searchInput.addEventListener("input", renderNotes);
filterOwnership.addEventListener("change", renderNotes);

function formatDisplayAuthor(note) {
  if (note.nickname) {
    const avatarPrefix = (note.author || "").split(" ")[0];
    const hasEmojiAvatar = avatarPrefix && !avatarPrefix.startsWith("@");
    return `${hasEmojiAvatar ? avatarPrefix + " " : ""}@${note.nickname}`;
  }
  return note.author || "@user";
}

function renderNotes() {
  notesBoard.innerHTML = "";
  if (!currentUser) return;

  const searchTerm = searchInput.value.toLowerCase().trim();
  const ownershipFilter = filterOwnership.value;

  latestDocs.forEach((docSnapshot) => {
    const note = docSnapshot.data();
    const noteId = docSnapshot.id;

    const isOwner = currentUser.uid === note.authorId;
    const isAdmin = currentUserRole === "admin";
    const canModify = isOwner || isAdmin;
    const formattedAuthor = formatDisplayAuthor(note);

    if (ownershipFilter === "mine" && !isOwner) return;
    if (
      searchTerm &&
      !note.content.toLowerCase().includes(searchTerm) &&
      !formattedAuthor.toLowerCase().includes(searchTerm)
    ) {
      return;
    }

    const likes = Array.isArray(note.likes) ? note.likes : [];
    const hasLiked = likes.includes(currentUser.uid);

    const stickerLikes = Array.isArray(note.stickerLikes) ? note.stickerLikes : [];
    const hasLikedSticker = stickerLikes.includes(currentUser.uid);

    const bgColor = note.color || "#fff740";
    const textColor = getContrastTextColor(bgColor);

    const noteCard = document.createElement("div");
    noteCard.classList.add("sticky-note");
    noteCard.style.backgroundColor = bgColor;
    noteCard.style.color = textColor;
    noteCard.style.transform = `rotate(${note.tilt || "0deg"})`;

    const actionsHTML = canModify
      ? `
        <div class="note-actions">
          <button type="button" class="edit-btn">Edit</button>
          <button type="button" class="delete-btn">Delete</button>
        </div>
      `
      : "";

    noteCard.innerHTML = `
      <button
        type="button"
        class="note-sticker-btn ${hasLikedSticker ? "sticker-liked" : ""}"
        title="${hasLikedSticker ? "Unlike sticker" : "Like sticker"}"
        aria-label="${hasLikedSticker ? "Unlike sticker" : "Like sticker"} (${stickerLikes.length} sticker likes)"
      >
        ${renderStickerMarkup(note.sticker || "📌")}
        <span class="sticker-like-count">❤️ ${stickerLikes.length}</span>
      </button>
      <p class="note-content">${escapeHTML(note.content)}</p>
      <div>
        <div class="note-meta">
          <button type="button" class="like-btn ${hasLiked ? "liked" : ""}">
            👍 ${likes.length}
          </button>
        </div>
        <div class="note-footer">
          <span class="note-author-tag"><strong>${escapeHTML(formattedAuthor)}</strong></span>
          ${actionsHTML}
        </div>
      </div>
    `;

    noteCard.querySelector(".note-sticker-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleStickerLike(noteId, hasLikedSticker);
    });

    noteCard.querySelector(".like-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLike(noteId, hasLiked);
    });

    if (canModify) {
      noteCard.querySelector(".edit-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        editNote(noteId, note.content);
      });
      noteCard.querySelector(".delete-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        deleteNote(noteId);
      });
    }

    notesBoard.appendChild(noteCard);
  });
}

async function toggleStickerLike(id, hasLikedSticker) {
  if (!currentUser) return;
  try {
    await updateDoc(doc(db, "sticky_notes", id), {
      stickerLikes: hasLikedSticker ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
    });
  } catch (error) {
    console.error("Error toggling sticker like:", error);
  }
}

async function toggleLike(id, hasLiked) {
  if (!currentUser) return;
  try {
    await updateDoc(doc(db, "sticky_notes", id), {
      likes: hasLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
    });
  } catch (error) {
    console.error("Error toggling like:", error);
  }
}

async function editNote(id, currentContent) {
  const newContent = prompt("Edit sticky note:", currentContent);
  if (newContent !== null && newContent.trim() !== "") {
    try {
      await updateDoc(doc(db, "sticky_notes", id), {
        content: newContent.trim()
      });
    } catch (error) {
      console.error("Error updating note:", error);
      alert("You do not have permission to edit this note.");
    }
  }
}

async function deleteNote(id) {
  if (confirm("Are you sure you want to remove this sticky note?")) {
    try {
      await deleteDoc(doc(db, "sticky_notes", id));
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("You do not have permission to delete this note.");
    }
  }
}

// ==================== DEVICE CAMERA CAPTURE ====================
async function startCameraStream() {
  stopCameraStream();
  cameraVideo.classList.remove("hidden");
  cameraPreviewImg.classList.add("hidden");
  capturePhotoBtn.classList.remove("hidden");
  retakePhotoBtn.classList.add("hidden");
  usePhotoBtn.classList.add("hidden");
  capturedBlob = null;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    cameraStatusMsg.textContent = "Camera API is unavailable on this browser. Please use Image upload instead.";
    return;
  }

  try {
    cameraStatusMsg.textContent = "Requesting camera access...";
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: cameraFacingMode },
      audio: false
    });
    cameraVideo.srcObject = cameraStream;
    cameraStatusMsg.textContent = "Camera active. Click Capture to take a photo.";
  } catch (err) {
    cameraStatusMsg.textContent = `Camera error: ${err.message}. Check browser camera permissions.`;
  }
}

function stopCameraStream() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  cameraVideo.srcObject = null;
}

openCameraBtn.addEventListener("click", () => {
  cameraModal.classList.remove("hidden");
  startCameraStream();
});

closeCameraBtn.addEventListener("click", () => {
  stopCameraStream();
  cameraModal.classList.add("hidden");
});

switchCameraBtn.addEventListener("click", () => {
  cameraFacingMode = cameraFacingMode === "environment" ? "user" : "environment";
  startCameraStream();
});

capturePhotoBtn.addEventListener("click", () => {
  if (!cameraStream) return;
  const width = cameraVideo.videoWidth || 640;
  const height = cameraVideo.videoHeight || 480;
  cameraCanvas.width = width;
  cameraCanvas.height = height;

  const ctx = cameraCanvas.getContext("2d");
  ctx.drawImage(cameraVideo, 0, 0, width, height);

  cameraCanvas.toBlob(
    (blob) => {
      if (!blob) return;
      capturedBlob = blob;
      if (capturedPreviewUrl) URL.revokeObjectURL(capturedPreviewUrl);
      capturedPreviewUrl = URL.createObjectURL(blob);

      cameraPreviewImg.src = capturedPreviewUrl;
      cameraVideo.classList.add("hidden");
      cameraPreviewImg.classList.remove("hidden");
      capturePhotoBtn.classList.add("hidden");
      retakePhotoBtn.classList.remove("hidden");
      usePhotoBtn.classList.remove("hidden");
      cameraStatusMsg.textContent = "Photo captured! Attach it or retake.";
    },
    "image/jpeg",
    0.88
  );
});

retakePhotoBtn.addEventListener("click", () => {
  startCameraStream();
});

usePhotoBtn.addEventListener("click", () => {
  if (!capturedBlob) return;
  const fileName = `camera_${Date.now()}.jpg`;
  const fileObj = new File([capturedBlob], fileName, { type: "image/jpeg" });
  setPendingAttachment(fileObj, true);
  stopCameraStream();
  cameraModal.classList.add("hidden");
});

// ==================== FREE CLOUD STORAGE UPLOAD (CLOUDINARY) ====================
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function setPendingAttachment(file, forceImage = false) {
  if (!file) return;
  // 10 MB limit for Cloudinary Free Tier
  if (file.size > 10 * 1024 * 1024) {
    alert("File exceeds the 10 MB free storage limit. Please choose a smaller file.");
    return;
  }

  const isImage = forceImage || file.type.startsWith("image/");
  const previewUrl = isImage ? URL.createObjectURL(file) : "";

  pendingAttachment = {
    file,
    previewUrl,
    isImage,
    name: file.name,
    size: file.size
  };

  attachmentFileName.textContent = file.name;
  attachmentFileMeta.textContent = `${isImage ? "Image" : "File"} • ${formatFileSize(file.size)}`;

  if (isImage && previewUrl) {
    attachmentImageThumb.src = previewUrl;
    attachmentImageThumb.classList.remove("hidden");
  } else {
    attachmentImageThumb.classList.add("hidden");
  }

  attachmentPreviewBanner.classList.remove("hidden");
}

function clearPendingAttachment() {
  if (pendingAttachment && pendingAttachment.previewUrl) {
    URL.revokeObjectURL(pendingAttachment.previewUrl);
  }
  pendingAttachment = null;
  imageFileInput.value = "";
  generalFileInput.value = "";
  attachmentPreviewBanner.classList.add("hidden");
  attachmentImageThumb.classList.add("hidden");
}

pickImageBtn.addEventListener("click", () => imageFileInput.click());
pickFileBtn.addEventListener("click", () => generalFileInput.click());
imageFileInput.addEventListener("change", (e) => {
  if (e.target.files && e.target.files[0]) setPendingAttachment(e.target.files[0], true);
});
generalFileInput.addEventListener("change", (e) => {
  if (e.target.files && e.target.files[0]) setPendingAttachment(e.target.files[0], false);
});
removeAttachmentBtn.addEventListener("click", clearPendingAttachment);

async function uploadToFreeStorage(file) {
  const isConfigured =
    FREE_STORAGE_CONFIG.cloudName &&
    FREE_STORAGE_CONFIG.cloudName !== "YOUR_CLOUDINARY_CLOUD_NAME" &&
    FREE_STORAGE_CONFIG.uploadPreset &&
    FREE_STORAGE_CONFIG.uploadPreset !== "YOUR_UNSIGNED_UPLOAD_PRESET";

  if (!isConfigured) {
    // Fallback for small images (< 450 KB) when Cloudinary preset is not configured yet
    if (file.type.startsWith("image/") && file.size <= 450 * 1024) {
      const dataUrl = await fileToCompressedDataURL(file);
      return {
        url: dataUrl,
        name: file.name,
        isImage: true,
        storageProvider: "inline-fallback"
      };
    }
    throw new Error(
      "Free cloud storage is not configured yet. Add your free Cloudinary cloudName and unsigned uploadPreset in app.js (see README.md)."
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${FREE_STORAGE_CONFIG.cloudName}/auto/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", FREE_STORAGE_CONFIG.uploadPreset);

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error((errData.error && errData.error.message) || "Cloud storage upload failed.");
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    name: file.name,
    isImage: file.type.startsWith("image/") || data.resource_type === "image",
    storageProvider: "cloudinary"
  };
}

function fileToCompressedDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ==================== USER & ADMIN MESSAGING + REPLIES ====================
function setReplyTarget(msgObj) {
  activeReplyTo = {
    id: msgObj.id,
    author: msgObj.author,
    nickname: msgObj.nickname,
    text: msgObj.text || (msgObj.attachment ? `[Attachment: ${msgObj.attachment.name}]` : "Message")
  };
  replyTargetAuthor.textContent = `@${msgObj.nickname || "user"}`;
  replyTargetText.textContent = activeReplyTo.text.slice(0, 80);
  replyPreviewBanner.classList.remove("hidden");
  chatMessageInput.focus();
}

function clearReplyTarget() {
  activeReplyTo = null;
  replyPreviewBanner.classList.add("hidden");
}

cancelReplyBtn.addEventListener("click", clearReplyTarget);

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return;
  unlockAudioSpeaker();

  const text = chatMessageInput.value.trim();
  if (!text && !pendingAttachment) return;

  sendChatBtn.disabled = true;
  let uploadedAttachment = null;

  try {
    if (pendingAttachment) {
      uploadProgressMsg.textContent = `Uploading "${pendingAttachment.name}" to free cloud storage...`;
      uploadProgressMsg.classList.remove("hidden");
      uploadedAttachment = await uploadToFreeStorage(pendingAttachment.file);
    }

    const nickname = getEffectiveNickname();
    const displayAuthor = `${settings.avatar || "😎"} @${nickname}`;

    await addDoc(messagesCollection, {
      senderId: currentUser.uid,
      author: displayAuthor,
      nickname,
      senderRole: currentUserRole,
      text,
      replyTo: activeReplyTo ? { ...activeReplyTo } : null,
      attachment: uploadedAttachment,
      createdAt: serverTimestamp()
    });

    chatMessageInput.value = "";
    clearReplyTarget();
    clearPendingAttachment();
    uploadProgressMsg.classList.add("hidden");
  } catch (error) {
    console.error("Message send error:", error);
    alert(error.message || "Failed to send message.");
    uploadProgressMsg.classList.add("hidden");
  } finally {
    sendChatBtn.disabled = false;
  }
});

function startListeningToMessages() {
  if (unsubscribeMessages) unsubscribeMessages();
  hasLoadedInitialMessages = false;
  knownMessageIds.clear();

  const q = query(messagesCollection, orderBy("createdAt", "asc"), limit(150));

  unsubscribeMessages = onSnapshot(q, (snapshot) => {
    const myNickname = getEffectiveNickname().toLowerCase();

    if (!hasLoadedInitialMessages) {
      snapshot.docs.forEach((d) => knownMessageIds.add(d.id));
      hasLoadedInitialMessages = true;
    } else {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && !knownMessageIds.has(change.doc.id)) {
          knownMessageIds.add(change.doc.id);
          const msg = change.doc.data();

          if (currentUser && msg.senderId !== currentUser.uid) {
            const isReplyToMe =
              msg.replyTo &&
              msg.replyTo.nickname &&
              msg.replyTo.nickname.toLowerCase() === myNickname;
            const isMentioningMe =
              msg.text && msg.text.toLowerCase().includes(`@${myNickname}`);

            const roleTag = msg.senderRole === "admin" ? " [ADMIN]" : "";
            const title = isReplyToMe
              ? `↩ ${msg.author}${roleTag} replied to you`
              : isMentioningMe
              ? `📣 ${msg.author}${roleTag} mentioned you`
              : `💬 New message from ${msg.author}${roleTag}`;

            const body =
              msg.text ||
              (msg.attachment ? `Sent an attachment: ${msg.attachment.name}` : "New message");

            pushNotification({
              type: "chat",
              title,
              body: body.slice(0, 65),
              targetTab: "chat"
            });

            if (activeWorkspaceTab !== "chat") {
              unreadChatCount += 1;
              chatUnreadPill.textContent = unreadChatCount > 9 ? "9+" : String(unreadChatCount);
              chatUnreadPill.classList.remove("hidden");
            }
          }
        }
      });
    }

    latestMessages = snapshot.docs;
    renderChatMessages();
  });
}

chatChannelFilter.addEventListener("change", renderChatMessages);

function scrollChatToBottom() {
  chatMessagesFeed.scrollTop = chatMessagesFeed.scrollHeight;
}

function renderChatMessages() {
  chatMessagesFeed.innerHTML = "";
  if (!currentUser) return;

  const filterVal = chatChannelFilter.value;
  let renderedCount = 0;

  latestMessages.forEach((docSnap) => {
    const msg = docSnap.data();
    const msgId = docSnap.id;

    if (filterVal === "admin" && msg.senderRole !== "admin") return;
    if (filterVal === "user" && msg.senderRole === "admin") return;
    if (filterVal === "media" && !msg.attachment) return;

    renderedCount += 1;
    const isMine = msg.senderId === currentUser.uid;
    const isAdminSender = msg.senderRole === "admin";
    const canDelete = isMine || currentUserRole === "admin";

    const row = document.createElement("div");
    row.className = `chat-bubble-row ${isMine ? "mine" : ""}`;
    row.id = `msg_${msgId}`;

    const roleChip = isAdminSender
      ? `<span class="badge badge-admin">ADMIN</span>`
      : `<span class="badge badge-user">USER</span>`;

    const timeStr =
      msg.createdAt && typeof msg.createdAt.toDate === "function"
        ? msg.createdAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "Just now";

    let replyHTML = "";
    if (msg.replyTo) {
      replyHTML = `
        <div class="chat-reply-quote" data-reply-id="${escapeAttr(msg.replyTo.id || "")}">
          <strong>↩ @${escapeHTML(msg.replyTo.nickname || "user")}</strong>:
          <span>${escapeHTML(msg.replyTo.text || "")}</span>
        </div>
      `;
    }

    let attachmentHTML = "";
    if (msg.attachment && msg.attachment.url) {
      if (msg.attachment.isImage) {
        attachmentHTML = `
          <a href="${escapeAttr(msg.attachment.url)}" target="_blank" rel="noopener noreferrer">
            <img src="${escapeAttr(msg.attachment.url)}" alt="${escapeAttr(msg.attachment.name || "Image")}" class="chat-attachment-image" loading="lazy" />
          </a>
        `;
      } else {
        attachmentHTML = `
          <a href="${escapeAttr(msg.attachment.url)}" target="_blank" rel="noopener noreferrer" download="${escapeAttr(msg.attachment.name || "file")}" class="chat-attachment-file">
            📄 ${escapeHTML(msg.attachment.name || "Download File")}
          </a>
        `;
      }
    }

    row.innerHTML = `
      <div class="chat-bubble">
        <div class="chat-bubble-header">
          <strong>${escapeHTML(msg.author || "@user")}</strong>
          ${roleChip}
          <span>• ${escapeHTML(timeStr)}</span>
        </div>
        ${replyHTML}
        ${msg.text ? `<div class="chat-text">${escapeHTML(msg.text)}</div>` : ""}
        ${attachmentHTML}
      </div>
      <div class="chat-bubble-actions">
        <button type="button" class="chat-action-link reply-msg-btn">↩ Reply</button>
        ${canDelete ? `<button type="button" class="chat-action-link delete-msg-btn">🗑️ Delete</button>` : ""}
      </div>
    `;

    // Jump to quoted message on click
    const quoteEl = row.querySelector(".chat-reply-quote");
    if (quoteEl && quoteEl.dataset.replyId) {
      quoteEl.addEventListener("click", () => {
        const targetEl = document.getElementById(`msg_${quoteEl.dataset.replyId}`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
          const bubble = targetEl.querySelector(".chat-bubble");
          if (bubble) {
            bubble.classList.add("highlight-flash");
            setTimeout(() => bubble.classList.remove("highlight-flash"), 1400);
          }
        }
      });
    }

    row.querySelector(".reply-msg-btn").addEventListener("click", () => {
      setReplyTarget({
        id: msgId,
        author: msg.author,
        nickname: msg.nickname,
        text: msg.text,
        attachment: msg.attachment
      });
    });

    if (canDelete) {
      row.querySelector(".delete-msg-btn").addEventListener("click", async () => {
        if (confirm("Delete this message?")) {
          try {
            await deleteDoc(doc(db, "messages", msgId));
          } catch (err) {
            alert("Could not delete message.");
          }
        }
      });
    }

    chatMessagesFeed.appendChild(row);
  });

  if (renderedCount === 0) {
    chatMessagesFeed.innerHTML = `<p class="empty-state">No messages yet. Start the conversation between Users & Admins!</p>`;
  } else {
    scrollChatToBottom();
  }
}

// ==================== HELPERS ====================
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}