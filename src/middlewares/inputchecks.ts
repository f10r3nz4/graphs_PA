import {Request, Response, NextFunction} from 'express';
import { Code } from '../enum/code.enum';
import jwt from 'jsonwebtoken';
import { CustomRequest, User } from '../interface/user';

export const checkValidAlgorithm = async (req: Request, res: Response, next: NextFunction) => {
    const availableAlgos = ['astar', 'agreedy', 'nba']; //salvo i nomi degli algoritmi possibili in una costante
    const algorithm = req.body.algorithm;
    if (algorithm === undefined || !availableAlgos.includes(algorithm.toLowerCase())) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'This algorithm is not available'
        });
    }
}