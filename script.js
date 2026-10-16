// Supabase Configuration
const SUPABASE_URL = "https://ogopytqswaeljinyvvei.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_QslFTZ66tJdC5eQj1-t-Sw_mbHrBHNi";

// Initialize Supabase Client safely
let supabaseClient = null;
try {
    if (window.supabase && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    }
} catch (e) {
    console.warn("Supabase initialization warning:", e);
}

// Fallback Mock Data matching the design preview precisely
const defaultMeetings = [
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
    },
    {
        id: 4,
        title: "Past Leadership Retrospective",
        date: "05",
        month: "OCT",
        time: "2:00 PM – 3:30 PM",
        location: "Conference Room",
        type: "Review",
        duration: "1.5 hours",
        category: "past",
        description: "Review of last month's achievements and community feedback analysis.",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80"
    }
];

const defaultPhotos = [
    { category: "meetings", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&q=80" },
    { category: "events", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&q=80" },
    { category: "meetings", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&q=80" },
    { category: "community", url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=500&q=80" },
    { category: "events", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80" },
    { category: "other", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=80" }
];

// App State
let currentView = 'home';
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

// Fetch Data from Supabase with fallback to defaults
async function fetchSupabaseData() {
    if (!supabaseClient) return;
    try {
        const { data: meetings, error: mError } = await supabaseClient.from('meetings').select('*');
        if (!mError && meetings && meetings.length > 0) {
            meetingsList = meetings;
        }

        const { data: photos, error: pError } = await supabaseClient.from('photos').select('*');
        if (!pError && photos && photos.length > 0) {
            photosList = photos;
        }
    } catch (err) {
        console.log("Using local default data due to network/table state.");
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Bottom Navigation
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const target = item.getAttribute('data-target');
            navigateTo(target);
        });
    });

    // Drawer Menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const closeDrawerBtn = document.querySelector('.close-drawer');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            drawerOverlay.classList.add('open');
        });
    }

    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', closeDrawer);
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', (e) => {
            if (e.target === drawerOverlay) closeDrawer();
        });
    }

    // Search button simulation
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            alert("Search feature ready. Browse meetings and pictures below!");
        });
    }
}

function closeDrawer() {
    const drawerOverlay = document.getElementById('drawer-overlay');
    if (drawerOverlay) drawerOverlay.classList.remove('open');
}

// Navigation router
function navigateTo(viewName, param = null) {
    currentView = viewName;
    const mainContent = document.getElementById('main-content');
    
    // Update active bottom nav state
    document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
        if (btn.getAttribute('data-target') === viewName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Render corresponding view
    switch(viewName) {
        case 'home':
            renderHome(mainContent);
            break;
        case 'meetings':
            renderMeetings(mainContent, 'upcoming');
            break;
        case 'meeting-detail':
            renderMeetingDetail(mainContent, param);
            break;
        case 'about':
            renderAbout(mainContent);
            break;
        case 'pictures':
            renderPictures(mainContent, 'all');
            break;
        case 'events':
            renderEvents(mainContent);
            break;
        case 'team':
            renderTeam(mainContent);
            break;
        case 'contact':
            renderContact(mainContent);
            break;
        case 'more':
            renderMore(mainContent);
            break;
        default:
            renderHome(mainContent);
    }
    
    mainContent.scrollTop = 0;
}

// --- View Renderers ---

function renderHome(container) {
    container.innerHTML = `
        <div class="hero-card">
            <h2>Welcome to<br>Middle MWM</h2>
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
                    <i class="fa-solid fa-chevron-right"></i>
                </div>
            `).join('')}
        </div>
    `;
}

window.renderMeetingsContainer = (tab) => {
    const container = document.getElementById('main-content');
    renderMeetings(container, tab);
};

function renderMeetingDetail(container, id) {
    const meeting = meetingsList.find(m => m.id === id) || meetingsList[0];

    container.innerHTML = `
        <button class="back-bar" onclick="navigateTo('meetings')">
            <i class="fa-solid fa-arrow-left"></i> Back to Meetings
        </button>

        <div class="meeting-detail-card">
            <div class="meeting-detail-header">
                <div>
                    <span style="font-size:12px; font-weight:800; color:var(--primary-blue);">${meeting.month} ${meeting.date}</span>
                    <h2 style="font-size:20px; font-weight:800; margin-top:2px;">${meeting.title}</h2>
                </div>
            </div>
            
            <div class="meeting-meta" style="margin-bottom:16px; font-size:13px;">
                <span><i class="fa-regular fa-clock" style="color:var(--primary-blue)"></i> ${meeting.time}</span>
                <span style="margin-top:4px;"><i class="fa-solid fa-location-dot" style="color:var(--primary-blue)"></i> ${meeting.location}</span>
            </div>

            <img src="${meeting.image}" alt="${meeting.title}" class="meeting-banner">

            <h3 style="font-size:15px; font-weight:700; margin-bottom:8px;">About This Meeting</h3>
            <p class="meeting-description">${meeting.description}</p>

            <button class="btn-primary" style="width:100%; justify-content:center; margin-bottom:20px;" onclick="alert('Meeting successfully added to your calendar!')">
                <i class="fa-regular fa-calendar-plus"></i> Add to Calendar
            </button>

            <div class="detail-info-list">
                <div class="detail-info-item">
                    <i class="fa-solid fa-tag"></i>
                    <div>
                        <div style="font-size:10px; color:var(--text-muted); font-weight:700;">Type</div>
                        <div>${meeting.type}</div>
                    </div>
                </div>
                <div class="detail-info-item">
                    <i class="fa-solid fa-location-dot"></i>
                    <div>
                        <div style="font-size:10px; color:var(--text-muted); font-weight:700;">Location</div>
                        <div>${meeting.location}</div>
                    </div>
                </div>
                <div class="detail-info-item">
                    <i class="fa-regular fa-clock"></i>
                    <div>
                        <div style="font-size:10px; color:var(--text-muted); font-weight:700;">Duration</div>
                        <div>${meeting.duration}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderAbout(container) {
    container.innerHTML = `
        <h2 class="section-title">About Us</h2>
        <p class="section-subtitle">Learn more about our mission, vision, and the team behind MWM.</p>

        <div class="hero-card" style="margin-bottom: 16px;">
            <h2>Together We Build More</h2>
            <p>Empowering students to lead and innovate.</p>
        </div>

        <div class="content-card">
            <h3><i class="fa-solid fa-bullseye"></i> Our Mission</h3>
            <p>To empower students, create opportunities, and build a stronger community through leadership, service, and collaboration.</p>
        </div>

        <div class="content-card">
            <h3><i class="fa-solid fa-eye"></i> Our Vision</h3>
            <p>A future where every student has the opportunity to grow, lead, and make a difference.</p>
        </div>

        <div class="content-card">
            <h3><i class="fa-solid fa-heart"></i> Our Values</h3>
            <ul class="values-list">
                <li>Leadership</li>
                <li>Integrity</li>
                <li>Community</li>
                <li>Excellence</li>
            </ul>
        </div>
    `;
}

function renderPictures(container, currentCategory = 'all') {
    const filtered = currentCategory === 'all' 
        ? photosList 
        : photosList.filter(p => p.category === currentCategory);

    container.innerHTML = `
        <h2 class="section-title">Pictures</h2>
        <p class="section-subtitle">Moments, memories, and milestones.</p>

        <div class="filter-chips">
            <div class="chip ${currentCategory === 'all' ? 'active' : ''}" onclick="filterPhotos('all')">All</div>
            <div class="chip ${currentCategory === 'meetings' ? 'active' : ''}" onclick="filterPhotos('meetings')">Meetings</div>
            <div class="chip ${currentCategory === 'events' ? 'active' : ''}" onclick="filterPhotos('events')">Events</div>
            <div class="chip ${currentCategory === 'community' ? 'active' : ''}" onclick="filterPhotos('community')">Community</div>
            <div class="chip ${currentCategory === 'other' ? 'active' : ''}" onclick="filterPhotos('other')">Other</div>
        </div>

        <div class="photo-grid">
            ${filtered.map(p => `
                <div class="photo-item">
                    <img src="${p.url}" alt="MWM Moment">
                </div>
            `).join('')}
        </div>
    `;
}

window.filterPhotos = (category) => {
    const container = document.getElementById('main-content');
    renderPictures(container, category);
};

function renderEvents(container) {
    container.innerHTML = `
        <h2 class="section-title">Events</h2>
        <p class="section-subtitle">What's coming up next at MWM.</p>
        <div class="content-card">
            <h3><i class="fa-solid fa-calendar-star"></i> Annual Student Summit</h3>
            <p>Join us next month for workshops, guest speakers, and collaborative student projects.</p>
        </div>
        <div class="content-card">
            <h3><i class="fa-solid fa-handshake-angle"></i> Community Charity Drive</h3>
            <p>We are organizing a book and school supply donation drive across campus.</p>
        </div>
    `;
}

function renderTeam(container) {
    container.innerHTML = `
        <h2 class="section-title">Our Team</h2>
        <p class="section-subtitle">Meet the dedicated leaders behind MWM.</p>
        <div class="content-card">
            <h3><i class="fa-solid fa-user-tie"></i> Executive Board</h3>
            <p>A dedicated group of students working together for MWM's success, organizing events, and mentoring new members.</p>
        </div>
    `;
}

function renderContact(container) {
    container.innerHTML = `
        <h2 class="section-title">Contact Us</h2>
        <p class="section-subtitle">Get in touch with our team.</p>
        <div class="content-card">
            <h3><i class="fa-solid fa-envelope-circle-check"></i> Send a Message</h3>
            <p style="margin-bottom: 12px;">Have questions or want to collaborate? Reach out to us at <strong>contact@mwm-students.org</strong> or visit us at the Main Student Union Hall.</p>
            <button class="btn-primary" onclick="alert('Message form submitted successfully!')">Open Contact Form</button>
        </div>
    `;
}

function renderMore(container) {
    container.innerHTML = `
        <h2 class="section-title">More Options</h2>
        <p class="section-subtitle">Explore all sections of the application.</p>
        <div class="content-card" style="cursor:pointer;" onclick="navigateTo('home')">
            <h3><i class="fa-solid fa-house"></i> Home Dashboard</h3>
            <p>Return to main welcome view.</p>
        </div>
        <div class="content-card" style="cursor:pointer;" onclick="navigateTo('about')">
            <h3><i class="fa-solid fa-user-group"></i> About Us & Mission</h3>
            <p>Learn about our core values.</p>
        </div>
        <div class="content-card" style="cursor:pointer;" onclick="navigateTo('team')">
            <h3><i class="fa-solid fa-users"></i> Our Team</h3>
            <p>Meet student organizers.</p>
        </div>
        <div class="content-card" style="cursor:pointer;" onclick="navigateTo('contact')">
            <h3><i class="fa-solid fa-envelope"></i> Contact</h3>
            <p>Get in touch with us.</p>
        </div>
    `;
}
