(function () {
  'use strict';

  const { SPORTS, COURTS, SLOT_STARTS } = window.RESERVAXA_DATA;
  const Core = window.ReservaXaCore;
  const DRAFT_KEY = 'reservaxaDraft';
  const COMPLETED_KEY = 'reservaxaCompleted';

  function loadDraft() {
    try { return Core.normalizeReservation(JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null')); }
    catch { return Core.makeReservation(); }
  }

  function saveDraft(reservation) {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(Core.normalizeReservation(reservation)));
  }

  function clearDraft() { sessionStorage.removeItem(DRAFT_KEY); }
  function clearCompleted() { sessionStorage.removeItem(COMPLETED_KEY); }

  function saveCompleted(summary) {
    sessionStorage.setItem(COMPLETED_KEY, JSON.stringify(summary));
  }

  function loadCompleted() {
    try { return JSON.parse(sessionStorage.getItem(COMPLETED_KEY) || 'null'); }
    catch { return null; }
  }

  function navigate(url) { window.location.href = url; }

  function showToast(message, duration = 2600) {
    const toast = document.querySelector('.toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => toast.classList.remove('is-visible'), duration);
  }

  function sportById(id) { return SPORTS.find(x => x.id === id) || null; }
  function courtById(id) { return COURTS.find(x => x.id === id) || null; }

  function fillSummary() {
    const r = loadDraft();
    const sport = sportById(r.sportId);
    const court = courtById(r.courtId);
    const map = {
      sport: sport?.name || 'Deporte',
      court: court?.name || 'Pista',
      date: r.date ? Core.formatDateGL(r.date) : 'Data',
      time: r.time || 'Hora'
    };
    Object.entries(map).forEach(([key, value]) => {
      document.querySelectorAll(`[data-summary="${key}"]`).forEach(el => { el.textContent = value; });
    });
  }

  function setupBackButtons() {
    document.querySelectorAll('[data-back]').forEach(btn => {
      btn.addEventListener('click', () => navigate(btn.dataset.back || 'index.html'));
    });
  }

  function renderSports() {
    const grid = document.querySelector('[data-sports-grid]');
    if (!grid) return;
    grid.replaceChildren(...SPORTS.map(sport => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'visual-card';
      btn.dataset.sportId = sport.id;
      btn.setAttribute('aria-label', `Escoller ${sport.name}`);
      btn.innerHTML = `<img src="${sport.image}" alt=""><span class="visual-card__content"><span class="visual-card__title">${sport.name}</span><span class="visual-card__meta">${sport.labelCount}</span></span>`;
      btn.addEventListener('click', () => {
        clearCompleted();
        const next = Core.withSport(loadDraft(), sport.id);
        saveDraft(next);
        navigate('pistas.html');
      });
      return btn;
    }));
  }

  function availabilityLabel(courtId) {
    const today = Core.toISODate(new Date());
    const next = Core.findNextAvailable(courtId, today, SLOT_STARTS, new Date(), 21);
    if (!next) return 'Sen ocos próximos';
    if (next.daysAhead === 0) return `Libre hoxe desde ${next.slot.start}`;
    if (next.daysAhead === 1) return `Libre mañá desde ${next.slot.start}`;
    return `Libre ${Core.formatDateGL(next.date, { day: '2-digit', month: '2-digit' })} desde ${next.slot.start}`;
  }

  function renderCourts() {
    const grid = document.querySelector('[data-courts-grid]');
    if (!grid) return;
    const r = loadDraft();
    const sport = sportById(r.sportId);
    if (!sport) return navigate('index.html');
    document.querySelectorAll('[data-sport-title]').forEach(el => { el.textContent = sport.name; });
    const compatible = COURTS.filter(court => court.sportId === sport.id);
    grid.replaceChildren(...compatible.map(court => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'visual-card court-card';
      btn.dataset.courtId = court.id;
      btn.setAttribute('aria-label', `Escoller ${court.name}. ${availabilityLabel(court.id)}`);
      btn.innerHTML = `<img src="${court.image}" alt=""><span class="visual-card__content"><span class="badge badge--free">✓ ${availabilityLabel(court.id)}</span><span class="visual-card__title visual-card__title--spaced">${court.name}</span><span class="visual-card__meta">${court.place} · ${court.feature}</span></span>`;
      btn.addEventListener('click', () => {
        let next = Core.withCourt(loadDraft(), court.id);
        const first = Core.findNextAvailable(court.id, Core.toISODate(new Date()), SLOT_STARTS, new Date(), 30);
        if (first) next = Core.withDate(next, first.date);
        saveDraft(next);
        navigate('disponibilidad.html');
      });
      return btn;
    }));
  }

  function setupAvailability() {
    const calendar = document.querySelector('[data-calendar]');
    if (!calendar) return;

    let r = loadDraft();
    const sport = sportById(r.sportId);
    const court = courtById(r.courtId);
    if (!sport) return navigate('index.html');
    if (!court || court.sportId !== sport.id) return navigate('pistas.html');

    const today = Core.startOfDay(new Date());
    const todayISO = Core.toISODate(today);
    if (!r.date || Core.isPastDate?.(r.date, new Date())) {
      r = Core.withDate(r, todayISO);
      saveDraft(r);
    }

    let weekStart = Core.fromISODate(r.date) || today;
    if (weekStart.getTime() < today.getTime()) weekStart = today;
    const offset = Math.floor((Core.startOfDay(weekStart).getTime() - today.getTime()) / (7 * Core.DAY_MS));
    weekStart = Core.addDays(today, Math.max(0, offset) * 7);

    document.querySelector('[data-court-title]').textContent = court.name;
    document.querySelector('[data-court-place]').textContent = court.place;

    const monthLabel = document.querySelector('[data-month-label]');
    const dayRow = document.querySelector('[data-day-row]');
    const slotGrid = document.querySelector('[data-slot-grid]');
    const prev = document.querySelector('[data-week-prev]');
    const nextWeek = document.querySelector('[data-week-next]');
    const nextBtn = document.querySelector('[data-next]');

    function renderSlots() {
      const current = loadDraft();
      const slots = Core.getAvailability(court.id, current.date, SLOT_STARTS, new Date());
      slotGrid.replaceChildren(...slots.map(slot => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `slot ${slot.available ? 'slot--free' : 'slot--busy'}`;
        const selected = current.time === slot.value && slot.available;
        if (slot.available) {
          btn.dataset.time = slot.value;
          btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
          btn.addEventListener('click', () => {
            const updated = Core.withTime(loadDraft(), slot.value);
            saveDraft(updated);
            renderSlots();
            nextBtn.disabled = false;
            showToast(`Hora ${slot.value} seleccionada`);
          });
        } else {
          btn.disabled = true;
        }
        btn.innerHTML = `<strong>${slot.start}</strong><span>${slot.available ? '✓ Libre' : `✕ ${slot.reason}`}</span>`;
        return btn;
      }));
      nextBtn.disabled = !Core.validateReservation({ ...loadDraft(), people: '2', contact: { name: 'Persoa Proba', phone: '600123123', email: '' } }, SPORTS, COURTS, SLOT_STARTS, new Date()).valid;
      if (!loadDraft().time) nextBtn.disabled = true;
    }

    function renderWeek() {
      const current = loadDraft();
      const days = Array.from({ length: 7 }, (_, i) => Core.addDays(weekStart, i));
      monthLabel.textContent = Core.formatMonthGL(weekStart);
      prev.disabled = weekStart.getTime() <= today.getTime();
      dayRow.replaceChildren(...days.map(date => {
        const iso = Core.toISODate(date);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'day-btn';
        btn.dataset.date = iso;
        btn.setAttribute('aria-pressed', current.date === iso ? 'true' : 'false');
        const dayDelta = Math.round((Core.startOfDay(date).getTime() - today.getTime()) / Core.DAY_MS);
        const extra = dayDelta === 0 ? 'Hoxe' : dayDelta === 1 ? 'Mañá' : '';
        btn.innerHTML = `<span>${Core.formatWeekdayShortGL(date)}</span><strong>${date.getDate()}</strong>${extra ? `<span>${extra}</span>` : '<span aria-hidden="true">&nbsp;</span>'}`;
        btn.addEventListener('click', () => {
          saveDraft(Core.withDate(loadDraft(), iso));
          renderWeek();
          renderSlots();
          showToast(`Mostrando dispoñibilidade para o ${Core.formatDateGL(iso)}`);
        });
        return btn;
      }));
      renderSlots();
    }

    prev.addEventListener('click', () => {
      const candidate = Core.addDays(weekStart, -7);
      weekStart = candidate.getTime() < today.getTime() ? today : candidate;
      const current = loadDraft();
      const end = Core.addDays(weekStart, 6);
      const selectedDate = Core.fromISODate(current.date);
      if (!selectedDate || selectedDate < weekStart || selectedDate > end) saveDraft(Core.withDate(current, Core.toISODate(weekStart)));
      renderWeek();
    });

    nextWeek.addEventListener('click', () => {
      weekStart = Core.addDays(weekStart, 7);
      const current = Core.withDate(loadDraft(), Core.toISODate(weekStart));
      saveDraft(current);
      renderWeek();
    });

    nextBtn.addEventListener('click', () => {
      const current = loadDraft();
      if (!current.time) return showToast('Escolle primeiro unha hora libre.');
      const slot = Core.getAvailability(court.id, current.date, SLOT_STARTS, new Date()).find(x => x.value === current.time && x.available);
      if (!slot) {
        saveDraft(Core.withTime(current, null));
        renderSlots();
        return showToast('Ese horario xa non está dispoñible. Escolle outro.');
      }
      navigate('reserva.html');
    });

    renderWeek();
  }

  function setFieldError(el, message) {
    const out = document.getElementById(`${el.id}Error`);
    el.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (out) out.textContent = message;
  }

  function setupForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    const r = loadDraft();
    const precheck = Core.validateReservation({ ...r, people: '2', contact: { name: 'Persoa Proba', phone: '600123123', email: '' } }, SPORTS, COURTS, SLOT_STARTS, new Date());
    if (!r.sportId) return navigate('index.html');
    if (!r.courtId) return navigate('pistas.html');
    if (!r.date || !r.time || !precheck.valid) return navigate('disponibilidad.html');

    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const people = document.getElementById('people');
    people.value = r.people || '2';

    function validateSingle(el) {
      let msg = '';
      if (el === name) msg = Core.validateName(name.value);
      if (el === people) msg = Core.validatePeople(people.value);
      if (el === phone || el === email) {
        const contact = Core.validateContact(phone.value, email.value);
        setFieldError(phone, contact.phone);
        setFieldError(email, contact.email);
        return contact.valid;
      }
      setFieldError(el, msg);
      return !msg;
    }

    [name, phone, email, people].forEach(el => {
      el.addEventListener('blur', () => validateSingle(el));
      el.addEventListener('input', () => {
        if (el.getAttribute('aria-invalid') === 'true' || el === phone || el === email) validateSingle(el);
      });
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      const contact = Core.validateContact(phone.value, email.value);
      const errors = {
        name: Core.validateName(name.value),
        phone: contact.phone,
        email: contact.email,
        people: Core.validatePeople(people.value)
      };
      [name, phone, email, people].forEach(el => setFieldError(el, errors[el.id]));
      const firstInvalid = [name, phone, email, people].find(el => errors[el.id]);
      if (firstInvalid) {
        firstInvalid.focus();
        showToast('Revisa os campos indicados antes de confirmar.');
        return;
      }

      const updated = {
        ...loadDraft(),
        people: people.value.trim(),
        contact: { name: name.value.trim(), phone: phone.value.trim(), email: email.value.trim() }
      };
      const finalCheck = Core.validateReservation(updated, SPORTS, COURTS, SLOT_STARTS, new Date());
      if (!finalCheck.valid) {
        showToast(finalCheck.reason);
        if (finalCheck.reason.includes('hora')) navigate('disponibilidad.html');
        return;
      }

      saveCompleted({
        sport: finalCheck.sport.name,
        court: finalCheck.court.name,
        place: finalCheck.court.place,
        date: Core.formatDateGL(updated.date),
        time: updated.time,
        people: updated.people,
        contactChannel: updated.contact.email ? 'correo electrónico' : 'teléfono'
      });
      clearDraft();
      navigate('confirmacion.html');
    });
  }

  function setupConfirmation() {
    const section = document.querySelector('[data-confirmation]');
    if (!section) return;
    const completed = loadCompleted();
    if (!completed) return navigate('index.html');
    Object.entries(completed).forEach(([key, value]) => {
      document.querySelectorAll(`[data-booking="${key}"]`).forEach(el => { el.textContent = value || '—'; });
    });
    const channel = document.querySelector('[data-confirm-channel]');
    if (channel) channel.textContent = `Método de contacto indicado: ${completed.contactChannel}.`;

    const homeLink = document.querySelector('[data-new-booking]');
    homeLink?.addEventListener('click', () => {
      clearDraft();
      clearCompleted();
    });

    const modalBg = document.querySelector('.modal-backdrop');
    const modal = document.querySelector('.modal');
    const open = document.querySelector('[data-open-cancel]');
    const close = document.querySelector('[data-close-modal]');
    const confirm = document.querySelector('[data-confirm-cancel]');
    let lastFocused = null;

    function focusables() {
      return [...modal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    }

    function openModal() {
      lastFocused = document.activeElement;
      modalBg.classList.add('is-open');
      modalBg.setAttribute('aria-hidden', 'false');
      document.querySelector('.app-shell')?.setAttribute('inert', '');
      focusables()[0]?.focus();
    }

    function closeModal() {
      modalBg.classList.remove('is-open');
      modalBg.setAttribute('aria-hidden', 'true');
      document.querySelector('.app-shell')?.removeAttribute('inert');
      lastFocused?.focus();
    }

    open?.addEventListener('click', openModal);
    close?.addEventListener('click', closeModal);
    modalBg?.addEventListener('click', e => { if (e.target === modalBg) closeModal(); });
    document.addEventListener('keydown', e => {
      if (!modalBg?.classList.contains('is-open')) return;
      if (e.key === 'Escape') return closeModal();
      if (e.key === 'Tab') {
        const items = focusables();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    confirm?.addEventListener('click', () => {
      clearDraft();
      clearCompleted();
      closeModal();
      showToast('Reserva cancelada. Volvendo ao inicio.', 1400);
      window.setTimeout(() => navigate('index.html'), 1500);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    fillSummary();
    setupBackButtons();
    renderSports();
    renderCourts();
    setupAvailability();
    setupForm();
    setupConfirmation();
  });
}());
