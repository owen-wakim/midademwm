// Global Supabase Credentials
const SUPABASE_URL = "https://ogopytqswaeljinyvvei.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_QslFTZ66tJdC5eQj1-t-Sw_mbHrBHNi";

var supabaseClient = null;

function initAuthSupabase() {
    if (window.supabase && window.supabase.createClient) {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
        } catch (e) {
            console.warn("Supabase init error:", e);
        }
    }
}

async function handleEmailSignUp(e) {
    if (e) e.preventDefault();
    if (!supabaseClient) initAuthSupabase();
    
    const email = document.getElementById('auth-email')?.value;
    const password = document.getElementById('auth-password')?.value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    if (!supabaseClient) {
        alert("Supabase SDK not loaded properly.");
        return;
    }

    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
        alert("Sign Up Error: " + error.message);
    } else {
        alert("Sign up successful! Please check your email for confirmation.");
        if (window.navigateTo) window.navigateTo('home');
    }
}

async function handleEmailSignIn(e) {
    if (e) e.preventDefault();
    if (!supabaseClient) initAuthSupabase();

    const email = document.getElementById('auth-email')?.value;
    const password = document.getElementById('auth-password')?.value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    if (!supabaseClient) {
        alert("Supabase SDK not loaded properly.");
        return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
        alert("Sign In Error: " + error.message);
    } else {
        alert("Successfully signed in!");
        if (window.navigateTo) window.navigateTo('home');
    }
}

async function handleGoogleAuth() {
    if (!supabaseClient) initAuthSupabase();
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
    if (error) alert("Google Auth Error: " + error.message);
}

document.addEventListener('DOMContentLoaded', initAuthSupabase);
