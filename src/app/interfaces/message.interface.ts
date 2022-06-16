import { File } from "../classes/file.model";

export interface IMessage {
    id: number;
    userId: string;
    message: string;
    date: Date;
    file: File;
    edited: boolean;
}
