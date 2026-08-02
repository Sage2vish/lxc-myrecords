export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'LXC Health API',
    version: '1.0.0',
    description: 'Hostinger-ready Node API for MyHealthHub weather integration. Working standard recorded on 2026-07-25.',
  },
  servers: [
    {
      url: 'https://api.lexvoraconsulting.com',
      description: 'Production',
    },
    {
      url: 'http://localhost:3000',
      description: 'Local development',
    },
  ],
  tags: [
    {name: 'Health'},
    {name: 'Weather'},
    {name: 'Doctors'},
  ],
  paths: {
    '/v1/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check for v1',
        responses: {
          200: {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: {type: 'boolean'},
                    version: {type: 'string'},
                  },
                  required: ['ok', 'version'],
                },
              },
            },
          },
        },
      },
    },
    '/v1/weather/today': {
      get: {
        tags: ['Weather'],
        summary: 'Get current weather for v1 using q or coordinates',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: false,
            schema: {type: 'string', example: '25.2048,55.2708'},
            description: 'WeatherAPI q parameter. Can be lat,lon or city.',
          },
          {
            name: 'lat',
            in: 'query',
            required: false,
            schema: {type: 'number', example: 25.2048},
            description: 'Latitude. Used when q is not supplied.',
          },
          {
            name: 'lon',
            in: 'query',
            required: false,
            schema: {type: 'number', example: 55.2708},
            description: 'Longitude. Used when q is not supplied.',
          },
          {
            name: 'city',
            in: 'query',
            required: false,
            schema: {type: 'string', example: 'Dubai'},
            description: 'Fallback city name if q and coordinates are unavailable.',
          },
        ],
        responses: {
          200: {
            description: 'Current weather summary',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    requestedLocation: {type: 'object'},
                    version: {type: 'string'},
                    city: {type: 'string'},
                    region: {type: 'string'},
                    country: {type: 'string'},
                    tempC: {type: 'number'},
                    feelsLikeC: {type: 'number'},
                    condition: {type: 'string'},
                    conditionCode: {type: 'number'},
                    icon: {type: 'string'},
                    isDay: {type: 'boolean'},
                    localtime: {type: 'string'},
                    source: {type: 'string'},
                  },
                  required: ['requestedLocation', 'version', 'city', 'tempC', 'condition', 'source'],
                },
              },
            },
          },
        },
      },
    },
    '/v1/doctors/search': {
      get: {
        tags: ['Doctors'],
        summary: 'Search doctors by name, specialization, or location',
        parameters: [
          {
            name: 'name',
            in: 'query',
            required: false,
            schema: {type: 'string', example: 'Amina'},
            description: 'Matches doctor name by partial text.',
          },
          {
            name: 'specialization',
            in: 'query',
            required: false,
            schema: {type: 'string', example: 'Cardiology'},
            description: 'Matches the doctor specialization by partial text.',
          },
          {
            name: 'location',
            in: 'query',
            required: false,
            schema: {type: 'string', example: 'Dubai'},
            description: 'Matches the doctor location by partial text.',
          },
        ],
        responses: {
          200: {
            description: 'Matching doctor list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    filters: {type: 'object'},
                    count: {type: 'number'},
                    items: {type: 'array', items: {type: 'object'}},
                  },
                  required: ['filters', 'count', 'items'],
                },
              },
            },
          },
        },
      },
    },
    '/v1/doctors/{doctorId}/profile': {
      get: {
        tags: ['Doctors'],
        summary: 'Retrieve a doctor profile',
        parameters: [
          {
            name: 'doctorId',
            in: 'path',
            required: true,
            schema: {type: 'string', example: 'DOC-1001'},
            description: 'Doctor identifier.',
          },
        ],
        responses: {
          200: {
            description: 'Doctor profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    doctorId: {type: 'string'},
                    name: {type: 'string'},
                    specialization: {type: 'string'},
                    location: {type: 'string'},
                    yearsOfExperience: {type: 'number'},
                    profile: {type: 'string'},
                  },
                  required: ['doctorId', 'name', 'specialization', 'location', 'profile'],
                },
              },
            },
          },
        },
      },
    },
    '/v1/doctors/{doctorId}/availability': {
      get: {
        tags: ['Doctors'],
        summary: 'Check doctor appointment availability',
        parameters: [
          {
            name: 'doctorId',
            in: 'path',
            required: true,
            schema: {type: 'string', example: 'DOC-1001'},
            description: 'Doctor identifier.',
          },
        ],
        responses: {
          200: {
            description: 'Availability data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    doctorId: {type: 'string'},
                    available: {type: 'boolean'},
                    nextAvailableSlot: {type: 'string'},
                    schedule: {type: 'array', items: {type: 'string'}},
                  },
                  required: ['doctorId', 'available', 'nextAvailableSlot', 'schedule'],
                },
              },
            },
          },
        },
      },
    },
  },
  components: {},
} as const;
