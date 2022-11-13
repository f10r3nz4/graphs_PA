import { Request, Response, NextFunction } from 'express';
import { Code } from '../enum/code.enum';
import { LinkI } from '../interface/graph';
import { CustomRequest } from '../interface/user';

export const checkValidAlgorithm = async (req: Request, res: Response, next: NextFunction) => {
    const availableAlgos = ['astar', 'agreedy', 'nba']; //salvo i nomi degli algoritmi possibili in una costante
    const algorithm = req.body.algorithm;
    if (algorithm === undefined || !availableAlgos.includes(algorithm.toLowerCase())) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'This algorithm is not available'
        });
    } else {
        next();
    }
}

//TODO: if there's enough time add the regural expression check
export const checkValidEmailParam = async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.email === undefined || !validateEmail(req.query.email as String)) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Specify a valid email'
        });
    } else {
        next();
    }
}

export const checkValidEmailBody = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.email === undefined || !validateEmail(req.body.email as String)) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Specify a valid email'
        });
    } else {
        next();
    }
}

export const checkValidAmountBody = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.amount === undefined || req.body.amount < 0 || typeof req.body.amount === 'string') {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Specify a valid amount'
        });
    } else {
        next();
    }
}

//controllo che l'utente loggato sia admin e abbia quindi i permessi per chiamare la funzione
export const checkIfAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const loggedUser = (req as CustomRequest).user;  //recupero l'utente loggato per controllarne il ruolo
    if (loggedUser.role !== 'admin') {
        return res.status(Code.BAD_REQUEST).json({
            message: 'You are not authorized'
        });
    } else {
        next();
    }
}

const validateEmail = (email: String) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const checkValidPassword = async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.password === undefined) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Specify a valid password'
        });
    } else {
        next();
    }
}

//si recupera la chiave JWT dal file env e si controlla
export const checkValidJWTEnvVar = async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.JWT_SECRET === undefined) {
        return res.status(Code.INTERNAL_SERVER_ERROR).json({
            message: 'The secret key to create tokens is not set'
        });
    } else {
        next();
    }
}

//si recupera la chiave JWT dal file env e si controlla
export const checkLinks = async (req: Request, res: Response, next: NextFunction) => {
    if ((req.body.links as LinkI[]) === undefined || (req.body.links as LinkI[]).length <= 0 ) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Please provide at least one link'
        });
    } else {
        next();
    }
}

export const checkNumberOfNodes = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.numberOfNodes === undefined || typeof req.body.numberOfNodes !== 'number') {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Please provide a valid number of nodes'
        });
    } else {
        next();
    }
}

export const checkNumberOfLinks = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.numberOfLinks === undefined || typeof req.body.numberOfLinks !== 'number') {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Please provide a valid number of links'
        });
    } else {
        next();
    }
}

//il nuovo peso deve essere un numero intero positivo
export const checkValidNewWeight = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.newWeight === undefined || typeof req.body.newWeight !== 'number' || req.body.newWeight < 0) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Please provide a valid weight'
        });
    } else {
        next();
    }
}

export const checkValidLink = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.link === undefined) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Please provide a valid link'
        });
    } else {
        next();
    }
}

export const checkValidIDGraph = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.idGraph === undefined || req.body.idGraph <= 0) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Please provide a valid graph ID'
        });
    } else {
        next();
    }
}

export const checkNodeFrom = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.from === undefined) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Please provide a starting node'
        });
    } else {
        next();
    }
}

export const checkNodeTo = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.to === undefined) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Please provide a goal node'
        });
    } else {
        next();
    }
}

export const checkRange = async (req: Request, res: Response, next: NextFunction) => {
    const start = req.body.startingValue;
    const goal = req.body.endingValue;
    if ((start === undefined || goal === undefined) || (goal < start) || (start < 0 || goal < 0)) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Please provide a valid range'
        });
    } else {
        next();
    }
}

export const checkIncrement = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.increment === undefined) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Please provide a valid increment value'
        });
    } else {
        next();
    }
}
