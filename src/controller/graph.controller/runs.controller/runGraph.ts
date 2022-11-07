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

export const runGraph = async (req: Request, res: Response) => {
    const user = (req as CustomRequest).user;
    const daoGraph: daoGraphs = new daoGraphs();
    const algorithm = req.body.algorithm;
    const idGraph = req.body.idGraph;
    const heuristic = req.body.heuristic;
    let from = `${(req.body.from as String)}-${idGraph}`;
    let to = `${(req.body.to as String)}-${idGraph}`;
    const availableAlgos = ['astar', 'agreedy', 'nba'];

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
    //TODO: check if the graph exists
    const graph = await daoGraph.getGraphByID(idGraph);
    const { g, cost } = await createAndPopulateGraph(graph);
    const isOriented = await daoGraph.orientationOfGraph(idGraph);

    const { path, optimalCost, time } = await runAlgorithm(g, algorithm, from, to, isOriented, heuristic);

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

const createAndPopulateGraph = async (graph: graphI) => {

    const g = createGraph();
    let cost = 0;

    graph.nodes.map((node) => {
        console.log(`Added node: ${node.id}`);
        g.addNode(`${node.id}`);
        cost += 0.01;
    })

    graph.links.map((link: any) => {
        console.log(`Added link: from: ${link.node_from}, to: ${link.node_to}, weight: ${link.weight}`)
        g.addLink(`${link.node_from}`, `${link.node_to}`, { weight: link.weight });
        cost += 0.25;
    })


    return {
        g: g,
        cost: cost
    };
}

const runAlgorithm = async (graph: Graph<any, any>, algorithm: String, from: String, to: String, isOriented: boolean, heuristic: number) => {
    let path, pathfinder;
    
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
    let time;
    if (pathfinder !== undefined) {
        const startTimer = new Date().getMilliseconds();
        path = pathfinder.find(from as NodeId, to as NodeId);
        const endTimer = new Date().getMilliseconds();
        console.log(startTimer, endTimer)
        time = endTimer - startTimer;
    }
    const optimalCost = await getCostOfRun(path);
    return {
        path: path,
        optimalCost: optimalCost,
        time: time
    };
}

const getCostOfRun = async (path: any): Promise<number> => {
    const daoLink = new daoLinks();
    let costOfRun = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const nodeFrom = path[i].id;
        const nodeTo = path[i + 1].id
        let weightOfLink = await daoLink.getWeightOfLink(
            nodeFrom,
            nodeTo
        )
        costOfRun += weightOfLink;
    }
    return costOfRun;
}

