import {useQuery} from '@tanstack/react-query';
import {
  getAppointments,
  getPrescriptions,
  getRecords,
  getVitals,
} from '../api/healthService';

export function useAppointments() {
  return useQuery({queryKey: ['appointments'], queryFn: getAppointments});
}

export function useRecords() {
  return useQuery({queryKey: ['records'], queryFn: getRecords});
}

export function usePrescriptions() {
  return useQuery({queryKey: ['prescriptions'], queryFn: getPrescriptions});
}

export function useVitals() {
  return useQuery({queryKey: ['vitals'], queryFn: getVitals});
}
