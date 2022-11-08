import { Request, Response } from "express";
import { Code } from "../../../enum/code.enum"
import { CustomRequest } from "../../../interface/user";
import { daoGraphs, graphI } from "../../dao/dao.graphs/dao.graphs";
import createGraph, { Graph, NodeId } from "ngraph.graph";
import path, { aStar, aGreedy, nba } from 'ngraph.path';
import { daoUsers } from "../../dao/dao.users/dao.users";
import { daoRuns } from "../../dao/dao.runs/dao.runs";
import { daoLinks } from "../../dao/dao.links/dao.links";
import {l1, l2} from '../../../heuristics/heuristics';

//calcola il percorso ottimo di un grafo tramite algoritmi a scelta
export const runGraph = async (req: Request, res: Response) => {
    const user = (req as CustomRequest).user;
    const daoGraph: daoGraphs = new daoGraphs();
    const algorithm = req.body.algorithm;
    const idGraph = req.body.idGraph;
    const heuristic = req.body.heuristic;
    //l'utente inserisce il nome del nodo di partenza e arrivo per l'algoritmo e viene trasformato in nome nodo+id grafo per indicare l'id del nodo
    let from = `${(req.body.from as String)}-${idGraph}`;
    let to = `${(req.body.to as String)}-${idGraph}`;
    const availableAlgos = ['astar', 'agreedy', 'nba']; //salvo i nomi degli algoritmi possibili in una costante

    if (from === undefined || to === undefined) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Please specify a starting point and a goal'
        });
    }

    console.log(`FROM: ${from}`, to);

    if (idGraph === undefined || idGraph <= 0) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Graph ID parameter is undefined or invalid'
        });
    }

    if (algorithm === undefined || !availableAlgos.includes(algorithm.toLowerCase())) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'This algorithm is not available'
        });
    }
    
    //recupera il grafo dal DB con ID
    const graph = await daoGraph.getGraphByID(idGraph);
    //salvo il grafo e il costo dell'esecuzione
    const { g, cost } = await createAndPopulateGraph(graph);
    const isOriented = await daoGraph.orientationOfGraph(idGraph);
 
    const { path, optimalCost, time } = await runAlgorithm(g, algorithm, from, to, isOriented, heuristic);

    //salvo l'esecuzione nel DB associandola all'utente
    try {
        if (time !== undefined) {
            const DAOUsers = new daoUsers();
            const DAORuns = new daoRuns();
            await DAOUsers.removeTokens(user.email, cost);
            await DAORuns.addRun(
                cost,
                graph.id,
                from,
                to,
                time,
                optimalCost
            )

        }

    } catch (error) {
        console.error(error);
    }

    return res.status(200).json({
        message: 'OK',
        graph: graph,
        path: path,
        cost: cost,
        time: time,
        optimalCost: optimalCost,
        oriented: isOriented,
        heuristic: heuristic === 1 ? 'Euclid distance' : 'Manhattan distance'
    })
}

//il grafo alla creazione veniva solo salvato nel db, adesso con createGraph dalla libreria graph viene effettivamente creato
const createAndPopulateGraph = async (graph: graphI) => {
    
    //creo il grafo e lo salvo nella costante
    const g = createGraph();
    //inizializzo il costo necessario alla creazione e quindi all'esecuzione
    let cost = 0;

    //aggiungo i nodi con il costo
    graph.nodes.map((node) => {
        console.log(`Added node: ${node.id}`);
        g.addNode(`${node.id}`);
        cost += 0.25;
    })

    //aggiungo gli archi con il costo
    graph.links.map((link: any) => {
        console.log(`Added link: from: ${link.node_from}, to: ${link.node_to}, weight: ${link.weight}`)
        g.addLink(`${link.node_from}`, `${link.node_to}`, { weight: link.weight });
        cost += 0.01;
    })


    return {
        g: g,
        cost: cost
    };
}

//esecuzione del modello tramite algoritmo definito nella libreria graph.path
const runAlgorithm = async (graph: Graph<any, any>, algorithm: String, from: String, to: String, isOriented: boolean, heuristic: number) => {
    let path, pathfinder;
    
    //l'utente indica uno dei tre algoritmi e indica anche l'euristica da usare, norma 1 o norma 2
    switch (algorithm) {
        case 'astar':
            pathfinder = aStar(
                graph, {
                
                oriented: isOriented,
                distance(fromNode, toNode, link) {
                    return link.data.weight;
                },
                heuristic(fromNode, toNode) {
                    if(heuristic === 2) {
                        return l2(fromNode, toNode);
                    } else {
                        return l1(fromNode, toNode);
                    }
                }
            });
            break;
        case 'agreedy':
            pathfinder = aGreedy(
                graph, {
                oriented: isOriented,
                distance(fromNode, toNode, link) {
                    return link.data.weight;
                },
                heuristic(fromNode, toNode) {
                    if(heuristic === 2) {
                        return l2(fromNode, toNode);
                    } else {
                        return l1(fromNode, toNode);
                    }
                }
            }
            )
            break;
        default:
            pathfinder = nba(
                graph, {
                oriented: isOriented,
                distance(fromNode, toNode, link) {
                    return link.data.weight;
                },
                heuristic(fromNode, toNode) {
                    if(heuristic === 2) {
                        return l2(fromNode, toNode);
                    } else {
                        return l1(fromNode, toNode);
                    }
                }
            }
            )
    }
    //calcolo il tempo necessario dall'inizio dell'esecuzione alla fine
    let time;
    if (pathfinder !== undefined) {
        const startTimer = new Date().getMilliseconds();
        path = pathfinder.find(from as NodeId, to as NodeId);
        const endTimer = new Date().getMilliseconds();
        console.log(startTimer, endTimer)
        time = endTimer - startTimer;
    }
    //salvo in una costante il costo del percorso
    const optimalCost = await getCostOfRun(path);
    return {
        path: path,
        optimalCost: optimalCost,
        time: time
    };
}

//recupera il costo (somma dei pesi) del percorso calcolato 
const getCostOfRun = async (path: any): Promise<number> => {
    const daoLink = new daoLinks();
    //inizializzo il costo del percorso a 0
    let costOfRun = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const nodeFrom = path[i].id;
        const nodeTo = path[i + 1].id
        //per tutti i nodi del percorso ottimo prendo i pesi degli archi e li sommo
        let weightOfLink = await daoLink.getWeightOfLink(
            nodeFrom,
            nodeTo
        )
        costOfRun += weightOfLink;
    }
    return costOfRun;
}

