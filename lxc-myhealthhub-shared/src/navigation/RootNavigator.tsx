// ============================================================================
// FILE        : RootNavigator.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Bottom tab navigator for MyHealthHub — the single place that
//               wires together Home, Records, Appointments, Prescriptions,
//               Vitals, Profile, and the center Add/ScheduleVisit action.
//               Styles the tab bar (icon sizes, center Add button, active/
//               inactive tint) rather than defining screen content itself.
// ============================================================================

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, StyleSheet, Text, View} from 'react-native';
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

function TabIcon({
  focused,
  routeName,
}: {
  focused: boolean;
  routeName: keyof RootTabParamList;
}) {
  if (routeName === 'Appointments') {
    return (
      <View style={styles.addTab}>
        <Text style={styles.addTabText}>+</Text>
      </View>
    );
  }

  if (routeName === 'Home') {
    return (
      <View style={[styles.homeIconFrame, focused && styles.homeIconFrameActive]}>
        <Image
          source={
            focused
              ? require('../../assets/nav-bottom/nav-home-icon-blue.png')
              : require('../../assets/nav-bottom/nav-home-icon-pink.png')
          }
          style={styles.homeNavImage}
        />
        <Text style={[styles.homeNavText, focused && styles.homeNavTextActive]}>Home</Text>
      </View>
    );
  }

  if (routeName === 'Vitals') {
    return (
      <Image
        source={
          focused
            ? require('../../assets/nav-bottom/nav-health-icon-blue.png')
            : require('../../assets/nav-bottom/nav-health-icon-pink.png')
        }
        style={styles.navImage}
      />
    );
  }

  if (routeName === 'Records') {
    return (
      <Image
        source={
          focused
            ? require('../../assets/nav-bottom/nav-vault-icon-blue.png')
            : require('../../assets/nav-bottom/nav-vault-icon-pink.png')
        }
        style={styles.navImage}
      />
    );
  }

  if (routeName === 'Profile') {
    return (
      <Image
        source={
          focused
            ? require('../../assets/nav-bottom/nav-more-icon-blue.png')
            : require('../../assets/nav-bottom/nav-more-icon-pink.png')
        }
        style={styles.navImage}
      />
    );
  }

  return null;
}

function renderTabBarIcon(focused: boolean, routeName: keyof RootTabParamList) {
  return <TabIcon focused={focused} routeName={routeName} />;
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 18,
    lineHeight: 20,
  },
  navImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  homeNavImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  homeNavText: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
  },
  homeNavTextActive: {
    color: colors.primary,
  },
  homeIconFrame: {
    width: 60,
    height: 50,
    paddingHorizontal: 5,
    paddingTop: 0,
    paddingBottom: 5,
    marginTop: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(216, 224, 236, 0.85)',
    backgroundColor: '#F6FAFF',
  },
  homeIconFrameActive: {
    borderColor: 'rgba(13, 99, 183, 0.28)',
    backgroundColor: '#EEF6FF',
  },
  tabIconActive: {
    fontWeight: '900',
  },
  addTab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.34,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 6},
    elevation: 6,
  },
  addTabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
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
          fontSize: 10,
          fontWeight: '800',
          marginTop: 0,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 78,
          paddingBottom: 3,
          paddingTop: 4,
          justifyContent: 'space-evenly',
          shadowColor: colors.shadow,
          shadowOpacity: 0.08,
          shadowRadius: 16,
          shadowOffset: {width: 0, height: -6},
          elevation: 12,
        },
        tabBarIcon: ({focused}) => renderTabBarIcon(focused, route.name as keyof RootTabParamList),
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{tabBarLabel: ''}} />
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
