DROP DATABASE IF EXISTS mvp;

CREATE DATABASE mvp;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR (50) 
);

CREATE TABLE password (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  password VARCHAR(50)
);

CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(5),
  volume DECIMAL,
  price DECIMAL
);

INSERT INTO users (username) VALUES ('satoshi');

INSERT INTO trades (user_id, type, volume, price) VALUES (1, 'buy', 1, 0);