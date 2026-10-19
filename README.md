# ProvokativeLook

Frontend application for **ProvokativeLook** built with React, TypeScript and Vite.

Production domain:

`site.provokativelook.ru`

---

## Tech Stack

* React
* TypeScript
* Vite
* SCSS
* Redux Toolkit
* RTK Query
* React Router

---

## Requirements

Before running the project locally, make sure you have installed:

* Node.js 24 LTS (the test suite uses native TypeScript support)
* npm

Check versions:

```bash
node -v
npm -v
```

---

## Installation

Install project dependencies:

```bash
npm ci
```

---

## Development

Start the development server:

```bash
npm run dev
```

Vite will start the local development server with Hot Module Replacement.

---

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```text
src/
├── api/
├── assets/
├── components/
├── helpers/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── scss/
├── store/
├── UI/
└── main.tsx
```

### Main Directories

**`api`**
API requests and RTK Query services.

**`components`**
Reusable application components and feature blocks.

**`pages`**
Application pages.

**`layouts`**
Shared page layouts.

**`store`**
Redux store and application state.

**`scss`**
Global styles, variables, mixins and shared SCSS utilities.

**`UI`**
Reusable UI components.

**`routes`**
Application routing configuration.

---

## Environment Variables

Environment-specific configuration should be stored in files such as:

```text
.env
.env.local
.env.production
```

Private API keys, access tokens, passwords and other sensitive credentials must not be committed to the repository.

Use `.env.example` to document required environment variables when necessary.

---

## Code Quality

Phone authentication uses SMS Aero Mobile ID for Russia and ordinary SMS codes for
Kazakhstan, Belarus, Armenia, Azerbaijan, Kyrgyzstan, Moldova, Tajikistan,
Turkmenistan and Uzbekistan. Routing is enforced by the PHP API using the number;
Kazakhstan's `+70`, `+76` and `+77` ranges are separate from Russian `+7` numbers.
New phone accounts still require email after phone verification. Email/password
registration is a fallback and verifies email before creating an account; a phone
can then be linked through the verified phone-change flow in the profile.

Deploy the corresponding `local/api/site` PHP changes and
`local/Application/Common/Crm/Bitrix24ContactService.php` together with the frontend.
SMS Aero credentials stay on the server in `smsaero.local.php`. The optional
`smsSign` setting selects a separate approved sender for ordinary SMS (otherwise
`sign` is used). International SMS must be available for that account and sender.

Offline phone-input checks: `node --test src/tests/phone.test.mjs`.
Backend checks in the PHP project: `php Tests/Api/AuditTest.php`,
`php Tests/Api/CatalogVisibilityAuditTest.php`, `php Tests/Api/FeaturedCatalogTest.php`,
`php Tests/Api/CatalogBatchTest.php`, `php Tests/Api/CatalogPurchasableTest.php`.
These tests stub SMS Aero, email, CRM and database calls; they do not send messages.

Before deploying changes, run:

```bash
npm run check
```

This runs ESLint with zero warnings, checks formatting, runs offline unit tests,
and builds the production bundle in `dist/`. Use `npm run format` to apply
ESLint fixes and Prettier formatting. Source comments have been removed; strings,
URLs and TypeScript declarations are preserved.

Run the isolated PHP integration tests from PowerShell:

```powershell
$env:SITE_BACKEND_ROOT = 'D:\Work\Провокация\local'
npm run test:integration
```

These tests exercise real PHP controllers and services with isolated storage,
mail, SMS and payment boundaries. They do not create real orders or send messages.
The runner starts and stops its own PHP servers. PHP must be on PATH.

Read-only production API smoke tests are opt-in:

```powershell
$env:RUN_API_SMOKE = '1'
node --test src/tests/apiReadSmoke.test.mjs
```

To preview the actual production build locally with the allowed API origin:

```bash
npm run preview -- --host 127.0.0.1 --port 5173 --strictPort
```

Only run one server on port 5173. The production frontend calls the configured
HTTPS API directly; the development server uses a TLS-verified API proxy.

Deploy `dist/` as static files with an SPA fallback to `index.html`.
Serve HTML without long-lived caching; hashed assets can use immutable caching.
Deploy the PHP API changes together, especially `index.php`,
`repositories/CatalogRepository.php`, `services/CatalogService.php` and
`mappers/CatalogMapper.php`. Deploy `controllers/CatalogController.php` too.
Catalog reads now load properties, offers, stock
and prices in bounded batches within each request, preserving live data.
API writes reject untrusted browser origins before Bitrix bootstrap.
Public catalog/content reads release the PHP session lock before expensive work.

Featured carousels request `catalog/featured&type=new&limit=10` or
`type=bestsellers&limit=10`. The response includes `pagination.hasMore` and
`pagination.nextCursor`. Pass the cursor unchanged to fetch the next page.
The backend uses bounded Bitrix queries and stable sort keys, skips products
without available stock, positive prices or photos, and scans at most 200
candidates per request. An empty partial page may still have a continuation.
No exact total is calculated on this path. Deploy the PHP changes before or
together with `dist/`; the earlier API does not return continuation metadata.

The frontend appends ten products near the end of the loaded carousel, retains
scroll position, shares concurrent page requests and offers a retry after errors.
Search suggestions reuse the first bestseller page without fetching the rest.
Run `php Tests/Api/FeaturedPaginationTest.php` in the PHP project to verify
page boundaries, visibility gaps, sort ties, cursor validation and bounded work.

See `production-audit.txt` for measured timings, validation and remaining release work.
