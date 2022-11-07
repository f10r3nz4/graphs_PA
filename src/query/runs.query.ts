export const QUERY = {
    ADD_RUN: 'INSERT INTO RUNS (time, cost, graph_id, cost_optimal, node_start, node_goal) VALUES (?,?,?,?,?,?)',
    SELECT_RUNS: 'SELECT * FROM RUNS'
}

