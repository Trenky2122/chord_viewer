import {User} from "./BackendModels";

export class Constants{
    public static get defaultUser():User{
        return {
            id: 0, userName: "", isAdmin: false
        }
    }
}