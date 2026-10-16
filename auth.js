// Supabase Configuration
const SUPABASE_URL = "https://ogopytqswaeljinyvvei.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_QslFTZ66tJdC5eQj1-t-Sw_mbHrBHNi";

let supabaseClient = null;
try {
    if (window.supabase && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    }
} catch (e) {
    console.warn("Supabase Auth initialization warning:", e);
}

// Handle Email Sign Up
async function handleEmailSignUp(event) {
    event.preventDefault();
    if (!supabaseClient) {
        alert("Supabase client not initialized.");
        return;
    }
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
        alert("Sign Up Error: " + error.message);
    } else {
        alert("Sign up successful! Please check your email for confirmation link.");
        if (typeof navigateTo === 'function') navigateTo('home');
    }
}

// Handle Email Sign In
async function handleEmailSignIn(event) {
    event.preventDefault();
    if (!supabaseClient) {
        alert("Supabase client not initialized.");
        return;
    }
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
        alert("Sign In Error: " + error.message);
    } else {
        alert("Successfully signed in!");
        if (typeof navigateTo === 'function') navigateTo('home');
    }
}

// Handle Google OAuth Sign In / Sign Up
async function handleGoogleAuth() {
    if (!supabaseClient) {
        alert("Supabase client not initialized.");
        return;
    }
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    });
    if (error) {
        alert("Google Auth Error: " + error.message);
    }
}

// Handle Sign Out
async function handleSignOut() {
    if (!supabaseClient) return;
    await supabaseClient.auth.signOut();
    alert("Signed out successfully.");
    if (typeof navigateTo === 'function') navigateTo('auth');
}