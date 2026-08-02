// ============================================================================
// FILE        : healthService.ts
// PROJECT     : LXC-Health
// PURPOSE     : Shared re-export of the health service layer during the move
//               into the common tree.
// ============================================================================

export {
  getAppointments,
  getPrescriptions,
  getRecords,
  getVitals,
} from '../../api/healthService';

