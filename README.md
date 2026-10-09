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

* Node.js 20+
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
npm install
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
Backend checks in the PHP project: `php Tests/Api/PhoneAuthTest.php`,
`php Tests/Api/SmsAeroClientTest.php`, `php Tests/Api/EmailRegistrationTest.php`.
These tests stub SMS Aero, email, CRM and database calls; they do not send messages.

Before deploying changes, verify that the production build completes successfully:

```bash
npm run build
```

If linting is configured:

```bash
npm run lint
```
