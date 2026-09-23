(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ReservaXaCore = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const DAY_MS = 86400000;

  function pad2(n) { return String(n).padStart(2, '0'); }

  function toISODate(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function fromISODate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    if (!match) return null;
    const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function addDays(date, amount) {
    const d = new Date(date);
    d.setDate(d.getDate() + amount);
    return d;
  }

  function formatDateGL(iso, options) {
    const d = fromISODate(iso);
    if (!d) return '';
    return new Intl.DateTimeFormat('gl-ES', options || { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
  }

  function formatMonthGL(date) {
    const text = new Intl.DateTimeFormat('gl-ES', { month: 'long', year: 'numeric' }).format(date);
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function formatWeekdayShortGL(date) {
    const text = new Intl.DateTimeFormat('gl-ES', { weekday: 'short' }).format(date).replace('.', '');
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function minutesFromTime(value) {
    const m = /^(\d{2}):(\d{2})$/.exec(value || '');
    return m ? Number(m[1]) * 60 + Number(m[2]) : NaN;
  }

  function endTime(start) {
    const mins = minutesFromTime(start) + 60;
    return `${pad2(Math.floor(mins / 60) % 24)}:${pad2(mins % 60)}`;
  }

  function makeReservation() {
    return {
      sportId: null,
      courtId: null,
      date: null,
      time: null,
      people: '2',
      contact: { name: '', phone: '', email: '' }
    };
  }

  function normalizeReservation(value) {
    const base = makeReservation();
    if (!value || typeof value !== 'object') return base;
    return {
      sportId: typeof value.sportId === 'string' ? value.sportId : null,
      courtId: typeof value.courtId === 'string' ? value.courtId : null,
      date: typeof value.date === 'string' ? value.date : null,
      time: typeof value.time === 'string' ? value.time : null,
      people: typeof value.people === 'string' ? value.people : '2',
      contact: {
        name: value.contact && typeof value.contact.name === 'string' ? value.contact.name : '',
        phone: value.contact && typeof value.contact.phone === 'string' ? value.contact.phone : '',
        email: value.contact && typeof value.contact.email === 'string' ? value.contact.email : ''
      }
    };
  }

  function withSport(reservation, sportId) {
    const r = normalizeReservation(reservation);
    if (r.sportId === sportId) return r;
    return { ...makeReservation(), sportId };
  }

  function withCourt(reservation, courtId) {
    const r = normalizeReservation(reservation);
    if (r.courtId === courtId) return r;
    return { ...r, courtId, date: null, time: null };
  }

  function withDate(reservation, date) {
    const r = normalizeReservation(reservation);
    if (r.date === date) return r;
    return { ...r, date, time: null };
  }

  function withTime(reservation, time) {
    const r = normalizeReservation(reservation);
    return { ...r, time };
  }

  function hashString(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function isPastDate(iso, now) {
    const d = fromISODate(iso);
    if (!d) return true;
    return startOfDay(d).getTime() < startOfDay(now || new Date()).getTime();
  }

  function isPastSlot(iso, start, now) {
    const current = now || new Date();
    const d = fromISODate(iso);
    if (!d) return true;
    const mins = minutesFromTime(start);
    d.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
    return d.getTime() <= current.getTime();
  }

  function getAvailability(courtId, iso, slotStarts, now) {
    const date = fromISODate(iso);
    if (!courtId || !date) return [];
    const weekday = date.getDay();
    const closedSunday = weekday === 0;
    return slotStarts.map((start, index) => {
      const seed = hashString(`${courtId}|${iso}|${index}`);
      let available = !closedSunday && (seed % 7) > 1;
      if (isPastDate(iso, now) || isPastSlot(iso, start, now)) available = false;
      return {
        start,
        end: endTime(start),
        value: `${start} – ${endTime(start)}`,
        available,
        reason: closedSunday ? 'Pechada' : (isPastSlot(iso, start, now) ? 'Pasada' : (available ? 'Libre' : 'Ocupada'))
      };
    });
  }

  function firstAvailable(courtId, iso, slotStarts, now) {
    return getAvailability(courtId, iso, slotStarts, now).find(slot => slot.available) || null;
  }

  function findNextAvailable(courtId, startIso, slotStarts, now, maxDays) {
    const start = fromISODate(startIso) || startOfDay(now || new Date());
    const limit = Number.isInteger(maxDays) ? maxDays : 30;
    for (let i = 0; i <= limit; i += 1) {
      const d = addDays(start, i);
      const iso = toISODate(d);
      const slot = firstAvailable(courtId, iso, slotStarts, now);
      if (slot) return { date: iso, slot, daysAhead: i };
    }
    return null;
  }

  function validateName(value) {
    const v = String(value || '').trim();
    if (v.length < 2) return 'Escribe un nome de polo menos 2 caracteres.';
    if (v.length > 80) return 'O nome non pode superar os 80 caracteres.';
    if (!/\p{L}/u.test(v)) return 'O nome debe conter letras.';
    if (!/^[\p{L}\p{M}][\p{L}\p{M}\s'’-]*$/u.test(v)) return 'Usa letras, espazos, apóstrofes ou guións.';
    return '';
  }

  function validatePhone(value, required) {
    const v = String(value || '').trim();
    if (!v) return required ? 'Introduce un teléfono ou un correo electrónico.' : '';
    if (v.length > 24) return 'O teléfono é demasiado longo.';
    if (!/^[+()\-\s\d]+$/.test(v)) return 'Usa só números, espazos, +, parénteses ou guións.';
    if ((v.match(/\+/g) || []).length > 1 || (v.includes('+') && !v.startsWith('+'))) return 'O signo + só pode aparecer unha vez ao inicio.';
    const digits = v.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 15) return 'O teléfono debe ter entre 9 e 15 díxitos.';
    return '';
  }

  function validateEmail(value, required) {
    const v = String(value || '').trim();
    if (!v) return required ? 'Introduce un correo electrónico ou un teléfono.' : '';
    if (v.length > 120) return 'O correo non pode superar os 120 caracteres.';
    if (/\s|[<>]/.test(v)) return 'O correo contén caracteres non válidos.';
    const parts = v.split('@');
    if (parts.length !== 2 || !parts[0] || !parts[1]) return 'Introduce un correo válido, por exemplo nome@correo.gal.';
    const [local, domain] = parts;
    if (local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return 'Revisa a parte anterior ao @ do correo.';
    if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return 'O correo contén caracteres non válidos.';
    if (domain.includes('..') || domain.startsWith('-') || domain.endsWith('-') || !domain.includes('.')) return 'Revisa o dominio do correo.';
    const labels = domain.split('.');
    if (labels.some(label => !label || label.startsWith('-') || label.endsWith('-') || !/^[A-Za-z0-9-]+$/.test(label))) return 'Revisa o dominio do correo.';
    if (labels[labels.length - 1].length < 2) return 'Revisa a terminación do correo.';
    return '';
  }

  function validatePeople(value) {
    const raw = String(value ?? '').trim();
    if (!/^\d{1,2}$/.test(raw)) return 'Indica un número enteiro entre 1 e 20.';
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1 || n > 20) return 'Indica un número enteiro entre 1 e 20.';
    return '';
  }

  function validateContact(phone, email) {
    const p = String(phone || '').trim();
    const e = String(email || '').trim();
    const none = !p && !e;
    return {
      phone: validatePhone(p, none),
      email: validateEmail(e, none),
      valid: !validatePhone(p, none) && !validateEmail(e, none)
    };
  }

  function validateReservation(reservation, sports, courts, slotStarts, now) {
    const r = normalizeReservation(reservation);
    const sport = sports.find(x => x.id === r.sportId);
    if (!sport) return { valid: false, reason: 'Deporte non válido.' };
    const court = courts.find(x => x.id === r.courtId && x.sportId === sport.id);
    if (!court) return { valid: false, reason: 'Pista non válida para este deporte.' };
    if (!r.date || isPastDate(r.date, now)) return { valid: false, reason: 'Data non válida.' };
    const slot = getAvailability(court.id, r.date, slotStarts, now).find(x => x.value === r.time && x.available);
    if (!slot) return { valid: false, reason: 'A hora xa non está dispoñible.' };
    if (validatePeople(r.people)) return { valid: false, reason: 'Número de participantes non válido.' };
    if (validateName(r.contact.name)) return { valid: false, reason: 'Nome non válido.' };
    const c = validateContact(r.contact.phone, r.contact.email);
    if (!c.valid) return { valid: false, reason: 'Método de contacto non válido.' };
    return { valid: true, sport, court, slot };
  }

  return {
    DAY_MS,
    toISODate, fromISODate, startOfDay, addDays,
    formatDateGL, formatMonthGL, formatWeekdayShortGL,
    makeReservation, normalizeReservation, withSport, withCourt, withDate, withTime,
    isPastDate, isPastSlot, getAvailability, firstAvailable, findNextAvailable,
    validateName, validatePhone, validateEmail, validatePeople, validateContact, validateReservation
  };
}));
