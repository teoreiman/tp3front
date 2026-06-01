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
finance.test.ts:
- calculateBalance: resta egresos de ingresos (cálculo central).
- calculateBalance con lista vacía: caso borde, debe dar 0.
- totalByType: suma solo el tipo pedido.
- groupByCategory: agrupa egresos por categoría e ignora ingresos.
- budgetStatus: los 3 estados (ok / warning / exceeded) + presupuesto 0.

## 4. Casos de uso críticos
1. Cálculo del balance: es el número que guía las decisiones del usuario.
2. Login + alta de transacción: camino mínimo de valor, cubierto por el E2E.

## 5. Pipeline de CI/CD
En .github/workflows/ci.yml, se dispara en cada push/PR a main. El deploy corre
SOLO en push a main. 

## 6. Limitaciones y deuda técnica
- Persistencia: las transacciones viven en memoria. al recargar se pierden.
- Auth: login simulado con credenciales fijas, sin back.
- Cobertura: testeo de src/lib, no los componentes.