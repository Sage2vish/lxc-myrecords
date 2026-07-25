# ChatGPT Context

Repository: `lxc-myrecords`

Current branch:
- `weather-api-integration`

Working plan:
- Build a Hostinger-ready Node backend in [`lxc-health-api`](./lxc-health-api/)
- Use WeatherAPI.com only from the backend
- Keep the WeatherAPI key server-side
- Have MyHealthHub call the backend for Dubai current weather
- Display the temperature below the glass slab on the right side in ruby pink, using Celsius

Key rules:
- Stay on `weather-api-integration` unless the user asks to change branches
- Do not put WeatherAPI secrets into the React Native app
- For iOS work, open the workspace, not the project file
- For Android release work, use the ABI split APK that matches the device

Useful start points:
- [`lxc-health-api/src/services/weatherapi.ts`](./lxc-health-api/src/services/weatherapi.ts)
- [`lxc-health-api/src/routes/weather.ts`](./lxc-health-api/src/routes/weather.ts)
- [`lxc-myhealthhub-shared/src/screens/HomeScreen.tsx`](./lxc-myhealthhub-shared/src/screens/HomeScreen.tsx)
