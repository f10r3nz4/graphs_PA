import express, { Application, NextFunction, Request, Response, Router } from "express";
import ip from "ip";
import cors from 'cors';
import { chargeToken, getUser, getUsers, handleLogin } from "./controller/user.controller/user.controller";
import { Code } from "./enum/code.enum";
import { validateToken } from "./middlewares/validate.token";
import { handleGraphCreation } from "./controller/graph.controller/handleGraphCreation";
import { getFilteredGraphs, getGraphs } from "./controller/graph.controller/getGraphs";
import { getNodes } from "./controller/graph.controller/getNodes";
import { runGraph } from "./controller/graph.controller/runs.controller/runGraph";
import { getRuns } from "./controller/graph.controller/runs.controller/getRuns";
import { modifyWeight } from "./controller/graph.controller/modifyWeight";

//configurazione con il DB
require('dotenv').config();

export class App {
    private readonly app: Application;
    private readonly APPLICATION_RUNNING = 'APPLICATION IS RUNNING ON:';
    private readonly ROUTE_NOT_FOUND = "ROUTE NOT FOUND";

    constructor(private readonly port: (string | number) = process.env.SERVER_PORT || 3000) {
        this.app = express();
        this.middleWare();
        this.routes();
    }

    listen(): void {
        this.app.listen(this.port);
        console.info(`${this.APPLICATION_RUNNING} ${ip.address()}:${this.port}`);
    }

    private middleWare(): void {
        this.app.use(cors({ origin: '*' }));
        this.app.use(express.json());
    }
    private routes(): void {
        //restituisce gli utenti
        this.app.get('/users',
            async (req: Request, res: Response, next: NextFunction) => await validateToken(req, res, next),
            (req: Request, res: Response) => getUsers(req, res)
        );
        //restituisce l'utente fornendo l'email
        this.app.get('/getUser',
            async (req: Request, res: Response, next: NextFunction) => await validateToken(req, res, next),
            async (req: Request, res: Response) => await getUser(req, res)
        );
        //effettua il lokin con auth JWT
        this.app.get('/login', (req: Request, res: Response) => handleLogin(req, res));
        //permette all'admin di associare un credito ad un utente tramite email
        this.app.post('/chargeTokens',
            async (req: Request, res: Response, next: NextFunction) => await validateToken(req, res, next),
            (req: Request, res: Response) => chargeToken(req, res)
        )
        //permette di creare un grafo inserendone le info sul DB
        this.app.post('/createGraph',
            async (req: Request, res: Response, next: NextFunction) => await validateToken(req, res, next),
            (req: Request, res: Response) => handleGraphCreation(req, res)
        )
        //restituisce tutti i grafi presenti nel DB
        this.app.get('/graphs',
            async (req: Request, res: Response, next: NextFunction) => await validateToken(req, res, next),
            (req: Request, res: Response) => getGraphs(req, res)
        )
        this.app.get('/graphs/filter',
            async (req: Request, res: Response, next: NextFunction) => await validateToken(req, res, next),
            (req: Request, res: Response) => getFilteredGraphs(req, res)
        );
        this.app.post('/graphs/modifyWeight',
            async (req: Request, res: Response, next: NextFunction) => await validateToken(req, res, next),
            (req: Request, res: Response) => modifyWeight(req, res)
        );
        //restituisce tutti i nodi della tabella Nodes
        this.app.get('/nodes',
            (req: Request, res: Response) => getNodes(req, res)
        )
        //esegue il grafo secondo l'algoritmo scelto
        this.app.get('/runGraph',
            async (req: Request, res: Response, next: NextFunction) => await validateToken(req, res, next),
            (req: Request, res: Response) => runGraph(req, res)
        )
        this.app.get('/runs',
            async (req: Request, res: Response, next: NextFunction) => await validateToken(req, res, next),
            (req: Request, res: Response) => getRuns(req, res)
        );
        //rotta base
        this.app.get('/', (_: Request, res: Response) => res.status(Code.OK).json({
            message: 'RUNNING'
        }));
        //errore
        this.app.all('*', (_: Request, res: Response) => res.status(Code.NOT_FOUND).json({
            message: this.ROUTE_NOT_FOUND
        }));
    }
}