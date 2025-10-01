// Fungsi cek password
function checkPassword() {
  const pw = document.getElementById("password").value;
  const loginCard = document.getElementById("loginCard");
  const mainCard = document.getElementById("mainCard");
  const error = document.getElementById("error");

  if (pw === "wan ketumbar") {
    loginCard.style.display = "none";
    mainCard.style.display = "block";
  } else {
    error.innerText = "Password salah!";
  }
}

// Fungsi mulai proses (simulasi)
function startProcess() {
  const status = document.getElementById("status");
  status.innerHTML = "<div class='processing'>Processing...</div>";

  // Waktu random 10–15 detik
  const delay = Math.floor(Math.random() * 5000) + 10000;

  setTimeout(() => {
    status.innerHTML = `
      <div class='done'>DONE BANG 😹</div>
      <br>
      <button onclick="location.reload()">Back</button>
    `;