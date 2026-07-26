import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../theme/colors';
import {fontSizes, fontWeights} from '../../../theme/typography';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';
import type {AppointmentPreview} from '../appointmentsData';

type Props = {
  appointment: AppointmentPreview;
  last?: boolean;
  onPress?: () => void;
};

export function AppointmentListItem({appointment, last, onPress}: Props) {
  return (
    <Pressable onPress={onPress} style={({pressed}) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.dateTile}>
        <Text style={styles.month}>{appointment.calendarMonth}</Text>
        <Text style={styles.day}>{appointment.calendarDay}</Text>
        <Text style={styles.weekday}>{appointment.calendarWeekday}</Text>
      </View>
      <View style={styles.rowIcon}>
        <Image
          source={
            appointment.gender === 'female'
              ? require('../../../../assets/doctor-female-icon.png')
              : require('../../../../assets/doctor-male-icon.png')
          }
          style={styles.iconImage}
        />
      </View>
      <View style={[styles.body, !last && styles.divider]}>
        <View style={styles.titleRow}>
          <Text style={styles.doctorName}>{appointment.name}</Text>
          <Text style={styles.time}>{appointment.time}</Text>
        </View>
        <Text style={styles.role}>{appointment.role}</Text>
        <Text style={styles.location}>⌖ {appointment.location}</Text>
        <View style={styles.footerRow}>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>Confirmed</Text>
          </View>
          <Text style={styles.date}>{appointment.date}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 9,
  },
  pressed: {
    opacity: 0.8,
  },
  dateTile: {
    alignItems: 'center',
    backgroundColor: '#FFF6FA',
    borderColor: '#F5D4E3',
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 88,
    paddingHorizontal: 8,
    width: 58,
  },
  month: {
    color: colors.accent,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.5,
  },
  day: {
    color: colors.text,
    fontSize: 21,
    fontWeight: fontWeights.bold,
    lineHeight: 23,
    marginTop: 2,
  },
  weekday: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    marginTop: 1,
  },
  rowIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    height: 46,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 46,
  },
  iconImage: {
    height: 46,
    resizeMode: 'cover',
    width: 46,
  },
  body: {
    flex: 1,
    paddingBottom: 8,
  },
  divider: {
    borderBottomColor: '#DCEBFA',
    borderBottomWidth: 1,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  doctorName: {
    color: colors.text,
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
  },
  time: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
  role: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
  location: {
    color: colors.muted,
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  date: {
    color: colors.text,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
  },
  statusPill: {
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusText: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
  },
});
