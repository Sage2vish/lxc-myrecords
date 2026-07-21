import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Text, View} from 'react-native';
import {HomeScreen} from '../screens/HomeScreen';
import {RecordsScreen} from '../screens/RecordsScreen';
import {AppointmentsScreen} from '../screens/AppointmentsScreen';
import {PrescriptionsScreen} from '../screens/PrescriptionsScreen';
import {VitalsScreen} from '../screens/VitalsScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {ScheduleVisitScreen} from '../screens/ScheduleVisitScreen';
import {NotificationsScreen} from '../screens/NotificationsScreen';
import {colors} from '../theme/colors';

export type RootTabParamList = {
  Home: undefined;
  Records: undefined;
  Appointments: undefined;
  Prescriptions: undefined;
  Vitals: undefined;
  Profile: undefined;
  ScheduleVisit: undefined;
  Notifications: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const icons: Record<keyof RootTabParamList, string> = {
  Home: '⌂',
  Records: '▣',
  Appointments: '+',
  Prescriptions: '℞',
  Vitals: '♡',
  Profile: '☰',
  ScheduleVisit: '⏳',
  Notifications: '🔔',
};

function TabIcon({color, icon, focused, routeName}: {color: string; icon: string; focused: boolean; routeName: keyof RootTabParamList}) {
  if (routeName === 'Appointments') {
    return (
      <View style={styles.addTab}>
        <Text style={styles.addTabText}>+</Text>
      </View>
    );
  }

  return <Text style={[styles.tabIcon, focused && styles.tabIconActive, {color}]}>{icon}</Text>;
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 22,
    lineHeight: 24,
  },
  tabIconActive: {
    fontWeight: '900',
  },
  addTab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.34,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 8},
    elevation: 8,
  },
  addTabText: {
    color: '#fff',
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '300',
  },
  hiddenTab: {
    flex: 0,
    width: 0,
    padding: 0,
  },
});

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800',
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 76,
          paddingBottom: 12,
          paddingTop: 10,
          justifyContent: 'space-evenly',
          shadowColor: colors.shadow,
          shadowOpacity: 0.08,
          shadowRadius: 20,
          shadowOffset: {width: 0, height: -8},
          elevation: 12,
        },
        tabBarIcon: ({color, focused}) => (
          <TabIcon color={color} focused={focused} icon={icons[route.name]} routeName={route.name} />
        ),
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Vitals" component={VitalsScreen} options={{tabBarLabel: 'Health'}} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} options={{tabBarLabel: ''}} />
      <Tab.Screen name="Records" component={RecordsScreen} options={{tabBarLabel: 'Vault'}} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{tabBarLabel: 'More'}} />
      <Tab.Screen
        name="Prescriptions"
        component={PrescriptionsScreen}
        options={{tabBarButton: () => null, tabBarItemStyle: styles.hiddenTab}}
      />
      <Tab.Screen
        name="ScheduleVisit"
        component={ScheduleVisitScreen}
        options={{tabBarButton: () => null, tabBarItemStyle: styles.hiddenTab}}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{tabBarButton: () => null, tabBarItemStyle: styles.hiddenTab}}
      />
    </Tab.Navigator>
  );
}
