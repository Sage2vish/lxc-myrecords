// ============================================================================
// FILE        : RootNavigator.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Bottom tab navigator for MyHealthHub — the single place that
//               wires together Home, Records, Schedules, Prescriptions,
//               Vitals, Profile, and the center Add/ScheduleVisit action.
//               Styles the tab bar (icon sizes, center Add button, active/
//               inactive tint) rather than defining screen content itself.
// ============================================================================

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {TabActions} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Animated, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {HomeScreen} from '../screens/HomeScreen';
import {RecordsScreen} from '../screens/RecordsScreen';
import {AppointmentsScreen} from '../screens/AppointmentsScreen';
import {PrescriptionsScreen} from '../screens/PrescriptionsScreen';
import {VitalsScreen} from '../screens/VitalsScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {ScheduleVisitScreen} from '../screens/ScheduleVisitScreen';
import {NotificationsScreen} from '../screens/NotificationsScreen';
import {AppSettingsScreen} from '../screens/AppSettingsScreen';
import {colors} from '../theme/colors';
import {radii} from '../theme/radii';
import {theme} from '../theme/theme-common';
import type {SettingsSectionKey} from '../features/settings/settingsData';

export type RootTabParamList = {
  Home: undefined;
  Records: undefined;
  Schedules: undefined;
  Prescriptions: undefined;
  Vitals: undefined;
  Profile: undefined;
  ScheduleVisit: undefined;
  Notifications: undefined;
  Settings: {section?: SettingsSectionKey} | undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

type NavItem = {
  name: keyof RootTabParamList;
  label: string;
  screenLabel: string;
  icon: {
    active: any;
    inactive: any;
  };
  isCenterAction?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Home',
    label: 'Home',
    screenLabel: 'Home',
    icon: {
      active: require('../../assets/nav-bottom/nav-home-icon-blue.png'),
      inactive: require('../../assets/nav-bottom/nav-home-icon-pink.png'),
    },
  },
  {
    name: 'Vitals',
    label: 'Health',
    screenLabel: 'Health',
    icon: {
      active: require('../../assets/nav-bottom/nav-health-icon-blue.png'),
      inactive: require('../../assets/nav-bottom/nav-health-icon-pink.png'),
    },
  },
  {
    name: 'Schedules',
    label: 'Schedules',
    screenLabel: 'Schedules',
    icon: {
      active: require('../../assets/nav-bottom/nav-schedule-icon-blue.png'),
      inactive: require('../../assets/nav-bottom/nav-schedule-icon-pink.png'),
    },
  },
  {
    name: 'Records',
    label: 'Vault',
    screenLabel: 'Vault',
    icon: {
      active: require('../../assets/nav-bottom/nav-vault-icon-blue.png'),
      inactive: require('../../assets/nav-bottom/nav-vault-icon-pink.png'),
    },
  },
  {
    name: 'Profile',
    label: 'Reports',
    screenLabel: 'Reports',
    icon: {
      active: require('../../assets/nav-bottom/nav-reports-icon-blue.png'),
      inactive: require('../../assets/nav-bottom/nav-reports-icon-pink.png'),
    },
  },
];

function TabIcon({focused, item}: {focused: boolean; item: NavItem}) {
  return (
    <View style={styles.tabStack}>
      <View style={styles.iconBox}>
        <Image source={focused ? item.icon.active : item.icon.inactive} style={styles.navImage} />
      </View>
      <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelActive]}>{item.label}</Text>
    </View>
  );
}

function BottomTabBar({
  state,
  descriptors,
  navigation,
}: {
  state: any;
  descriptors: any;
  navigation: any;
}) {
  const visibleRoutes = useMemo(
    () => NAV_ITEMS.map(item => ({item, route: state.routes.find((candidate: any) => candidate.name === item.name)})),
    [state.routes],
  );
  const [tabWidth, setTabWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const activeIndex = visibleRoutes.findIndex(({item}) => item.name === state.routes[state.index]?.name);
    if (activeIndex < 0 || tabWidth === 0) {
      return;
    }

    Animated.spring(translateX, {
      toValue: activeIndex * tabWidth,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
      mass: 0.8,
    }).start();
  }, [state.index, state.routes, tabWidth, translateX, visibleRoutes]);

  const indicatorWidth = Math.max(tabWidth - 10, 0);
  const indicatorOffsetX = 10;

  return (
    <View
      style={styles.tabBar}
      onLayout={event => {
        const width = event.nativeEvent.layout.width;
        setTabWidth((width - 0) / visibleRoutes.length);
      }}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.activePill,
          {
            width: indicatorWidth,
            transform: [{translateX: Animated.add(translateX, new Animated.Value(indicatorOffsetX))}],
          },
        ]}
      />
      {visibleRoutes.map(({item, route}: any, index: number) => {
        if (!route || !item) {
          return null;
        }

        const focused = state.index === state.routes.findIndex((r: any) => r.key === route.key);
        const descriptor = descriptors[route.key];
        const options = descriptor.options;
        const label = item.label || options.tabBarLabel || options.title || route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.dispatch(TabActions.jumpTo(item.name));
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
          onLongPress={onLongPress}
          style={[styles.tabItem, {width: tabWidth || `${100 / visibleRoutes.length}%`}]}>
            <View style={styles.tabCell}>
              <TabIcon focused={focused} item={{...item, label}} />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 18,
    lineHeight: 20,
  },
  navImage: {
    width: theme.iconNav.size,
    height: theme.iconNav.size,
    resizeMode: 'contain',
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  tabStack: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 52,
    height: 60,
    gap: 5,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    height: 68,
    marginTop: 4,
    paddingBottom: 0,
    paddingTop: 0,
    paddingHorizontal: 4,
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: -6},
    elevation: 12,
    overflow: 'hidden',
  },
  activePill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 0,
    borderRadius: radii.slider,
    backgroundColor: '#DCEEFF',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 68,
  },
  tabCell: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarLabel: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
  },
  tabBarLabelActive: {
    color: colors.primary,
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
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarShowLabel: false,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{tabBarLabel: 'Home'}} />
      <Tab.Screen name="Vitals" component={VitalsScreen} options={{tabBarLabel: 'Health'}} />
      <Tab.Screen name="Schedules" component={AppointmentsScreen} options={{tabBarLabel: 'Schedules'}} />
      <Tab.Screen name="Records" component={RecordsScreen} options={{tabBarLabel: 'Vault'}} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{tabBarLabel: 'Reports'}} />
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
      <Tab.Screen
        name="Settings"
        component={AppSettingsScreen}
        options={{tabBarButton: () => null, tabBarItemStyle: styles.hiddenTab}}
      />
    </Tab.Navigator>
  );
}
