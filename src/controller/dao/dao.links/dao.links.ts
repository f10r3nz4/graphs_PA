import { connection } from "../../../config/mysql.config";
import { LinkI } from "../../../interface/graph";
import { QUERY } from "../../../query/graph.query";
import { ResultSet } from "../../user.controller/user.controller";

export class daoLinks {
    pool;
//connetto il DB
    constructor() {
        this.pool = connection()
    }
    
    //funzione che aggiunge il link al DB 
    async addLinkToGraph(from: String, to: String, weight: number, graph: number) {
        //genero l'id dei nodi e del link come sono salvati nelle loro tabelle
        const idLink: String = `${from}-${to}-${graph}`;
        const idNodeFrom: String = `${from}-${graph}`
        const idNodeTo: String = `${to}-${graph}`;

        try {
            //controllo che i nodi del link da aggiungere siano esistenti
            if (
                (await this.linkExists(idNodeFrom, idNodeTo)) === false &&
                (await this.linkExists(idNodeTo, idNodeFrom)) === false
            ) {
                await this.pool.query(
                    QUERY.INSERT_LINK, [ //chiamo la query per inserire il link
                    idLink,
                    idNodeFrom,
                    idNodeTo,
                    graph,
                    weight
                ]);
                console.log(`Link: ${idLink} added in database`);
            }
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    //effettuo la select del link se esiste
    async linkExists(from: String, to: String): Promise<boolean> {
        let linkFound = false;
        try {
            const rs: ResultSet = await this.pool.query(
                QUERY.SELECT_LINK, [
                from,
                to
            ]);
            
            if ((rs[0] as LinkI[]).length !== 0) {
                linkFound = true;
            }
        } catch (error) {
            console.error(error);
        }
        return linkFound;
    }

    //recupero il peso del link con una select
    async getWeightOfLink(idNodeFrom: String, idNodeTo: String): Promise<number> {
        const rs: ResultSet = await this.pool.query(
            QUERY.SELECT_WEIGHT_OF_LINK,
            [
                idNodeFrom,
                idNodeTo
            ]
        ) as ResultSet;
        const weights = rs[0] as {weight: number}[]
        let totalWeight = 0;
        weights.map((weight) => {
            totalWeight += weight.weight;
        })

        return totalWeight;
    }

    //recupero il peso del link con una select con l'id creato nella costante
    async getWeightOfLinkByID(idLink: String): Promise<number> {
        console.log(`Requesting weight of link with id: ${idLink}`);
        const rs: ResultSet = await this.pool.query(
            QUERY.SELECT_WEIGHT_OF_LINK_BY_ID,
            [
                idLink
            ]
        ) as ResultSet;
        const weight = (rs[0] as {weight: number}[])[0];
        return weight.weight;
    }

    //aggiornamento del peso dopo la modifica
    async updateWeightOfLink(id: String, weight: number) {
        await this.pool.query(
            QUERY.UPDATE_WEIGHT_OF_LINK_WITH_ID,
            [
                weight,
                id
            ]
        )
    }
}
