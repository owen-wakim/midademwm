let defaultMeetings = [
    {
        id: 1,
        title: "General Meeting",
        date: "14",
        month: "NOV",
        time: "3:00 PM – 4:00 PM",
        location: "Main Hall",
        type: "General",
        duration: "1 hour",
        category: "upcoming",
        description: "Our weekly general meeting to discuss upcoming events, important updates, and give everyone a chance to share their ideas.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Planning Session",
        date: "21",
        month: "NOV",
        time: "3:00 PM – 4:30 PM",
        location: "Room 102",
        type: "Planning",
        duration: "1.5 hours",
        category: "upcoming",
        description: "Deep dive strategy session for upcoming student activities, budgeting, and team assignments.",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Team Meeting",
        date: "28",
        month: "NOV",
        time: "3:00 PM – 4:00 PM",
        location: "Main Hall",
        type: "Team",
        duration: "1 hour",
        category: "upcoming",
        description: "Sync-up across all committees and lead members to review milestones.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
    }
];

let defaultPhotos = [
    { category: "meetings", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&q=80" },
    { category: "events", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&q=80" },
    { category: "meetings", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&q=80" },
    { category: "community", url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=500&q=80" },
    { category: "events", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80" },
    { category: "other", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=80" }
];

let meetingsList = [...defaultMeetings];
let photosList = [...defaultPhotos];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    setupEventListeners();
    await fetchSupabaseData();
    navigateTo('home');
}

async function fetchSupabaseData() {
    if (!supabaseClient) return;
    try {
        const { data: meetings } = await supabaseClient.from('meetings').select('*');
        if (meetings && meetings.length > 0) meetingsList = meetings;

        const { data: photos } = await supabaseClient.from('photos').select('*');
        if (photos && photos.length > 0) photosList = photos;
    } catch (err) {
        console.log("Using local default fallback data.");
    }
}

function setupEventListeners() {
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            navigateTo(item.getAttribute('data-target'));
        });
    });

    const menuBtn = document.getElementById('menu-btn');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const closeDrawerBtn = document.querySelector('.close-drawer');

    if (menuBtn) menuBtn.addEventListener('click', () => drawerOverlay.classList.add('open'));
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', (e) => { if (e.target === drawerOverlay) closeDrawer(); });

    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) searchBtn.addEventListener('click', () => navigateTo('meetings'));
}

function closeDrawer() {
    const drawerOverlay = document.getElementById('drawer-overlay');
    if (drawerOverlay) drawerOverlay.classList.remove('open');
}

function navigateTo(viewName, param = null) {
    const mainContent = document.getElementById('main-content');
    
    document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
        if (btn.getAttribute('data-target') === viewName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    switch(viewName) {
        case 'home': renderHome(mainContent); break;
        case 'meetings': renderMeetings(mainContent, 'upcoming'); break;
        case 'meeting-detail': renderMeetingDetail(mainContent, param); break;
        case 'about': renderAbout(mainContent); break;
        case 'pictures': renderPictures(mainContent, 'all'); break;
        case 'events': renderEvents(mainContent); break;
        case 'team': renderTeam(mainContent); break;
        case 'contact': renderContact(mainContent); break;
        case 'auth': renderAuth(mainContent); break;
        case 'more': renderMore(mainContent); break;
        default: renderHome(mainContent);
    }
    mainContent.scrollTop = 0;
}

// Render Views
function renderHome(container) {
    container.innerHTML = `
        <div class="hero-card">
            <h2>Welcome to Midade Mieh w Mieh</h2>
            <p>A community of students, led by students. We organize, plan, and create opportunities for a better tomorrow.</p>
            <button class="btn-primary" onclick="navigateTo('meetings')">
                View Upcoming Meetings <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>

        <div class="shortcuts-grid">
            <div class="shortcut-card" onclick="navigateTo('meetings')">
                <div class="shortcut-icon bg-blue"><i class="fa-solid fa-calendar-days"></i></div>
                <span>Meetings</span>
                <p>Stay updated</p>
            </div>
            <div class="shortcut-card" onclick="navigateTo('about')">
                <div class="shortcut-icon bg-purple"><i class="fa-solid fa-user-group"></i></div>
                <span>About Us</span>
                <p>Our mission</p>
            </div>
            <div class="shortcut-card" onclick="navigateTo('pictures')">
                <div class="shortcut-icon bg-green"><i class="fa-solid fa-image"></i></div>
                <span>Pictures</span>
                <p>Moments</p>
            </div>
            <div class="shortcut-card" onclick="navigateTo('events')">
                <div class="shortcut-icon bg-orange"><i class="fa-solid fa-calendar-plus"></i></div>
                <span>Events</span>
                <p>What's coming</p>
            </div>
            <div class="shortcut-card" onclick="navigateTo('team')">
                <div class="shortcut-icon bg-teal"><i class="fa-solid fa-users"></i></div>
                <span>Our Team</span>
                <p>Meet the team</p>
            </div>
            <div class="shortcut-card" onclick="navigateTo('contact')">
                <div class="shortcut-icon bg-pink"><i class="fa-solid fa-envelope"></i></div>
                <span>Contact</span>
                <p>Get in touch</p>
            </div>
        </div>
    `;
}

function renderAuth(container) {
    container.innerHTML = `
        <div class="auth-container">
            <h2 class="section-title" style="text-align:center;">Account Access</h2>
            <p class="section-subtitle" style="text-align:center;">Sign in or create an account via Supabase</p>
            
            <button class="btn-google" onclick="handleGoogleAuth()">
                <i class="fa-brands fa-google" style="color:#EA4335;"></i> Continue with Google
            </button>

            <div class="divider"><span>or with email</span></div>

            <form>
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="auth-email" class="form-control" placeholder="name@example.com" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="auth-password" class="form-control" placeholder="••••••••" required>
                </div>
                <div style="display:flex; gap:10px; margin-top:16px;">
                    <button type="submit" class="btn-primary" style="flex:1; justify-content:center;" onclick="handleEmailSignIn(event)">Sign In</button>
                    <button type="button" class="btn-primary" style="flex:1; justify-content:center; background:#0A60FF; color:white;" onclick="handleEmailSignUp(event)">Sign Up</button>
                </div>
            </form>
        </div>
    `;
}

function renderMeetings(container, tab = 'upcoming') {
    const filtered = meetingsList.filter(m => m.category === tab);
    container.innerHTML = `
        <h2 class="section-title">Meetings</h2>
        <p class="section-subtitle">Stay updated with our upcoming and past meetings.</p>
        
        <div class="tabs-header">
            <button class="tab-btn ${tab === 'upcoming' ? 'active' : ''}" onclick="renderMeetingsContainer('upcoming')">Upcoming</button>
            <button class="tab-btn ${tab === 'past' ? 'active' : ''}" onclick="renderMeetingsContainer('past')">Past Meetings</button>
        </div>

        <div class="meetings-list">
            ${filtered.length === 0 ? `<p style="text-align:center; color:var(--text-muted); padding:30px;">No meetings found.</p>` : 
              filtered.map(m => `
                <div class="meeting-card" onclick="navigateTo('meeting-detail', ${m.id})">
                    <div class="date-badge">
                        <span class="month">${m.month}</span>
                        <span class="day">${m.date}</span>
                    </div>
                    <div class="meeting-info">
                        <h3>${m.title}</h3>
                        <div class="meeting-meta">
                            <span><i class="fa-regular fa-clock"></i> ${m.time}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${m.location}</span>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:14px;"></i>
                </div>
            `).join('')}
        </div>
    `;
}

window.renderMeetingsContainer = (tab) => renderMeetings(document.getElementById('main-content'), tab);

function renderMeetingDetail(container, id) {
    const meeting = meetingsList.find(m => m.id === id) || meetingsList[0];
    container.innerHTML = `
        <button class="back-bar" style="background:none; border:none; color:var(--primary-blue); font-weight:700; cursor:pointer; margin-bottom:16px;" onclick="navigateTo('meetings')">
            <i class="fa-solid fa-arrow-left"></i> Back to Meetings
        </button>

        <div class="content-card">
            <span style="font-size:12px; font-weight:800; color:var(--primary-blue);">${meeting.month} ${meeting.date}</span>
            <h2 style="font-size:24px; font-weight:800; margin:4px 0 12px 0;">${meeting.title}</h2>
            <img src="${meeting.image}" alt="${meeting.title}" style="width:100%; height:260px; object-fit:cover; border-radius:var(--radius-sm); margin-bottom:16px;">
            <p style="margin-bottom:16px;">${meeting.description}</p>
            <button class="btn-primary" onclick="alert('Added to your calendar!')"><i class="fa-regular fa-calendar-plus"></i> Add to Calendar</button>
        </div>
    `;
}

function renderAbout(container) {
    container.innerHTML = `
        <h2 class="section-title">About Us</h2>
        <p class="section-subtitle">Learn more about our mission and vision.</p>
        <div class="content-card">
            <h3><i class="fa-solid fa-bullseye"></i> Our Mission</h3>
            <p>To empower students, create opportunities, and build a stronger community through leadership, service, and collaboration.</p>
        </div>
        <div class="content-card">
            <h3><i class="fa-solid fa-eye"></i> Our Vision</h3>
            <p>A future where every student has the opportunity to grow, lead, and make a difference.</p>
        </div>
    `;
}

function renderPictures(container, currentCategory = 'all') {
    const filtered = currentCategory === 'all' ? photosList : photosList.filter(p => p.category === currentCategory);
    container.innerHTML = `
        <h2 class="section-title">Pictures</h2>
        <p class="section-subtitle">Moments, memories, and milestones.</p>
        <div class="filter-chips">
            <div class="chip ${currentCategory === 'all' ? 'active' : ''}" onclick="filterPhotos('all')">All</div>
            <div class="chip ${currentCategory === 'meetings' ? 'active' : ''}" onclick="filterPhotos('meetings')">Meetings</div>
            <div class="chip ${currentCategory === 'events' ? 'active' : ''}" onclick="filterPhotos('events')">Events</div>
            <div class="chip ${currentCategory === 'community' ? 'active' : ''}" onclick="filterPhotos('community')">Community</div>
        </div>
        <div class="photo-grid">
            ${filtered.map(p => `<div class="photo-item"><img src="${p.url}" alt="Moment"></div>`).join('')}
        </div>
    `;
}

window.filterPhotos = (cat) => renderPictures(document.getElementById('main-content'), cat);

function renderEvents(container) {
    container.innerHTML = `
        <h2 class="section-title">Events</h2>
        <p class="section-subtitle">What's coming up next.</p>
        <div class="content-card">
            <h3><i class="fa-solid fa-calendar-star"></i> Annual Student Summit</h3>
            <p>Join us next month for workshops, guest speakers, and collaborative student projects.</p>
        </div>
    `;
}

function renderTeam(container) {
    container.innerHTML = `
        <h2 class="section-title">Our Team</h2>
        <p class="section-subtitle">Meet the leaders behind Midade Mieh w Mieh.</p>
        <div class="content-card">
            <h3><i class="fa-solid fa-user-tie"></i> Executive Board</h3>
            <p>A dedicated group of students working together for community success.</p>
        </div>
    `;
}

function renderContact(container) {
    container.innerHTML = `
        <h2 class="section-title">Contact Us</h2>
        <p class="section-subtitle">Get in touch with our team.</p>
        <div class="content-card">
            <h3><i class="fa-solid fa-envelope"></i> Send a Message</h3>
            <p>Reach out to us at contact@midademiehwmieh.org</p>
        </div>
    `;
}

function renderMore(container) {
    container.innerHTML = `
        <h2 class="section-title">More Options</h2>
        <p class="section-subtitle">Explore all sections.</p>
        <div class="content-card" style="cursor:pointer;" onclick="navigateTo('auth')">
            <h3><i class="fa-solid fa-user-lock"></i> Sign In / Sign Up</h3>
            <p>Manage your Supabase account credentials.</p>
        </div>
    `;
}
