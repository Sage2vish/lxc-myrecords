# API To-do

Branch: `lxc-api-development`

This file tracks the planned `lxc-api` buildout for the MyHealthHub API surface.
The goal is to grow this service into a consistent, grouped REST platform that
the APIM catalog can read from directly.

## Working Rules

- Build APIs in `lxc-api` first.
- Keep OpenAPI in sync with every route addition.
- Prefer shared patterns: router -> controller -> service -> validation -> response.
- Keep error payloads consistent across all groups.
- Use grouped Swagger tags so APIM can mirror the API surface cleanly.

## Batches

| Batch | Scope | Status |
|---|---|---|
| 1 | Inspect current `lxc-api` structure, framework, routing, middleware, OpenAPI setup and conventions | Done |
| 2 | Create common API architecture: route registration, controllers, services, validation, error model and Swagger grouping | Not started |
| 3 | Identity & Access APIs | In progress |
| 4 | User Profile & Family APIs | In progress |
| 5 | Health Summary APIs | In progress |
| 6 | Doctor & Provider APIs | Not started |
| 7 | Appointment APIs | Not started |
| 8 | Medicine & Prescription APIs | Not started |
| 9 | Medical Vault APIs | Not started |
| 10 | Reports & Laboratory APIs | Not started |
| 11 | Notifications APIs | Not started |
| 12 | Weather & Environment APIs | Not started |
| 13 | Consent, Privacy & Compliance APIs | Not started |
| 14 | Platform Health and Operational APIs | Not started |
| 15 | SLA metadata, rate limits, API catalogue grouping and filters | Not started |
| 16 | Tests, OpenAPI validation, cleanup and final implementation report | Not started |

## Identity & Access APIs

### Purpose

These APIs manage authentication, account security, application access, sessions,
and consent-related entry points.

### Suggested APIs

- User Registration API
- Mobile OTP API
- OTP Verification API
- Email Login API
- Google Sign-In API
- Facebook Sign-In API
- Token Refresh API
- Logout API
- Password Reset API
- Device Registration API
- Biometric Authentication API
- Session Management API
- User Consent API
- Terms Acceptance API

### Example Endpoints

- `POST /v1/auth/register`
- `POST /v1/auth/otp/request`
- `POST /v1/auth/otp/verify`
- `POST /v1/auth/login`
- `POST /v1/auth/token/refresh`
- `POST /v1/auth/logout`
- `GET /v1/auth/sessions`
- `DELETE /v1/auth/sessions/{sessionId}`

### Recommended SLA

**Platinum**

Authentication failures can prevent the entire application from functioning.

### Build Checklist

- [x] Confirm route module structure for `auth`
- [x] Define request/response contracts
- [ ] Add validation schemas
- [x] Add service layer for identity/session behavior
- [ ] Add error model and shared status responses
- [x] Add OpenAPI tags and endpoint docs
- [ ] Ensure APIM catalog can group these endpoints automatically

## User Profile & Family APIs

### Purpose

This group manages the user, dependants and people connected to the account.

### Suggested APIs

- User Profile API
- Profile Picture API
- Address API
- Emergency Contact API
- Family Member API
- Dependant Profile API
- Caregiver Access API
- Profile Sharing API
- Language and Preference API
- User Settings API

### Example Endpoints

- `GET /v1/users/me`
- `PATCH /v1/users/me`
- `GET /v1/users/me/family`
- `POST /v1/users/me/family`
- `GET /v1/profiles/{profileId}`
- `PATCH /v1/profiles/{profileId}`
- `POST /v1/profiles/{profileId}/sharing`

### Recommended SLA

**Gold**

The application should always carry a `profileId`, because the logged-in user
may be viewing their own information or a child/dependant’s information.

### Build Checklist

- [x] Confirm route module structure for `profiles`
- [x] Define request/response contracts
- [ ] Add validation schemas
- [x] Add service layer for profile/family behavior
- [ ] Add error model and shared status responses
- [x] Add OpenAPI tags and endpoint docs
- [ ] Ensure APIM catalog can group these endpoints automatically

## Health Summary APIs

### Purpose

This powers the Health area and the health overview shown on the home screen.

### Suggested APIs

- Health Summary API
- Health Condition API
- Allergy API
- Medication Summary API
- Vital Signs API
- Blood Pressure API
- Blood Glucose API
- Weight and BMI API
- Heart Rate API
- Health Risk API
- Wellness Score API
- Recent Health Activity API

### Example Endpoints

- `GET /v1/profiles/{profileId}/health-summary`
- `GET /v1/profiles/{profileId}/conditions`
- `POST /v1/profiles/{profileId}/conditions`
- `GET /v1/profiles/{profileId}/allergies`
- `GET /v1/profiles/{profileId}/vitals`
- `POST /v1/profiles/{profileId}/vitals`
- `GET /v1/profiles/{profileId}/health-score`

### Recommended SLA

**Gold**

This group contains sensitive medical data, so the catalogue should prominently display:

- Data classification
- Consent requirement
- Encryption status
- Audit logging status
- Retention policy

### Build Checklist

- [x] Confirm route module structure for `healthSummary`
- [x] Define request/response contracts
- [ ] Add validation schemas
- [x] Add service layer for health summary behavior
- [ ] Add error model and shared status responses
- [x] Add OpenAPI tags and endpoint docs
- [ ] Ensure APIM catalog can group these endpoints automatically

## Notes

- Start with the Identity & Access APIs as the first functional batch.
- Once the pattern is established, reuse it across the remaining API groups.
- Keep the APIM catalog in sync via OpenAPI rather than hardcoded catalog cards.
