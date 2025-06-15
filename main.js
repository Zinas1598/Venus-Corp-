// Modal open/close logic for a smooth UX
document.getElementById('investBtn').onclick = function() {
  document.getElementById('modalBg').style.display = 'flex';
  document.getElementById('successMsg').textContent = '';
  document.getElementById('investForm').reset();
};
document.getElementById('closeModal').onclick = function() {
  document.getElementById('modalBg').style.display = 'none';
};
window.onclick = function(e) {
  if (e.target === document.getElementById('modalBg')) {
    document.getElementById('modalBg').style.display = 'none';
  }
};

// Redirect to dashboard.html when analytics card is clicked
document.getElementById('analyticsCard').onclick = function() {
  window.location.href = "dashboard.html";
};

// Investment form: save investment and redirect to payment.html
document.getElementById('investForm').onsubmit = function(e) {
  e.preventDefault();
  const planSelect = document.getElementById('plan');
  const selectedPlan = planSelect.value;
  const amountInput = document.getElementById('amount');
  const amountValue = parseFloat(amountInput.value);
  const planMinimums = { Starter: 3000, Growth: 6000, Elite: 9000 };
  const min = planMinimums[selectedPlan] || 3000;
  const successMsg = document.getElementById('successMsg');

  if (!selectedPlan) {
    successMsg.textContent = "Please select a plan.";
    return;
  }
  if (isNaN(amountValue) || amountValue < min) {
    successMsg.textContent = `Minimum for ${selectedPlan} is ₦${min}.`;
    return;
  }

  // Save investment to localStorage
  const investments = JSON.parse(localStorage.getItem('venuscorp_investments') || '[]');
  investments.push({
    date: new Date().toLocaleString(),
    plan: selectedPlan,
    amount: amountValue,
    status: 'Pending Payment'
  });
  localStorage.setItem('venuscorp_investments', JSON.stringify(investments));

  // Save payment timer start time and amount
  localStorage.setItem('venuscorp_payment_timer', JSON.stringify({
    start: Date.now(),
    duration: 3600, // seconds
    plan: selectedPlan,
    amount: amountValue
  }));

  // Redirect to payment menu
  window.location.href = "payment.html";
};

// About section toggle
const aboutNav = document.getElementById('aboutNav');
const aboutSection = document.getElementById('about');
if (aboutNav && aboutSection) {
  aboutNav.addEventListener('click', function(e) {
    e.preventDefault();
    if (aboutSection.style.display === "none" || aboutSection.style.display === "") {
      aboutSection.style.display = "block";
      aboutSection.scrollIntoView({ behavior: "smooth" });
    } else {
      aboutSection.style.display = "none";
    }
  });
}

// Hide scroll on body until login/signup
document.body.style.overflow = "hidden";
// Auth logic (login/signup)
const loginBg = document.getElementById('loginBg');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const loginError = document.getElementById('loginError');
const signupUser = document.getElementById('signupUser');
const signupPass = document.getElementById('signupPass');
const signupPass2 = document.getElementById('signupPass2');
const signupError = document.getElementById('signupError');
const signupSuccess = document.getElementById('signupSuccess');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const mainContent = document.getElementById('mainContent');

function getStoredUser() {
  const user = localStorage.getItem('venuscorp_user');
  return user ? JSON.parse(user) : null;
}
function setStoredUser(userObj) {
  localStorage.setItem('venuscorp_user', JSON.stringify(userObj));
}
const storedUser = getStoredUser();
if (storedUser) {
  loginUser.value = storedUser.username;
}
showSignup.onclick = () => {
  loginForm.style.display = "none";
  signupForm.style.display = "block";
  loginError.textContent = "";
};
showLogin.onclick = () => {
  signupForm.style.display = "none";
  loginForm.style.display = "block";
  signupError.textContent = "";
  signupSuccess.textContent = "";
};
signupForm.onsubmit = function(e) {
  e.preventDefault();
  if (signupPass.value !== signupPass2.value) {
    signupError.textContent = "Passwords do not match.";
    signupSuccess.textContent = "";
    return;
  }
  if (
    signupUser.value.length < 3 ||
    signupPass.value.length < 4 ||
    signupPass.value.length > 6
  ) {
    signupError.textContent = "Username must be at least 3 characters. Password must be 4-6 characters.";
    signupSuccess.textContent = "";
    return;
  }
  setStoredUser({ username: signupUser.value, password: signupPass.value });
  signupError.textContent = "";
  signupSuccess.textContent = "Signup successful! You can now login.";
  setTimeout(() => {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
    signupSuccess.textContent = "";
    loginUser.value = signupUser.value;
  }, 1500);
};
loginForm.onsubmit = function(e) {
  e.preventDefault();
  const user = getStoredUser();
  if (
    user &&
    loginUser.value === user.username &&
    loginPass.value === user.password
  ) {
    loginBg.style.display = "none";
    mainContent.style.display = "block";
    document.body.style.overflow = "auto";
  } else {
    loginError.textContent = "Invalid username or password.";
  }
};
