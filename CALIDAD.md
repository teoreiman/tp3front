# CALIDAD.md — fin de mes

## 1. Estrategia general
Nuestro idea se basa en testear la logica de negocio y
proteger al usuario con un test. Separamos la
lógica pura (finance.ts) de los componentes de React: así testeamos
las reglas del negocio con tests unitarios rápidos (sin DOM) y reservamos el
E2E —más lento— para validar la integración en un navegador real.

## 2. Herramientas seleccionadas
- Vitest: se integra con Vite, arranca casi instantáneo y
  su API es compatible con Jest. Lo elegimos sobre Jest para no mantener una
  toolchain de transformers paralela a la de Vite.
- Testing Library + jsdom: disponibles para tests de componentes.
- Playwright (E2E): navegador real, levanta el preview solo. Preferido sobre
  Cypress por velocidad e instalación simple en CI.
- ESLint: barrera de calidad estática.
- GitHub Actions + Vercel: CI/CD y hosting nativo de apps Vite.

## 3. Tests desarrollados
Unitarios — `src/lib/finance.test.ts` (Vitest):
- calculateBalance: resta egresos de ingresos (cálculo central).
- calculateBalance con lista vacía: caso borde, debe dar 0.
- totalByType: suma solo el tipo pedido.
- groupByCategory: agrupa egresos por categoría e ignora ingresos.
- budgetStatus: los 3 estados (ok / warning / exceeded) + presupuesto 0.

Unitarios — `src/lib/auth.test.ts` (Vitest):
- login con credenciales válidas: devuelve la sesión y la persiste.
- login con credenciales inválidas: tira error y no persiste nada.
- getSession: null si no hay sesión / si el dato guardado está corrupto.
- logout: limpia la sesión persistida.

E2E — `e2e/app.spec.ts` (Playwright):
- "login → crear transacción → se ve en la lista y actualiza el balance":
  loguea con las credenciales demo, verifica que se entra al dashboard,
  carga un ingreso de 50.000, y comprueba que (a) la transacción aparece en
  la lista y (b) el balance se actualiza al monto cargado. Cubre el camino
  completo de la app en un navegador real.

## 4. Casos de uso críticos
1. Cálculo del balance: es el número que guía las decisiones del usuario.
2. Login + alta de transacción: camino mínimo de valor, cubierto por el E2E.

## 5. Pipeline de CI/CD
En `.github/workflows/ci.yml`, se dispara en cada push/PR a `main`. Corre los
jobs en cadena (cada uno con `needs:` del anterior):

1. `lint`: `npm run lint` (ESLint). Es la primera barrera: si el código no pasa
   las reglas estáticas, no tiene sentido seguir gastando minutos de CI. Si falla,
   se corta acá y no se ejecutan los tests.
2. `test`: `npm run test` (Vitest). Tests unitarios de la lógica de negocio.
3. `e2e`: instala Chromium y corre `npm run test:e2e` (Playwright), que levanta
   el preview del build y valida el flujo principal en un navegador real.
4. `build`: `npm run build` (`tsc -b && vite build`). Confirma que el proyecto
   compila y typechequea antes de publicar nada.
5. `deploy`: despliega a Vercel. Está gateado con
   `if: github.ref == 'refs/heads/main' && github.event_name == 'push'`.

Decisiones de diseño:
- El deploy depende de que lint, test, e2e y build hayan pasado. Así, **a
  producción solo llega código verificado**: si cualquier paso falla, el deploy
  no corre.
- El deploy corre SOLO en push a `main`, no en PRs: los PRs validan calidad
  (lint/test/e2e/build) pero no publican; recién al mergear a `main` se despliega.
- Orden lint → test → e2e → build: barato a caro. Cortamos lo antes posible para
  dar feedback rápido y no quemar minutos en pasos lentos si algo básico falla.

## 6. Cobertura
`npm run coverage` (Vitest + v8) sobre la lógica de negocio (`src/lib`):
~97% statements y 100% branches. El único renglón sin cubrir es `formatCurrency`
(formateo de moneda, sin lógica de negocio). Supera el 60% pedido como extra.

## 7. Limitaciones y deuda técnica
- Persistencia: las transacciones viven en memoria. al recargar se pierden.
- Auth: login simulado con credenciales fijas, sin back.
- Cobertura: testeamos `src/lib` (lógica), no los componentes de UI. El flujo de
  UI igual queda cubierto de punta a punta por el test E2E.