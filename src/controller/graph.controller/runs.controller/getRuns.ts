import { Request, Response } from "express";
import { Code } from "../../../enum/code.enum";
import { daoRuns } from "../../dao/dao.runs/dao.runs";

//restituisce tutte le esecuzioni salvate nel DB tramite DAO
export const getRuns = async (req: Request, res: Response) => {
    const daoRun: daoRuns = new daoRuns();
    const runs = await daoRun.getRuns();

    return res.status(Code.OK).json({ 
        runs: runs
    })
}


