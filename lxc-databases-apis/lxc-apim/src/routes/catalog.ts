import {Router} from 'express';
import {pool} from '../config/db.js';
import {env} from '../config/env.js';
import {requireAuth} from '../middleware/auth.js';

export const catalogRouter = Router();

type OpenApiSpec = {
  tags?: Array<{name: string}>;
  paths?: Record<string, Record<string, {tags?: string[]; summary?: string; description?: string}>>;
};

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

const fallbackGroups: CatalogGroup[] = [
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

function toGroupId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function titleFromTag(tag: string) {
  return tag;
}

function buildGroupsFromSpec(spec: OpenApiSpec): CatalogGroup[] {
  const tags = spec.tags?.map((tag) => tag.name).filter(Boolean) ?? [];
  const paths = spec.paths ?? {};
  const groups = new Map<string, CatalogGroup>();

  for (const tagName of tags) {
    groups.set(toGroupId(tagName), {
      id: toGroupId(tagName),
      name: titleFromTag(tagName),
      description: `${tagName} endpoints.`,
      countLabel: '0 APIs',
      icon: '◌',
      endpoints: [],
    });
  }

  for (const [path, operations] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(operations)) {
      const tagName = operation.tags?.[0] ?? 'API';
      const groupId = toGroupId(tagName);
      if (!groups.has(groupId)) {
        groups.set(groupId, {
          id: groupId,
          name: titleFromTag(tagName),
          description: `${tagName} endpoints.`,
          countLabel: '0 APIs',
          icon: '◌',
          endpoints: [],
        });
      }

      const group = groups.get(groupId)!;
      const endpointName =
        path.includes('weather') ? 'Current Weather' :
        path.includes('search') ? `${tagName.replace(/s$/i, '')} Search API` :
        path.includes('profile') ? `${tagName.replace(/s$/i, '')} Profile API` :
        path.includes('availability') ? 'Appointment Availability API' :
        `${tagName} API`;

      group.endpoints.push({
        id: `${groupId}-${method}-${path.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '')}`,
        method: method.toUpperCase(),
        path,
        displayName: endpointName,
        summary: operation.summary ?? endpointName,
        description: operation.description ?? operation.summary ?? endpointName,
        details: ['Source: lxc-api /openapi.json'],
        version: 'v1.0.0',
        auth: 'None',
        environment: env.apimEnv === 'local' ? 'Local' : 'Production',
      });
    }
  }

  return Array.from(groups.values()).map((group) => ({
    ...group,
    countLabel: `${group.endpoints.length} API${group.endpoints.length === 1 ? '' : 's'}`,
  }));
}

async function loadGroups() {
  const apiBaseUrl = env.apimEnv === 'local' ? 'http://localhost:3000' : 'https://api.lexvoraconsulting.com';
  try {
    const response = await fetch(`${apiBaseUrl}/openapi.json`, {headers: {accept: 'application/json'}});
    if (!response.ok) {
      throw new Error(`OpenAPI fetch failed (${response.status})`);
    }

    const spec = (await response.json()) as OpenApiSpec;
    const groups = buildGroupsFromSpec(spec).filter((group) => group.endpoints.length > 0);
    return groups.length > 0 ? groups : fallbackGroups;
  } catch {
    return fallbackGroups;
  }
}

catalogRouter.get('/catalog', requireAuth, async (req, res, next) => {
  let dbError: string | null = null;

  try {
    await pool.query('SELECT 1');
  } catch (error) {
    dbError = error instanceof Error ? error.message : 'Unknown database error';
  }

  try {
    const groups = await loadGroups();
    const selectedGroupId = typeof req.query.group === 'string' ? req.query.group : groups[0]?.id;
    const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? groups[0];
    const selectedEndpointId = typeof req.query.endpoint === 'string' ? req.query.endpoint : selectedGroup?.endpoints[0]?.id;
    const selectedEndpoint = groups.flatMap((group) => group.endpoints).find((endpoint) => endpoint.id === selectedEndpointId) ?? selectedGroup?.endpoints[0];
    const baseUrl = env.apimEnv === 'local' ? 'http://localhost:3000' : 'https://api.lexvoraconsulting.com';
    const docsUrl = `${baseUrl}/openapi.json`;

    res.render('catalog', {
      groups,
      selectedGroup,
      selectedEndpoint,
      dbError,
      session: req.session,
      apimEnv: env.apimEnv,
      baseUrl,
      docsUrl,
    });
  } catch (error) {
    next(error);
  }
});
