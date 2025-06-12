// Supabase DB connection
const supabaseClient = supabase.createClient(
  'https://dcpzpbmkfxzzxofyrzvu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjcHpwYm1rZnh6enhvZnlyenZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NDIxMTIsImV4cCI6MjA2MTExODExMn0.33Bn9eVPv-Z7GuQNUPEBZ8xcdhokJ67hAMUdlhjdUok',
  {
    auth: { storage: sessionStorage }
  }
);

// Hash check for sign-ups
const SIGNUP_HASH = "8e74b3b2f92e618592c625d278bb7c4a0b3fb0e66ace2893997abd350a442539";

async function checkPassword(str) {
  const hash = await hashString(str);
  if (hash === SIGNUP_HASH) {
    return true;
  }
  return false;
}

async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Sign-up function
async function signUp(email, password, hash, username) {
  if (!await checkPassword(hash)) {
    changeMessage("Sign-Up Failed : Incorrect Hash Password")
    return true;
  }

  const { user, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    changeMessage("Sign-Up Failed : " + error.message)
  } else {
    changeMessage("Sign-Up Succeeded")
    if (username != "") {
      const { } = await supabaseClient
        .from('profiles')
        .update({ username: username })
        .eq('id', user.id);
    }
    setTimeout(() => {
      window.location.href = 'mpl_index.html';
    }, 1000);
  }
}

// Sign-in function
async function signIn(email, password) {
  const { user, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    changeMessage("Sign-In Failed : " + error.message)
  } else {
    changeMessage("Sign-In Succeeded")
    setTimeout(() => {
      window.location.href = 'mpl_index.html';
    }, 1000);
  }
}

function changeMessage(str) {
  const message = document.getElementById('message');
  message.textContent = str;
}

// Element Functions ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.getElementById('apply-btn').addEventListener('click', () => {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const hashInput = document.getElementById('hash');
  const usernameInput = document.getElementById('username');
  const email = emailInput.value;
  const password = passwordInput.value;
  const hash = hashInput.value;
  const username = usernameInput.value;
  signUp(email, password, hash, username);
});

document.getElementById('signin-btn').addEventListener('click', () => {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const email = emailInput.value;
  const password = passwordInput.value;
  signIn(email, password);
});

document.getElementById('signup-btn').addEventListener('click', () => {
  // Unhide hash
  const temp1 = document.getElementById('hash-container');
  temp1.style.display = 'block';
  // Hide Sign In
  const temp2 = document.getElementById('signin-btn');
  temp2.style.display = 'none';
  // Unhide go back
  const temp3 = document.getElementById('back-btn');
  temp3.style.display = 'inline-block';
  // Hide Sign Up
  const temp4 = document.getElementById('signup-btn');
  temp4.style.display = 'none';
  // Unhide Apply
  const temp5 = document.getElementById('apply-btn');
  temp5.style.display = 'inline-block';
  changeMessage("");
});

document.getElementById('back-btn').addEventListener('click', () => {
  // Hide hash
  const temp1 = document.getElementById('hash-container');
  temp1.style.display = 'none';
  // Unhide Sign In
  const temp2 = document.getElementById('signin-btn');
  temp2.style.display = 'inline-block';
  // Hide go back
  const temp3 = document.getElementById('back-btn');
  temp3.style.display = 'none';
  // Unhide Sign Up
  const temp4 = document.getElementById('signup-btn');
  temp4.style.display = 'inline-block';
  // Hide Apply
  const temp5 = document.getElementById('apply-btn');
  temp5.style.display = 'none';
  changeMessage("");
});
