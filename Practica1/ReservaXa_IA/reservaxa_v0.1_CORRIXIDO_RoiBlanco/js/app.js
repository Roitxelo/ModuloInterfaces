const STORAGE_KEY = 'reservaxaBooking';
const defaultBooking = {
  sport: '',
  court: '',
  courtPlace: '',
  date: '17/09/2026',
  time: '',
  name: '',
  phone: '',
  email: '',
  people: '2'
};

function loadBooking() {
  try { return { ...defaultBooking, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
  catch { return { ...defaultBooking }; }
}
function saveBooking(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function patchBooking(patch) { const next = { ...loadBooking(), ...patch }; saveBooking(next); return next; }
function resetBooking() { saveBooking(defaultBooking); }

function goBack(fallback = 'index.html') {
  if (document.referrer && history.length > 1) history.back();
  else location.href = fallback;
}

function showToast(message) {
  const toast = document.querySelector('.toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function fillSummary() {
  const b = loadBooking();
  document.querySelectorAll('[data-summary="sport"]').forEach(el => el.textContent = b.sport || 'Deporte');
  document.querySelectorAll('[data-summary="court"]').forEach(el => el.textContent = b.court || 'Pista');
  document.querySelectorAll('[data-summary="date"]').forEach(el => el.textContent = b.date || 'Data');
  document.querySelectorAll('[data-summary="time"]').forEach(el => el.textContent = b.time || 'Hora');
}

function setupBackButtons() {
  document.querySelectorAll('[data-back]').forEach(btn => btn.addEventListener('click', () => goBack(btn.dataset.back || 'index.html')));
}

function setupHome() {
  document.querySelectorAll('[data-sport]').forEach(card => {
    card.addEventListener('click', () => {
      patchBooking({ sport: card.dataset.sport, court: '', courtPlace: '', time: '' });
      location.href = 'pistas.html';
    });
  });
}

function setupCourts() {
  const b = loadBooking();
  const title = document.querySelector('[data-sport-title]');
  if (title) title.textContent = b.sport || 'Deporte';
  document.querySelectorAll('[data-court]').forEach(card => {
    card.addEventListener('click', () => {
      patchBooking({ court: card.dataset.court, courtPlace: card.dataset.place, time: '' });
      location.href = 'disponibilidad.html';
    });
  });
}

function setupAvailability() {
  const b = loadBooking();
  const title = document.querySelector('[data-court-title]');
  if (title) title.textContent = b.court || 'Pista';
  const place = document.querySelector('[data-court-place]');
  if (place) place.textContent = b.courtPlace || 'Instalación municipal';

  document.querySelectorAll('.day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.day-btn').forEach(x => x.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      patchBooking({ date: btn.dataset.date, time: '' });
      document.querySelectorAll('.slot--free').forEach(x => x.setAttribute('aria-pressed', 'false'));
      const next = document.querySelector('[data-next]');
      if (next) next.disabled = true;
      showToast(`Mostrando dispoñibilidade para o ${btn.dataset.date}`);
    });
  });

  document.querySelectorAll('.slot--free').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.slot--free').forEach(x => x.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      patchBooking({ time: btn.dataset.time });
      const next = document.querySelector('[data-next]');
      if (next) next.disabled = false;
      showToast(`Hora ${btn.dataset.time} seleccionada`);
    });
  });

  const next = document.querySelector('[data-next]');
  if (next) next.addEventListener('click', () => {
    const current = loadBooking();
    if (!current.time) return showToast('Escolle primeiro unha hora libre.');
    location.href = 'reserva.html';
  });
}

function setupForm() {
  const form = document.querySelector('#bookingForm');
  if (!form) return;
  const b = loadBooking();
  ['name','phone','email','people'].forEach(id => {
    const el = document.getElementById(id);
    if (el && b[id]) el.value = b[id];
  });

  const validators = {
    name: v => v.trim().length >= 2 ? '' : 'Escribe un nome de polo menos 2 caracteres.',
    phone: v => /^[0-9 +()-]{9,15}$/.test(v.trim()) ? '' : 'Introduce un teléfono válido, por exemplo 600 123 123.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Introduce un correo válido, por exemplo nome@correo.gal.',
    people: v => (+v >= 1 && +v <= 20) ? '' : 'Indica entre 1 e 20 participantes.'
  };

  function validateField(el) {
    const msg = validators[el.id](el.value);
    const out = document.querySelector(`[data-error-for="${el.id}"]`);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (out) out.textContent = msg;
    return !msg;
  }

  Object.keys(validators).forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => validateField(el));
    el.addEventListener('blur', () => validateField(el));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fields = Object.keys(validators).map(id => document.getElementById(id));
    const validity = fields.map(validateField);
    if (validity.some(v => !v)) {
      fields.find(el => el.getAttribute('aria-invalid') === 'true')?.focus();
      showToast('Revisa os campos marcados antes de continuar.');
      return;
    }
    patchBooking({
      name: document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('email').value.trim(),
      people: document.getElementById('people').value
    });
    location.href = 'confirmacion.html';
  });
}

function setupConfirmation() {
  const b = loadBooking();
  const map = {
    sport: b.sport,
    court: b.court,
    place: b.courtPlace,
    date: b.date,
    time: b.time,
    people: b.people,
    name: b.name
  };
  Object.entries(map).forEach(([key,val]) => {
    document.querySelectorAll(`[data-booking="${key}"]`).forEach(el => el.textContent = val || '—');
  });

  const modalBg = document.querySelector('.modal-backdrop');
  const open = document.querySelector('[data-open-cancel]');
  const closeBtns = document.querySelectorAll('[data-close-modal]');
  const confirm = document.querySelector('[data-confirm-cancel]');
  const modal = document.querySelector('.modal');
  let lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modalBg.classList.add('is-open');
    modalBg.setAttribute('aria-hidden', 'false');
    modal.querySelector('button')?.focus();
  }
  function closeModal() {
    modalBg.classList.remove('is-open');
    modalBg.setAttribute('aria-hidden', 'true');
    lastFocused?.focus();
  }
  open?.addEventListener('click', openModal);
  closeBtns.forEach(x => x.addEventListener('click', closeModal));
  modalBg?.addEventListener('click', e => { if (e.target === modalBg) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modalBg?.classList.contains('is-open')) closeModal(); });
  confirm?.addEventListener('click', () => {
    resetBooking();
    closeModal();
    showToast('Reserva cancelada correctamente.');
    setTimeout(() => location.href = 'index.html', 900);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fillSummary();
  setupBackButtons();
  setupHome();
  setupCourts();
  setupAvailability();
  setupForm();
  setupConfirmation();
});
