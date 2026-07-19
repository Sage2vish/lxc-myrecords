import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Text} from 'react-native';
import {HomeScreen} from '../screens/HomeScreen';
import {RecordsScreen} from '../screens/RecordsScreen';
import {AppointmentsScreen} from '../screens/AppointmentsScreen';
import {PrescriptionsScreen} from '../screens/PrescriptionsScreen';
import {VitalsScreen} from '../screens/VitalsScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {colors} from '../theme/colors';

export type RootTabParamList = {
  Home: undefined;
  Records: undefined;
  Appointments: undefined;
  Prescriptions: undefined;
  Vitals: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const icons: Record<keyof RootTabParamList, string> = {
  Home: '⌂',
  Records: '□',
  Appointments: '◴',
  Prescriptions: '+',
  Vitals: '♡',
  Profile: '○',
};

function TabIcon({color, icon}: {color: string; icon: string}) {
  return <Text style={[styles.tabIcon, {color}]}>{icon}</Text>;
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
});

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerStyle: {backgroundColor: colors.surface},
        headerTitleStyle: {color: colors.text, fontWeight: '700'},
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIcon: ({color}) => <TabIcon color={color} icon={icons[route.name]} />,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Records" component={RecordsScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Prescriptions" component={PrescriptionsScreen} />
      <Tab.Screen name="Vitals" component={VitalsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
