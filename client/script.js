const API = "https://notes-website-boyg.onrender.com";

async function signup() {
  const email = signupEmail.value;
  const password = signupPass.value;

  const res = await fetch(API + "/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  msg.innerText = data.message;
}

async function login() {
  const email = loginEmail.value;
  const password = loginPass.value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    msg.innerText = data.message;
  }
}
