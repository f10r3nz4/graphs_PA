import { connection } from "../../../config/mysql.config";
import { LinkI } from "../../../interface/graph";
import { QUERY } from "../../../query/graph.query";
import { ResultSet } from "../../user.controller/user.controller";

//interfaccia nodi
export interface nodeI {
    id: String,
    name: String,
    graphID: String,
}

//interfaccia grafi
export interface graphI {
    id: number,
    userEmail: string,
    oriented: boolean,
    nodes: nodeI[],
    links: LinkI[]
}

export class daoGraphs {
    pool; 
    
    //collegamento con il DB
    constructor() {
        this.pool = connection();
    }

    //funzione che recupera i grafi nel DB creati dall'utente passato come email
    async getGraphsByEmail(email: string): Promise<graphI[]> {
        let graphs: graphI[] = [];
        //recupera tutti i grafi
        if (email !== undefined) {
            //se email valida effettua la query per prendere i grafi dal DB filtrati per utente
            const rs: ResultSet = await this.pool.query(QUERY.SELECT_GRAPHS, [
                email
            ]);
            graphs = (rs[0] as graphI[]);
            //prende tutti i nodi e i link del grafo
            await Promise.all(graphs.map(
                async (graph: graphI) => {
                    console.log(`Searching for nodes of graph: ${graph.id}`)
                    //chiama la query che restituisce i nodi filtrati per grafo
                    const rsNodes: ResultSet = await this.pool.query(
                        QUERY.SELECT_NODES_OF_GRAPH,
                        graph.id
                    );
                    graph.nodes = rsNodes[0] as nodeI[]; //i nodi vengono salvati secondo l'interfaccia

                    const rsLinks: ResultSet = await this.pool.query(
                         //chiama la query che restituisce i link filtrati per grafo
                        QUERY.SELECT_LINKS_FROM_GRAPH,
                        graph.id
                    )

                    //i links vengono salvati secondo l'interfaccia
                    graph.links = rsLinks[0] as LinkI[];
                }))
        }
        return graphs;
    }

    //funzione che recupera i grafi nel DB tramite l'id dello stesso
    async getGraphByID(id: number): Promise<graphI> {
        const rs: ResultSet = await this.pool.query(QUERY.SELECT_GRAPH_BY_ID, [
            id
        ]);
        //salva i grafi secondo l'interfaccia
        let graph = rs[0] as graphI[];
        //recupera i nodi
        const rsNodes: ResultSet = await this.pool.query(
            QUERY.SELECT_NODES_OF_GRAPH,
            id
        );
        graph[0].nodes = rsNodes[0] as nodeI[];
        //recupera gli archi
        const rsLinks: ResultSet = await this.pool.query(
            QUERY.SELECT_LINKS_FROM_GRAPH,
            id
        )

        graph[0].links = rsLinks[0] as LinkI[];
        return graph[0];
    }
    
    //effettua l'inserimento del grafo nella tabella
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
    
    //prende l'eventuale orientamento del grafo
    async orientationOfGraph(id: number): Promise<boolean> {
        let isOriented: number = 0; //flag false di default
        try {
            const rs: ResultSet = await this.pool.query(QUERY.SELECT_ORIENTATION_GRAPH, [
                id
            ])
            isOriented =(rs[0] as { oriented: number }[])[0].oriented //controlla l'effettivo valore recuperato dalla select
        } catch (error) {
            console.error(error);
        }
        return isOriented == 1; 
    }
}
