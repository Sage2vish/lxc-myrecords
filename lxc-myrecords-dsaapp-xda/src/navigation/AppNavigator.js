import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { Colors } from '../theme';

import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import PatientsScreen from '../screens/Patients/PatientsScreen';
import DoctorsScreen from '../screens/Doctors/DoctorsScreen';
import AppointmentsScreen from '../screens/Appointments/AppointmentsScreen';
import UploadsScreen from '../screens/Uploads/UploadsScreen';
import GeoTrackingScreen from '../screens/GeoTracking/GeoTrackingScreen';
import RecordsScreen from '../screens/Records/RecordsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({ label, focused }) => (
  <Text style={{ fontSize: 10, color: focused ? Colors.accent : Colors.textMuted, marginTop: 2 }}>
    {label}
  </Text>
);

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border },
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Patients" component={PatientsScreen} />
      <Tab.Screen name="Doctors" component={DoctorsScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Uploads" component={UploadsScreen} />
      <Tab.Screen name="GeoTracking" component={GeoTrackingScreen} options={{ title: 'Geo' }} />
      <Tab.Screen name="Records" component={RecordsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
