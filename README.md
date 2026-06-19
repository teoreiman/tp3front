# FinTrack — TP3 Calidad y Automatización (CI/CD)

Aplicación de finanzas personales (continuación del TP2) con un **pipeline de
calidad** que valida y despliega automáticamente cada cambio: `lint → tests →
e2e → build → deploy`.

## 🌐 URL de producción

La app se despliega en **Vercel** automáticamente en cada push a `main`:

> **https://TU-PROYECTO.vercel.app**
>
> ⚠️ Reemplazar por la URL real del proyecto en Vercel (Dashboard de Vercel →
> Settings → Domains).

## 🧱 Estructura del repositorio

```
.
├── .github/workflows/ci.yml   # Pipeline CI/CD (GitHub Actions)
├── CALIDAD.md                 # Documentación de calidad (estrategia, tests, pipeline)
├── vercel.json                # Config de hosting (SPA rewrites)
└── tp3front/                  # Aplicación (React + TypeScript + Vite)
    ├── src/                   # Código fuente
    │   ├── lib/               # Lógica de negocio (finance.ts) + tests unitarios
    │   └── components/        # Componentes de UI
    ├── e2e/                   # Tests E2E (Playwright)
    ├── playwright.config.ts   # Config de Playwright
    └── vitest.config.ts       # Config de Vitest
```

> La app vive en `tp3front/`; todos los comandos de npm se corren dentro de esa carpeta.

## 🚀 Desarrollo local

```bash
cd tp3front
npm ci                 # instalar dependencias
npm run dev            # servidor de desarrollo

npm run lint           # ESLint
npm run test           # tests unitarios (Vitest)
npm run coverage       # tests unitarios + reporte de cobertura
npm run test:e2e       # tests E2E (Playwright; descarga el navegador la 1ª vez)
npm run build          # build de producción
```

Credenciales de la demo: usuario `demo` / contraseña `demo1234`.

## 🔄 Pipeline CI/CD

Definido en [`.github/workflows/ci.yml`](.github/workflows/ci.yml). Se dispara en
cada **push** o **pull request** a `main` y ejecuta los jobs en secuencia:

`lint` → `test` → `e2e` → `build` → `deploy`

Cada job depende del anterior (`needs:`), por lo que el **deploy a producción solo
ocurre si lint, tests, e2e y build pasaron**. Además, el deploy corre únicamente
en **push a `main`** (no en PRs). El detalle de las decisiones de diseño está en
[`CALIDAD.md`](CALIDAD.md).

## 🌿 Convención de ramas (branch naming)

Ningún cambio se mergea directo a `main`. Todo pasa por un Pull Request que
referencia su issue (ej. `closes #12`) y debe ser revisado y aprobado por el otro
integrante antes de mergear.

| Prefijo     | Uso                                   | Ejemplo                       |
|-------------|---------------------------------------|-------------------------------|
| `feature/`  | Nueva funcionalidad                   | `feature/budget-alert`        |
| `fix/`      | Corrección de un bug                  | `fix/balance-negativo`        |
| `chore/`    | Configuración / mantenimiento / CI    | `chore/playwright-config`     |
| `docs/`     | Documentación                         | `docs/calidad-md`             |

Convención de ramas: `<prefijo>/<descripcion-corta-en-kebab-case>`.

## 📋 Flujo de trabajo en GitHub

1. **Issue** por cada funcionalidad, mejora o bug (título descriptivo, descripción
   breve, asignado a un integrante).
2. **Rama** siguiendo la convención de arriba.
3. **Pull Request** que referencia el issue (`closes #N`), con al menos un
   comentario de revisión real del otro integrante.
4. **Merge** a `main` solo con el PR aprobado y el pipeline en verde.
