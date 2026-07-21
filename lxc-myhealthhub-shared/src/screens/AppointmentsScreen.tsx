import React from 'react';
import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';
import {Card} from '../components/Card';
import {ListRow} from '../components/ListRow';
import {PrimaryButton} from '../components/PrimaryButton';
import {Screen} from '../components/Screen';
import {SectionHeader} from '../components/SectionHeader';
import {useAppointments} from '../hooks/useHealthData';
import type {RootTabParamList} from '../navigation/RootNavigator';

export function AppointmentsScreen() {
  const {data = [], isLoading} = useAppointments();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  return (
    <Screen>
      <SectionHeader title="Appointments" subtitle="Manage upcoming and completed visits." />
      <PrimaryButton label="Schedule New Visit" onPress={() => navigation.navigate('ScheduleVisit')} />
      <Card>
        {isLoading ? <Text>Loading appointments...</Text> : null}
        {data.map(appointment => (
          <ListRow
            key={appointment.id}
            title={`${appointment.doctor} • ${appointment.specialty}`}
            detail={`${appointment.date} • ${appointment.location}`}
            meta={appointment.status}
          />
        ))}
      </Card>
    </Screen>
  );
}
