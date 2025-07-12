// app.js

// --- DOM Elements ---
const form = document.getElementById('participant-form');
const nameInput = document.getElementById('name');
const dniInput = document.getElementById('dni');
const participantList = document.getElementById('participant-list');
const winnerList = document.getElementById('winner-list');
const winnerCount = document.getElementById('winner-count');
const drawButton = document.getElementById('draw-button');
const resetButton = document.getElementById('reset-button');
const resultTitle = document.getElementById('result-title');

// --- Storage Key ---
const STORAGE_KEY = 'sorteo_participantes';

// --- Internal Data ---
let participants = [];

// --- Load from localStorage ---
function loadParticipants() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    participants = JSON.parse(saved);
    renderParticipants();
  }
}

// --- Save to localStorage ---
function saveParticipants() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
}

// --- Render participant list ---
function renderParticipants() {
  participantList.innerHTML = '';
  participants.forEach((p, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1} - ${p.name} - ${p.dni}`;
    participantList.appendChild(li);
  });
}

// --- Add participant ---
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const dni = dniInput.value.trim();

  if (!name || !/^\d+$/.test(dni)) {
    alert('Nombre válido y DNI numérico requerido.');
    return;
  }

  const exists = participants.some(p => p.dni === dni);
  if (exists) {
    alert('Este DNI ya fue ingresado.');
    return;
  }

  participants.push({ name, dni });
  saveParticipants();
  renderParticipants();
  form.reset();
});

// --- Draw winners ---
drawButton.addEventListener('click', () => {
  const count = parseInt(winnerCount.value);
  if (participants.length < count) {
    alert('No hay suficientes participantes para ese sorteo.');
    return;
  }

  const shuffled = [...participants].sort(() => 0.5 - Math.random());
  const winners = shuffled.slice(0, count);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-AR');

  resultTitle.textContent = `Sorteo de duchas del día ${formattedDate}`;
  winnerList.innerHTML = '';

  winners.forEach((w, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1} - ${w.name} - ${w.dni}`;
    winnerList.appendChild(li);
  });
});

// --- Reset everything ---
resetButton.addEventListener('click', () => {
  if (confirm('¿Seguro que querés reiniciar todo?')) {
    participants = [];
    localStorage.removeItem(STORAGE_KEY);
    participantList.innerHTML = '';
    winnerList.innerHTML = '';
    resultTitle.textContent = '';
  }
});

// --- On load ---
loadParticipants();
