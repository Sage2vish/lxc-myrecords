// ============================================================================
// FILE        : ScheduleVisitScreen.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Form screen for booking a new appointment (doctor, date,
//               time, location, reason); writes the new appointment into
//               the TanStack Query cache on submit.
// ============================================================================

import React, {useState} from 'react';
import {Alert, Pressable, Text, TextInput, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useQueryClient} from '@tanstack/react-query';
import {PrimaryButton} from '../components/PrimaryButton';
import {Screen} from '../components/Screen';
import {colors} from '../theme/colors';
import type {Appointment} from '../types/health';

export const ScheduleVisitScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!doctor.trim() || !date.trim() || !time.trim() || !location.trim()) {
      Alert.alert('Missing information', 'Please fill in doctor, date, time, and location.');
      return;
    }

    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      doctor: doctor.trim(),
      specialty: reason.trim() || 'General Visit',
      date: `${date.trim()} ${time.trim()}`,
      location: location.trim(),
      status: 'Pending',
    };

    queryClient.setQueryData<Appointment[]>(['appointments'], previous =>
      previous ? [appointment, ...previous] : [appointment],
    );

    Alert.alert('Visit scheduled', 'Your appointment request has been submitted.', [
      {text: 'OK', onPress: () => navigation.goBack()},
    ]);
  };

  return (
    <Screen>
      <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
        <Text style={styles.cancel}>‹ Back</Text>
      </Pressable>
      <Text style={styles.title}>Schedule a Visit</Text>
      <TextInput
        placeholder="Doctor Name"
        value={doctor}
        onChangeText={setDoctor}
        style={styles.input}
      />
      <TextInput
        placeholder="Date (MM/DD/YYYY)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Time (HH:MM)"
        value={time}
        onChangeText={setTime}
        style={styles.input}
      />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />
      <TextInput
        placeholder="Reason for Visit"
        value={reason}
        onChangeText={setReason}
        style={[styles.input, {height: 80}]}
      />
      <PrimaryButton label="Submit" onPress={handleSubmit} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  cancel: {fontSize: 16, fontWeight: '700', color: colors.primary, marginBottom: 8},
  title: {fontSize: 24, fontWeight: '600', marginBottom: 4},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 4,
  },
});