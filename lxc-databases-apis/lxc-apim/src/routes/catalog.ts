import {Router} from 'express';
import {pool} from '../config/db.js';
import {env} from '../config/env.js';
import {requireAuth} from '../middleware/auth.js';

export const catalogRouter = Router();

type CatalogEndpoint = {
  id: string;
  method: string;
  path: string;
  displayName: string;
  summary: string;
  description: string;
  details: string[];
  version: string;
  auth: string;
  environment: string;
};

type CatalogGroup = {
  id: string;
  name: string;
  description: string;
  countLabel: string;
  icon: string;
  endpoints: CatalogEndpoint[];
};

catalogRouter.get('/catalog', requireAuth, async (req, res) => {
  let dbError: string | null = null;

  try {
    await pool.query('SELECT 1');
  } catch (error) {
    dbError = error instanceof Error ? error.message : 'Unknown database error';
  }

  const groups: CatalogGroup[] = [
    {
      id: 'health',
      name: 'Health',
      description: 'System and uptime endpoints.',
      countLabel: '1 API',
      icon: '♥',
      endpoints: [
        {
          id: 'health-check',
          method: 'GET',
          path: '/v1/health',
          displayName: 'Health Check',
          summary: 'Health check for v1',
          description: 'Service is healthy',
          details: ['Docs: /openapi.json', 'Used for liveness checks'],
          version: 'v1.0.0',
          auth: 'None',
          environment: env.apimEnv === 'local' ? 'Local' : 'Production',
        },
      ],
    },
    {
      id: 'weather',
      name: 'Weather',
      description: 'Current weather lookup endpoints.',
      countLabel: '1 API',
      icon: '☁',
      endpoints: [
        {
          id: 'weather-today',
          method: 'GET',
          path: '/v1/weather/today',
          displayName: 'Current Weather',
          summary: 'Get current weather for v1 using q or coordinates',
          description: 'Current weather summary',
          details: ['Query: q, lat, lon, city', 'Falls back to default city when needed'],
          version: 'v1.0.0',
          auth: 'None',
          environment: env.apimEnv === 'local' ? 'Local' : 'Production',
        },
      ],
    },
    {
      id: 'doctors',
      name: 'Doctors API',
      description: 'Doctors profile, search, and scheduling endpoints.',
      countLabel: '3 APIs',
      icon: '◌',
      endpoints: [
        {
          id: 'doctor-search',
          method: 'GET',
          path: '/v1/doctors/search',
          displayName: 'Doctor Search API',
          summary: 'Search doctors by name or specialization',
          description: 'Find doctors by specialty, location, or name.',
          details: ['Query: name, specialization, location', 'Supports grouped search and filters'],
          version: 'v1.0.0',
          auth: 'OAuth 2.0',
          environment: env.apimEnv === 'local' ? 'Local' : 'Production',
        },
        {
          id: 'doctor-profile',
          method: 'GET',
          path: '/v1/doctors/{doctorId}/profile',
          displayName: 'Doctor Profile API',
          summary: 'Retrieve detailed doctor profile',
          description: 'Doctor credentials, specialties, and service details.',
          details: ['Path: doctorId', 'Detailed profile and credentials'],
          version: 'v1.1.0',
          auth: 'OAuth 2.0',
          environment: env.apimEnv === 'local' ? 'Local' : 'Production',
        },
        {
          id: 'doctor-appointments',
          method: 'GET',
          path: '/v1/doctors/{doctorId}/availability',
          displayName: 'Appointment Availability API',
          summary: 'Check appointment availability',
          description: 'Real-time booking slots and working hours.',
          details: ['Path: doctorId', 'Availability and schedule checks'],
          version: 'v1.0.3',
          auth: 'OAuth 2.0',
          environment: env.apimEnv === 'local' ? 'Local' : 'Production',
        },
      ],
    },
    {
      id: 'medicines',
      name: 'Medicines API',
      description: 'Medicine search, interaction, and prescription support.',
      countLabel: '3 APIs',
      icon: '◌',
      endpoints: [
        {
          id: 'medicine-search',
          method: 'GET',
          path: '/v1/medicines/search',
          displayName: 'Medicine Search API',
          summary: 'Search medicines by name or brand',
          description: 'Lookup medications by name, brand, or composition.',
          details: ['Query: name, brand, composition', 'Supports medicine directory search'],
          version: 'v1.3.0',
          auth: 'OAuth 2.0',
          environment: env.apimEnv === 'local' ? 'Local' : 'Production',
        },
        {
          id: 'medicine-interactions',
          method: 'GET',
          path: '/v1/medicines/interactions',
          displayName: 'Drug Interaction API',
          summary: 'Check medicine interactions',
          description: 'Potential interactions between multiple drugs.',
          details: ['Query: drug list', 'Flags possible interactions'],
          version: 'v1.1.0',
          auth: 'OAuth 2.0',
          environment: env.apimEnv === 'local' ? 'Local' : 'Production',
        },
        {
          id: 'prescription-validation',
          method: 'POST',
          path: '/v1/medicines/prescriptions/validate',
          displayName: 'Prescription Validation API',
          summary: 'Validate prescriptions',
          description: 'Prescription format and compliance checks.',
          details: ['Body: prescription payload', 'Validates drug rules and compliance'],
          version: 'v1.0.2',
          auth: 'OAuth 2.0',
          environment: env.apimEnv === 'local' ? 'Local' : 'Production',
        },
      ],
    },
    {
      id: 'hospitals',
      name: 'Hospital and Clinics API',
      description: 'Hospitals, clinics, and location coverage endpoints.',
      countLabel: '3 APIs',
      icon: '◌',
      endpoints: [
        {
          id: 'hospital-search',
          method: 'GET',
          path: '/v1/hospitals/search',
          displayName: 'Hospital Search API',
          summary: 'Search hospitals and clinics',
          description: 'Find healthcare facilities by name or area.',
          details: ['Query: name, area, specialty', 'Facility discovery'],
          version: 'v1.0.0',
          auth: 'None',
          environment: env.apimEnv === 'local' ? 'Local' : 'Production',
        },
        {
          id: 'hospital-details',
          method: 'GET',
          path: '/v1/hospitals/{hospitalId}',
          displayName: 'Hospital Details API',
          summary: 'Get hospital details',
          description: 'Facility metadata, contacts, and services.',
          details: ['Path: hospitalId', 'Detailed facility profile'],
          version: 'v1.0.1',
          auth: 'None',
          environment: env.apimEnv === 'local' ? 'Local' : 'Production',
        },
        {
          id: 'clinic-availability',
          method: 'GET',
          path: '/v1/clinics/{clinicId}/availability',
          displayName: 'Clinic Availability API',
          summary: 'Check clinic availability',
          description: 'Working hours and live slot availability.',
          details: ['Path: clinicId', 'Availability and hours'],
          version: 'v1.0.0',
          auth: 'None',
          environment: env.apimEnv === 'local' ? 'Local' : 'Production',
        },
      ],
    },
  ];

  const selectedGroupId = typeof req.query.group === 'string' ? req.query.group : groups[0]?.id;
  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? groups[0];
  const selectedEndpointId = typeof req.query.endpoint === 'string' ? req.query.endpoint : selectedGroup?.endpoints[0]?.id;
  const selectedEndpoint = groups.flatMap((group) => group.endpoints).find((endpoint) => endpoint.id === selectedEndpointId) ?? selectedGroup?.endpoints[0];
  const baseUrl = env.apimEnv === 'local' ? 'http://localhost:3000' : 'https://api.lexvoraconsulting.com';
  const docsUrl = `${baseUrl}/openapi.json`;
  const allGroups = groups;

  res.render('catalog', {
    groups: allGroups,
    selectedGroup,
    selectedEndpoint,
    dbError,
    session: req.session,
    apimEnv: env.apimEnv,
    baseUrl,
    docsUrl,
  });
});
