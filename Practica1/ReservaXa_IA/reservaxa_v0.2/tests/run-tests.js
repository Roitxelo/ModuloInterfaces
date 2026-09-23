const assert = require('assert');
const Core = require('../js/core.js');

const SPORTS = [
  { id: 'padel', name: 'Pádel' }, { id: 'tenis', name: 'Tenis' }
];
const COURTS = [
  { id: 'p1', sportId: 'padel', name: 'P1', place: 'A' },
  { id: 't1', sportId: 'tenis', name: 'T1', place: 'B' }
];
const SLOTS = ['08:00','09:00','10:00','16:00','17:00','18:00','19:00','20:00','21:00'];
const NOW = new Date(2026, 8, 18, 7, 0, 0);
const TODAY = '2026-09-18';

function ok(value, msg) { assert.strictEqual(value, '', msg); }
function bad(value, msg) { assert.notStrictEqual(value, '', msg); }

// Participantes
['1','10','20'].forEach(v => ok(Core.validatePeople(v), `people valid ${v}`));
['0','21','1.5','1e1','0x10','0b10','+10','Infinity','NaN','texto','999999999999999999999'].forEach(v => bad(Core.validatePeople(v), `people invalid ${v}`));

// Teléfono
ok(Core.validatePhone('600 123 123', true), 'phone normal');
['+++++++++','---------','(((((((((',')))))))))','123------','()()()()()','+ + + + +'].forEach(v => bad(Core.validatePhone(v, true), `phone invalid ${v}`));

// Email
['nome@correo.gal','a.b+tag@test.com'].forEach(v => ok(Core.validateEmail(v, true), `email valid ${v}`));
['a@b..com','a@-b.com','<b>@a.com','a@test.com!'].forEach(v => bad(Core.validateEmail(v, true), `email invalid ${v}`));

// Nome
["María López", "Xoán O'Neill", 'Ana-María'].forEach(v => ok(Core.validateName(v), `name valid ${v}`));
['<>','@@','12',''].forEach(v => bad(Core.validateName(v), `name invalid ${v}`));

// Contacto: polo menos un
assert(Core.validateContact('600 123 123','').valid);
assert(Core.validateContact('','nome@correo.gal').valid);
assert(!Core.validateContact('','').valid);
assert(!Core.validateContact('+++++++++','nome@correo.gal').valid);

// Invalidación en cascada
let r = Core.makeReservation();
r = Core.withSport(r, 'padel');
r = Core.withCourt(r, 'p1');
r = Core.withDate(r, TODAY);
r = Core.withTime(r, '17:00 – 18:00');
let changed = Core.withSport(r, 'tenis');
assert.strictEqual(changed.courtId, null);
assert.strictEqual(changed.date, null);
assert.strictEqual(changed.time, null);
changed = Core.withCourt({ ...r }, 't1');
assert.strictEqual(changed.date, null);
assert.strictEqual(changed.time, null);
changed = Core.withDate({ ...r }, '2026-09-19');
assert.strictEqual(changed.time, null);

// Dispoñibilidade determinista e primeira hora coherente
const a1 = Core.getAvailability('p1', TODAY, SLOTS, NOW);
const a2 = Core.getAvailability('p1', TODAY, SLOTS, NOW);
assert.deepStrictEqual(a1, a2);
const first = Core.firstAvailable('p1', TODAY, SLOTS, NOW);
assert.strictEqual(first?.value, a1.find(x => x.available)?.value);

// Data pasada
assert.strictEqual(Core.isPastDate('2026-09-17', NOW), true);
assert.strictEqual(Core.isPastDate('2026-09-18', NOW), false);

// Reserva completa con hora realmente dispoñible
const validSlot = Core.firstAvailable('p1', TODAY, SLOTS, NOW);
assert(validSlot, 'must have at least one free slot in test fixture');
const full = {
  sportId: 'padel', courtId: 'p1', date: TODAY, time: validSlot.value, people: '2',
  contact: { name: 'María López', phone: '600 123 123', email: '' }
};
assert.strictEqual(Core.validateReservation(full, SPORTS, COURTS, SLOTS, NOW).valid, true);
assert.strictEqual(Core.validateReservation({ ...full, courtId: 't1' }, SPORTS, COURTS, SLOTS, NOW).valid, false);
assert.strictEqual(Core.validateReservation({ ...full, people: '1e1' }, SPORTS, COURTS, SLOTS, NOW).valid, false);

console.log('OK: todas as probas lóxicas pasaron.');
