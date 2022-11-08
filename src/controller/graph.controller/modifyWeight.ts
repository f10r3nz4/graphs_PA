import { Request, Response } from "express";
import { Code } from "../../enum/code.enum";
import { CustomRequest } from "../../interface/user";
import { daoLinks } from "../dao/dao.links/dao.links";

//permette all'utente di modificare il peso di un arco
export const modifyWeight = async (req: Request, res: Response) => {
    const email = (req as CustomRequest).user.email;
    //dal corpo della richiesta si prende il nuovo peso e l'arco relativo
    const newWeightRequested = req.body.newWeight;
    const idLink = req.body.link;

    //il nuovo peso deve essere un numero intero positivo
    if (newWeightRequested < 0) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Please specify a valid weight'
        })
    }
    //richiamo la funzione che calcola il nuovo peso
    const { newWeight, old } = await calculateNewWeight(newWeightRequested, idLink)

    return res.status(200).json({
        newWeight: newWeight,
        old: old
    })
}
//funzione che calcola il nuovo peso dell'arco indicato tramite id
const calculateNewWeight = async (newWeight: number, idLink: String) => {
    //alpha è una costante che è salva in env ed è un valore tra 0 e 1 estremi non compresi
    let alpha = parseFloat(process.env.ALPHA as string);
    //mi collego alla tabella dei Links tramite DAO
    const daoLink = new daoLinks();
    //prendo il vecchio peso del link tramite id dello stesso
    const oldWeight = await daoLink.getWeightOfLinkByID(idLink);
    //se non è in grado di recuperare il valore di alpha dall'env o c'è qualche errore associa 0.9
    if (alpha === undefined) {
        alpha = 0.9;
    }

    //calcola i nuovi peso tramite l'espressione
    const newWeightCalculated = alpha * oldWeight + (1 - alpha) * newWeight;
    console.log(`Old weight: ${oldWeight}, new weight: ${newWeightCalculated}`);

    console.log(newWeightCalculated)
    //passo il peso aggiornato
    await daoLink.updateWeightOfLink(idLink, newWeightCalculated)

    return {
        newWeight: newWeightCalculated,
        old: oldWeight
    };
}

