-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS repos;

-- CREATE TABLE users (
--      id SERIAL PRIMARY KEY,
--      email VARCHAR NOT NULL UNIQUE CHECK (email != ''),
--      password VARCHAR NOT NULL CHECK (password != ''),
--      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE repos (
--      id SERIAL PRIMARY KEY,
--      refId INTEGER REFERENCES users(id),
--      owner VARCHAR NOT NULL,
--      proj_name VARCHAR NOT NULL,
--      url VARCHAR NOT NULL,
--      stars INTEGER  NOT NULL,
--      forks INTEGER  NOT NULL,
--      issues INTEGER  NOT NULL,
--      timestamp VARCHAR NOT NULL
-- );

