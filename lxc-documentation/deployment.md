# Deployment

This document explains the current deployment approach for the MyHealthHub
ecosystem, with Hostinger as the backend target and GitHub as the source of
truth for code.

## Deployment Model

The system is deployed in two parts:

1. Mobile app builds are generated for Android and iOS.
2. The backend API is deployed as a Node.js app on Hostinger.

The backend API acts as the controlled integration point for external services.

## Backend Deployment Target

| Item | Value |
|---|---|
| Platform | Hostinger |
| App Type | Node.js web app |
| Recommended Runtime | Node.js 20.x |
| Current API Domain | `apis.lexvoraconsulting.com` |
| Common API Root | `/v1` |

## Deployment Responsibilities

### Mobile

- Build release APKs or iOS builds.
- Keep app credentials out of the repository.
- Point the app to the correct API base URL.
- Validate the UI against the target device classes.

### Backend

- Keep WeatherAPI.com keys server-side.
- Normalize provider data before returning it to the app.
- Expose Swagger/OpenAPI docs for testing.
- Maintain a health endpoint for deployment checks.
- Provide fallback behavior for location and weather lookup.

## Environment Variables

The backend should document variables, but production secrets must stay in the
Hostinger environment UI.

Typical entries:

| Variable | Purpose |
|---|---|
| `PORT` | Server listen port |
| `DEFAULT_WEATHER_CITY` | Fallback city such as Dubai |
| `WEATHER_WEATHERAPI_FORECASTV1_BASE_URL` | Provider base URL |
| `WEATHER_WEATHERAPI_FORECASTV1_API_KEY` | WeatherAPI.com token |
| `HOSTINGER_API_TOKEN` | Optional automation token |
| `HOSTINGER_APP_ID` | Optional automation identifier |

## Release Flow

Recommended sequence:

1. Finish implementation in a feature branch.
2. Run checks locally.
3. Commit and push to GitHub.
4. Generate the required release archive if Hostinger upload requires it.
5. Update Hostinger environment variables.
6. Deploy or redeploy the backend.
7. Test the health endpoint and Swagger UI.
8. Verify the mobile app against the deployed API.

## Build Artifacts

| Artifact | Purpose |
|---|---|
| Android release APK | Installable production or staging build |
| iOS release build | App Store or ad hoc delivery |
| API archive | Hostinger upload package if needed |
| Docs README | Human-readable reference for future changes |

## Verification Checklist

- API health endpoint responds
- Swagger UI loads
- Weather endpoint returns a normalized response
- Fallback city works when location lookup fails
- Mobile app can call the deployed API successfully

## Secrets Policy

Never commit:

- API keys
- Access tokens
- Hosting passwords
- Private service credentials

Use:

- Hostinger environment variables for production
- Local `.env` files for development
- Example files with placeholder values only

## Related Docs

- [README](./README.md)
- [architecture](./architecture.md)
- [compatibility](./compatibility.md)
- [release-runbook](./release-runbook.md)
