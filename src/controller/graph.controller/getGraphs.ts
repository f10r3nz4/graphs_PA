import { Request, Response } from "express";
import { Code } from "../../enum/code.enum";
import { LinkI } from "../../interface/graph";
import { CustomRequest } from "../../interface/user";
import { daoGraphs, graphI, nodeI } from "../dao/dao.graphs/dao.graphs";

export const getGraphs = async (req: Request, res: Response) => {
    const email = (req as CustomRequest).user.email;
    const daoGraph: daoGraphs = new daoGraphs();

    if (email === undefined) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'No email found'
        });
    }

    const graphs = await daoGraph.getGraphsByEmail(email);

    return res.status(200).json({
        graphs: graphs
    })
}

export const getFilteredGraphs = async (req: Request, res: Response) => {
    const email = (req as CustomRequest).user.email;
    const daoGraph: daoGraphs = new daoGraphs();
    let numberOfNodes = req.body.numberOfNodes;
    let numberOfLinks = req.body.numberOfLinks;
    
    if (numberOfLinks < 0 || numberOfNodes < 0) {
        numberOfLinks = 0;
        numberOfNodes = 0;
    }

    if (email === undefined) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'No email found'
        });
    }

    const graphs = await daoGraph.getGraphsByEmail(email);

    const filteredGraphs = graphs.filter((graph: graphI) => {
        if(graph.nodes.length === numberOfNodes && graph.links.length === numberOfLinks) {
            return graph;
        }
    })

    return res.status(Code.OK).json({
        numberOfNodes: numberOfNodes,
        numberOfLinks: numberOfLinks,
        email: email,
        graphs: filteredGraphs
    })
}


