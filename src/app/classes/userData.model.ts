import { IContact } from "../interfaces/contact.interface";
import { IUserData } from "../interfaces/userData.interface";

export class UserData implements IUserData {
    constructor(
        public userName: string,
        public image: string,
        public email: string,
        public contacts: Array<IContact>,
        public backgroundChat: string,
        public id?: string
    ) { }
}