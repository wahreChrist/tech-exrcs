DROP TABLE IF EXISTS users;

CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     email VARCHAR NOT NULL UNIQUE CHECK (email != ''),
     password VARCHAR NOT NULL CHECK (password != ''),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);