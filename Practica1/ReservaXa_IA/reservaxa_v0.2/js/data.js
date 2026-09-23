(function () {
  'use strict';

  const SPORTS = [
    { id: 'padel', name: 'Pádel', labelCount: '3 pistas', image: 'assets/padel.svg' },
    { id: 'tenis', name: 'Tenis', labelCount: '2 pistas', image: 'assets/tenis.svg' },
    { id: 'futbol', name: 'Fútbol', labelCount: '2 campos', image: 'assets/futbol.svg' },
    { id: 'baloncesto', name: 'Baloncesto', labelCount: '2 pistas', image: 'assets/baloncesto.svg' }
  ];

  const COURTS = [
    { id: 'padel-xunqueira', sportId: 'padel', name: 'Pista A Xunqueira', place: 'Polideportivo Municipal', feature: 'Exterior', image: 'assets/padel-court-1.svg' },
    { id: 'padel-pardellas', sportId: 'padel', name: 'Pista Pardellas', place: 'Complexo Deportivo Pardellas', feature: 'Cuberta', image: 'assets/padel-court-2.svg' },
    { id: 'padel-lagoas', sportId: 'padel', name: 'Pista As Lagoas', place: 'Área Deportiva As Lagoas', feature: 'Exterior', image: 'assets/padel-court-3.svg' },
    { id: 'tenis-xunqueira', sportId: 'tenis', name: 'Pista de Tenis Xunqueira', place: 'Polideportivo Municipal', feature: 'Exterior', image: 'assets/tenis.svg' },
    { id: 'tenis-pardellas', sportId: 'tenis', name: 'Pista de Tenis Pardellas', place: 'Complexo Deportivo Pardellas', feature: 'Cuberta', image: 'assets/tenis.svg' },
    { id: 'futbol-campo1', sportId: 'futbol', name: 'Campo Municipal 1', place: 'Complexo Deportivo Municipal', feature: 'Herba artificial', image: 'assets/futbol.svg' },
    { id: 'futbol-campo2', sportId: 'futbol', name: 'Campo Municipal 2', place: 'Complexo Deportivo Municipal', feature: 'Exterior', image: 'assets/futbol.svg' },
    { id: 'basket-pavillon', sportId: 'baloncesto', name: 'Pista do Pavillón', place: 'Pavillón Municipal', feature: 'Cuberta', image: 'assets/baloncesto.svg' },
    { id: 'basket-lagoas', sportId: 'baloncesto', name: 'Cancha As Lagoas', place: 'Área Deportiva As Lagoas', feature: 'Exterior', image: 'assets/baloncesto.svg' }
  ];

  const SLOT_STARTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

  window.RESERVAXA_DATA = { SPORTS, COURTS, SLOT_STARTS };
}());
