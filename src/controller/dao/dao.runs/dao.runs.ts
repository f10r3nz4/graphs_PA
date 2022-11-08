import { connection } from "../../../config/mysql.config";
import { runI } from "../../../interface/run";
import { User } from "../../../interface/user";
import { QUERY } from "../../../query/runs.query";
import { ResultSet } from "../../user.controller/user.controller";

export class daoRuns {
    pool;

    //collegamento DB
    constructor() {
        this.pool = connection();
    }

    //funzione per aggiungere la nuova esecuzione le informazioni relative
    async addRun(cost: number, idGraph: number, nodeStart: String, nodeGoal: String, time: number, optimalCost: number) {
        
        //aggiungo l'esecuzione alla sua tabella tramite query
        await this.pool.query(
            QUERY.ADD_RUN,
            [
                time,
                cost,
                idGraph,
                optimalCost,
                nodeStart,
                nodeGoal
            ]
        );
    }

    //recupera le esecuzioni salvate sul DB
    async getRuns(): Promise<runI[]> {
        let runs: runI[] = [];
        //recupero con una select le runs esistenti
        const rs: ResultSet = await this.pool.query(
            QUERY.SELECT_RUNS
        );
        //salvo le informazioni secondo l'interfaccia
        (rs[0] as runI[]).map((run: any) => {
            const nameNodeStart = run.node_start.slice(0,-2);
            const nameNodeGoal = run.node_goal.slice(0,-2);
            run.node_start = nameNodeStart;
            run.node_goal = nameNodeGoal;
            runs.push(run);
        })
        return runs;
    }
}
