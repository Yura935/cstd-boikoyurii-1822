import { IContact } from "../interfaces/contact.interface";
import { IMessage } from "../interfaces/message.interface";

export class Contact implements IContact {
    constructor(
        public userName: string,
        public image: string,
        public messages: Array<IMessage>,
        public lastMessage: IMessage,
        public id?: string
    ) { }
}