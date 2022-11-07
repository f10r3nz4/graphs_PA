import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";

//esporto RS

export type ResultSet = [RowDataPacket[] | RowDataPacket[][] | OkPacket[] | ResultSetHeader, FieldPacket[]];