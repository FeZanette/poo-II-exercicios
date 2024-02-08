-- Active: 1707317067406@@127.0.0.1@3306
CREATE TABLE videos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    duration INTEGER NOT NULL,
    uploaded_at TEXT NOT NULL
);

INSERT INTO videos (id, title, duration, uploaded_at)
VALUES 
    ('v001', 'Javascript', 7200, '2024-02-07T12:22:18.312Z'),
    ('v002', 'CSS', 3600, '2024-02-07T12:22:18.312Z');