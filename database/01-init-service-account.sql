-- Create service account for application use
-- This user has limited privileges and is used by the app (not root/admin)

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_service') THEN
    CREATE ROLE app_service WITH LOGIN PASSWORD 'app_service_password';
  END IF;
END
$$;

-- Grant connection and usage on the database
GRANT CONNECT ON DATABASE incogni_gift TO app_service;
GRANT USAGE ON SCHEMA public TO app_service;
-- Grant CREATE privilege for running migrations
GRANT CREATE ON SCHEMA public TO app_service;

-- Grant privileges on existing tables (will be applied after migrations)
-- This ensures the service account can access tables created by migrations
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_service;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO app_service;

-- Grant privileges on all existing tables (for initial setup)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_service;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_service;

