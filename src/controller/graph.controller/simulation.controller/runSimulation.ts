import { Request, Response } from "express";
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import jwt from 'jsonwebtoken';
import { daoGraphs } from "../../dao/dao.graphs/dao.graphs";
import { createAndPopulateGraph } from '../runs.controller/createAndPopulateGraph';
import { daoUsers } from "../../dao/dao.users/dao.users";
import { CustomRequest } from "../../../interface/user";
import { Code } from "../../../enum/code.enum";
import { Graph, Node, NodeId } from "ngraph.graph";
import { runAlgorithm } from "../runs.controller/runGraph";

//interfaccia che definisce il risultato 
interface results {
    optimalCost: number,
    time: number,
    path: Node<any>[],
    startRange: number,
    endRange: number,
    weight: number
}

//eseguo la simulazione salvando tutte le informazioni interessanti nella costante
export const runSimulation = async (req: Request, res: Response) => {
    const user = (req as CustomRequest).user;
    const nodeFrom = req.body.from as String;
    const nodeTo = req.body.to as String;
    let startingValue = req.body.startingValue;
    const endingValue = req.body.endingValue;
    const increment = req.body.increment;
    const algorithm = req.body.algorithm;
    const idGraph = req.body.idGraph;
    const heuristic = req.body.heuristic;
    const daoG = new daoGraphs();
    const results: results[] = []
    let bestResult = {
        optimalCost: 0,
        time: 0 ,
        path: [] as Node<any>[],
        startRange: 0,
        endRange: 0,
        weight: 0
    };

    let from = `${nodeFrom}-${idGraph}`;
    let to = `${(nodeTo)}-${idGraph}`;
    
    //recupero il grafo dal DB, lo creo con le funzioni della libreria ngraph richiamando il run controller
    const graph = await daoG.getGraphByID(idGraph);
    const { g, cost } = await createAndPopulateGraph(graph);
    //recupero le informazioni sull'utente per controllare il credito
    const daoUser = new daoUsers();
    const balanceOfUser = await daoUser.getBalance(user.email);
    const isOriented = await daoG.orientationOfGraph(idGraph);
    if (cost > balanceOfUser) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'User does not have enough tokens to run this'
        })
    };

    //controllo sul range accettabile per la simulazione e si esegue l'algorimo richiesto prendendo la funzione da runGraph
    //utilizzo del while per una esecuzione iterativa
    while (startingValue <= endingValue) {
        const { path, optimalCost, time } = await runAlgorithm(g, algorithm, from, to, isOriented, heuristic);
        //tutti i risultati vengono salvati nella variabile
        const resultObtained= { 
            optimalCost: optimalCost,
            time: time as number,
            path: path as Node<any>[],
            startRange: startingValue,
            endRange: endingValue,
            weight: startingValue
        }
        //tra tutti i risultati ottenuti si sceglie quello con il costo ottimale migliore (il più basso)
        if (bestResult.optimalCost < optimalCost) {
            bestResult = resultObtained;
        }
        
        //aggiorno il peso del link eliminandolo e reinserendolo con il nuovo peso
        results.push(resultObtained)
        console.log(`Optimal cost: ${optimalCost}, time: ${time}`);
        g.forEachLinkedNode(nodeFrom as NodeId, function (linkedNode, link) {
            if (linkedNode.id === nodeTo) {
                g.removeLink(link);
            }
        },
            isOriented);
        console.log(`Link modified! New weight: ${startingValue}`);
        g.addLink(nodeFrom as NodeId, nodeTo as NodeId, { weight: startingValue })
        startingValue += increment;
    }

    return res.status(Code.OK).json({
        results: results,
        bestResult: bestResult
    });
}
