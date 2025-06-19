#!/bin/bash
echo "** Started creating default DB and users"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  -- Create extensions
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- Create test schema
  CREATE SCHEMA IF NOT EXISTS test;

  CREATE USER $POSTGRES_APP_USER WITH PASSWORD '$POSTGRES_APP_PASSWORD';

  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT, SELECT, UPDATE ON TABLES TO "$POSTGRES_APP_USER";

  ALTER DEFAULT PRIVILEGES IN SCHEMA test
  GRANT SELECT, INSERT, UPDATE ON TABLES TO "$POSTGRES_APP_USER";

  GRANT USAGE ON SCHEMA test TO $POSTGRES_APP_USER;

  SET search_path TO public, dev;
EOSQL

echo "** Finished creating default DB and users"