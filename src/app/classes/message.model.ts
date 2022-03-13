import { IMessage } from "../interfaces/message.interface";

export class Message implements IMessage {
    constructor(
        public id: number,
        public userId: string,
        public message: string,
        public date: Date,
        public edited: boolean
    ) { }
}