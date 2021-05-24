-- upgrade --
CREATE TABLE IF NOT EXISTS "authevents" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "username" VARCHAR(100),
    "user_keycloak_id" VARCHAR(100),
    "event_type" VARCHAR(100) NOT NULL,
    "realm_id" VARCHAR(100),
    "client_id" VARCHAR(100),
    "ip_address" VARCHAR(50),
    "payload" JSONB NOT NULL,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "dispenserstate" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "state" VARCHAR(7) NOT NULL,
    "payload" JSONB NOT NULL,
    "guid" VARCHAR(200) NOT NULL,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON COLUMN "dispenserstate"."state" IS 'IDLE: idle\nBUSY: busy\nOFFLINE: offline';
CREATE TABLE IF NOT EXISTS "doorstate" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "state" VARCHAR(7) NOT NULL  DEFAULT 'unknown',
    "payload" JSONB NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON COLUMN "doorstate"."state" IS 'CLOSED: closed\nMOVING: moving\nOPEN: open\nOFFLINE: offline\nUNKNOWN: unknown';
CREATE TABLE IF NOT EXISTS "fleetstate" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "fleet_name" VARCHAR(200) NOT NULL,
    "payload" JSONB NOT NULL,
    "robot_battery_percent" VARCHAR(200) NOT NULL,
    "robot_location" VARCHAR(200) NOT NULL,
    "robot_mode" VARCHAR(13) NOT NULL  DEFAULT 'closed',
    "robot_model" VARCHAR(200) NOT NULL,
    "robot_name" VARCHAR(200) NOT NULL,
    "robot_seq" INT NOT NULL,
    "robot_task_id" VARCHAR(200) NOT NULL,
    "robots" JSONB NOT NULL
);
COMMENT ON COLUMN "fleetstate"."robot_mode" IS 'MODE_IDLE: closed\nMODE_CHARGING: charging\nMODE_MOVING: moving\nMODE_PAUSED: paused\nMODE_WAITING: waiting\nMODE_EMERGENCY: emergency\nMODE_GOING_HOME: going_home\nMODE_DOCKING: docking\nMODE_ADAPTER_ERROR: adapter_error';
CREATE TABLE IF NOT EXISTS "healthstatus" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "device" TEXT NOT NULL,
    "actor_id" VARCHAR(25),
    "health_status" VARCHAR(25),
    "health_message" TEXT,
    "payload" JSONB NOT NULL,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "ingestorstate" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "state" VARCHAR(7) NOT NULL  DEFAULT 'offline',
    "payload" JSONB NOT NULL,
    "guid" VARCHAR(200) NOT NULL,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON COLUMN "ingestorstate"."state" IS 'IDLE: idle\nBUSY: busy\nOFFLINE: offline';
CREATE TABLE IF NOT EXISTS "liftstate" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(200) NOT NULL,
    "door_state" VARCHAR(6) NOT NULL  DEFAULT 'closed',
    "state" VARCHAR(9) NOT NULL  DEFAULT 'unknown',
    "destination_floor" VARCHAR(20) NOT NULL,
    "motion_state" VARCHAR(7) NOT NULL  DEFAULT 'stopped',
    "payload" JSONB NOT NULL,
    "current_floor" VARCHAR(20) NOT NULL,
    "session_id" VARCHAR(200) NOT NULL,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON COLUMN "liftstate"."door_state" IS 'DOOR_CLOSED: closed\nDOOR_MOVING: moving\nDOOR_OPEN: open';
COMMENT ON COLUMN "liftstate"."state" IS 'MODE_AGV: avg\nMODE_EMERGENCY: emergency\nMODE_FIRE: fire\nMODE_HUMAN: human\nMODE_OFFLINE: offline\nMODE_UNKNOWN: unknown';
COMMENT ON COLUMN "liftstate"."motion_state" IS 'MOTION_DOWN: down\nMOTION_STOPPED: stopped\nMOTION_UNKNOWN: unknown\nMOTION_UP: up';
CREATE TABLE IF NOT EXISTS "rawlog" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "level" VARCHAR(8) NOT NULL  DEFAULT 'info',
    "payload" JSONB NOT NULL,
    "message" TEXT NOT NULL,
    "created" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "container_name" TEXT
);
COMMENT ON COLUMN "rawlog"."level" IS 'CRITICAL: critical\nERROR: error\nWARN: warn\nINFO: info\nDEBUG: debug\nUNKNOWN: unknown';
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(20) NOT NULL,
    "content" JSONB NOT NULL
);
