-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS reset_codes;
-- DROP TABLE IF EXISTS friendships;
-- DROP TABLE IF EXISTS messages;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR NOT NULL CHECK (first != ''),
    last VARCHAR NOT NULL CHECK (last != ''),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_pic_url VARCHAR(255),
    bio VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE friendships(
--     id SERIAL PRIMARY KEY,
--     sender_id INT REFERENCES users(id) NOT NULL,
--     recipient_id INT REFERENCES users(id) NOT NULL,
--     accepted BOOLEAN DEFAULT false
-- );

-- CREATE TABLE messages(
--     id SERIAL PRIMARY KEY,
--     user_id INT REFERENCES users(id) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     message VARCHAR(255) NOT NULL CHECK (message != '')
-- );

-- createdb finalproject
-- psql -d finalproject -f server/sql/setup.sql