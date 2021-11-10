import { IMessage } from "./message.interface";

export interface IContact {
    userName: string;
    image: string;
    messages: Array<IMessage>;
    lastMessage: IMessage;
    id?: string;
}
