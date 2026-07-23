// ============================================================================
// FILE        : react-native-config.d.ts
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Type declaration for the react-native-config module's
//               Config export (API_BASE_URL), used by api/client.ts.
// ============================================================================

declare module 'react-native-config' {
  const Config: {
    API_BASE_URL?: string;
  };

  export default Config;
}
