import { IMessage } from "./message.interface";

export interface IContact {
    userName: string;
    image: string;
    email: string,
    messages: Array<IMessage>;
    lastMessage: IMessage;
    isContact: boolean;
    id?: string;
}
