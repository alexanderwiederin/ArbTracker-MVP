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
  volume INTEGER,
  price DECIMAL
);