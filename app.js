
/* Part 0: CampusPulse User Authentication (Google & Phone) */

function initAuth() {
  const savedUser = localStorage.getItem('campuspulse_user');
  if (savedUser) {
    try {
      AppState.currentUser = JSON.parse(savedUser);
    } catch (e) {
      AppState.currentUser = null;
    }
  }

  const overlay = document.getElementById('login-screen-overlay');
  if (AppState.currentUser) {
    if (overlay) overlay.classList.add('hidden');
    updateUserProfileDisplay();
  } else {
    if (overlay) overlay.classList.remove('hidden');
  }

  setupAuthListeners();
}

function loginWithGoogle() {
  const overlay = document.getElementById('login-screen-overlay');
  const googleBtn = document.getElementById('btn-login-google');
  if (googleBtn) {
    googleBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connecting with Google...';
  }

  setTimeout(() => {
    const user = {
      name: 'Prince Bhardwaj',
      email: 'prince.bhardwaj@campus.edu',
      phone: '+91 9685504121',
      method: 'Google',
      avatar: 'P'
    };
    AppState.currentUser = user;
    localStorage.setItem('campuspulse_user', JSON.stringify(user));
    if (overlay) overlay.classList.add('hidden');
    if (googleBtn) {
      googleBtn.innerHTML = `
        <svg class="google-svg-icon" viewBox="0 0 24 24" width="20" height="20">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <span class="btn-text">Continue with Google</span>
      `;
    }
    updateUserProfileDisplay();
    showToast('Welcome Back, Prince!', 'Signed in successfully via Google.', 'success');
  }, 700);
}

function sendPhoneOtp() {
  const phoneInput = document.getElementById('input-login-phone');
  const stepNumber = document.getElementById('phone-login-step-number');
  const stepOtp = document.getElementById('phone-login-step-otp');
  const displayPhone = document.getElementById('display-otp-phone');
  const val = (phoneInput ? phoneInput.value.trim() : '') || '9685504121';

  if (val.length < 10) {
    showToast('Invalid Phone Number', 'Please enter a valid 10-digit mobile number', 'warning');
    return;
  }

  if (displayPhone) displayPhone.textContent = `+91 ${val}`;
  if (stepNumber) stepNumber.style.display = 'none';
  if (stepOtp) stepOtp.style.display = 'flex';
  showToast('OTP Sent', `Verification code sent to +91 ${val}`, 'info');
}

function verifyPhoneOtp() {
  const phoneInput = document.getElementById('input-login-phone');
  const val = (phoneInput ? phoneInput.value.trim() : '') || '9685504121';
  const overlay = document.getElementById('login-screen-overlay');

  const user = {
    name: 'Student (+91 ' + val.slice(-4) + ')',
    phone: '+91 ' + val,
    email: 'student' + val.slice(-4) + '@campus.edu',
    method: 'Phone OTP',
    avatar: 'S'
  };

  AppState.currentUser = user;
  localStorage.setItem('campuspulse_user', JSON.stringify(user));
  if (overlay) overlay.classList.add('hidden');
  updateUserProfileDisplay();
  showToast('Verified!', 'Logged in successfully with phone.', 'success');
}

function loginAsGuest() {
  const overlay = document.getElementById('login-screen-overlay');
  const user = {
    name: 'Campus Guest',
    email: 'guest@campus.edu',
    phone: '+91 9685504121',
    method: 'Guest',
    avatar: 'G'
  };
  AppState.currentUser = user;
  if (overlay) overlay.classList.add('hidden');
  updateUserProfileDisplay();
  showToast('Guest Session', 'Browsing CampusPulse as Guest.', 'info');
}

function logoutUser() {
  AppState.currentUser = null;
  localStorage.removeItem('campuspulse_user');
  const overlay = document.getElementById('login-screen-overlay');
  const modalSettings = document.getElementById('modal-settings');
  const stepNumber = document.getElementById('phone-login-step-number');
  const stepOtp = document.getElementById('phone-login-step-otp');

  if (modalSettings) modalSettings.style.display = 'none';
  if (stepNumber) stepNumber.style.display = 'flex';
  if (stepOtp) stepOtp.style.display = 'none';
  if (overlay) overlay.classList.remove('hidden');

  showToast('Logged Out', 'You have been safely signed out.', 'info');
}

function updateUserProfileDisplay() {
  const user = AppState.currentUser;
  if (!user) return;

  const nameEl = document.getElementById('settings-user-name');
  const contactEl = document.getElementById('display-otp-phone');
  const userContactEl = document.getElementById('settings-user-contact');
  const avatarEl = document.getElementById('settings-user-avatar');

  if (nameEl) nameEl.textContent = user.name;
  if (userContactEl) userContactEl.textContent = `${user.email || user.phone} (${user.method})`;
  if (avatarEl) avatarEl.textContent = user.avatar || user.name.charAt(0).toUpperCase();

  // Pre-fill registration forms
  const regName = document.getElementById('reg-fullname');
  const regEmail = document.getElementById('reg-email');
  const regPhone = document.getElementById('reg-phone');
  if (regName && !regName.value) regName.value = user.name;
  if (regEmail && !regEmail.value && user.email) regEmail.value = user.email;
  if (regPhone && !regPhone.value && user.phone) regPhone.value = user.phone;
}

function setupAuthListeners() {
  const btnGoogle = document.getElementById('btn-login-google');
  const btnReqOtp = document.getElementById('btn-request-otp');
  const btnVerifyOtp = document.getElementById('btn-verify-otp');
  const btnBackPhone = document.getElementById('btn-back-to-phone');
  const btnSkipGuest = document.getElementById('btn-skip-guest');
  const btnLogout = document.getElementById('btn-user-logout');
  const btnCloseSettingsX = document.getElementById('btn-close-settings-x');
  const modalSettings = document.getElementById('modal-settings');

  if (btnGoogle) btnGoogle.addEventListener('click', loginWithGoogle);
  if (btnReqOtp) btnReqOtp.addEventListener('click', sendPhoneOtp);
  if (btnVerifyOtp) btnVerifyOtp.addEventListener('click', verifyPhoneOtp);
  if (btnBackPhone) {
    btnBackPhone.addEventListener('click', () => {
      document.getElementById('phone-login-step-number').style.display = 'flex';
      document.getElementById('phone-login-step-otp').style.display = 'none';
    });
  }
  if (btnSkipGuest) btnSkipGuest.addEventListener('click', loginAsGuest);
  if (btnLogout) btnLogout.addEventListener('click', logoutUser);
  if (btnCloseSettingsX && modalSettings) {
    btnCloseSettingsX.addEventListener('click', () => modalSettings.style.display = 'none');
  }

  // Auto tab through OTP fields
  document.querySelectorAll('.otp-digit').forEach((input, idx, all) => {
    input.addEventListener('keyup', (e) => {
      if (e.key >= '0' && e.key <= '9') {
        if (idx < all.length - 1) all[idx + 1].focus();
      } else if (e.key === 'Backspace') {
        if (idx > 0) all[idx - 1].focus();
      } else if (e.key === 'Enter') {
        verifyPhoneOtp();
      }
    });
  });
}

/* CampusPulse Event Hub ? Complete Dual-Interface JavaScript Part 1 */
let CAMPUS_EVENTS = [
  {
    id: "evt-1",
    title: "AI & Robotics Summit 2026",
    category: "Technology",
    date: "2026-10-15",
    dateDisplay: "Thu, Oct 15",
    timeDisplay: "10:00 AM - 12:30 PM",
    isoStart: "2026-10-15T10:00:00",
    isoEnd: "2026-10-15T12:30:00",
    venue: "Turing Auditorium, Eng Hall",
    organizer: "Campus Robotics Club",
    capacity: 150,
    registeredCount: 138,
    bgGradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
    description: "Explore the bleeding edge of artificial intelligence, humanoid robotics, and neural autonomy with live hardware demos and keynote speaker Dr. Aris Vance.",
    agenda: ["10:00 AM - Opening & Autonomous Robotics Demo", "11:00 AM - Keynote: Generative AI in Physical Systems", "12:00 PM - Q&A and Student Showcase"]
  },
  {
    id: "evt-2",
    title: "Campus Hackathon 2026 Kickoff",
    category: "Technology",
    date: "2026-10-15",
    dateDisplay: "Thu, Oct 15",
    timeDisplay: "11:30 AM - 02:00 PM",
    isoStart: "2026-10-15T11:30:00",
    isoEnd: "2026-10-15T14:00:00",
    venue: "Innovation Hub, Student Center",
    organizer: "ACM Student Chapter",
    capacity: 200,
    registeredCount: 184,
    bgGradient: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)",
    description: "The 36-hour flagship campus hackathon begins! Team formation mixer, API sponsor credits distribution, hardware checkout, and free lunch.",
    agenda: ["11:30 AM - Check-in & Team Matching Mixer", "12:15 PM - Hackathon Rules & Sponsor API Keys", "01:00 PM - Hacking Commences & Lunch Buffet"]
  },
  {
    id: "evt-3",
    title: "Design Thinking & UI/UX Masterclass",
    category: "Career",
    date: "2026-10-16",
    dateDisplay: "Fri, Oct 16",
    timeDisplay: "02:00 PM - 04:30 PM",
    isoStart: "2026-10-16T14:00:00",
    isoEnd: "2026-10-16T16:30:00",
    venue: "Design Studio 3, Arts Complex",
    organizer: "Product Design Guild",
    capacity: 50,
    registeredCount: 42,
    bgGradient: "linear-gradient(135deg, #581c87 0%, #7e22ce 50%, #9333ea 100%)",
    description: "Hands-on rapid prototyping and user journey mapping workshop led by senior product designers. Bring your laptop and wireframing tools.",
    agenda: ["02:00 PM - User Research Insights", "02:45 PM - Figma Prototyping Sprint", "04:00 PM - Peer Design Critiques"]
  },
  {
    id: "evt-4",
    title: "Startup Pitch & Venture Fair",
    category: "Career",
    date: "2026-10-16",
    dateDisplay: "Fri, Oct 16",
    timeDisplay: "03:30 PM - 06:00 PM",
    isoStart: "2026-10-16T15:30:00",
    isoEnd: "2026-10-16T18:00:00",
    venue: "Business School Amphitheater",
    organizer: "Campus Incubator & Ventures",
    capacity: 120,
    registeredCount: 95,
    bgGradient: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    description: "10 student founder teams pitch for $15,000 in non-dilutive grant funding in front of alumni investors and venture capital judges.",
    agenda: ["03:30 PM - Founder Pitches (Batch 1)", "04:30 PM - Networking Break", "05:15 PM - Seed Award Announcements"]
  },
  {
    id: "evt-5",
    title: "Autumn Acoustic Music Festival",
    category: "Arts & Music",
    date: "2026-10-18",
    dateDisplay: "Sun, Oct 18",
    timeDisplay: "06:00 PM - 09:30 PM",
    isoStart: "2026-10-18T18:00:00",
    isoEnd: "2026-10-18T21:30:00",
    venue: "Central Quad Amphitheater",
    organizer: "Student Activities Council",
    capacity: 350,
    registeredCount: 310,
    bgGradient: "linear-gradient(135deg, #831843 0%, #be185d 50%, #db2777 100%)",
    description: "Under-the-stars live outdoor concert featuring 6 student indie-folk bands, artisan hot cider, food trucks, and light installations.",
    agenda: ["06:00 PM - Gates Open & Acoustic Sets", "07:30 PM - Headline Band Performance", "09:00 PM - Grand Jam Session Finale"]
  },
  {
    id: "evt-6",
    title: "Intramural 3v3 Basketball Showdown",
    category: "Sports",
    date: "2026-10-19",
    dateDisplay: "Mon, Oct 19",
    timeDisplay: "04:00 PM - 07:30 PM",
    isoStart: "2026-10-19T16:00:00",
    isoEnd: "2026-10-19T19:30:00",
    venue: "Student Rec Center Court 1",
    organizer: "Campus Athletics Dept",
    capacity: 80,
    registeredCount: 65,
    bgGradient: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
    description: "High-octane tournament with 16 campus squads battling it out in single-elimination games for the Fall intramural trophy.",
    agenda: ["04:00 PM - Bracket Seedings", "04:30 PM - Quarterfinals & Semifinals", "06:45 PM - Championship Game"]
  },
  {
    id: "evt-7",
    title: "Inter-Collegiate Debate Championship",
    category: "Academic",
    date: "2026-10-21",
    dateDisplay: "Wed, Oct 21",
    timeDisplay: "01:00 PM - 04:00 PM",
    isoStart: "2026-10-21T13:00:00",
    isoEnd: "2026-10-21T16:00:00",
    venue: "Law School Moot Court Room",
    organizer: "Debate & Oratory Society",
    capacity: 90,
    registeredCount: 78,
    bgGradient: "linear-gradient(135deg, #14532d 0%, #16a34a 50%, #22c55e 100%)",
    description: "Parliamentary debate motion on ethical artificial intelligence, autonomous weapons, and international regulation.",
    agenda: ["01:00 PM - Motion Reveal & Prep", "01:45 PM - Opening Arguments", "03:15 PM - Judges Deliberation"]
  },
  {
    id: "evt-8",
    title: "Cybersecurity CTF Challenge",
    category: "Technology",
    date: "2026-10-23",
    dateDisplay: "Fri, Oct 23",
    timeDisplay: "10:00 AM - 03:00 PM",
    isoStart: "2026-10-23T10:00:00",
    isoEnd: "2026-10-23T15:00:00",
    venue: "Computing Center Lab B",
    organizer: "Cyber Defense Group",
    capacity: 100,
    registeredCount: 88,
    bgGradient: "linear-gradient(135deg, #0f172a 0%, #334155 50%, #475569 100%)",
    description: "Jeopardy-style Capture The Flag tournament covering web vulnerabilities, reverse engineering, cryptography, and network traffic forensics.",
    agenda: ["10:00 AM - Security Briefing & VPN Setup", "10:30 AM - CTF Flags Go Live", "02:30 PM - Solutions Walkthrough"]
  }
];

const AppState = {
  currentRole: 'student',
  currentUser: null,
  isOperatorAuthenticated: false, // 'student' | 'operator'
  activeScreen: 'home',
  activeOpScreen: 'op-dashboard',
  screenHistory: ['home'],
  selectedEventId: null,
  activeFilter: 'all',
  searchQuery: '',
  activeSort: 'date-asc',
  opAttendeeSearch: '',
  theme: localStorage.getItem('cp_theme') || 'light',
  myRegistrations: [],
  pendingRegistration: null
};

// Data Persistence
function loadStoredData() {
  const savedEvents = localStorage.getItem('cp_custom_events');
  if (savedEvents) {
    try {
      CAMPUS_EVENTS = JSON.parse(savedEvents);
    } catch(e) {}
  }

  const savedRegs = localStorage.getItem('cp_registrations');
  if (savedRegs) {
    try {
      AppState.myRegistrations = JSON.parse(savedRegs);
      return;
    } catch(e) {}
  }
  AppState.myRegistrations = [
    {
      id: "reg-init-1",
      eventId: "evt-1",
      registeredAt: "2026-10-10T09:30:00",
      fullName: "Jordan Rivera",
      email: "jordan.rivera@campus.edu",
      studentId: "STU-9921",
      ticketType: "Standard Pass",
      phone: "+1 (555) 349-8821",
      specialNotes: "None",
      checkedIn: false,
      hasConflict: false
    }
  ];
  saveRegistrations();
}

function saveEvents() {
  localStorage.setItem('cp_custom_events', JSON.stringify(CAMPUS_EVENTS));
  updateBadgesAndMetrics();
}

function saveRegistrations() {
  localStorage.setItem('cp_registrations', JSON.stringify(AppState.myRegistrations));
  updateBadgesAndMetrics();
}

// Conflict Calculation Math
function checkTimeConflict(eventA, eventB) {
  if (!eventA || !eventB) return { isConflict: false, overlapMinutes: 0 };
  const startA = new Date(eventA.isoStart).getTime();
  const endA = new Date(eventA.isoEnd).getTime();
  const startB = new Date(eventB.isoStart).getTime();
  const endB = new Date(eventB.isoEnd).getTime();
  const isConflict = startA < endB && endA > startB;
  let overlapMinutes = 0;
  if (isConflict) {
    const overlapMs = Math.min(endA, endB) - Math.max(startA, startB);
    overlapMinutes = Math.max(1, Math.round(overlapMs / 60000));
  }
  return { isConflict, overlapMinutes };
}

function findConflictsForEvent(eventId) {
  const targetEvent = CAMPUS_EVENTS.find(e => e.id === eventId);
  if (!targetEvent) return [];
  const conflicts = [];
  AppState.myRegistrations.forEach(reg => {
    if (reg.eventId === eventId) return;
    const existingEvent = CAMPUS_EVENTS.find(e => e.id === reg.eventId);
    if (!existingEvent) return;
    const conflictResult = checkTimeConflict(targetEvent, existingEvent);
    if (conflictResult.isConflict) {
      conflicts.push({
        registeredEvent: existingEvent,
        registration: reg,
        overlapMinutes: conflictResult.overlapMinutes
      });
    }
  });
  return conflicts;
}

function isEventRegistered(eventId) {
  return AppState.myRegistrations.some(r => r.eventId === eventId);
}

function getAllSystemConflicts() {
  const conflictsList = [];
  const regCount = AppState.myRegistrations.length;
  for (let i = 0; i < regCount; i++) {
    for (let j = i + 1; j < regCount; j++) {
      const regA = AppState.myRegistrations[i];
      const regB = AppState.myRegistrations[j];
      const evA = CAMPUS_EVENTS.find(e => e.id === regA.eventId);
      const evB = CAMPUS_EVENTS.find(e => e.id === regB.eventId);
      if (evA && evB) {
        const c = checkTimeConflict(evA, evB);
        if (c.isConflict) {
          conflictsList.push({
            studentName: regA.fullName,
            studentId: regA.studentId,
            eventA: evA,
            eventB: evB,
            overlapMinutes: c.overlapMinutes
          });
        }
      }
    }
  }
  return conflictsList;
}

function hasAnyScheduleClash() {
  return getAllSystemConflicts().length > 0;
}

/* Part 2: Student Screens & Navigation */
function updateBadgesAndMetrics() {
  const regCount = AppState.myRegistrations.length;
  const passBadge = document.getElementById('tab-badge-count');
  if (passBadge) {
    passBadge.textContent = regCount;
    passBadge.style.display = regCount > 0 ? 'flex' : 'none';
  }
  const metricPasses = document.getElementById('metric-passes-count');
  if (metricPasses) metricPasses.textContent = regCount;
  const metricEvents = document.getElementById('metric-events-count');
  if (metricEvents) metricEvents.textContent = CAMPUS_EVENTS.length;
  const clashCountEl = document.getElementById('metric-clash-count');
  if (clashCountEl) {
    clashCountEl.textContent = hasAnyScheduleClash() ? '1+' : '0';
  }
  const activePasses = document.getElementById('passes-total-count');
  if (activePasses) activePasses.textContent = regCount;
  const summaryCaption = document.getElementById('schedule-status-caption');
  if (summaryCaption) {
    summaryCaption.textContent = `${regCount} confirmed pass${regCount === 1 ? '' : 'es'} on schedule`;
  }

  // Update Operator KPIs too
  const opKpiEvents = document.getElementById('op-kpi-events');
  if (opKpiEvents) opKpiEvents.textContent = CAMPUS_EVENTS.length;
  const opKpiAttendees = document.getElementById('op-kpi-attendees');
  if (opKpiAttendees) opKpiAttendees.textContent = regCount;
  const opKpiClashes = document.getElementById('op-kpi-clashes');
  if (opKpiClashes) opKpiClashes.textContent = getAllSystemConflicts().length;

  let totalCap = 0;
  let totalBooked = 0;
  CAMPUS_EVENTS.forEach(e => {
    totalCap += e.capacity;
    totalBooked += e.registeredCount;
  });
  const avgOcc = totalCap > 0 ? Math.round((totalBooked / totalCap) * 100) : 0;
  const opKpiOccupancy = document.getElementById('op-kpi-occupancy');
  if (opKpiOccupancy) opKpiOccupancy.textContent = `${avgOcc}%`;
}

function navigateTo(screenId, eventId = null, isBack = false) {
  if (screenId === 'details' && eventId) {
    AppState.selectedEventId = eventId;
  }
  if (!isBack && AppState.activeScreen !== screenId) {
    AppState.screenHistory.push(screenId);
  }
  AppState.activeScreen = screenId;

  document.querySelectorAll('#interface-student-wrapper .screen-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  const targetPanel = document.getElementById(`screen-${screenId}`);
  if (targetPanel) targetPanel.classList.add('active');

  const backBtn = document.getElementById('top-back-btn');
  const brandBadge = document.getElementById('top-brand-badge');
  const screenTitle = document.getElementById('top-screen-title');

  if (screenId === 'details' || screenId === 'register') {
    if (backBtn) backBtn.style.display = 'inline-flex';
    if (brandBadge) brandBadge.style.display = 'none';
    if (screenTitle) {
      screenTitle.style.display = 'block';
      screenTitle.textContent = screenId === 'details' ? 'Event Details' : 'Register';
    }
  } else {
    if (backBtn) backBtn.style.display = 'none';
    if (brandBadge) brandBadge.style.display = 'flex';
    if (screenTitle) screenTitle.style.display = 'none';
  }

  document.querySelectorAll('#nav-tabs-student .bottom-tab-item').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.screen === screenId);
  });

  if (screenId === 'home') renderHomeScreen();
  else if (screenId === 'events') renderEventsScreen();
  else if (screenId === 'details') renderDetailsScreen(AppState.selectedEventId);
  else if (screenId === 'register') renderRegisterScreen(AppState.selectedEventId);
  else if (screenId === 'my-registrations') renderMyRegistrationsScreen();

  const scrollContainer = document.getElementById('screen-scroll-surface');
  if (scrollContainer) scrollContainer.scrollTop = 0;
}

function renderHomeScreen() {
  updateBadgesAndMetrics();
  const featuredScroller = document.getElementById('home-featured-list');
  if (featuredScroller) {
    const featuredList = CAMPUS_EVENTS.slice(0, 4);
    featuredScroller.innerHTML = featuredList.map(evt => {
      const isReg = isEventRegistered(evt.id);
      const conflicts = !isReg ? findConflictsForEvent(evt.id) : [];
      let statusBadge = '';
      if (isReg) {
        statusBadge = '<span class="badge-registered-status"><i class="fa-solid fa-check"></i> Registered</span>';
      } else if (conflicts.length > 0) {
        statusBadge = '<span class="badge-clash-status"><i class="fa-solid fa-bolt"></i> Clash Alert</span>';
      }
      return `
        <div class="featured-card" onclick="navigateTo('details', '${evt.id}')">
          <div class="featured-card-cover" style="background: ${evt.bgGradient || 'linear-gradient(135deg, #4f46e5, #7c3aed)'}">
            <div class="featured-badge-row">
              <span class="badge-category">${evt.category}</span>
              ${statusBadge}
            </div>
            <div style="font-size: 11px; color: #fff; font-weight: 700;">${evt.dateDisplay}</div>
          </div>
          <div class="featured-card-body">
            <h4 class="featured-event-title">${evt.title}</h4>
            <div class="event-meta-line"><i class="fa-regular fa-clock"></i><span>${evt.timeDisplay}</span></div>
            <div class="event-meta-line"><i class="fa-solid fa-location-dot"></i><span>${evt.venue}</span></div>
            <div class="featured-card-footer">
              <span class="capacity-chip">${evt.registeredCount}/${evt.capacity} spots</span>
              <span class="view-btn-pill">View <i class="fa-solid fa-chevron-right"></i></span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  const upcomingContainer = document.getElementById('home-upcoming-list');
  if (upcomingContainer) {
    const upcomingList = CAMPUS_EVENTS.slice(0, 5);
    upcomingContainer.innerHTML = upcomingList.map(evt => renderEventListCardHtml(evt)).join('');
  }
}

function renderEventsScreen() {
  const container = document.getElementById('all-events-container');
  const countLabel = document.getElementById('events-counter-label');
  if (!container) return;

  let filtered = CAMPUS_EVENTS.filter(evt => {
    const matchesFilter = AppState.activeFilter === 'all' || evt.category === AppState.activeFilter;
    const query = AppState.searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      evt.title.toLowerCase().includes(query) ||
      evt.venue.toLowerCase().includes(query) ||
      evt.organizer.toLowerCase().includes(query) ||
      evt.category.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  if (AppState.activeSort === 'date-asc') {
    filtered.sort((a, b) => new Date(a.isoStart) - new Date(b.isoStart));
  } else if (AppState.activeSort === 'popularity') {
    filtered.sort((a, b) => (b.registeredCount / b.capacity) - (a.registeredCount / a.capacity));
  } else if (AppState.activeSort === 'title-asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (countLabel) countLabel.textContent = `Showing ${filtered.length} event${filtered.length === 1 ? '' : 's'}`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-events-state">
        <div class="empty-state-icon"><i class="fa-regular fa-calendar-xmark"></i></div>
        <h4>No Events Found</h4>
        <p>Try adjusting your search keywords or filter category.</p>
      </div>
    `;
    return;
  }
  container.innerHTML = filtered.map(evt => renderEventListCardHtml(evt)).join('');
}

function renderEventListCardHtml(evt) {
  const isReg = isEventRegistered(evt.id);
  const conflicts = !isReg ? findConflictsForEvent(evt.id) : [];
  const dateObj = new Date(evt.isoStart);
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const month = monthNames[dateObj.getMonth()];
  const day = dateObj.getDate();

  let tagHtml = `<span class="category-mini-tag">${evt.category}</span>`;
  if (isReg) {
    tagHtml += `<span class="tag-registered"><i class="fa-solid fa-check"></i> Booked</span>`;
  } else if (conflicts.length > 0) {
    tagHtml += `<span class="tag-clash"><i class="fa-solid fa-bolt"></i> Clash Alert</span>`;
  }

  return `
    <div class="event-list-card" onclick="navigateTo('details', '${evt.id}')">
      <div class="event-date-badge">
        <span class="date-badge-month">${month}</span>
        <span class="date-badge-day">${day}</span>
      </div>
      <div class="event-card-content">
        <div class="event-tags-row">${tagHtml}</div>
        <h4 class="event-card-title">${evt.title}</h4>
        <div class="event-card-time-loc">
          <span><i class="fa-regular fa-clock" style="color: var(--primary);"></i> ${evt.timeDisplay}</span>
          <span><i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> ${evt.venue.split(',')[0]}</span>
        </div>
      </div>
      <div class="event-card-arrow"><i class="fa-solid fa-chevron-right"></i></div>
    </div>
  `;
}

function renderDetailsScreen(eventId) {
  const container = document.getElementById('details-render-container');
  if (!container) return;
  const evt = CAMPUS_EVENTS.find(e => e.id === eventId);
  if (!evt) {
    container.innerHTML = '<p>Event not found.</p>';
    return;
  }

  const isReg = isEventRegistered(eventId);
  const conflicts = !isReg ? findConflictsForEvent(eventId) : [];
  const pct = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));

  let clashCardHtml = '';
  if (!isReg && conflicts.length > 0) {
    const c = conflicts[0];
    clashCardHtml = `
      <div class="details-clash-warning-card">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <div class="details-clash-warning-text">
          <strong>?? Schedule Clash Warning!</strong>
          <p>Overlaps with <strong>${c.registeredEvent.title}</strong> (${c.registeredEvent.timeDisplay}) by ${c.overlapMinutes} minutes.</p>
        </div>
      </div>
    `;
  }

  let actionBtnHtml = '';
  if (isReg) {
    actionBtnHtml = `
      <div class="btn-registered-status">
        <i class="fa-solid fa-circle-check"></i>
        <span>Already Registered (Pass Confirmed)</span>
      </div>
    `;
  } else {
    actionBtnHtml = `
      <button class="btn-primary-action" onclick="navigateTo('register', '${evt.id}')">
        <span>Register for Event</span>
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    `;
  }

  container.innerHTML = `
    <div class="details-hero-banner" style="background: ${evt.bgGradient || 'linear-gradient(135deg, #4f46e5, #7c3aed)'}">
      <div class="details-banner-top">
        <span class="details-banner-badge">${evt.category}</span>
        ${isReg ? '<span class="details-banner-status status-active-badge"><i class="fa-solid fa-check"></i> Booked</span>' : ''}
      </div>
      <div style="font-size: 13px; font-weight: 700; color: #fff;">${evt.dateDisplay}</div>
    </div>

    <h2 class="details-header-title">${evt.title}</h2>
    <div class="details-organizer-row">
      <i class="fa-solid fa-users organizer-icon"></i>
      <span>Organized by <strong>${evt.organizer}</strong></span>
    </div>

    <div class="details-info-grid">
      <div class="info-grid-card">
        <div class="info-card-icon"><i class="fa-regular fa-clock"></i></div>
        <div class="info-card-text">
          <small>Time Slot</small>
          <strong>${evt.timeDisplay}</strong>
        </div>
      </div>
      <div class="info-grid-card">
        <div class="info-card-icon"><i class="fa-solid fa-location-dot"></i></div>
        <div class="info-card-text">
          <small>Campus Venue</small>
          <strong>${evt.venue}</strong>
        </div>
      </div>
    </div>

    ${clashCardHtml}

    <div class="details-capacity-card">
      <div class="capacity-title-row">
        <span>Capacity Fill</span>
        <span>${evt.registeredCount} / ${evt.capacity} registered (${pct}%)</span>
      </div>
      <div class="capacity-bar-track">
        <div class="capacity-bar-fill" style="width: ${pct}%;"></div>
      </div>
    </div>

    <div class="details-section-block">
      <h4>About This Event</h4>
      <p>${evt.description}</p>
    </div>

    <div class="details-section-block">
      <h4>Agenda & Highlights</h4>
      <ul class="agenda-items-list">
        ${(evt.agenda || []).map(a => `<li><i class="fa-solid fa-check-circle"></i><span>${a}</span></li>`).join('')}
      </ul>
    </div>

    <div class="details-action-bar">
      ${actionBtnHtml}
    </div>
  `;
}

function renderRegisterScreen(eventId) {
  const evt = CAMPUS_EVENTS.find(e => e.id === eventId);
  if (!evt) return;

  const hiddenInput = document.getElementById('form-hidden-event-id');
  if (hiddenInput) hiddenInput.value = eventId;

  const previewCard = document.getElementById('reg-event-preview-card');
  if (previewCard) {
    const dateObj = new Date(evt.isoStart);
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    previewCard.innerHTML = `
      <div class="preview-badge-date">
        <small>${months[dateObj.getMonth()]}</small>
        <span>${dateObj.getDate()}</span>
      </div>
      <div class="preview-meta">
        <h4>${evt.title}</h4>
        <p><i class="fa-regular fa-clock"></i> ${evt.timeDisplay} ? ${evt.venue.split(',')[0]}</p>
      </div>
    `;
  }

  const conflicts = findConflictsForEvent(eventId);
  const liveClashBox = document.getElementById('form-conflict-alert-box');
  const overlapPreview = document.getElementById('form-overlap-card');

  if (conflicts.length > 0) {
    const c = conflicts[0];
    if (liveClashBox) liveClashBox.style.display = 'block';
    if (overlapPreview) {
      overlapPreview.innerHTML = `
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>Clashes with <strong>${c.registeredEvent.title}</strong> (${c.registeredEvent.timeDisplay})</span>
      `;
    }
  } else {
    if (liveClashBox) liveClashBox.style.display = 'none';
  }

  resetFormValidationErrors();
}

function renderMyRegistrationsScreen() {
  updateBadgesAndMetrics();
  const container = document.getElementById('my-registrations-container');
  const globalClashBanner = document.getElementById('my-schedule-clash-banner');
  if (!container) return;

  const hasClash = hasAnyScheduleClash();
  if (globalClashBanner) {
    globalClashBanner.style.display = hasClash ? 'flex' : 'none';
  }

  if (AppState.myRegistrations.length === 0) {
    container.innerHTML = `
      <div class="empty-events-state">
        <div class="empty-state-icon"><i class="fa-solid fa-ticket"></i></div>
        <h4>No Passes Yet</h4>
        <p>You haven't registered for any campus events yet.</p>
        <button class="btn-primary-action" style="margin-top: 16px;" onclick="navigateTo('events')">
          <span>Explore Events</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = AppState.myRegistrations.map(reg => {
    const evt = CAMPUS_EVENTS.find(e => e.id === reg.eventId);
    if (!evt) return '';

    let conflictWith = null;
    for (const otherReg of AppState.myRegistrations) {
      if (otherReg.id === reg.id) continue;
      const otherEvt = CAMPUS_EVENTS.find(e => e.id === otherReg.eventId);
      if (otherEvt && checkTimeConflict(evt, otherEvt).isConflict) {
        conflictWith = otherEvt;
        break;
      }
    }

    const dateObj = new Date(evt.isoStart);
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    return `
      <div class="digital-pass-card">
        ${conflictWith ? `
          <div class="pass-clash-header-badge">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>Schedule Clash: Overlaps with ${conflictWith.title}</span>
          </div>
        ` : ''}
        <div class="pass-card-top">
          <div class="pass-event-details">
            <span class="pass-meta-pill">${evt.category}</span>
            <h4>${evt.title}</h4>
            <div class="event-meta-line"><i class="fa-regular fa-clock"></i><span>${evt.timeDisplay}</span></div>
            <div class="event-meta-line"><i class="fa-solid fa-location-dot"></i><span>${evt.venue}</span></div>
          </div>
          <div class="pass-date-box">
            <span class="pass-date-month">${months[dateObj.getMonth()]}</span>
            <span class="pass-date-day">${dateObj.getDate()}</span>
          </div>
        </div>
        <div class="pass-perforation"></div>
        <div class="pass-card-bottom">
          <div class="pass-attendee-info">
            <div class="pass-attendee-col">
              <small>Attendee</small>
              <strong>${reg.fullName}</strong>
            </div>
            <div class="pass-attendee-col">
              <small>Student ID</small>
              <strong>${reg.studentId}</strong>
            </div>
            <div class="pass-attendee-col">
              <small>Pass Tier</small>
              <strong>${reg.ticketType}</strong>
            </div>
          </div>
          <div class="pass-actions-row">
            <button class="btn-pass-view" onclick="openTicketModal('${reg.id}')">
              <i class="fa-solid fa-qrcode"></i>
              <span>View Pass (QR)</span>
            </button>
            <button class="btn-pass-cancel" onclick="cancelRegistration('${reg.id}')">
              <i class="fa-solid fa-xmark"></i>
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* Part 3: Operator Interface & System Handlers */

function openOperatorAuthModal() {
  const modal = document.getElementById('modal-operator-auth');
  const input = document.getElementById('input-operator-pass');
  const err = document.getElementById('op-auth-error-msg');
  if (err) err.style.display = 'none';
  if (input) {
    input.value = '';
    input.style.borderColor = 'var(--border-subtle)';
  }
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
      if (input) input.focus();
    }, 80);
  }
}

function closeOperatorAuthModal() {
  const modal = document.getElementById('modal-operator-auth');
  if (modal) modal.style.display = 'none';
  const input = document.getElementById('input-operator-pass');
  if (input) input.value = '';
  const err = document.getElementById('op-auth-error-msg');
  if (err) err.style.display = 'none';
  if (AppState.currentRole === 'student') {
    const btnRoleStudent = document.getElementById('btn-role-student');
    const btnRoleOperator = document.getElementById('btn-role-operator');
    if (btnRoleStudent) btnRoleStudent.classList.add('active');
    if (btnRoleOperator) btnRoleOperator.classList.remove('active');
  }
}

function handleOperatorLogin() {
  const input = document.getElementById('input-operator-pass');
  const err = document.getElementById('op-auth-error-msg');
  const card = document.getElementById('operator-auth-card');
  if (!input) return;

  const enteredPassword = input.value.trim();
  if (enteredPassword === 'prince123') {
    AppState.isOperatorAuthenticated = true;
    closeOperatorAuthModal();
    switchRole('operator', true);
    showToast('Access Granted', 'Welcome to Operator Control Center', 'success');
  } else {
    if (err) {
      err.textContent = 'Incorrect password! Access denied.';
      err.style.display = 'block';
    }
    input.style.borderColor = '#ef4444';
    if (card) {
      card.classList.remove('shake-error');
      void card.offsetWidth;
      card.classList.add('shake-error');
    }
    input.focus();
    input.select();
  }
}

function switchRole(role, force = false) {
  if (role === 'operator' && !force && !AppState.isOperatorAuthenticated) {
    openOperatorAuthModal();
    return;
  }
  AppState.currentRole = role;
  const isStudent = role === 'student';

  document.getElementById('btn-role-student').classList.toggle('active', isStudent);
  document.getElementById('btn-role-operator').classList.toggle('active', !isStudent);

  document.getElementById('interface-student-wrapper').style.display = isStudent ? 'block' : 'none';
  document.getElementById('interface-operator-wrapper').style.display = isStudent ? 'none' : 'block';

  document.getElementById('nav-tabs-student').style.display = isStudent ? 'flex' : 'none';
  document.getElementById('nav-tabs-operator').style.display = isStudent ? 'none' : 'flex';

  const brandBadge = document.getElementById('top-brand-badge');
  const screenTitle = document.getElementById('top-screen-title');
  const backBtn = document.getElementById('top-back-btn');

  if (isStudent) {
    navigateTo(AppState.activeScreen || 'home');
  } else {
    if (backBtn) backBtn.style.display = 'none';
    if (brandBadge) brandBadge.style.display = 'flex';
    if (screenTitle) screenTitle.style.display = 'none';
    navigateOpTo(AppState.activeOpScreen || 'op-dashboard');
  }

  showToast(`Switched to ${isStudent ? 'User / Student' : 'Operator Portal'}`, `Loaded ${isStudent ? 'attendee app' : 'admin control center'}`, 'info');
}

function navigateOpTo(opScreenId) {
  AppState.activeOpScreen = opScreenId;

  document.querySelectorAll('#interface-operator-wrapper .screen-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  const targetPanel = document.getElementById(`screen-${opScreenId}`);
  if (targetPanel) targetPanel.classList.add('active');

  document.querySelectorAll('#nav-tabs-operator .bottom-tab-item').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.opscreen === opScreenId);
  });

  if (opScreenId === 'op-dashboard') renderOpDashboard();
  else if (opScreenId === 'op-events') renderOpEventsList();
  else if (opScreenId === 'op-attendees') renderOpAttendeesList();

  const scrollContainer = document.getElementById('screen-scroll-surface');
  if (scrollContainer) scrollContainer.scrollTop = 0;
}

function renderOpDashboard() {
  updateBadgesAndMetrics();

  // Render Live Conflict Audit Monitor
  const auditContainer = document.getElementById('op-conflict-feed');
  if (auditContainer) {
    const conflicts = getAllSystemConflicts();
    if (conflicts.length === 0) {
      auditContainer.innerHTML = `
        <div style="background: var(--bg-surface); border: 1px dashed var(--border-subtle); padding: 14px; border-radius: var(--radius-md); text-align: center; font-size: 11px; color: var(--text-muted);">
          <i class="fa-solid fa-circle-check" style="color: var(--emerald); margin-right: 5px;"></i>
          No schedule conflicts detected in student rosters.
        </div>
      `;
    } else {
      auditContainer.innerHTML = conflicts.map(c => `
        <div class="audit-conflict-card">
          <div class="audit-card-head">
            <span class="audit-student-name"><i class="fa-solid fa-user"></i> ${c.studentName} (${c.studentId})</span>
            <span class="audit-clash-pill">Overlap: ${c.overlapMinutes}m</span>
          </div>
          <div class="audit-details-row">
            <div>? <strong>${c.eventA.title}</strong> (${c.eventA.timeDisplay})</div>
            <div>? <strong>${c.eventB.title}</strong> (${c.eventB.timeDisplay})</div>
          </div>
        </div>
      `).join('');
    }
  }

  // Render Capacity Radar
  const radarContainer = document.getElementById('op-capacity-radar');
  if (radarContainer) {
    radarContainer.innerHTML = CAMPUS_EVENTS.slice(0, 5).map(e => {
      const pct = Math.min(100, Math.round((e.registeredCount / e.capacity) * 100));
      return `
        <div class="op-radar-item">
          <div class="op-radar-header">
            <span>${e.title}</span>
            <span>${e.registeredCount}/${e.capacity} (${pct}%)</span>
          </div>
          <div class="capacity-bar-track">
            <div class="capacity-bar-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function renderOpEventsList() {
  const container = document.getElementById('op-events-list');
  if (!container) return;

  container.innerHTML = CAMPUS_EVENTS.map(evt => {
    const pct = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));
    return `
      <div class="op-event-manage-card">
        <div class="op-card-top-row">
          <div>
            <span class="category-mini-tag">${evt.category}</span>
            <h4 class="op-card-title">${evt.title}</h4>
          </div>
          <button class="btn-delete-event" onclick="deleteOpEvent('${evt.id}')">
            <i class="fa-regular fa-trash-can"></i>
            <span>Delete</span>
          </button>
        </div>
        <div class="event-meta-line"><i class="fa-regular fa-calendar"></i><span>${evt.dateDisplay} ? ${evt.timeDisplay}</span></div>
        <div class="event-meta-line"><i class="fa-solid fa-location-dot"></i><span>${evt.venue}</span></div>
        <div style="margin-top: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
            <span>Occupancy</span>
            <strong>${evt.registeredCount} / ${evt.capacity} booked</strong>
          </div>
          <div class="capacity-bar-track">
            <div class="capacity-bar-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function deleteOpEvent(eventId) {
  if (!confirm('Are you sure you want to delete this event? This will also remove any student passes registered for it.')) return;
  const idx = CAMPUS_EVENTS.findIndex(e => e.id === eventId);
  if (idx !== -1) {
    const removedTitle = CAMPUS_EVENTS[idx].title;
    CAMPUS_EVENTS.splice(idx, 1);
    AppState.myRegistrations = AppState.myRegistrations.filter(r => r.eventId !== eventId);
    saveEvents();
    saveRegistrations();
    renderOpEventsList();
    renderOpDashboard();
    showToast('Event Deleted', `Removed "${removedTitle}" from system.`, 'info');
  }
}

function renderOpAttendeesList() {
  const container = document.getElementById('op-attendees-list');
  if (!container) return;

  const query = (AppState.opAttendeeSearch || '').toLowerCase().trim();
  const list = AppState.myRegistrations.filter(reg => {
    const evt = CAMPUS_EVENTS.find(e => e.id === reg.eventId);
    if (!query) return true;
    return reg.fullName.toLowerCase().includes(query) ||
           reg.studentId.toLowerCase().includes(query) ||
           (evt && evt.title.toLowerCase().includes(query));
  });

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-events-state">
        <i class="fa-solid fa-users-slash empty-state-icon"></i>
        <h4>No Attendees Found</h4>
        <p>No student registrations match your criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(reg => {
    const evt = CAMPUS_EVENTS.find(e => e.id === reg.eventId);
    if (!evt) return '';

    // Check if attendee holds conflicting booking
    let conflictWith = null;
    for (const other of AppState.myRegistrations) {
      if (other.id === reg.id) continue;
      const otherEvt = CAMPUS_EVENTS.find(e => e.id === other.eventId);
      if (otherEvt && checkTimeConflict(evt, otherEvt).isConflict) {
        conflictWith = otherEvt;
        break;
      }
    }

    let statusPill = `<span class="attendee-badge-status badge-confirmed">Confirmed</span>`;
    if (reg.checkedIn) {
      statusPill = `<span class="attendee-badge-status badge-checked-in"><i class="fa-solid fa-check"></i> Checked-In</span>`;
    } else if (conflictWith) {
      statusPill = `<span class="attendee-badge-status badge-conflict-clash">?? Overlap Conflict</span>`;
    }

    return `
      <div class="op-attendee-card">
        <div class="attendee-head-row">
          <div class="attendee-name-box">
            <strong>${reg.fullName}</strong>
            <small>${reg.studentId} ? ${reg.email}</small>
          </div>
          ${statusPill}
        </div>
        <div class="attendee-event-title"><i class="fa-solid fa-ticket" style="color: var(--primary);"></i> ${evt.title}</div>
        <div class="attendee-meta-line">${evt.timeDisplay} ? ${reg.ticketType}</div>
        ${conflictWith ? `<div style="font-size: 10px; color: var(--amber-dark); margin-bottom: 8px;"><strong>?? Note:</strong> Clashes with ${conflictWith.title}</div>` : ''}
        <div class="attendee-actions-row">
          <button class="btn-op-checkin ${reg.checkedIn ? 'checked' : ''}" onclick="toggleAttendeeCheckIn('${reg.id}')">
            <i class="fa-solid ${reg.checkedIn ? 'fa-user-check' : 'fa-qrcode'}"></i>
            <span>${reg.checkedIn ? 'Undo Check-In' : 'Check-In Attendee'}</span>
          </button>
          <button class="btn-op-revoke" onclick="revokeAttendeePass('${reg.id}')">
            <span>Revoke Pass</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function toggleAttendeeCheckIn(regId) {
  const reg = AppState.myRegistrations.find(r => r.id === regId);
  if (!reg) return;
  reg.checkedIn = !reg.checkedIn;
  saveRegistrations();
  renderOpAttendeesList();
  showToast(reg.checkedIn ? 'Attendee Checked In' : 'Check-In Reverted', `${reg.fullName} (${reg.studentId})`, 'success');
}

function revokeAttendeePass(regId) {
  if (!confirm('Revoke this student pass?')) return;
  cancelRegistration(regId);
  renderOpAttendeesList();
  renderOpDashboard();
}

// Operator Event Creation Modal
function openOpAddEventModal() {
  const modal = document.getElementById('modal-op-add-event-overlay');
  if (modal) modal.classList.add('active');
}

function closeOpAddEventModal() {
  const modal = document.getElementById('modal-op-add-event-overlay');
  if (modal) modal.classList.remove('active');
}

function handleOpAddEventSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('op-event-title').value.trim();
  const category = document.getElementById('op-event-category').value;
  const capacity = parseInt(document.getElementById('op-event-capacity').value, 10) || 100;
  const dateStr = document.getElementById('op-event-date').value;
  const startStr = document.getElementById('op-event-start').value;
  const endStr = document.getElementById('op-event-end').value;
  const venue = document.getElementById('op-event-venue').value.trim();
  const organizer = document.getElementById('op-event-organizer').value.trim();
  const desc = document.getElementById('op-event-desc').value.trim();

  if (!title || !dateStr || !startStr || !endStr || !venue) {
    alert('Please fill out all required event details.');
    return;
  }

  const isoStart = `${dateStr}T${startStr}:00`;
  const isoEnd = `${dateStr}T${endStr}:00`;

  // Venue Overlap Safety Check for Operator
  const venueClash = CAMPUS_EVENTS.find(e => {
    return e.venue.toLowerCase() === venue.toLowerCase() &&
           checkTimeConflict({ isoStart, isoEnd }, e).isConflict;
  });

  if (venueClash) {
    if (!confirm(`Warning: Venue "${venue}" is already booked by "${venueClash.title}" during this time window! Publish anyway?`)) {
      return;
    }
  }

  const newEvent = {
    id: 'evt-op-' + Date.now(),
    title,
    category,
    date: dateStr,
    dateDisplay: dateStr,
    timeDisplay: `${startStr} - ${endStr}`,
    isoStart,
    isoEnd,
    venue,
    organizer: organizer || 'Campus Activities',
    capacity,
    registeredCount: 0,
    bgGradient: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)",
    description: desc || 'Campus event published by operator.',
    agenda: ["Welcome & Check-in", "Main Presentation", "Interactive Session"]
  };

  CAMPUS_EVENTS.unshift(newEvent);
  saveEvents();
  closeOpAddEventModal();
  renderOpEventsList();
  renderOpDashboard();
  showToast('Event Published!', `"${title}" is now live for students to register.`, 'success');
}

// Student Form Handlers
function handleRegistrationSubmit(e) {
  e.preventDefault();
  const eventId = document.getElementById('form-hidden-event-id').value;
  const nameInput = document.getElementById('input-full-name');
  const emailInput = document.getElementById('input-email');
  const idInput = document.getElementById('input-student-id');
  const ticketInput = document.getElementById('input-ticket-type');
  const phoneInput = document.getElementById('input-phone-number');
  const notesInput = document.getElementById('input-special-notes');
  const consentInput = document.getElementById('input-consent');

  resetFormValidationErrors();
  let isValid = true;

  if (!nameInput.value.trim()) {
    showError('err-full-name', 'Please enter your full name');
    isValid = false;
  }
  if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
    showError('err-email', 'Valid campus email is required');
    isValid = false;
  }
  if (!idInput.value.trim()) {
    showError('err-student-id', 'Student ID is required');
    isValid = false;
  }
  if (!consentInput.checked) {
    showError('err-consent', 'You must agree to campus guidelines');
    isValid = false;
  }
  if (!isValid) return;

  const registrationData = {
    id: 'reg-' + Date.now(),
    eventId: eventId,
    registeredAt: new Date().toISOString(),
    fullName: nameInput.value.trim(),
    email: emailInput.value.trim(),
    studentId: idInput.value.trim(),
    ticketType: ticketInput.value,
    phone: phoneInput.value.trim(),
    specialNotes: notesInput.value.trim(),
    checkedIn: false,
    hasConflict: false
  };

  const conflicts = findConflictsForEvent(eventId);
  if (conflicts.length > 0) {
    AppState.pendingRegistration = registrationData;
    openClashModal(CAMPUS_EVENTS.find(e => e.id === eventId), conflicts[0].registeredEvent, conflicts[0].overlapMinutes);
    return;
  }

  completeRegistration(registrationData);
}

function completeRegistration(regData, withConflict = false) {
  regData.hasConflict = withConflict;
  AppState.myRegistrations.push(regData);
  saveRegistrations();
  const evt = CAMPUS_EVENTS.find(e => e.id === regData.eventId);
  if (evt) evt.registeredCount += 1;
  saveEvents();
  AppState.pendingRegistration = null;

  if (withConflict) {
    showToast('Schedule Overlap Allowed', 'Registration confirmed with time clash noted.', 'warning');
  } else {
    showToast('Registration Confirmed!', 'Your digital pass is now available.', 'success');
  }
  navigateTo('my-registrations');
}

function openClashModal(targetEvt, conflictEvt, overlapMinutes) {
  const modal = document.getElementById('modal-clash-overlay');
  const comparisonGrid = document.getElementById('clash-comparison-grid');
  const durationText = document.getElementById('clash-overlap-text');
  if (!modal || !comparisonGrid) return;

  comparisonGrid.innerHTML = `
    <div class="clash-event-card card-existing-booking">
      <div class="clash-card-tag"><i class="fa-solid fa-lock"></i> Existing Registration</div>
      <h4 class="clash-card-title">${conflictEvt.title}</h4>
      <div class="clash-card-time"><i class="fa-regular fa-clock"></i> ${conflictEvt.dateDisplay} ? ${conflictEvt.timeDisplay}</div>
    </div>
    <div class="clash-event-card card-new-attempt">
      <div class="clash-card-tag"><i class="fa-solid fa-triangle-exclamation"></i> Attempted New Registration</div>
      <h4 class="clash-card-title">${targetEvt.title}</h4>
      <div class="clash-card-time"><i class="fa-regular fa-clock"></i> ${targetEvt.dateDisplay} ? ${targetEvt.timeDisplay}</div>
    </div>
  `;

  if (durationText) {
    durationText.textContent = `Overlaps by ${overlapMinutes} minutes`;
  }
  modal.classList.add('active');
}

function closeClashModal() {
  const modal = document.getElementById('modal-clash-overlay');
  if (modal) modal.classList.remove('active');
}

function cancelRegistration(regId) {
  const regIndex = AppState.myRegistrations.findIndex(r => r.id === regId);
  if (regIndex === -1) return;
  const removed = AppState.myRegistrations.splice(regIndex, 1)[0];
  const evt = CAMPUS_EVENTS.find(e => e.id === removed.eventId);
  if (evt && evt.registeredCount > 0) evt.registeredCount -= 1;
  saveRegistrations();
  saveEvents();
  renderMyRegistrationsScreen();
  showToast('Pass Cancelled', 'Registration removed from schedule.', 'info');
}

function openTicketModal(regId) {
  const reg = AppState.myRegistrations.find(r => r.id === regId);
  if (!reg) return;
  const evt = CAMPUS_EVENTS.find(e => e.id === reg.eventId);
  if (!evt) return;

  const modal = document.getElementById('modal-ticket-overlay');
  const body = document.getElementById('ticket-modal-body');
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="ticket-pass-visual">
      <span class="pass-meta-pill">${evt.category}</span>
      <h3 style="font-size: 16px; font-weight: 800; margin: 4px 0 6px;">${evt.title}</h3>
      <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
        <i class="fa-regular fa-clock"></i> ${evt.dateDisplay} ? ${evt.timeDisplay}
      </p>

      <div class="qr-code-graphic">
        <svg viewBox="0 0 100 100" width="130" height="130">
          <rect width="100" height="100" fill="#ffffff"/>
          <rect x="10" y="10" width="26" height="26" fill="#0f172a"/>
          <rect x="14" y="14" width="18" height="18" fill="#ffffff"/>
          <rect x="18" y="18" width="10" height="10" fill="#0f172a"/>
          <rect x="64" y="10" width="26" height="26" fill="#0f172a"/>
          <rect x="68" y="14" width="18" height="18" fill="#ffffff"/>
          <rect x="72" y="18" width="10" height="10" fill="#0f172a"/>
          <rect x="10" y="64" width="26" height="26" fill="#0f172a"/>
          <rect x="14" y="68" width="18" height="18" fill="#ffffff"/>
          <rect x="18" y="72" width="10" height="10" fill="#0f172a"/>
          <rect x="42" y="14" width="6" height="16" fill="#0f172a"/>
          <rect x="52" y="24" width="6" height="16" fill="#0f172a"/>
          <rect x="42" y="44" width="16" height="16" fill="#4f46e5"/>
          <rect x="64" y="54" width="16" height="8" fill="#0f172a"/>
          <rect x="74" y="70" width="16" height="16" fill="#0f172a"/>
          <rect x="44" y="74" width="14" height="14" fill="#0f172a"/>
        </svg>
      </div>

      <div class="barcode-simulated"></div>
      <div style="font-family: monospace; font-size: 11px; color: var(--text-muted); letter-spacing: 1px;">
        TKT-PASS-${reg.id.toUpperCase().slice(-8)}
      </div>

      <div style="margin-top: 14px; text-align: left; font-size: 11px; background: var(--bg-card); padding: 10px; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: var(--text-muted);">Attendee:</span>
          <strong>${reg.fullName}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color: var(--text-muted);">Student ID:</span>
          <strong>${reg.studentId}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">Tier:</span>
          <strong>${reg.ticketType}</strong>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
}

function closeTicketModal() {
  const modal = document.getElementById('modal-ticket-overlay');
  if (modal) modal.classList.remove('active');
}

function showToast(title, message, type = 'info') {
  const shelf = document.getElementById('app-toast-shelf');
  if (!shelf) return;
  const toast = document.createElement('div');
  toast.className = `app-toast toast-${type}`;
  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'warning') icon = 'fa-triangle-exclamation';
  if (type === 'error') icon = 'fa-circle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon} toast-icon"></i>
    <div class="toast-text">
      <strong>${title}</strong>
      <span>${message}</span>
    </div>
  `;
  shelf.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 300ms ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function showError(elId, msg) {
  const el = document.getElementById(elId);
  if (el) {
    el.textContent = msg;
    el.classList.add('visible');
  }
}

function resetFormValidationErrors() {
  document.querySelectorAll('.error-feedback').forEach(el => {
    el.textContent = '';
    el.classList.remove('visible');
  });
}

function setupEventListeners() {
  // Operator Authentication Modal Listeners
  const formOpAuth = document.getElementById('form-operator-auth');
  const btnCloseOpAuth = document.getElementById('btn-close-operator-auth');
  const btnCancelOpAuth = document.getElementById('btn-cancel-operator-auth');
  const btnTogglePassVis = document.getElementById('btn-toggle-operator-pass-vis');
  const inputOpPass = document.getElementById('input-operator-pass');
  const btnLockOperator = document.getElementById('btn-lock-operator');

  if (formOpAuth) {
    formOpAuth.addEventListener('submit', (e) => {
      e.preventDefault();
      handleOperatorLogin();
    });
  }
  if (btnCloseOpAuth) {
    btnCloseOpAuth.addEventListener('click', closeOperatorAuthModal);
  }
  if (btnCancelOpAuth) {
    btnCancelOpAuth.addEventListener('click', closeOperatorAuthModal);
  }
  if (btnTogglePassVis && inputOpPass) {
    btnTogglePassVis.addEventListener('click', () => {
      const isPass = inputOpPass.type === 'password';
      inputOpPass.type = isPass ? 'text' : 'password';
      const eyeIcon = document.getElementById('icon-operator-eye');
      if (eyeIcon) {
        eyeIcon.className = isPass ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      }
    });
  }
  if (btnLockOperator) {
    btnLockOperator.addEventListener('click', () => {
      AppState.isOperatorAuthenticated = false;
      switchRole('student');
      showToast('Session Locked', 'Operator portal locked.', 'info');
    });
  }

  // Role selector switches
  const btnRoleStudent = document.getElementById('btn-role-student');
  const btnRoleOperator = document.getElementById('btn-role-operator');
  if (btnRoleStudent) btnRoleStudent.addEventListener('click', () => switchRole('student'));
  if (btnRoleOperator) btnRoleOperator.addEventListener('click', () => switchRole('operator'));

  // Student bottom tabs
  document.querySelectorAll('#nav-tabs-student .bottom-tab-item').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.screen));
  });

  // Operator bottom tabs
  document.querySelectorAll('#nav-tabs-operator .bottom-tab-item').forEach(btn => {
    btn.addEventListener('click', () => navigateOpTo(btn.dataset.opscreen));
  });

  // Top Back Button
  const topBackBtn = document.getElementById('top-back-btn');
  if (topBackBtn) {
    topBackBtn.addEventListener('click', () => {
      if (AppState.screenHistory.length > 1) {
        AppState.screenHistory.pop();
        const prev = AppState.screenHistory[AppState.screenHistory.length - 1];
        navigateTo(prev, null, true);
      } else {
        navigateTo('home', null, true);
      }
    });
  }

  // See All Button on Home
  const seeAllBtn = document.getElementById('btn-home-see-all');
  if (seeAllBtn) seeAllBtn.addEventListener('click', () => navigateTo('events'));

  // Category chips on Home
  document.querySelectorAll('#home-category-chips .category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#home-category-chips .category-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.activeFilter = chip.dataset.cat;
      document.querySelectorAll('#list-category-tabs .category-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.filter === chip.dataset.cat);
      });
      navigateTo('events');
    });
  });

  // Category filter tabs on Event List
  document.querySelectorAll('#list-category-tabs .category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#list-category-tabs .category-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.activeFilter = chip.dataset.filter;
      renderEventsScreen();
    });
  });

  // Search input
  const searchInput = document.getElementById('search-events-input');
  const clearSearchBtn = document.getElementById('btn-clear-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      if (clearSearchBtn) clearSearchBtn.style.display = AppState.searchQuery ? 'block' : 'none';
      renderEventsScreen();
    });
  }
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      AppState.searchQuery = '';
      clearSearchBtn.style.display = 'none';
      renderEventsScreen();
    });
  }

  // Sort select
  const sortSelect = document.getElementById('sort-events-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.activeSort = e.target.value;
      renderEventsScreen();
    });
  }

  // Booking Form Submit
  const bookingForm = document.getElementById('event-booking-form');
  if (bookingForm) bookingForm.addEventListener('submit', handleRegistrationSubmit);

  // Form Cancel Button
  const formCancelBtn = document.getElementById('btn-form-cancel');
  if (formCancelBtn) {
    formCancelBtn.addEventListener('click', () => {
      if (AppState.screenHistory.length > 1) {
        AppState.screenHistory.pop();
        const prev = AppState.screenHistory[AppState.screenHistory.length - 1];
        navigateTo(prev, null, true);
      } else {
        navigateTo('events');
      }
    });
  }

  // Clash Modal: Register Anyway Button
  const overrideBtn = document.getElementById('btn-clash-register-anyway');
  if (overrideBtn) {
    overrideBtn.addEventListener('click', () => {
      closeClashModal();
      if (AppState.pendingRegistration) {
        completeRegistration(AppState.pendingRegistration, true);
      }
    });
  }

  // Clash Modal: Cancel Button
  const clashCancelBtn = document.getElementById('btn-clash-keep-existing');
  if (clashCancelBtn) {
    clashCancelBtn.addEventListener('click', () => {
      closeClashModal();
      AppState.pendingRegistration = null;
      showToast('Registration Cancelled', 'Kept current schedule without overlaps.', 'info');
    });
  }

  // Close ticket modal
  const closeTicketBtn = document.getElementById('btn-close-ticket-modal');
  if (closeTicketBtn) closeTicketBtn.addEventListener('click', closeTicketModal);

  // Theme Toggle Button
  const themeBtn = document.getElementById('btn-toggle-theme');
  const themeIcon = document.getElementById('theme-icon');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', AppState.theme);
      localStorage.setItem('cp_theme', AppState.theme);
      if (themeIcon) {
        themeIcon.className = AppState.theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
    });
  }

  // Home Clash Demo Trigger Button
  const bannerDemoBtn = document.getElementById('trigger-clash-demo-btn');
  if (bannerDemoBtn) {
    bannerDemoBtn.addEventListener('click', () => {
      triggerQuickClashDemonstration();
    });
  }

  // Operator Actions & Modal Listeners
  const btnOpCreateTop = document.getElementById('btn-op-create-event-top');
  if (btnOpCreateTop) btnOpCreateTop.addEventListener('click', openOpAddEventModal);

  const btnOpAddList = document.getElementById('btn-op-add-event-list');
  if (btnOpAddList) btnOpAddList.addEventListener('click', openOpAddEventModal);

  const btnCloseOpModal = document.getElementById('btn-close-op-event-modal');
  if (btnCloseOpModal) btnCloseOpModal.addEventListener('click', closeOpAddEventModal);

  const btnCancelOpEvent = document.getElementById('btn-cancel-op-event');
  if (btnCancelOpEvent) btnCancelOpEvent.addEventListener('click', closeOpAddEventModal);

  const formOpAddEvent = document.getElementById('form-operator-add-event');
  if (formOpAddEvent) formOpAddEvent.addEventListener('submit', handleOpAddEventSubmit);

  const opAttendeeSearch = document.getElementById('op-attendee-search');
  if (opAttendeeSearch) {
    opAttendeeSearch.addEventListener('input', (e) => {
      AppState.opAttendeeSearch = e.target.value;
      renderOpAttendeesList();
    });
  }
}

function triggerQuickClashDemonstration() {
  const isEvt1Booked = AppState.myRegistrations.some(r => r.eventId === 'evt-1');
  if (!isEvt1Booked) {
    AppState.myRegistrations.push({
      id: "reg-demo-1",
      eventId: "evt-1",
      registeredAt: new Date().toISOString(),
      fullName: "Jordan Rivera",
      email: "jordan.rivera@campus.edu",
      studentId: "STU-9921",
      ticketType: "Standard Pass",
      phone: "+1 (555) 349-8821",
      specialNotes: "None",
      checkedIn: false,
      hasConflict: false
    });
    saveRegistrations();
  }

  navigateTo('register', 'evt-2');
  showToast('Clash Demo Ready', 'Submitting this will trigger the Schedule Clash Warning!', 'warning');
}

function startClock() {
  const clockEl = document.getElementById('clock-display');
  function tick() {
    const d = new Date();
    const h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    if (clockEl) clockEl.textContent = `${h}:${m}`;
  }
  tick();
  setInterval(tick, 10000);
}

document.addEventListener('DOMContentLoaded', () => {
  if (AppState.theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
  }
  loadStoredData();
  setupEventListeners();
  navigateTo('home');
  startClock();
});

window.markAttended = function(regId) {
  const reg = AppState.myRegistrations.find(r => r.id === regId);
  if (reg) {
    reg.attended = true;
    saveState();
    if (typeof renderOperatorAttendees === 'function') {
      renderOperatorAttendees();
    }
    if (typeof showToast === 'function') {
      showToast("Attendance marked present", "success");
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const btnSettings = document.getElementById('btn-settings');
  const modalSettings = document.getElementById('modal-settings');
  const btnCloseSettings = document.getElementById('btn-close-settings');
  
  if (btnSettings && modalSettings) {
    btnSettings.addEventListener('click', () => {
      modalSettings.style.display = 'flex';
    });
    btnCloseSettings.addEventListener('click', () => {
      modalSettings.style.display = 'none';
    });
  }
});
