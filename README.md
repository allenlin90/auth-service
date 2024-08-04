## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Running depending services

### Production 
- MongoDB
- Redis (BullMQ, Express session store)

### Development
- Redis commander (web-based GUI client for redis)
- MailCatcher

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

---

# Features

## Bull MQ

- route: `/admin/queues`

## Authentication

- AccessToken `(1 hour)`
- RefreshToken `(30 days)`

### User login and refresh token

- The current authentication flow allows the same user logins in on multiple devices to generate multiple refresh token.
- Every time the refresh token is used to refresh an access token, the api will destroy the given one and generate a new one.
- Refresh token is returned in cookie with `httOnly`, `samesite` (if cross domain), `secure` (production mode), and `expiresAt` flag.
- The business logic can be updated at `AuthService#refreshToken`.

### Authentication Guard

- Guard endpoints require HTTP request with header `Authorization: Bearer $ACCESS_JWT_TOKEN`.

### Forgot password

- [MailCatcher](https://mailcatcher.me/) is used for local dev and check email output
- By default setup, email sent can be checked at `http://localhost:1080` (or refer to settings in `docker-compose.yml`) from mail catcher web UI.

### Queues

- A email sending job will be dispatched to BullMQ worker thread.


## 3rd party OAuth service
### Google OAuth

- Integrating using `passport`, `passport-google-oauth20`, `express-session`, `redis`, and `connect-redis`. 
- Using `redis` for session data store to re-use existing `redis` for `BullMQ`.
- Using session ID from `express-session` for `state` when initiating OAuth flow to prevent CSRF. 
- Using `express-session` in middleware to align OAuth service provider and user intention (using OAuth for sign-up or login).
  - Default user intention is `login`. 
  - Session data `ttl` is `15 mins`. 
  - Session cookie `maxAge` is `15 mins`. 

## TODOs

- [ ] Deploy to production environment. e.g. AWS, Digital Ocean.

### Admin features
- [ ] Manage users
- [ ] Manage app clients integrating auth service

### Authentication
- Integrate with `Google` OAuth
  - [x] `Google` OAuth sign-up and login flow
  - [ ] Manage access and refresh token from `Google` OAuth
    - Current implementation doesn't store and re-use tokens from `Google`

### BullMQ 
- [ ] Implement auth guard for `BullMQ` board UI in production

### Email service
- [ ] Integrate with mailing services such as `SendGrid` or `MailChimp`

### MongoDB
- Cascade actions related collections in schema hooks
  - [x] Removing `User` related records (e.g. `ResetToken` and `RefreshToken`) when a `User` is deleted. 
- [ ] Apply soft delete to all records in `mongodb`

### Performance
- [ ] Rate limiting
- [ ] Timeout with no response (5 seconds)

### Refactoring
- [ ] Move all routes and paths in constants

### Security
- Verify app client integrating with this auth service
  - [ ] White listing with `cors` settings, gateway, load balancer, or proxy
  - [ ] White listing and allowing only registered/acknowledged apps to integrate with this auth service
