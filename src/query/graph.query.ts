export const QUERY = {
    SELECT_GRAPHS: 'SELECT * FROM GRAPH AS graph WHERE graph.users_email = ?',
    SELECT_NODES_OF_GRAPH: 'SELECT * FROM NODES AS nodes WHERE nodes.graph_id = ?',
    SELECT_NODES: 'SELECT * FROM NODES',
    SELECT_NODE_FROM_GRAPH: 'SELECT * FROM NODES JOIN GRAPH ON NODES.graph_id = GRAPH.id WHERE (GRAPH.id = ? AND NODES.name = ?)',
    SELECT_LINKS_FROM_GRAPH: 'SELECT * FROM LINK AS link WHERE link.graph_id = ?',
    SELECT_LINK: 'SELECT * FROM LINK WHERE (LINK.node_from = ? AND LINK.node_to)',
    SELECT_GRAPH_BY_ID: 'SELECT * FROM GRAPH as graph WHERE graph.id = ?',
    SELECT_WEIGHT_OF_LINK: 'SELECT (weight) FROM LINK WHERE (node_to = ? AND node_from = ?)',
    SELECT_WEIGHT_OF_LINK_BY_ID: 'SELECT (weight) FROM LINK WHERE (id = ?)',
    UPDATE_WEIGHT_OF_LINK_WITH_ID: 'UPDATE LINK SET weight = ? WHERE id = ?',
    SELECT_ORIENTATION_GRAPH: 'SELECT (oriented) FROM GRAPH WHERE (id = ?)',
    CREATE_GRAPH: 'INSERT INTO GRAPH (users_email, oriented) VALUES(?, ?)',
    INSERT_NODE: 'INSERT INTO NODES (id,name, graph_id) VALUES (?,?,?)',
    INSERT_LINK: 'INSERT INTO LINK (id, node_from, node_to, graph_id, weight) VALUES (?,?,?,?,?)',
    SELECT_NODE: 'SELECT * FROM NODES AS node WHERE (node.id = ? AND node.graph_id = ?)',
    COUNT_GRAPHS: 'SELECT COUNT(*) AS numberOfGraphs FROM GRAPH WHERE GRAPH.users_email = ?'
}

