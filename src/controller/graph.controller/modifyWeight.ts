import { Request, Response } from "express";
import { Code } from "../../enum/code.enum";
import { daoLinks } from "../dao/dao.links/dao.links";

//permette all'utente di modificare il peso di un arco
export const modifyWeight = async (req: Request, res: Response) => {
    //dal corpo della richiesta si prende il nuovo peso e l'arco relativo
    const newWeightRequested = req.body.newWeight;
    const idLink = req.body.link as String;
    const daolinks = new daoLinks();

    const idSplitted = idLink.trim().split("-");
    const idGraph = idSplitted[2];
    
    const isLinkValid = await daolinks.linkExists(`${idSplitted[0]}-${idGraph}`, `${idSplitted[1]}-${idGraph}`);

    if(!isLinkValid) {
        return res.status(Code.BAD_REQUEST).json({
            message: 'Link not found'
        })
    }
    //richiamo la funzione che calcola il nuovo peso
    const { newWeight, old } = await calculateNewWeight(newWeightRequested, idLink)

    return res.status(Code.OK).json({
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

    //passo il peso aggiornato
    await daoLink.updateWeightOfLink(idLink, newWeightCalculated)

    return {
        newWeight: newWeightCalculated,
        old: oldWeight
    };
}

