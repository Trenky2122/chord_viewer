import {Collection, User} from "./BackendModels";

export class Constants{
    public static get defaultUser():User{
        return {
            id: 0, userName: "", isAdmin: false
        }
    }

    public static get defaultCollection(): Collection{
        return {
            id: 0, name: "", authorId: 0, tabRelations:[], userRelations: [], isPublic: false
        }
    }
}