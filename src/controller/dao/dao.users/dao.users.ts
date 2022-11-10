import { connection } from "../../../config/mysql.config";
import { User } from "../../../interface/user";
import { QUERY } from "../../../query/user.query";
import { ResultSet } from "../../user.controller/user.controller";

export class daoUsers {
    pool;

    //connessione al DB
    constructor() {
        this.pool = connection();
    }

    //scalo il credito all'utente per l'esecuzione o la creazione di un modello
    async removeTokens(email: String, amount: number) {
        //costante dove viene salvato il totale attuale del credito dell'utente
        const currentBalance = await this.getBalance(email);
        try {
            //se il costo dell'esecuzione o creazione del grafo è superiore al credito posseduto dall'utente c'è un errore
            if (currentBalance < amount) {
                throw new Error('Unsufficient balance');
            } else {
                await this.pool.query(QUERY.REMOVE_TOKENS, [
                    amount,
                    email
                ]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async addTokens(amount: number, receiver: String) {
        //si effettua la query per aggiungere il credito all'utente nel DB
        await this.pool.query(QUERY.ADD_TOKENS, [
            amount,
            receiver
        ]);
    }

    //con una select sull'utente restituisco le informazioni sul suo credito
    async getBalance(email: String): Promise<number> {
        const rs: ResultSet = await this.pool.query(QUERY.SELECT_USER, [
            email
        ])
        const user: User = rs[0] as User;
        return (user[0] as User).token;
    }
}
