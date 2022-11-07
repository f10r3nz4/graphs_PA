import { Pool } from "mysql2/promise";
import { QUERY } from "../../query/graph.query";

export const addGraphInDB = async (pool: Pool, email: String) => {
    if (pool === undefined || email === undefined) {
        throw new Error('One or more params are undefined in addGraphInDB');
    }

    try {
        await pool.query(QUERY.CREATE_GRAPH, [email]);
    } catch (error) {
        console.error(error)
        throw new Error('Could not create graph.');
    }
}