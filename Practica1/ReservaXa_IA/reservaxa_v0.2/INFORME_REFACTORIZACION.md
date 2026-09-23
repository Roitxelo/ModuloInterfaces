# Informe breve — ReservaXa! v0.2

## 1. Arquivos modificados

- `index.html`
- `pistas.html`
- `disponibilidad.html`
- `reserva.html`
- `confirmacion.html`
- `css/styles.css`
- `js/app.js`
- `README.md`

Arquivos novos:

- `js/data.js`
- `js/core.js`
- `tests/run-tests.js`
- `INFORME_REFACTORIZACION.md`

## 2. Cambios principais

- Fonte de verdade única: `sports → courts → availability → reservation`.
- IDs internos para deportes e pistas; os textos visibles xa non controlan relacións.
- Pistas renderizadas segundo o deporte seleccionado.
- “Libre desde …” e calendario usan exactamente a mesma función de dispoñibilidade.
- Ao seleccionar unha pista, a data inicial salta á primeira data con dispoñibilidade próxima.
- Navegación real por semanas, con semana anterior bloqueada ao chegar ao presente.
- Datas e franxas pasadas non son reservables.
- Estado temporal migrado a `sessionStorage`; os datos persoais non pasan á confirmación e bórranse ao finalizar/cancelar.
- Invalidación en cascada de pista/data/hora ao cambiar decisións previas.
- Participantes: só enteiros 1–20; rexeita notación científica, hex, decimais, signos e textos.
- Teléfono: valida caracteres permitidos e 9–15 díxitos reais.
- Email: validación lixeira de estrutura, dominio, puntos consecutivos e caracteres evidentes inválidos.
- Nome: admite letras Unicode, tildes, espazos, apóstrofes e guións; rexeita entradas absurdas.
- Só é obrigatorio un método de contacto: teléfono ou correo. Se se completan ambos, ambos deben ser válidos.
- Erros con `aria-invalid`, `aria-describedby`, texto explícito e foco no primeiro campo inválido.
- Barra de progreso migrada a `<progress>`.
- `alt=""` nas imaxes que só decoran tarxetas con título visible.
- Modal con trap de foco, Escape, `aria-modal` e fondo `inert` mentres está aberto.
- Eliminados estilos inline repetidos.
- Tipografías auxiliares elevadas a 1rem e layout reforzado contra overflow.
- Contraste reforzado: texto ocupado `#3c4a44` sobre `#ecefed` ≈ 8.04:1; borde principal `#6f8379` sobre branco ≈ 4.04:1; CTA `#0b6b4a` sobre branco ≈ 6.53:1.

## 3. Erros adicionais detectados durante a inspección

- O botón “volver” da v0.1 dependía de `history.back()`, polo que podía saír da aplicación se a páxina se abría desde outra orixe. Substituíuse por navegación determinista ao paso anterior.
- A confirmación antiga afirmaba que se enviara un correo, pero o prototipo non ten backend. O texto xa non promete un envío inexistente.
- A barra da v0.1 mostraba 100% antes da confirmación; agora expresa “4 de 4” como último paso, non como acción xa finalizada.
- Acceso directo a pasos intermedios podía deixar a interface sen contexto. Agora cada pantalla comproba precondicións e redirixe ao paso correcto.
- A data inicial fixa quedaba obsoleta. Todas as datas parten da data real do navegador.

## 4. Probas executadas

### Automatizadas con Node

`node tests/run-tests.js`

- participantes válidos: `1`, `10`, `20`;
- participantes inválidos: `0`, `21`, `1.5`, `1e1`, `0x10`, `0b10`, `+10`, `Infinity`, `NaN`, texto e cadea longa;
- teléfono válido e exemplos absurdos;
- email válido e exemplos inválidos do prompt;
- nomes con tilde, guión e apóstrofe; entradas absurdas;
- teléfono OU email como contacto mínimo;
- invalidación deporte → pista/data/hora;
- invalidación pista → data/hora;
- invalidación data → hora;
- dispoñibilidade determinista;
- primeira hora libre consistente coa lista de slots;
- data pasada non válida;
- reserva final válida/inválida segundo deporte-pista, participantes e slot.

Resultado: **todas as probas lóxicas pasaron**.

### Comprobacións estáticas

- `node --check` en `core.js`, `data.js`, `app.js`: OK.
- sen `style="..."` nos HTML: OK.
- sen uso de `localStorage`: OK.
- sen `TODO`/`FIXME`: OK.
- sen datas fixas antigas no HTML/JS: OK.
- contraste calculado dos principais estados activos: conforme cos limiares previstos.

### Proba de navegador

Intentouse executar Chromium headless no contedor para capturas e smoke test. O proceso Chromium non se mantivo estable no contedor (fallo/timeout do servizo do navegador), polo que non se afirma unha proba visual automatizada completa. O proxecto queda preparado para ser probado con Live Server nun navegador normal.

## 5. Resultado por grupos

- Integridade funcional (RF-01 a RF-05): implementada.
- Formularios (RF-06 a RF-12): implementados e probados a nivel lóxico.
- Accesibilidade (RF-13 a RF-23): implementada no código; contraste clave comprobado por cálculo; queda recomendable verificación manual con navegador/lector de pantalla.
- Responsive e limpeza (RF-24 a RF-26): implementados; sen estilos inline repetidos e con CSS defensivo.
- Regresión lóxica: completada mediante batería Node.

## 6. Limitacións pendentes

- Non hai backend nin base de datos: a reserva é un prototipo de interface.
- Non se envían SMS/correos reais.
- A dispoñibilidade é determinista de demostración, non procede dun Concello real.
- A proba visual automática con Chromium non puido completarse por limitación do contedor; convén executar manualmente zoom 100–200%, Tab/Shift+Tab e lector de pantalla no equipo de entrega.

## 7. Backlog P3 non implementado

- QR/código de reserva.
- confirmación real por SMS/email.
- engadir ao calendario `.ics`.
- abrir mapas / como chegar.
- filtros rápidos.
- vista de dispoñibilidade multi-día máis compacta.
- repetir reserva conservando só datos non sensibles.
- compartir reserva.
- información ampliada de instalacións.
- incidencias/peches reais.
- consultar/cancelar por código sen login.
- PWA.
