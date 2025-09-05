# wan-project
simulator 
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wan Project</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: black;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .hidden { display: none; }

    .screen {
      background: #111;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 0 30px red;
      text-align: center;
      width: 320px;
    }

    .logo {
      width: 120px;
      margin-bottom: 15px;
      border-radius: 10px;
      box-shadow: 0 0 20px red;
    }

    h1 {
      color: red;
      text-shadow: 0 0 10px red;
      margin-bottom: 20px;
    }

    input {
      width: 90%;
      padding: 10px;
      margin: 10px 0;
      border-radius: 8px;
      border: none;
      outline: none;
      text-align: center;
    }

    button {
      display: block;
      width: 100%;
      margin: 10px 0;
      padding: 12px;
      border: none;
      border-radius: 10px;
      background: red;
      color: white;
      font-size: 16px;
      cursor: pointer;
      transition: 0.3s;
    }

    button:hover { background: darkred; }
  </style>
</head>
<body>
  <!-- Layar 1: Password -->
  <div id="passwordScreen" class="screen">
    <h1>Password</h1>
    <input type="password" id="passwordInput" placeholder="Masukkan password">
    <button onclick="checkPassword()">Masuk</button>
  </div>

  <!-- Layar 2: Menu -->
  <div id="menu" class="screen hidden">
    <img src="https://i.ibb.co/7Jmrk4PR/Proyek-Baru-255-49-D229-E.png" alt="Logo" class="logo">
    <h1>Wan Project</h1>
    <button onclick="showScreen('kenon')">Kenon WhatsApp</button>
    <button onclick="showScreen('unban')">Unban WhatsApp</button>
    <button onclick="showScreen('spam')">Spam WhatsApp</button>
    <button onclick="showScreen('bug')">Bug WhatsApp</button>
  </div>

  <!-- Layar 3: Input Nomor -->
  <div id="kenon" class="screen hidden">
    <h1>Kenon WhatsApp</h1>
    <input type="text" placeholder="Masukkan No.">
    <button onclick="goBack()">Back</button>
  </div>

  <div id="unban" class="screen hidden">
    <h1>Unban WhatsApp</h1>
    <input type="text" placeholder="Masukkan No.">
    <button onclick="goBack()">Back</button>
  </div>

  <div id="spam" class="screen hidden">
    <h1>Spam WhatsApp</h1>
    <input type="text" placeholder="Masukkan No.">
    <button onclick="goBack()">Back</button>
  </div>

  <div id="bug" class="screen hidden">
    <h1>Bug WhatsApp</h1>
    <input type="text" placeholder="Masukkan No.">
    <button onclick="goBack()">Back</button>
  </div>

  <script>
    function checkPassword() {
      const input = document.getElementById("passwordInput").value;
      if (input === "170710") { // password baru
        document.getElementById("passwordScreen").classList.add("hidden");
        document.getElementById("menu").classList.remove("hidden");
      } else {
        alert("Password salah!");
      }
    }

    function showScreen(screenId) {
      document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
      document.getElementById(screenId).classList.remove("hidden");
    }

    function goBack() {
      document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
      document.getElementById("menu").classList.remove("hidden");
    }
  </script>
</body>
</html>
