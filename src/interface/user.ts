import RowDataPacket from "mysql2/typings/mysql/lib/protocol/packets/RowDataPacket";
import { ResultSet } from "../controller/user.controller/user.controller";
import { Request } from 'express';

export interface User extends ResultSet {
    id: number;
    email: string;
    password: string;
    role: string;
    token: number;
}

export interface CustomRequest extends Request {
    user: {
        id: number;
        email: string;
        role: string;
        token: number
    }
};