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
import { runSimulation } from "./controller/graph.controller/simulation.controller/runSimulation";
import { checkIfAdmin, checkIncrement, checkLinks, checkNodeFrom, checkNodeTo, checkNumberOfLinks, checkNumberOfNodes, checkRange, checkValidAlgorithm, checkValidAmountBody, checkValidEmailBody, checkValidEmailParam, checkValidIDGraph, checkValidJWTEnvVar, checkValidLink, checkValidNewWeight, checkValidPassword } from "./middlewares/inputchecks";

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

    //definizione delle rotte che l'utente finale può usare
    //rotta test: rotta "aggiuntiva" utilizzata in fase di test
    //rotta canon: rotta richiesta dalle specifiche dell'API
    private routes(): void {

        //rotta test -- restituisce gli utenti
        this.app.get('/users',
            [validateToken],
            (req: Request, res: Response) => getUsers(req, res)
        );

        //rotta test -- restituisce l'utente fornendo l'email con autenticazione
        this.app.get('/getUser',
            [validateToken],
            async (req: Request, res: Response) => await getUser(req, res)
        );

        //rotta canon -- effettua il login con auth JWT
        this.app.get('/login',
            [checkValidEmailParam, checkValidPassword, checkValidJWTEnvVar],
            (req: Request, res: Response) => handleLogin(req, res));

        //rotta canon -- permette all'admin di associare un credito ad un utente tramite email
        this.app.post('/chargeTokens',
            [validateToken, checkIfAdmin, checkValidAmountBody, checkValidEmailBody],
            (req: Request, res: Response) => chargeToken(req, res)
        )

        //rotta canon -- permette di creare un grafo inserendone le info sul DB
        this.app.post('/createGraph',
            [validateToken, checkLinks],
            (req: Request, res: Response) => handleGraphCreation(req, res)
        )

        //rotta test -- restituisce tutti i grafi presenti nel DB con autorizzazione
        this.app.get('/graphs',
            [validateToken],
            (req: Request, res: Response) => getGraphs(req, res)
        )

        //rotta canon -- restituisce i grafi nel DB filtrando in AND per numero di nodi e di archi
        this.app.get('/graphs/filter',
            [validateToken, checkNumberOfNodes, checkNumberOfLinks],
            (req: Request, res: Response) => getFilteredGraphs(req, res)
        );

        //rotta canon -- indicando il grafo, un arco e un nuovo peso aggiorna il peso del grafo attraverso un algoritmo base
        this.app.post('/graphs/modifyWeight',
            [validateToken, checkValidNewWeight, checkValidLink],
            (req: Request, res: Response) => modifyWeight(req, res)
        );

        //rotta test -- restituisce tutti i nodi della tabella Nodes
        this.app.get('/nodes',
            (req: Request, res: Response) => getNodes(req, res)
        )

        //rotta canon -- esegue il grafo idicato secondo l'algoritmo e la norma scelti
        this.app.get('/runGraph',
            [validateToken, checkValidAlgorithm, checkNodeFrom, checkNodeTo, checkValidIDGraph],
            (req: Request, res: Response) => runGraph(req, res)
        )

        //rotta canoc -- esegue una simulazione sulla modifica del peso di un link in modo iterativo
        this.app.post('/simulation',
            [validateToken, checkValidAlgorithm, checkRange, checkNodeFrom, checkNodeTo, checkIncrement, checkValidIDGraph],
            (req: Request, res: Response) => runSimulation(req, res)
        )

        //rotta canon -- restituisce le informazioni delle esecuzioni effettuate dell'utente autenticato
        this.app.get('/runs',
            [validateToken],
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
