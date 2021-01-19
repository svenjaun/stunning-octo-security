CREATE DATABASE "stunning-octo-security";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE octo_role (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(40) NOT NULL,
    importance INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE octo_user (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username varchar(50) NOT NULL,
    email varchar(50) NOT NULL,
    key BYTEA,
    pw_hash varchar(255) NOT NULL,
    role_id uuid references octo_role(id),
    UNIQUE (username),
    UNIQUE (email)
);

INSERT INTO octo_role (name, importance) VALUES ('Octo_User', 10), ('Octo_Admin', 100), ('Octo_Boss', 1000000);