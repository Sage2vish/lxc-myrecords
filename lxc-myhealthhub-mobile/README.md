# MyHealthHub Mobile App by Lexvora

![App Banner](https://via.placeholder.com/900x300.png?text=LXC+MyHealthHub)

**Your Personal Health Companion. Manage your medical records, appointments, and prescriptions with ease.**

---

## 📱 App Overview

**MyHealthHub** is a secure, patient-centric mobile application designed to give you complete control over your healthcare journey. Access your health information anytime, anywhere, and connect with your healthcare providers seamlessly.

### ✨ Key Features

-   👤 **Secure Profile:** Manage your personal and medical profile information.
-   🩺 **View Medical Records:** Access your complete health history, including diagnoses, lab results, and treatment plans.
-   📅 **Appointment Management:** Book new appointments, view upcoming visits, and check your visit history.
-   💊 **Prescription Tracking:** Keep a list of your current and past prescriptions, and set medication reminders.
-   📈 **Health Vitals:** Log and track key health metrics like blood pressure, glucose levels, and weight.
-   💬 **Secure Messaging:** (Future) Communicate directly and securely with your assigned doctors.
-   🔔 **Notifications:** Receive reminders for upcoming appointments and medication schedules.
-   🌐 **Multi-language Support:** Available in English and Hindi.

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing.

### Prerequisites

-   Node.js (v18+ recommended)
-   Yarn or npm
-   React Native CLI (`npm install -g react-native-cli`)
-   **iOS:** Xcode and CocoaPods
-   **Android:** Java JDK (v17+) and Android Studio

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd lxc-myhealthhub-mobile
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment

Create a `.env` file in the root of the project and add the necessary environment variables.

```env
# .env
API_BASE_URL=https://lexvoraconsulting.com/api/v1/myhealthhub
```

### 4. Link Native Dependencies (for iOS)

```bash
cd ios && pod install && cd ..
```

### 5. Run the Application

#### For Android

```bash
# Start the Metro server
npx react-native start

# Run on an Android emulator or connected device
npx react-native run-android
```

#### For iOS

```bash
# Start the Metro server
npx react-native start

# Run on an iOS simulator or connected device
npx react-native run-ios
```

---

## 🛠️ Tech Stack & Key Libraries

| Library                       | Purpose                               |
| ----------------------------- | ------------------------------------- |
| `react` & `react-native`      | Core application framework            |
| `@react-navigation/*`         | Screen navigation (stack, tabs, drawer) |
| `axios`                       | HTTP client for API communication     |
| `react-native-keychain`       | Secure credential storage (for tokens)  |
| `zod`                         | Schema validation for API responses   |
| `@tanstack/react-query`       | Data fetching, caching, and state management |
| `i18n-js`                     | Internationalization (EN/HI)          |
| `moment` or `date-fns`        | Date and time formatting              |
| `react-native-push-notification` | Local and remote notifications      |
| `react-native-vector-icons`   | Customizable icons                    |

---

## 🗂️ Project Structure

```
lxc-myhealthhub-mobile/
├── src/
│   ├── api/          # API service definitions, Axios instance
│   ├── assets/       # Images, fonts, and other static assets
│   ├── components/   # Reusable UI components (Button, Card, Input)
│   ├── config/       # App-wide configuration, environment variables
│   ├── hooks/        # Custom React hooks (e.g., useAuth, useApi)
│   ├── navigation/   # React Navigation navigators and routes
│   ├── screens/      # Feature-based screen components
│   ├── services/     # Business logic (auth, notifications)
│   ├── store/        # State management (Zustand, Redux, etc.)
│   ├── theme/        # Global styles, colors, typography
│   └── utils/        # Helper functions
├── .env.example      # Example environment file
├── App.tsx           # Root component of the application
└── ...               # Other config files (babel, metro, etc.)
```

---

## 🌐 API & Backend

The mobile app communicates with a secure backend API to fetch and update user data.

-   **Base URL:** `https://lexvoraconsulting.com/api/v1/myhealthhub`
-   **Authentication:** JWT (JSON Web Tokens) sent in the `Authorization` header.

### Example Endpoints

-   `POST /auth/login` - User login
-   `GET /profile` - Get user profile data
-   `GET /appointments` - Get a list of user's appointments
-   `GET /records` - Get user's medical records

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

---

## 📞 Support

For questions or support, please contact **Lexvora Consulting** at lexvoraconsulting.com.