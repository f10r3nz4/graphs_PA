import { connection } from "../../../config/mysql.config";
import { QUERY } from "../../../query/graph.query";
import { ResultSet } from "../../user.controller/user.controller";

interface nodeI {
    id: String,
    name: String,
    graph: String
}

export class daoNodes {
    pool;

    constructor() {
        this.pool = connection();
    }

    async addNode(id: String, name: String, graph: number) {
        try {
            const nodeIsInGraph = await this.checkIfNodeIsInGraph(graph, name);
            if(nodeIsInGraph === false) {
                await this.pool.query(QUERY.INSERT_NODE, [
                    id,
                    name,
                    graph
                ]);
                console.log(`Node: ${name} added in graph: ${graph}`);
            }
        } catch (error) {
            if((error as Error).message.includes('Duplicate entry')) {
                console.log(`The node: ${name} is already included in graph: ${graph}`);
            } else {
                console.error(error);
            }
        }
    }

    async getNodesOfGraph(graph: number): Promise<nodeI[]> {
        let nodes: nodeI[] = [];
        try {
            const rs: ResultSet = (await this.pool.query(QUERY.SELECT_NODES_OF_GRAPH,
                graph
            ));
            nodes = rs[0] as nodeI[];
        } catch (error) {
            console.error(error);
        }
        return nodes;
    }

    async getNodes(): Promise<nodeI[]> {
        let nodes: nodeI[] = [];
        try {
            const rs: ResultSet = (await this.pool.query(QUERY.SELECT_NODES));
            nodes = rs[0] as nodeI[];
        } catch (error) {
            console.error(error);
        }
        return nodes;
    }

    async checkIfNodeIsInGraph(graph: number, node: String): Promise<boolean> {
        let nodeIsInGraph = false;
        try {
            const rs: ResultSet = await this.pool.query(QUERY.SELECT_NODE_FROM_GRAPH, [
                graph,
                node
            ])
            
            if ((rs[0] as nodeI[]).length !== 0) {
                nodeIsInGraph = true;
            }
        } catch (error) {
            console.error(error);
        }
        return nodeIsInGraph;
    }
}