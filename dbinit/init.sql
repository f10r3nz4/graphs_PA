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

-- L'ID del nodo è `nameOfNode-graphID`
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

-- Inserimento di due modelli più o meno complessi assegnati all'utente user@user1.it
-- Grafo con ID 1 (non orientato)
INSERT INTO GRAPH (users_email, oriented) VALUES ('user@user1.it', 0);
INSERT INTO NODES (id, name, graph_id) VALUES ('Roma-1', 'Roma', 1);
INSERT INTO NODES (id, name, graph_id) VALUES ('Milano-1', 'Milano', 1);
INSERT INTO NODES (id, name, graph_id) VALUES ('Napoli-1', 'Napoli', 1);
INSERT INTO NODES (id, name, graph_id) VALUES ('Torino-1', 'Torino', 1);
INSERT INTO NODES (id, name, graph_id) VALUES ('Palermo-1', 'Palermo', 1);
INSERT INTO NODES (id, name, graph_id) VALUES ('Venezia-1', 'Venezia', 1);
INSERT INTO NODES (id, name, graph_id) VALUES ('Messina-1', 'Messina', 1);
INSERT INTO NODES (id, name, graph_id) VALUES ('Padova-1', 'Padova', 1);
INSERT INTO NODES (id, name, graph_id) VALUES ('Firenze-1', 'Firenze', 1);
INSERT INTO NODES (id, name, graph_id) VALUES ('Taranto-1', 'Taranto', 1);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Roma-Milano-1', 'Roma-1', 'Milano-1', 1, 571);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Roma-Napoli-1', 'Roma-1', 'Napoli-1', 1, 223);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Napoli-Milano-1', 'Napoli-1', 'Milano-1', 1, 771);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Milano-Messina-1', 'Milano-1', 'Messina-1', 1, 1244);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Messina-Palermo-1', 'Messina-1', 'Palermo-1', 1, 225);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Messina-Torino-1', 'Messina-1', 'Torino-1', 1, 1362);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Torino-Padova-1', 'Torino-1', 'Padova-1', 1, 369);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Padova-Venezia-1', 'Padova-1', 'Venezia-1', 1, 46);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Padova-Taranto-1', 'Padova-1', 'Taranto-1', 1, 864);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Venezia-Taranto-1', 'Venezia-1', 'Taranto-1', 1, 898);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Venezia-Firenze-1', 'Venezia-1', 'Firenze-1', 1, 271);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Firenze-Palermo-1', 'Firenze-1', 'Palermo-1', 1, 1169);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Palermo-Taranto-1', 'Palermo-1', 'Taranto-1', 1, 609);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Taranto-Roma-1', 'Taranto-1', 'Roma-1', 1, 331);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Roma-Firenze-1', 'Roma-1', 'Firenze-1', 1, 274);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Torino-Firenze-1', 'Torino-1', 'Firenze-1', 1, 434);
-- Grafo con ID 2 (orientato)
INSERT INTO GRAPH (users_email, oriented) VALUES ('user@user1.it', 1);
INSERT INTO NODES (id, name, graph_id) VALUES ('A-2', 'A', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('B-2', 'B', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('C-2', 'C', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('D-2', 'D', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('E-2', 'E', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('F-2', 'F', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('G-2', 'G', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('H-2', 'H', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('I-2', 'I', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('L-2', 'L', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('M-2', 'M', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('N-2', 'N', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('O-2', 'O', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('P-2', 'P', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('Q-2', 'Q', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('R-2', 'R', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('S-2', 'S', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('T-2', 'T', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('U-2', 'U', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('V-2', 'V', 2);
INSERT INTO NODES (id, name, graph_id) VALUES ('Z-2', 'Z', 2);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('A-B-2', 'A-2', 'B-2', 2, 9);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('B-C-2', 'B-2', 'C-2', 2, 6);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('C-D-2', 'C-2', 'D-2', 2, 3);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('C-E-2', 'C-2', 'E-2', 2, 8);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('D-E-2', 'D-2', 'E-2', 2, 5);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('E-B-2', 'E-2', 'B-2', 2, 2);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('E-A-2', 'E-2', 'A-2', 2, 1);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('E-F-2', 'E-2', 'F-2', 2, 4);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('F-G-2', 'F-2', 'G-2', 2, 7);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('F-C-2', 'F-2', 'C-2', 2, 8);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('G-H-2', 'G-2', 'H-2', 2, 9);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('H-I-2', 'H-2', 'I-2', 2, 5);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('I-L-2', 'I-2', 'L-2', 2, 2);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('I-G-2', 'I-2', 'G-2', 2, 3);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('L-M-2', 'L-2', 'M-2', 2, 4);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('M-H-2', 'M-2', 'H-2', 2, 7);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('H-N-2', 'H-2', 'N-2', 2, 6);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('H-O-2', 'H-2', 'O-2', 2, 4);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('O-P-2', 'O-2', 'P-2', 2, 5);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('P-N-2', 'P-2', 'N-2', 2, 6);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('N-Q-2', 'N-2', 'Q-2', 2, 3);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Q-R-2', 'Q-2', 'R-2', 2, 2);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('R-S-2', 'R-2', 'S-2', 2, 1);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('S-T-2', 'S-2', 'T-2', 2, 7);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('S-U-2', 'S-2', 'U-2', 2, 8);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('U-T-2', 'U-2', 'T-2', 2, 9);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('T-V-2', 'T-2', 'V-2', 2, 5);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('V-U-2', 'V-2', 'U-2', 2, 2);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('V-Z-2', 'V-2', 'Z-2', 2, 8);
INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES ('Z-M-2', 'Z-2', 'M-2', 2, 3);
