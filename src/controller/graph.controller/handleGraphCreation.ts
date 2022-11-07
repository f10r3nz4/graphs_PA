import { Request, Response } from "express";
import { Code } from "../../enum/code.enum";
import { GraphI, LinkI } from "../../interface/graph";
import { CustomRequest } from "../../interface/user";
import { daoGraphs } from "../dao/dao.graphs/dao.graphs";
import { daoLinks } from "../dao/dao.links/dao.links";
import { daoNodes } from "../dao/dao.nodes/dao.nodes";
import { daoUsers } from "../dao/dao.users/dao.users";

//TODO: do same thing for links as done with nodes (add them in database when user create a new graph in db)
export const handleGraphCreation = async (req: Request, res: Response) => {
    const links = req.body.links as LinkI[];
    let oriented = req.body.oriented;
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

    if (oriented === undefined) {
        oriented = false;
    }

    const { userHaveEnoughTokens, cost } = doesUserHaveEnoughTokens({ oriented: oriented, links: links }, balance);
    if (!userHaveEnoughTokens) {
        return res.status(400).json({
            message: 'You don\'n have enough tokens to create this graph'
        })
    }

    try {
        await dao.createGraph(email, oriented);
        const graphs = await dao.getGraphsByEmail(email);
        let lastGraphCreated;
        if (graphs.length > 0) {
            lastGraphCreated = graphs[graphs.length - 1];
        } else {
            lastGraphCreated = graphs[0];
        }
        for (let i = 0; i < links.length; i++) {
            const fromNode = links[i].from;
            const toNode = links[i].to;
            const weight = links[i].weight;

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
            await daoForUser.removeTokens(email, cost);
        }
    } catch (error) {
        console.error(error);
        return res.status(Code.OK).json({
            message: 'Something went wrong',
            error: (error as Error).message
        })
    }

    return res.status(Code.OK).json({
        message: 'Graph created in DB',
        cost: cost
    })
}

const doesUserHaveEnoughTokens = (graphToBuild: GraphI, balance: number): {
    userHaveEnoughTokens: boolean,
    cost: number
} => {
    const nodesToAdd = new Map<String, boolean>();
    const linksToAdd = new Map<String, boolean>();
    let cost = 0;
    let userHasEnoughTokens = false;

    const costsForAction = {
        node: 0.25,
        link: 0.01
    };
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
    if (balance >= cost) {
        userHasEnoughTokens = true;
    }
    return {
        userHaveEnoughTokens: userHasEnoughTokens,
        cost: cost
    };
}