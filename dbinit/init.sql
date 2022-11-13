CREATE DATABASE IF NOT EXISTS usersdb;
USE usersdb;

DROP TABLE IF EXISTS RUNS;
DROP TABLE IF EXISTS LINK;
DROP TABLE IF EXISTS NODES;
DROP TABLE IF EXISTS GRAPH;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
 id INT NOT NULL AUTO_INCREMENT, 
 email VARCHAR(255) NOT NULL,
 password VARCHAR(255) NOT NULL,
 role VARCHAR(30) NOT NULL,
 token REAL(8,2) DEFAULT NULL,
 PRIMARY KEY (id),
 CONSTRAINT UQ_Users_Email UNIQUE (email)
);
 
CREATE TABLE GRAPH (
    id INT NOT NULL AUTO_INCREMENT,
    users_email VARCHAR(255) NOT NULL,
    oriented BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (users_email) REFERENCES users(email),
    PRIMARY KEY (id)
);

-- The id is `nameOfNode-graphID`
CREATE TABLE NODES (
    id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    graph_id INT NOT NULL,
    FOREIGN KEY (graph_id) REFERENCES GRAPH(id),
    PRIMARY KEY (id)
);

CREATE TABLE LINK (
    id VARCHAR(255) NOT NULL,
    node_to VARCHAR(255) NOT NULL,
    node_from VARCHAR(255) NOT NULL,
    weight INT NOT NULL,
    graph_id INT NOT NULL,
    FOREIGN KEY (node_from) REFERENCES NODES(id),
    FOREIGN KEY (node_to) REFERENCES NODES(id),
    FOREIGN KEY (graph_id) REFERENCES GRAPH(id),
    PRIMARY KEY (id)
);

CREATE TABLE RUNS (
    id INT NOT NULL AUTO_INCREMENT,
    time INT NOT NULL,
    cost FLOAT NOT NULL,
    graph_id INT NOT NULL,
    cost_optimal FLOAT NOT NULL,
    node_start VARCHAR(255) NOT NULL,
    node_goal VARCHAR(255) NOT NULL, 
    FOREIGN KEY (graph_id) REFERENCES GRAPH(id),
    FOREIGN KEY (node_start) REFERENCES NODES(id),
    FOREIGN KEY (node_goal) REFERENCES NODES(id),
    PRIMARY KEY (id)
);

INSERT INTO users (email, password, role, token) VALUES ('user@user1.it', 'user123', 'user', 10000);
INSERT INTO users (email, password, role, token) VALUES ('user2@user2.it', 'user123', 'user', 0.0);
INSERT INTO users (email, password, role, token) VALUES ('admin@user1.it', 'admin123', 'admin', 0.0);