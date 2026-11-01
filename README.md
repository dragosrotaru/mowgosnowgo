# MowGoSnowGo

An on-demand yard-services app I built in 2018-2019 as a client project for MowGoSnowGo, a landscaping and snow-removal company in Ontario. Customers booked grass cutting, snow removal, yard clean-ups and similar jobs from their phone. The company approved, scheduled and billed them through an email-driven back office.

The app shipped to the App Store and Google Play and ran in production. **The business and all of its infrastructure have since shut down.** This repository is a cleaned-up snapshot of the final code, published as a portfolio piece. It isn't maintained, and it won't run on today's toolchains without upgrades.

## What it does

**Customers** (React Native app, iOS and Android)
- Sign up with email or Facebook, and reset a forgotten password by email
- Request a service: pick the type, address (Google Places autocomplete, limited to a 30 km service radius), date and notes, then see the price with tax
- Save a card once; it's charged only when the job is completed
- Track, view and cancel requests

**The company** (no admin app needed)
- Each new request is emailed to the operator with signed one-click links to approve, deny, complete or cancel it ([`api/src/admin.js`](api/src/admin.js), [`api/src/modules/service/`](api/src/modules/service))
- Every status change emails the customer from HTML templates

## Technical highlights

- **Deferred payments with Stripe.** The card is captured as a Stripe customer and source at booking time, and the charge happens when the job is marked complete. Late cancellations automatically incur a fee ([`api/src/modules/service/resolvers.js`](api/src/modules/service/resolvers.js), [`api/src/payments.js`](api/src/payments.js)).
- **Email-driven back office.** Admin actions are mutations authorized by JWT-signed tokens embedded in emailed links, so the operator could run the business from their inbox with no separate admin UI.
- **Facebook login.** Tokens are verified server-side against the Graph API before an account is created or linked, and there's the data-deletion page Facebook requires ([`api/src/modules/user/resolvers.js`](api/src/modules/user/resolvers.js), [`api/src/facebookDataDeleteConfirmation.js`](api/src/facebookDataDeleteConfirmation.js)).
- **GraphQL end to end.** An Express and express-graphql API over Sequelize and Postgres (with migrations), consumed by Apollo Client in the app.
- **Production operations.** Deployed with PM2 in cluster mode behind NGINX, with the app published to both stores through Expo.

## Stack

| | |
|---|---|
| Mobile | React Native, Expo, Apollo Client, Google Places |
| API | Node.js, Express, GraphQL, Sequelize, PostgreSQL, PM2 |
| Services | Stripe, SendGrid, Facebook Login |

## Layout

```
api/
  src/modules/user      sign-up, login, password reset, emails
  src/modules/service   service requests, pricing, status workflow, emails
  src/admin.js          one-click admin actions from emailed links
  src/payments.js       Stripe card capture page
  src/migrations        database schema
  src/seeders           development seed data (example users only)
mobile/
  src/modules           screens: sign-up, booking, service list and details, account, ...
  src/config.js         service catalogue, pricing, service area
```

## Running it locally

These instructions are kept for reference; the 2018-era dependencies (Babel 6, the Expo SDK of the time) need updating before it will build.

```bash
# API
cd api
# set the environment variables listed in .env.example (your own Stripe, SendGrid and database values)
npm run setup               # install, migrate, seed
npm run dev

# Mobile
cd mobile
npm install
# set `api` and `googlePlacesApiKey` in src/config.js, then start with Expo
```

## Notes

- All keys, passwords and real user data have been removed. Configuration comes from environment variables (see [`api/.env.example`](api/.env.example)).
- The original history isn't included. This is a single snapshot of the final production version.
- The API began from the open-source [crate](https://github.com/atulmy/crate) starter (MIT).
