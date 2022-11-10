import { Request, Response } from "express";
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import jwt from 'jsonwebtoken';
import { daoGraphs } from "../../dao/dao.graphs/dao.graphs";


// The check on the input will be done in a middleware
export const runSimulation = async (req: Request, res: Response) => {
    const nodeFrom = req.body.nodeFrom;
    const nodeTo = req.body.nodeTo;
    const startingValue = req.body.startingValue;
    const endingValue = req.body.endingValue;
    const increment = req.body.increment;
    const algorithm = req.body.algorithm;
    const idGraph = req.body.idGraph;
    const heuristic = req.body.heuristic;
    const daoG = new daoGraphs();

    let from = `${nodeFrom}-${idGraph}`;
    let to = `${(nodeTo)}-${idGraph}`;

    const graph = await daoG.getGraphByID(idGraph);
}