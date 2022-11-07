import { Request, Response } from "express";
import { daoNodes } from "../dao/dao.nodes/dao.nodes";

export const getNodes = async (req: Request, res: Response) => {
    const dao: daoNodes = new daoNodes();
    const nodes = await dao.getNodes();
    
    return res.status(200).json({
        nodes: nodes
    })
}