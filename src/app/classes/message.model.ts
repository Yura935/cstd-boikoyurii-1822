import { IMessage } from "../interfaces/message.interface";

export class Message implements IMessage {
    constructor(
        public id: number | string,
        public name: string,
        public userName: string,
        public message: string,
        public date: Date
    ) { }
}