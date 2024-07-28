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

- MongoDB
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

## Authentication

- AccessToken (1 hour)
- RefreshToken (30 days)

### User login and refresh token

- The current authentication flow allows the same user logins in on multiple devices to generate multiple refresh token.
- Every time the refresh token is used to refresh an access token, the api will destroy the given one and generate a new one.
- Refresh token is returned in cookie with `httOnly`, `samesite` (if cross domain), `secure` (production mode), and `expiresAt` flag.
- The business logic can be updated at `AuthService#refreshToken`.

### Authentication Guard

- Guard endpoints require HTTP request with header `Authorization: Bearer $ACCESS_JWT_TOKEN`.

### Forgot password

- [MailCatcher](https://mailcatcher.me/) is used for local dev and check email output
- By default setup, email sent can be checked at `http://localhost:1080` from mail catcher web UI.
