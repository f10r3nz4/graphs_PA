import { connection } from "../../../config/mysql.config";
import { User } from "../../../interface/user";
import { QUERY } from "../../../query/user.query";
import { ResultSet } from "../../user.controller/user.controller";

export class daoUsers {
    pool;

    constructor() {
        this.pool = connection();
    }

    async removeTokens(email: String, amount: number) {
        const currentBalance = await this.getBalance(email);
        try { 
            if(currentBalance < amount) {
                throw new Error('Unsufficient balance');
            } else {
                await this.pool.query(QUERY.REMOVE_TOKENS, [
                    amount,
                    email
                ]);
            }
        } catch(error) {
            console.error(error);
        }
    }

    async getBalance(email: String): Promise<number> {
        const rs: ResultSet = await this.pool.query(QUERY.SELECT_USER, [
            email
        ])
        return (rs[0] as User).token;
    }
}