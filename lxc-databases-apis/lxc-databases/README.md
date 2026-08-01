# lxc-databases

Dedicated database workspace for the Lexvora Consulting APIs & Databases stack.

This folder is reserved for database-related design, schema planning,
integration notes, migrations, and deployment context. It is intended to be the
single place where we define how health data is stored, accessed, secured, and
evolved over time.

## Purpose

The goal of this folder is to keep the data layer separate from the mobile and
API applications so database decisions stay easy to review and maintain.

Use this space for:

- Data model and schema notes
- Collection or table design
- Migration strategy
- Environment variable guidance
- Backup and recovery notes
- Security and access patterns
- Provider-specific implementation details

## Database Options

The platform can use either of these as the primary database choice:

### MongoDB Atlas

Best when the project needs flexible document storage and evolving health data
structures.

Good fit for:

- Patient profiles with nested data
- Medical records and attachments metadata
- Event-style health timelines
- Rapid schema iteration
- JSON-first API design

Typical strengths:

- Flexible document model
- Strong fit for app-centric and semi-structured data
- Easy to store deeply nested health objects
- Familiar pairing with Node.js APIs

### Supabase

Best when the project benefits from relational structure, auth integration, and
Postgres compatibility.

Good fit for:

- Structured patient and account data
- Appointment and scheduling records
- Reporting and analytics queries
- Strong relational constraints
- SQL-based business logic

Typical strengths:

- PostgreSQL foundation
- Row-level security support
- Built-in auth and storage options
- Strong SQL querying and reporting
- Good fit for normalized health data

## Decision Context

Choose based on the shape of the data and the way the application will grow:

- Pick `MongoDB Atlas` if the health records will stay highly flexible and
  document-oriented.
- Pick `Supabase` if the platform needs stronger relational integrity,
  reporting, and SQL-driven workflows.

## Recommended Direction

For the current MyHealthHub ecosystem, the decision should be made around the
core data shapes:

- If the first priority is patient records, timelines, and medical documents,
  MongoDB Atlas is a natural starting point.
- If the first priority is users, appointments, permissions, and audit-friendly
  relational data, Supabase is likely the better base.

## Suggested Folder Structure

```text
lxc-databases/
├── README.md
├── schema/
├── migrations/
├── seeds/
├── docs/
└── env.example
```

## Environment Notes

Keep secrets out of git.

Suggested variables:

```bash
DATABASE_URL=
MONGODB_URI=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DB_PROVIDER=
```

Only the variables needed for the chosen provider should be populated.

## Working Rules

- Keep provider-specific scripts and notes inside this folder
- Avoid scattering schema decisions across app folders
- Document breaking changes before applying them
- Treat patient data as sensitive by default

## Next Step

Add the initial schema or migration files here once the database choice is
confirmed.
