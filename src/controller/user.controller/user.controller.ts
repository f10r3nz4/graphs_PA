import { Request, Response } from "express";
import { connection } from "../../config/mysql.config";
import { CustomRequest, User } from "../../interface/user";
import { QUERY } from "../../query/user.query";
import { Code } from "../../enum/code.enum";
import { Status } from "../../enum/status.enum";
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import jwt from 'jsonwebtoken';
import { ResultSet } from "../../types/ResultSet";


//restituisce gli utenti esistenti tramite una select sul DB
export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`);
    try {
        const pool = connection();
        const result: ResultSet = await pool.query(QUERY.SELECT_USERS);

        return res.status(Code.OK)
            .json({
                status: Status.OK,
                userRetrieved: result[0]
            })
    } catch (error: unknown) {
        console.error(error);
        return res.status(Code.INTERNAL_SERVER_ERROR)
            .json({
                code: Code.INTERNAL_SERVER_ERROR,
                status: Status.INTERNAL_SERVER_ERROR,
                message: 'An error occurred'
            })
    }
}

//restituisce le informazioni sull'utente richiamato tramite email
export const getUser = async (req: Request, res: Response): Promise<Response> => {
    console.info(`[${new Date().toLocaleString()}] New users request`);
    const userEmail = req.query.email as string;

    const user = await getUserByEmail(userEmail);
    return res.status(user.code).json(user)
}

//gestisce il login tramite email e password con una select e un confronto coi dati nel DB
export const handleLogin = async (req: Request, res: Response) => {
    const email = req.query.email as String;
    const password = req.query.password as String;

    //si effettua la connessione con il DB per effettuare la query
    const pool = connection();
    const result: ResultSet = await pool.query(QUERY.SELECT_USER, [email]);
    const userData = result[0] as User;
    const option = { expiresIn: '1h' }
    

    if (password !== (userData[0] as User).password as String) {
        return res.status(Code.UNAUTHORIZED).json({
            message: 'Unauthorized'
        })
    } else {
    //con i metodi messi a disposizione da JWT si crea un token a partire dalla chiave salvata in env
        const token = jwt.sign( 
            (userData[0] as User),
            process.env.JWT_SECRET!,
            option
        );
        return res.status(200).json({
            message: result[0],
            token: token
        })
    }
}

//permette all'utente admin di aggiungere un credito (token) all'utente
export const chargeToken = async (req: Request, res: Response) => {
    const receiver = req.body.email;
    const amount = req.body.amount;

    //recupero l'utente
    const user = await getUserByEmail(receiver);

    if(user.code === Code.NOT_FOUND) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'This user does not exist'
        })
    }
    
    return res.status(Code.OK).json({
        message: `Receiver: ${receiver} received: ${amount} tokens`
    }); 
}
//recupera le informazioni dell'utente attraverso una select a partire dall'email
//le informazioni vengono salvate in una costante
const getUserByEmail = async (email: string) => {
    if (email === undefined) {
        return {
            code: Code.BAD_REQUEST,
            message: 'Please provide a valid email for the user'
        }
    }

    try {
        const pool = connection();
        //effettuo la select sul DB
        const result: ResultSet = await pool.query(QUERY.SELECT_USER, [email]);
        //ritorno le informazioni richieste o gli eventuali errori
        if ((result[0] as Array<ResultSet>).length > 0) {
            return {
                message: 'User retrieved',
                user: result[0],
                code: Code.OK
            }
        } else {
            return {
                message: 'User not found',
                code: Code.NOT_FOUND
            }
        }
    } catch (error: unknown) {
        return {
            message: 'An error occured',
            code: Code.INTERNAL_SERVER_ERROR
        }
    }
}

export { ResultSet };
