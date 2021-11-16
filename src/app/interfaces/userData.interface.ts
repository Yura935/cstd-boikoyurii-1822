import { IContact } from "./contact.interface";

export interface IUserData {
    userName: string;
    email: string;
    image: string;
    contacts: Array<IContact>;
    id?: string;
}
