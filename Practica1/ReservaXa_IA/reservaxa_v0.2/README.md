# ReservaXa! v0.2 — Refactorización total

Prototipo móbil responsive en **HTML + CSS + JavaScript vanilla** para reservar instalacións deportivas municipais sen rexistro.

## Fluxo

1. `index.html` — escolla de deporte.
2. `pistas.html` — pistas compatibles co deporte e primeira dispoñibilidade real calculada.
3. `disponibilidad.html` — navegación semanal, día e franxa horaria.
4. `reserva.html` — datos mínimos da reserva.
5. `confirmacion.html` — resumo final e cancelación con confirmación.

## Arquitectura

- `js/data.js`: fonte de datos de deportes, pistas e franxas horarias.
- `js/core.js`: lóxica pura de estado, invalidación, dispoñibilidade e validación.
- `js/app.js`: renderizado e interacción co DOM.
- `sessionStorage`: mantén só o borrador mentres dura o fluxo. Os datos persoais elimínanse ao confirmar ou cancelar.

A reserva usa IDs (`sportId`, `courtId`) e unha única estrutura de estado. Cambiar deporte, pista ou data invalida automaticamente os datos posteriores incompatibles.

## Execución

Recomendado con VS Code + Live Server:

1. Abrir esta carpeta completa en VS Code.
2. Botón dereito sobre `index.html`.
3. **Open with Live Server**.

Tamén se pode servir desde terminal:

```bash
npx serve .
```

## Probas automáticas

As probas de lóxica non teñen dependencias externas:

```bash
node tests/run-tests.js
```

Comproban validación de participantes, teléfono, email e nome; contacto alternativo; invalidación en cascada; datas pasadas; dispoñibilidade determinista; coherencia da primeira hora libre; e validación final dunha reserva.

## Accesibilidade incorporada

- `lang="gl"`.
- enlace “Saltar ao contido principal”.
- elementos semánticos e `<button>` reais.
- foco visible mediante `:focus-visible`.
- barra de progreso semántica con `<progress>`.
- imaxes decorativas de tarxetas con `alt=""` para evitar anuncios redundantes.
- estados Libre/Ocupada con texto + símbolo + cor.
- bordes de inputs reforzados e estados de erro non dependentes só da cor.
- erros asociados con `aria-describedby` + `aria-invalid` + rexións `role="status"`.
- diálogo de cancelación con `aria-modal`, Escape e retención do foco.
- targets táctiles amplos.
- tipografía funcional de 1rem ou superior.
- layout defensivo con `min-width: 0` e `overflow-wrap`.

## Limitación real do prototipo

Non existe backend: non se crea unha reserva municipal real, non se envían correos/SMS e a dispoñibilidade é un conxunto de datos determinista de demostración. A validación do navegador mellora a UX, pero non substitúe unha futura validación en servidor.
