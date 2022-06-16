import { IMessage } from "../interfaces/message.interface";
import { File } from "./file.model";

export class Message implements IMessage {
    constructor(
        public id: number,
        public userId: string,
        public message: string,
        public date: Date,
        public file: File,
        public edited: boolean
    ) { }
}