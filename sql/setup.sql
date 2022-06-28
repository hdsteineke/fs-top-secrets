-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS secrets CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE secrets (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP
);

INSERT INTO secrets (
  title,
  description,
  created_at
)

VALUES 
('SNACK STASH', 'the chocolate peanut butter trail mix is hidden in the foot stool', CURRENT_TIMESTAMP),
('CLOSET', 'dont look in there...', CURRENT_TIMESTAMP),
('SURPRISE', 'flash mob begins promptly at 1600 hours', CURRENT_TIMESTAMP);