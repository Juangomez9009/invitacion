// ----------------- MÚSICA DE FONDO ------------------

const music = document.getElementById("bg-music");
const button = document.querySelector(".music-button");
let isMuted = false;
let hasStarted = false;

function startExperience() {
  document.getElementById("welcome-modal").style.display = "none";
  music.play().then(() => {
    hasStarted = true;
    isMuted = false;
    button.textContent = "🔇 Silenciar música";
  }).catch((e) => {
    console.warn("Autoplay fallido:", e);
  });
}

function toggleMusic() {
  if (!hasStarted) return;

  music.muted = !music.muted;
  button.textContent = music.muted ? "🔊 Reanudar música" : "🔇 Silenciar música";
}

// ----------------- CUENTA REGRESIVA ------------------

function updateCountdown() {
  const eventDate = new Date("2025-08-02T16:00:00");
  const now = new Date();
  const diff = eventDate - now;

  const countdownElement = document.getElementById("countdown-text");

  if (diff <= 0) {
    countdownElement.textContent = "¡Ya es el gran día!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdownElement.textContent = `${days} días, ${hours}h ${minutes}m ${seconds}s 💍`;
  setTimeout(updateCountdown, 1000);
}

updateCountdown();

// ----------------- FORMULARIO CONFIRMACIÓN ------------------

function mostrarFormulario(nombre, cupos) {
  document.getElementById("confirmacion-nombre").innerHTML = `Hola <strong>${nombre}</strong> 👋<br>Tienes asignado(s) <strong>${cupos}</strong> cupo(s).`;

  const select = document.getElementById("asistentes");
  select.innerHTML = "";
  for (let i = 0; i <= cupos; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;
    select.appendChild(option);
  }

  document.getElementById("confirmacion-form").style.display = "block";
}

// ----------------- BÚSQUEDA POR CELULAR ------------------

async function buscarInvitado() {
  const numero = document.getElementById("celular").value.trim();
  try {
    const response = await fetch("invitados.json");
    if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");

    const lista = await response.json();
    const invitado = lista.find(i => String(i.celular) === numero);

    if (invitado) {
      mostrarFormulario(invitado.nombre, invitado.cupos);
    } else {
      alert("Número no registrado. Por favor verifica o comunícate con los novios.");
    }
  } catch (error) {
    alert("Hubo un problema al buscar. Intenta nuevamente.");
    console.error("Error al buscar invitado:", error);
  }
}

// ----------------- ENVÍO DE CONFIRMACIÓN ------------------

function confirmarAsistencia() {
  const celular = document.getElementById("celular").value.trim();
  const asistentes = document.getElementById("asistentes").value;
  const transporte = document.getElementById("transporte").value;
  const alergias = document.getElementById("alergias").value.trim();

  // Validación adicional para el campo de transporte
  if (transporte === "") {
    alert("Por favor indica si requieres transporte.");
    return;
  }

  const formData = new FormData();
  formData.append("celular", celular);
  formData.append("asistentes", asistentes);
  formData.append("transporte", transporte);
  formData.append("alergias", alergias);
  formData.append("fecha", new Date().toLocaleString());

  fetch("https://script.google.com/macros/s/AKfycbxK_OQ-oBd71Y4zm2Fhvy1TdUOxxHImsQ8lt7hFgbqWCx358ZkdgSq_RhW12bKQdHUgGA/exec", {
    method: "POST",
    body: formData
  })
  .then(response => {
    if (!response.ok) throw new Error("Error al enviar datos");
    alert("¡Gracias por confirmar tu asistencia! 🎉");
    document.getElementById("confirmacion-form").style.display = "none";
  })
  .catch(error => {
    console.error("❌ Error en confirmación:", error);
    alert("Hubo un problema al registrar tu asistencia. Intenta nuevamente.");
  });
}
}
