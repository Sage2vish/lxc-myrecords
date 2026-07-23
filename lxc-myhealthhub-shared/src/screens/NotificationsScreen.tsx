// ============================================================================
// FILE        : NotificationsScreen.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Notifications list screen (mock in-app notifications —
//               appointment reminders, lab results, prescription refills).
// ============================================================================

import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Card} from '../components/Card';
import {ListRow} from '../components/ListRow';
import {Screen} from '../components/Screen';
import {SectionHeader} from '../components/SectionHeader';
import {colors} from '../theme/colors';

const notifications = [
  {
    id: 'n1',
    title: 'Appointment Reminder',
    detail: 'Your visit with Dr. Ananya Sharma is tomorrow at 11:30 AM.',
    meta: '2h ago',
  },
  {
    id: 'n2',
    title: 'Lab Results Ready',
    detail: 'Your recent blood test results have been uploaded to your vault.',
    meta: '5h ago',
  },
  {
    id: 'n3',
    title: 'Prescription Refill',
    detail: 'Metformin 500mg is due for a refill in 3 days.',
    meta: '1d ago',
  },
  {
    id: 'n4',
    title: 'Vaccination Due',
    detail: "Aarav's next vaccination is scheduled for next week.",
    meta: '2d ago',
  },
  {
    id: 'n5',
    title: 'Health Tip',
    detail: 'Stay hydrated — aim for 8 glasses of water today.',
    meta: '3d ago',
  },
];

export function NotificationsScreen() {
  const navigation = useNavigation();

  return (
    <Screen>
      <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
        <Text style={styles.back}>‹ Back</Text>
      </Pressable>
      <SectionHeader title="Notifications" subtitle="Updates on appointments, records, and reminders." />
      <Card>
        {notifications.map(notification => (
          <ListRow
            key={notification.id}
            title={notification.title}
            detail={notification.detail}
            meta={notification.meta}
          />
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
