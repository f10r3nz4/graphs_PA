import { Request, Response } from "express";
import { Code } from "../../enum/code.enum";
import { CustomRequest } from "../../interface/user";
import { daoLinks } from "../dao/dao.links/dao.links";

export const modifyWeight = async (req: Request, res: Response) => {
    const email = (req as CustomRequest).user.email;
    const newWeightRequested = req.body.newWeight;
    const idLink = req.body.link;


    if (newWeightRequested < 0) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Please specify a valid weight'
        })
    }

    const { newWeight, old } = await calculateNewWeight(newWeightRequested, idLink)

    return res.status(200).json({
        newWeight: newWeight,
        old: old
    })
}

const calculateNewWeight = async (newWeight: number, idLink: String) => {
    let alpha = parseFloat(process.env.ALPHA as string);

    //TODO: get the old weight of the link
    const daoLink = new daoLinks();
    const oldWeight = await daoLink.getWeightOfLinkByID(idLink);

    if (alpha === undefined) {
        alpha = 0.9;
    }

    const newWeightCalculated = alpha * oldWeight + (1 - alpha) * newWeight;
    console.log(`Old weight: ${oldWeight}, new weight: ${newWeightCalculated}`);

    console.log(newWeightCalculated)
    await daoLink.updateWeightOfLink(idLink, newWeightCalculated)

    return {
        newWeight: newWeightCalculated,
        old: oldWeight
    };
}

