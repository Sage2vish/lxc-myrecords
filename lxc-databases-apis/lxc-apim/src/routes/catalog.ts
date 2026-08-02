import {Router} from 'express';
import {pool} from '../config/db.js';
import {env} from '../config/env.js';
import {requireAuth} from '../middleware/auth.js';

export const catalogRouter = Router();

type OpenApiOperation = {
  tags?: string[];
  summary?: string;
  description?: string;
  security?: Array<Record<string, string[]>>;
  parameters?: unknown[];
  requestBody?: {content?: Record<string, {schema?: OpenApiSchema}>};
  responses?: Record<string, {description?: string; content?: Record<string, {schema?: OpenApiSchema}>}>;
  'x-rate-limit'?: string;
  'x-last-updated'?: string;
};

type OpenApiSchema = {
  type?: string;
  example?: unknown;
  properties?: Record<string, OpenApiSchema>;
  required?: string[];
  items?: OpenApiSchema;
};

type OpenApiSpec = {
  info?: {version?: string};
  tags?: Array<{name: string; description?: string}>;
  paths?: Record<string, Record<string, OpenApiOperation>>;
  security?: Array<Record<string, string[]>>;
};

type CatalogEndpoint = {
  id: string;
  method: string;
  path: string;
  displayName: string;
  summary: string;
  description: string;
  version: string;
  auth: string;
  environment: string;
  rateLimit: string;
  lastUpdated: string;
  requestExample: string;
  responseExample: string;
  operationJson: string;
};

type CatalogGroup = {
  id: string;
  name: string;
  description: string;
  countLabel: string;
  icon: string;
  endpoints: CatalogEndpoint[];
};

const HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options']);

function toGroupId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function getAuthLabel(operation: OpenApiOperation, spec: OpenApiSpec) {
  const security = operation.security ?? spec.security;
  if (!security?.length) return 'None';

  const schemes = [...new Set(security.flatMap((requirement) => Object.keys(requirement)))];
  return schemes.length ? schemes.join(', ') : 'None';
}

function exampleFromSchema(schema?: OpenApiSchema): unknown {
  if (!schema) return {};
  if (schema.example !== undefined) return schema.example;
  if (schema.properties) {
    return Object.fromEntries(Object.entries(schema.properties).map(([name, property]) => [name, exampleFromSchema(property)]));
  }
  if (schema.type === 'array') return [exampleFromSchema(schema.items)];
  if (schema.type === 'boolean') return false;
  if (schema.type === 'number' || schema.type === 'integer') return 0;
  return schema.type === 'object' ? {} : '';
}

function schemaExample(content?: Record<string, {schema?: OpenApiSchema}>) {
  const schema = content?.['application/json']?.schema ?? Object.values(content ?? {})[0]?.schema;
  return JSON.stringify(exampleFromSchema(schema), null, 2);
}

function buildGroupsFromSpec(spec: OpenApiSpec): CatalogGroup[] {
  const groups = new Map<string, CatalogGroup>();

  for (const tag of spec.tags ?? []) {
    const id = toGroupId(tag.name);
    groups.set(id, {
      id,
      name: tag.name,
      description: tag.description ?? `${tag.name} endpoints.`,
      countLabel: '0 APIs',
      icon: '◌',
      endpoints: [],
    });
  }

  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.has(method)) continue;

      const tagName = operation.tags?.[0] ?? 'Ungrouped';
      const groupId = toGroupId(tagName);
      if (!groups.has(groupId)) {
        groups.set(groupId, {
          id: groupId,
          name: tagName,
          description: `${tagName} endpoints.`,
          countLabel: '0 APIs',
          icon: '◌',
          endpoints: [],
        });
      }

      const summary = operation.summary ?? `${method.toUpperCase()} ${path}`;
      groups.get(groupId)!.endpoints.push({
        id: `${groupId}-${method}-${path.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '')}`,
        method: method.toUpperCase(),
        path,
        displayName: summary,
        summary,
        description: operation.description ?? summary,
        version: spec.info?.version ?? 'Unknown',
        auth: getAuthLabel(operation, spec),
        environment: env.apimEnv === 'local' ? 'Local' : 'Production',
        rateLimit: operation['x-rate-limit'] ?? 'Not specified',
        lastUpdated: operation['x-last-updated'] ?? 'Not specified',
        requestExample: operation.requestBody ? schemaExample(operation.requestBody.content) : 'No request body defined.',
        responseExample: schemaExample(Object.values(operation.responses ?? {})[0]?.content),
        operationJson: JSON.stringify(operation, null, 2),
      });
    }
  }

  return [...groups.values()]
    .filter((group) => group.endpoints.length > 0)
    .map((group) => ({
      ...group,
      countLabel: `${group.endpoints.length} API${group.endpoints.length === 1 ? '' : 's'}`,
    }));
}

async function loadGroups(): Promise<{groups: CatalogGroup[]; error: string | null}> {
  const apiBaseUrl = env.apimEnv === 'local' ? 'http://localhost:3000' : 'https://api.lexvoraconsulting.com';
  try {
    const response = await fetch(`${apiBaseUrl}/openapi.json`, {headers: {accept: 'application/json'}});
    if (!response.ok) throw new Error(`OpenAPI fetch failed (${response.status})`);

    const groups = buildGroupsFromSpec((await response.json()) as OpenApiSpec);
    return groups.length
      ? {groups, error: null}
      : {groups: [], error: 'The OpenAPI document does not contain any API operations.'};
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {groups: [], error: `Unable to load the lxc-api OpenAPI document: ${message}`};
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
    const {groups, error: catalogError} = await loadGroups();
    const selectedGroupId = typeof req.query.group === 'string' ? req.query.group : groups[0]?.id;
    const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? groups[0];
    const selectedEndpointId = typeof req.query.endpoint === 'string' ? req.query.endpoint : selectedGroup?.endpoints[0]?.id;
    const selectedEndpoint = groups.flatMap((group) => group.endpoints).find((endpoint) => endpoint.id === selectedEndpointId) ?? selectedGroup?.endpoints[0];
    const baseUrl = env.apimEnv === 'local' ? 'http://localhost:3000' : 'https://api.lexvoraconsulting.com';

    res.render('catalog', {
      groups, selectedGroup, selectedEndpoint, dbError, catalogError,
      session: req.session, apimEnv: env.apimEnv, baseUrl, docsUrl: `${baseUrl}/openapi.json`,
    });
  } catch (error) {
    next(error);
  }
});
