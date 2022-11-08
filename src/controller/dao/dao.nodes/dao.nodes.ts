import { connection } from "../../../config/mysql.config";
import { QUERY } from "../../../query/graph.query";
import { ResultSet } from "../../user.controller/user.controller";

//definizione interfaccia del nodo con le informazioni interessanti
interface nodeI {
    id: String,
    name: String,
    graph: String
}

export class daoNodes {
    pool;

    constructor() {
        this.pool = connection(); //connessione DB
    }

    //funzione che gestisce l'inderimento del nodo nella sua tabella
    async addNode(id: String, name: String, graph: number) {
        try {
            const nodeIsInGraph = await this.checkIfNodeIsInGraph(graph, name); //inserimento se nodo non è già presente
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

    //recupero i nodi del grafo con una select
    async getNodesOfGraph(graph: number): Promise<nodeI[]> {
        let nodes: nodeI[] = [];
        try {
            const rs: ResultSet = (await this.pool.query(QUERY.SELECT_NODES_OF_GRAPH,
                graph
            ));
            //li salvo secondo l'interfaccia
            nodes = rs[0] as nodeI[];
        } catch (error) {
            console.error(error);
        }
        return nodes;
    }

    //recupero i nodi con una select 
    async getNodes(): Promise<nodeI[]> {
        let nodes: nodeI[] = [];
        try {
            const rs: ResultSet = (await this.pool.query(QUERY.SELECT_NODES));
            //inserisco i nodi nell'array
            nodes = rs[0] as nodeI[];
        } catch (error) {
            console.error(error);
        }
        return nodes;
    }

    //funzione che controlla se il nodo è già presente nella tabella nodes
    async checkIfNodeIsInGraph(graph: number, node: String): Promise<boolean> {
        let nodeIsInGraph = false; //flag di controllo a false
        try {
            //estraggo con una select
            const rs: ResultSet = await this.pool.query(QUERY.SELECT_NODE_FROM_GRAPH, [
                graph,
                node
            ])
            
           //controllo sul risultato
            if ((rs[0] as nodeI[]).length !== 0) {
                //il risultato contiene il nodo estratto perchè giù esistente
                nodeIsInGraph = true;
            }
        } catch (error) {
            console.error(error);
        }
        return nodeIsInGraph;
    }
}
