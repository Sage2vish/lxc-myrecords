// No-op stub for react-native-sqlite-storage on web
const SQLite = {
  enablePromise: () => {},
  openDatabase: () => Promise.resolve(null),
};
export default SQLite;
