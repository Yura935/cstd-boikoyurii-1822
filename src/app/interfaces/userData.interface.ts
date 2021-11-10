import { IContact } from "./contact.interface";

export interface IUserData {
    nickName: string;
    email: string;
    image: string;
    contacts: Array<IContact>;
}
