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
    {name: 'Identity & Access'},
    {name: 'User Profile & Family'},
    {name: 'Health Summary'},
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
    '/v1/auth/register': {
      post: {
        tags: ['Identity & Access'],
        summary: 'Register a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {type: 'string', example: 'Priya Kumar'},
                  email: {type: 'string', example: 'priya@example.com'},
                  phone: {type: 'string', example: '+971501112233'},
                  password: {type: 'string', example: 'Secret123!'},
                },
                required: ['name', 'email', 'password'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered',
            content: {
              'application/json': {
                schema: {type: 'object'},
              },
            },
          },
        },
      },
    },
    '/v1/auth/otp/request': {
      post: {
        tags: ['Identity & Access'],
        summary: 'Request a mobile OTP',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  phone: {type: 'string', example: '+971501112233'},
                },
                required: ['phone'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP request accepted',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
    },
    '/v1/auth/otp/verify': {
      post: {
        tags: ['Identity & Access'],
        summary: 'Verify a mobile OTP',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  phone: {type: 'string', example: '+971501112233'},
                  otp: {type: 'string', example: '123456'},
                },
                required: ['phone', 'otp'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OTP verified',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
    },
    '/v1/auth/login': {
      post: {
        tags: ['Identity & Access'],
        summary: 'Email login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {type: 'string', example: 'priya@example.com'},
                  password: {type: 'string', example: 'Secret123!'},
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login success',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
    },
    '/v1/auth/token/refresh': {
      post: {
        tags: ['Identity & Access'],
        summary: 'Refresh access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: {type: 'string', example: 'lxc_rt_xxx'},
                },
                required: ['refreshToken'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Token refreshed',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
    },
    '/v1/auth/logout': {
      post: {
        tags: ['Identity & Access'],
        summary: 'Logout a session',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  sessionId: {type: 'string', example: 'ses_demo'},
                },
                required: ['sessionId'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Session logged out',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
    },
    '/v1/auth/sessions': {
      get: {
        tags: ['Identity & Access'],
        summary: 'List sessions',
        responses: {
          200: {
            description: 'Active sessions',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
    },
    '/v1/auth/sessions/{sessionId}': {
      delete: {
        tags: ['Identity & Access'],
        summary: 'Delete a session',
        parameters: [
          {
            name: 'sessionId',
            in: 'path',
            required: true,
            schema: {type: 'string', example: 'ses_demo'},
          },
        ],
        responses: {
          200: {
            description: 'Session deleted',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
    },
    '/v1/users/me': {
      get: {
        tags: ['User Profile & Family'],
        summary: 'Get current user profile',
        responses: {
          200: {
            description: 'Current user profile',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
      patch: {
        tags: ['User Profile & Family'],
        summary: 'Update current user profile',
        requestBody: {
          required: true,
          content: {'application/json': {schema: {type: 'object'}}},
        },
        responses: {
          200: {
            description: 'Current user profile updated',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
    },
    '/v1/users/me/family': {
      get: {
        tags: ['User Profile & Family'],
        summary: 'List current user family members',
        responses: {
          200: {
            description: 'Family members',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
      post: {
        tags: ['User Profile & Family'],
        summary: 'Add a family member',
        requestBody: {
          required: true,
          content: {'application/json': {schema: {type: 'object'}}},
        },
        responses: {
          201: {
            description: 'Family member added',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
    },
    '/v1/profiles/{profileId}': {
      get: {
        tags: ['User Profile & Family'],
        summary: 'Get a profile by profileId',
        parameters: [
          {
            name: 'profileId',
            in: 'path',
            required: true,
            schema: {type: 'string', example: 'profile-self-001'},
          },
        ],
        responses: {
          200: {
            description: 'Profile record',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
      patch: {
        tags: ['User Profile & Family'],
        summary: 'Update a profile by profileId',
        parameters: [
          {
            name: 'profileId',
            in: 'path',
            required: true,
            schema: {type: 'string', example: 'profile-self-001'},
          },
        ],
        requestBody: {
          required: true,
          content: {'application/json': {schema: {type: 'object'}}},
        },
        responses: {
          200: {
            description: 'Profile updated',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
    },
    '/v1/profiles/{profileId}/sharing': {
      post: {
        tags: ['User Profile & Family'],
        summary: 'Create a sharing link for a profile',
        parameters: [
          {
            name: 'profileId',
            in: 'path',
            required: true,
            schema: {type: 'string', example: 'profile-child-001'},
          },
        ],
        responses: {
          200: {
            description: 'Profile sharing enabled',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
    },
    '/v1/profiles/{profileId}/health-summary': {
      get: {
        tags: ['Health Summary'],
        summary: 'Get the health summary for a profile',
        parameters: [
          {
            name: 'profileId',
            in: 'path',
            required: true,
            schema: {type: 'string', example: 'profile-self-001'},
          },
        ],
        responses: {
          200: {
            description: 'Profile health summary',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
    },
    '/v1/profiles/{profileId}/conditions': {
      get: {
        tags: ['Health Summary'],
        summary: 'List health conditions for a profile',
        parameters: [
          {
            name: 'profileId',
            in: 'path',
            required: true,
            schema: {type: 'string', example: 'profile-self-001'},
          },
        ],
        responses: {
          200: {
            description: 'Conditions list',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
      post: {
        tags: ['Health Summary'],
        summary: 'Add a health condition for a profile',
        parameters: [
          {
            name: 'profileId',
            in: 'path',
            required: true,
            schema: {type: 'string', example: 'profile-self-001'},
          },
        ],
        requestBody: {required: true, content: {'application/json': {schema: {type: 'object'}}}},
        responses: {
          201: {
            description: 'Condition created',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
    },
    '/v1/profiles/{profileId}/allergies': {
      get: {
        tags: ['Health Summary'],
        summary: 'List allergies for a profile',
        parameters: [
          {
            name: 'profileId',
            in: 'path',
            required: true,
            schema: {type: 'string', example: 'profile-self-001'},
          },
        ],
        responses: {
          200: {
            description: 'Allergies list',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
    },
    '/v1/profiles/{profileId}/vitals': {
      get: {
        tags: ['Health Summary'],
        summary: 'List vital signs for a profile',
        parameters: [
          {
            name: 'profileId',
            in: 'path',
            required: true,
            schema: {type: 'string', example: 'profile-self-001'},
          },
        ],
        responses: {
          200: {
            description: 'Vital signs list',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
      post: {
        tags: ['Health Summary'],
        summary: 'Add a vital sign reading for a profile',
        parameters: [
          {
            name: 'profileId',
            in: 'path',
            required: true,
            schema: {type: 'string', example: 'profile-self-001'},
          },
        ],
        requestBody: {required: true, content: {'application/json': {schema: {type: 'object'}}}},
        responses: {
          201: {
            description: 'Vital created',
            content: {'application/json': {schema: {type: 'object'}}},
          },
        },
      },
    },
    '/v1/profiles/{profileId}/health-score': {
      get: {
        tags: ['Health Summary'],
        summary: 'Get the health score for a profile',
        parameters: [
          {
            name: 'profileId',
            in: 'path',
            required: true,
            schema: {type: 'string', example: 'profile-self-001'},
          },
        ],
        responses: {
          200: {
            description: 'Health score response',
            content: {'application/json': {schema: {type: 'object'}}},
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
