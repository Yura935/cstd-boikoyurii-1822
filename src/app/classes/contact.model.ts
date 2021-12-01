import { IContact } from "../interfaces/contact.interface";
import { IMessage } from "../interfaces/message.interface";

export class Contact implements IContact {
    constructor(
        public userName: string,
        public image: string,
        public email: string,
        public messages: Array<IMessage>,
        public lastMessage: IMessage,
        public isContact: boolean,
        public id?: string
    ) { }
}