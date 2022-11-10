import { Request, Response } from "express";
import { Code } from "../../enum/code.enum";
import { GraphI, LinkI } from "../../interface/graph";
import { CustomRequest } from "../../interface/user";
import { daoGraphs } from "../dao/dao.graphs/dao.graphs";
import { daoLinks } from "../dao/dao.links/dao.links";
import { daoNodes } from "../dao/dao.nodes/dao.nodes";
import { daoUsers } from "../dao/dao.users/dao.users";

//gestisce la creazione del grafo intesa come inserimento di nodi e link nelle rispettive tabelle
//le informazioni vengono inserite nella tabella grafo insieme all'identificativo dell'utente che lo crea
//si utilizza DAO per interagire con il DB
export const handleGraphCreation = async (req: Request, res: Response) => {
    const links = req.body.links as LinkI[]; //richiamo gli archi con l'interfaccia
    let oriented = req.body.oriented;
    //recupero le informazioni interessanti dall'utente loggato
    const email = (req as CustomRequest).user.email;
    const balance = (req as CustomRequest).user.token;
    
    const dao: daoGraphs = new daoGraphs();
    const daoForNodes: daoNodes = new daoNodes();
    const daoForLinks: daoLinks = new daoLinks();
    const daoForUser: daoUsers = new daoUsers();

    if (email === undefined) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'No email found'
        });
    }

    if (balance === undefined) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Balance was undefined'
        });
    }

    if (links === undefined) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Body is missing'
        });
    }

    if (links === undefined) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Please specify your links'
        });
    }

    if (links.length < 1) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Please provide at least one link'
        });
    }
    //si setta l'orientamento del grafo come non orientato di default
    if (oriented === undefined) {
        oriented = false;
    }
    //controllo che l'utente abbia abbastanza credito per creare il grafo
    const { userHaveEnoughTokens, cost } = doesUserHaveEnoughTokens({ oriented: oriented, links: links }, balance);
    if (!userHaveEnoughTokens) {
        return res.status(401).json({
            message: 'You don\'n have enough tokens to create this graph'
        })
    }

    try {
        await dao.createGraph(email, oriented); //crea il grafo sul database tramite il DAO
        //recupera il grafo creato come ultimo grafo creato dall'utente recuperandolo dall'email
        const graphs = await dao.getGraphsByEmail(email); 
        let lastGraphCreated;
        if (graphs.length > 0) {
            lastGraphCreated = graphs[graphs.length - 1];
        } else {
            lastGraphCreated = graphs[0];
        }
        //prendo le informazioni che definiscono il grafo
        for (let i = 0; i < links.length; i++) {
            const fromNode = links[i].from;
            const toNode = links[i].to;
            const weight = links[i].weight;
        //inserisco le informazioni del grafo nelle relative tabelle attraverso i DAO
            await daoForNodes.addNode(
                `${fromNode}-${lastGraphCreated.id}`,
                fromNode,
                lastGraphCreated.id
            );
            await daoForNodes.addNode(
                `${toNode}-${lastGraphCreated.id}`,
                toNode,
                lastGraphCreated.id
            );
            await daoForLinks.addLinkToGraph(
                fromNode,
                toNode,
                weight,
                lastGraphCreated.id,
            )
            await daoForUser.removeTokens(email, cost); //rimuovo il credito necessario per la creazione 
        }
    } catch (error) {
        console.error(error);
        return res.status(Code.INTERNAL_SERVER_ERROR).json({
            message: 'Something went wrong',
            error: (error as Error).message
        })
    }

    return res.status(Code.OK).json({
        message: 'Graph created in DB',
        cost: cost
    })
}
//conteggio del credito necessario
const doesUserHaveEnoughTokens = (graphToBuild: GraphI, balance: number): {
    userHaveEnoughTokens: boolean,
    cost: number
} => {
    const nodesToAdd = new Map<String, boolean>(); //nome nodo e flag di creazione
    const linksToAdd = new Map<String, boolean>(); //nome arco e flag di creazione
    let cost = 0; //costo di partenza
    let userHasEnoughTokens = false; //set di default
    //setta i costi necessari per la creazione
    const costsForAction = {
        node: 0.25,
        link: 0.01
    };
    //conta il costo totale come somma di nodo di partenza, di arrivo e arco
    graphToBuild.links.map((link) => {
        if (!nodesToAdd.get(link.from)) {
            nodesToAdd.set(link.from, true);
            cost += costsForAction.node;
        }
        if (!nodesToAdd.get(link.to)) {
            nodesToAdd.set(link.to, true);
            cost += costsForAction.node;
        }
        const idLink = `${link.from}-${link.to}`;
        if (!linksToAdd.get(idLink)) {
            nodesToAdd.set(idLink, true);
            cost += costsForAction.link;
        }
    })

    console.log(`Cost for the creation of this graph: ${cost}. \nUser balance: ${balance}`);
    if (balance >= cost) { //controllo effettivo che l'utente abbia abbastanza token per creare il grafo
        userHasEnoughTokens = true;
    }
    return {
        userHaveEnoughTokens: userHasEnoughTokens,
        cost: cost
    };
}
