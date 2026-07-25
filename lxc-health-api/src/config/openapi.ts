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
  },
  components: {},
} as const;
