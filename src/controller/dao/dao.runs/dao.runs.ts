import { connection } from "../../../config/mysql.config";
import { runI } from "../../../interface/run";
import { User } from "../../../interface/user";
import { QUERY } from "../../../query/runs.query";
import { ResultSet } from "../../user.controller/user.controller";

export class daoRuns {
    pool;

    constructor() {
        this.pool = connection();
    }

    async addRun(cost: number, idGraph: number, nodeStart: String, nodeGoal: String, time: number, optimalCost: number) {
        
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

    async getRuns(): Promise<runI[]> {
        let runs: runI[] = [];
        const rs: ResultSet = await this.pool.query(
            QUERY.SELECT_RUNS
        );
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