import { IContact } from "../interfaces/contact.interface";
import { IUserData } from "../interfaces/userData.interface";

export class UserData implements IUserData {
    constructor(
        public nickName: string,
        public email: string,
        public image: string,
        public contacts: Array<IContact>
    ) { }
}