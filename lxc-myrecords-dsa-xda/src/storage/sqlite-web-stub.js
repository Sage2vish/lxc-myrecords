// ============================================================================
// FILE        : sqlite-web-stub.js
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : No-op stub for react-native-sqlite-storage on the web build,
//               aliased in webpack.config.js so database.js's SQLite import
//               resolves without a native module.
// ============================================================================

// No-op stub for react-native-sqlite-storage on web
const SQLite = {
  enablePromise: () => {},
  openDatabase: () => Promise.resolve(null),
};
export default SQLite;
