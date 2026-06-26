# CALIDAD.md — Fin de Mes

## 1. Estrategia general

Separamos la lógica pura de negocio (finance.ts, auth.ts) de los componentes de
React. Esto nos permite testear las reglas del negocio con tests unitarios rápidos
(sin DOM, sin navegador), y reservar el E2E —más lento y frágil— para validar la
integración real en un navegador. La prioridad es: si falla la lógica central, el
test unitario lo atrapa antes que llegue a CI; si falla la integración de la UI, lo
atrapa el E2E.

Elegimos no testear los componentes con Testing Library porque el flujo completo ya
queda cubierto por el E2E, y la lógica que vale proteger vive fuera del JSX.

## 2. Herramientas seleccionadas

- **Vitest**: se integra nativamente con Vite, arranca casi instantáneo y su API es
  compatible con Jest. Lo elegimos sobre Jest para no mantener una toolchain de
  transformers paralela a la de Vite.
- **jsdom**: simula el DOM para los tests unitarios que necesitan localStorage
  (auth.ts). Es más liviano que montar un navegador.
- **Playwright (E2E)**: levanta un navegador real (Chromium) y valida el flujo de
  punta a punta. Lo preferimos sobre Cypress por su velocidad de instalación en CI
  y su API más expresiva.
- **ESLint**: barrera de calidad estática. Si el código no pasa las reglas, el
  pipeline se corta antes de gastar tiempo en tests.
- **GitHub Actions + Vercel**: CI/CD y hosting. GitHub Actions corre el pipeline
  en cada push/PR; Vercel despliega automáticamente al mergearse a main.

## 3. Tests desarrollados

### Unitarios — `src/lib/finance.test.ts` (Vitest)

| Test | Qué valida |
|------|-----------|
| `calculateBalance` resta egresos de ingresos | Cálculo central: ingresos − egresos = balance |
| `calculateBalance` con lista vacía | Caso borde: debe retornar 0 sin romper |
| `totalByType` suma solo el tipo pedido | Filtrado correcto por tipo de transacción |
| `groupByCategory` agrupa egresos por categoría | Agrupación correcta, ignora ingresos |
| `budgetStatus` marca "ok" por debajo del 80% | Estado verde del presupuesto |
| `budgetStatus` marca "warning" entre 80%–99% | Estado de advertencia |
| `budgetStatus` marca "exceeded" al 100%+ | Estado superado |
| `budgetStatus` no rompe con presupuesto 0 | División por cero controlada |
| `formatCurrency` formatea con separador de miles | Formato correcto de pesos argentinos |
| `formatCurrency` formatea cero | Caso borde del formateador |

### Unitarios — `src/lib/auth.test.ts` (Vitest)

| Test | Qué valida |
|------|-----------|
| Login con credenciales válidas | Retorna sesión y la persiste en localStorage |
| Login con credenciales inválidas | Lanza error y no persiste nada |
| `getSession` sin sesión guardada | Retorna null correctamente |
| `getSession` con dato corrupto | Maneja JSON inválido sin romper |
| `logout` limpia la sesión | Elimina la sesión persistida |

### E2E — `e2e/app.spec.ts` (Playwright)

| Test | Qué valida |
|------|-----------|
| Login → crear transacción → balance actualizado | Flujo completo: autenticación, carga de datos, actualización de UI |
| Login con credenciales incorrectas | Muestra mensaje de error, no entra al dashboard |

## 4. Casos de uso críticos

1. **Cálculo del balance**: es el número que guía las decisiones del usuario.
   Un error aquí afecta todo lo que el usuario ve. Cubierto con múltiples tests
   unitarios (lista normal, lista vacía, solo ingresos, solo egresos).

2. **Login + carga de transacción**: camino mínimo de valor de la app. Si falla,
   el usuario no puede hacer nada. Cubierto por el E2E de punta a punta.

3. **Login fallido**: el usuario tiene que ver un mensaje de error claro y no
   entrar al dashboard. Cubierto por el segundo test E2E y por el test unitario
   de auth.

Priorizamos estos tres sobre, por ejemplo, el formato de moneda, porque son los
que directamente bloquean o confunden al usuario.

## 5. Pipeline de CI/CD

Definido en `.github/workflows/ci.yml`. Se dispara en cada push o PR a `main`.
Los jobs corren en secuencia con `needs:`, de más barato a más caro:

1. **`lint`** (`npm run lint`): ESLint. Primera barrera: si el código no cumple las
   reglas estáticas, no tiene sentido gastar minutos en tests. Falla → el pipeline
   se corta acá.

2. **`test`** (`npm run test`): Vitest. Tests unitarios de lógica de negocio.
   Rápidos (< 5s), sin navegador.

3. **`e2e`**: instala Chromium con `npx playwright install --with-deps chromium`
   y corre `npm run test:e2e`. Playwright levanta el preview de la app y valida
   los flujos principales en un navegador real.

4. **`build`** (`npm run build`): `tsc -b && vite build`. Verifica que el proyecto
   typechequea y compila correctamente antes de publicar.

5. **`deploy`**: despliega a Vercel. Si los secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`
   y `VERCEL_PROJECT_ID` están configurados como GitHub Secrets, hace el deploy
   por CLI. Si no están, emite un warning y termina exitosamente (Vercel igual
   despliega automáticamente vía su integración nativa de GitHub).

**Decisiones de diseño:**
- El deploy depende de que lint, test, e2e y build hayan pasado. A producción
  solo llega código verificado.
- El deploy corre SOLO en push a `main`, no en PRs: los PRs validan calidad pero
  no publican; recién al mergear se despliega.
- Orden lint → test → e2e → build: cortamos lo antes posible para dar feedback
  rápido y no quemar minutos en pasos lentos si algo básico falla.

## 6. Cobertura

`npm run coverage` (Vitest + v8) sobre `src/lib/`:

- **100% statements, 100% branches, 100% functions** en `finance.ts` y `auth.ts`.

Supera ampliamente el 60% pedido como extra. La cobertura es alta porque la
lógica de negocio está completamente aislada del DOM y es fácil de testear de
forma exhaustiva.

## 7. Uso de IA (Claude Code) para generación de tests

Usamos **Claude Code** (Anthropic) como agente de IA a lo largo del desarrollo.
El agente fue invocado directamente desde el editor (VS Code) con acceso completo
al repositorio.

**Qué generó el agente:**
- La estructura inicial de `finance.test.ts` y `auth.test.ts`: los describe/it
  blocks, los datos de prueba (`txs`), y las assertions principales.
- El test E2E de `app.spec.ts`: el flujo login → agregar transacción → verificar
  balance, incluyendo los selectores correctos (`getByLabel`, `getByTestId`).
- El segundo test E2E de credenciales incorrectas.
- Los tests de `formatCurrency` (el caso de 0 y el separador de miles).
- Las correcciones al pipeline de CI (el bug de `working-directory` en el job
  de deploy antes del checkout).

**Qué modificamos y por qué:**
- Ajustamos los valores de prueba en `txs` para que los números tuvieran sentido
  (1000 de ingreso, 400 de egresos → balance 600) y fueran fáciles de verificar
  mentalmente.
- Renombramos los tests para que el mensaje de fallo fuera descriptivo en español
  (consistente con el resto de la documentación del proyecto).
- El selector del E2E usaba inicialmente `getByRole('combobox', { name: 'Tipo' })`
  que no funcionaba porque el select no tiene un label asociado; lo cambiamos a
  `getByRole('combobox').first()`.
- Revisamos que las assertions del E2E (`toContainText('50.000')`) coincidieran
  con el formato real de `formatCurrency` (separador de miles con punto en es-AR).

Cada línea de test generada fue revisada y probada localmente antes de commitear.

## 8. Limitaciones y deuda técnica

- **Persistencia**: las transacciones viven en memoria; al recargar la página se
  pierden. Una iteración siguiente agregaría localStorage o un backend.
- **Auth**: login simulado con credenciales fijas, sin backend ni JWT. Suficiente
  para el TP pero no apto para producción.
- **Cobertura de UI**: no testeamos los componentes de React con Testing Library
  (solo la lógica). El flujo de UI queda cubierto de punta a punta por el E2E,
  pero cambios en el JSX sin cambios en la lógica podrían no ser detectados.
- **Un solo usuario demo**: extender a múltiples usuarios requeriría un backend.
- **E2E solo en Chromium**: no validamos Firefox ni Safari por tiempo. En un
  proyecto real agregaríamos los otros browsers del playwright.config.ts.
