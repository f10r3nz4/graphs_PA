import {Request, Response, NextFunction} from 'express';
import { Code } from '../enum/code.enum';
import jwt from 'jsonwebtoken';
import { CustomRequest, User } from '../interface/user';

//esporto una costante che mi certifica il token valido dell'utente e quindi la sua corretta autenticazione
export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if(token === undefined) {
        return res.status(Code.UNAUTHORIZED).json({
            message: 'Unauthorized'
        })
    } else {
        //prendo la chiave jwt dall'env
        const secret = process.env.JWT_SECRET;
        if(secret !== undefined) {
            //verifico il token come chiave e token generato
            const tokenVerified = jwt.verify(token, secret);
            //associo il token all'user autenticato
            const loggedUser = tokenVerified as User;
            (req as CustomRequest).user = {
                id: loggedUser.id,
                email: loggedUser.email,
                token: loggedUser.token,
                role: loggedUser.role
            }
            next();
        } else {
            return res.status(Code.INTERNAL_SERVER_ERROR).json({
                message: 'The secret key to create tokens is not set'
            })
        }
        
    }
}
