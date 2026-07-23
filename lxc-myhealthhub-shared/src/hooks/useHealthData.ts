// ============================================================================
// FILE        : useHealthData.ts
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : React Query hooks (useAppointments/useRecords/
//               usePrescriptions/useVitals) wrapping api/healthService.ts
//               for screens to consume.
// ============================================================================

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
