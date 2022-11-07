import { connection } from "../../../config/mysql.config";
import { LinkI } from "../../../interface/graph";
import { QUERY } from "../../../query/graph.query";
import { ResultSet } from "../../user.controller/user.controller";

export interface nodeI {
    id: String,
    name: String,
    graphID: String,
}

export interface graphI {
    id: number,
    userEmail: string,
    oriented: boolean,
    nodes: nodeI[],
    links: LinkI[]
}

export class daoGraphs {
    pool;

    constructor() {
        this.pool = connection();
    }

    async getGraphsByEmail(email: string): Promise<graphI[]> {
        let graphs: graphI[] = [];
        //get all the graphs
        if (email !== undefined) {
            const rs: ResultSet = await this.pool.query(QUERY.SELECT_GRAPHS, [
                email
            ]);
            graphs = (rs[0] as graphI[]);
            //get all the nodes and links of that graph
            await Promise.all(graphs.map(
                async (graph: graphI) => {
                    console.log(`Searching for nodes of graph: ${graph.id}`)
                    const rsNodes: ResultSet = await this.pool.query(
                        QUERY.SELECT_NODES_OF_GRAPH,
                        graph.id
                    );
                    graph.nodes = rsNodes[0] as nodeI[];

                    const rsLinks: ResultSet = await this.pool.query(
                        QUERY.SELECT_LINKS_FROM_GRAPH,
                        graph.id
                    )

                    graph.links = rsLinks[0] as LinkI[];
                }))
        }
        return graphs;
    }

    async getGraphByID(id: number): Promise<graphI> {
        const rs: ResultSet = await this.pool.query(QUERY.SELECT_GRAPH_BY_ID, [
            id
        ]);
        let graph = rs[0] as graphI[];
        const rsNodes: ResultSet = await this.pool.query(
            QUERY.SELECT_NODES_OF_GRAPH,
            id
        );
        graph[0].nodes = rsNodes[0] as nodeI[];
        const rsLinks: ResultSet = await this.pool.query(
            QUERY.SELECT_LINKS_FROM_GRAPH,
            id
        )

        graph[0].links = rsLinks[0] as LinkI[];
        return graph[0];
    }

    async createGraph(email: String, oriented: boolean) {
        try {
            await this.pool.query(QUERY.CREATE_GRAPH, [
                email,
                oriented
            ])
        } catch (error) {
            console.error(error);
        }
    }

    async orientationOfGraph(id: number): Promise<boolean> {
        let isOriented: number = 0;
        try {
            const rs: ResultSet = await this.pool.query(QUERY.SELECT_ORIENTATION_GRPAH, [
                id
            ])
            isOriented =(rs[0] as { oriented: number }[])[0].oriented 
        } catch (error) {
            console.error(error);
        }
        return isOriented == 1;
    }
}