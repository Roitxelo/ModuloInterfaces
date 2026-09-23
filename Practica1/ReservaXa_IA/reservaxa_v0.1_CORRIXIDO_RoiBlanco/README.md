# ReservaXa! v0.1

Prototipo móbil responsive en HTML + CSS con JavaScript vanilla mínimo para interacción, validación e conservación do fluxo entre pantallas.

## Pantallas
1. `index.html` — escolla de deporte.
2. `pistas.html` — escolla de pista coa primeira dispoñibilidade visible.
3. `disponibilidad.html` — día e franxa horaria.
4. `reserva.html` — formulario de datos.
5. `confirmacion.html` — confirmación e opción de cancelar con diálogo preventivo.

## Checklist cuberta
- Estado do sistema: barra de progreso, seleccións persistentes, toasts e confirmación final.
- Control/liberdade: botóns atrás, cambio de hora, cancelación con modal e tecla Escape.
- Consistencia: mesmos patróns de botón, cor e navegación.
- Prevención de erros: franxas ocupadas desactivadas, validación do formulario e confirmación antes de cancelar.
- Recoñecer antes que recordar: resumo visible da selección durante o fluxo.
- Eficiencia: deporte → pista → hora → datos → confirmación.
- Contraste: paleta escura sobre branco e CTA con texto branco.
- Non uso exclusivo da cor: estados Libre/Ocupada inclúen texto e iconas.
- Fonte ≥16px e line-height 1.5.
- Targets táctiles ≥48px.
- Navegación por teclado, `:focus-visible` e enlace para saltar ao contido.
- `alt` nas imaxes informativas.
- CTA principal claramente destacado.
- Espazo en branco, agrupación e grid consistentes.
- Labels visibles e permanentes.
- Validación en tempo real con mensaxes específicas.
- Inputs adaptados: text, tel, email e number.

## Execución
Abrir `index.html` nun navegador. Para evitar limitacións dalgúns navegadores con `localStorage` en ficheiros locais, recoméndase servir a carpeta cun servidor simple, por exemplo Live Server en VS Code.
