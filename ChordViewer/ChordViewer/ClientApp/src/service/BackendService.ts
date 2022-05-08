import axios, {AxiosResponse} from "axios";
import {Collection, CollectionTabRelation, Tab, User} from "../models/BackendModels";
export class BackendService{
    private static axios = axios.create({
        withCredentials: true
    })
    private static config = require("./config.json");
    private static baseUrl = BackendService.config.baseUrl;
    public static LogIn(username: string, password: string): Promise<AxiosResponse<User>>{
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        return BackendService.axios.post(BackendService.baseUrl+"api/User/login", params);
    }

    public static LogOut(): Promise<AxiosResponse<User>>{
        return BackendService.axios.delete(BackendService.baseUrl+"api/User/logout");
    }

    public static GetCurrentUser(): Promise<AxiosResponse<User>>{
        return BackendService.axios.get(BackendService.baseUrl+"api/User/me");
    }

    public static GetTab(id: number): Promise<AxiosResponse<Tab>>{
        return BackendService.axios.get(BackendService.baseUrl+"api/Tab/"+id);
    }

    public static GetTabsForToneKey(toneKey: string): Promise<AxiosResponse<Tab[]>>{
        return BackendService.axios.get(BackendService.baseUrl + "api/Tab/tabsForToneKey/"+escape(toneKey));
    }

    public static SaveTab(tab: Tab): Promise<AxiosResponse>{
        return BackendService.axios.post(BackendService.baseUrl+"api/Tab/createTab", tab);
    }

    public static CreateUser(username: string, password: string){
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        return BackendService.axios.post(BackendService.baseUrl+"api/User/createUser", params);
    }

    public static UserOwnCollections(): Promise<AxiosResponse<Collection>>{
        return BackendService.axios.get(BackendService.baseUrl + "api/Collection/collectionsForUser");
    }

    public static UserSharedCollections(): Promise<AxiosResponse<Collection>>{
        return BackendService.axios.get(BackendService.baseUrl + "api/Collection/collectionsSharedWithUser");
    }

    public static CreateCollection(collection: Collection): Promise<Collection>{
        return BackendService.axios.post(BackendService.baseUrl+"api/Collection", collection);
    }

    public static GetCollection(id: number){
        return BackendService.axios.get(BackendService.baseUrl+"api/Collection/"+id);
    }

    public static ChangeCollectionPublicStatus(collectionId: number, publicStatus: boolean){
        return BackendService.axios.put(BackendService.baseUrl+"api/Collection/changePublicStatus/"+collectionId+"/"+publicStatus);
    }

    public static GetCollectionsNotContainingTab(tabId: number){
        return BackendService.axios.get(BackendService.baseUrl + "api/Collection/collectionsNotContainingTab/"+tabId);
    }

    public static CreateCollectionTabRelations(relations: CollectionTabRelation[]): Promise<CollectionTabRelation[]>{
        return BackendService.axios.post(BackendService.baseUrl+"api/CollectionTabRelation/multiple", relations);
    }

    public static GetAllUsers(): Promise<AxiosResponse<User[]>>{
        return BackendService.axios.get(BackendService.baseUrl+"api/User");
    }

    public static GetUsersForCollection(collectionId: number): Promise<AxiosResponse<User[]>>{
        return BackendService.axios.get(BackendService.baseUrl+"api/Collection/"+collectionId +"/users")
    }

    public static SetUsersForCollection(collectionId: number, userIds: number[]): Promise<AxiosResponse>{
        return BackendService.axios.put(BackendService.baseUrl+"api/Collection/"+collectionId +"/users", userIds)
    }

    public static DeleteCollection(collectionId: number){
        return BackendService.axios.delete(BackendService.baseUrl+"api/Collection/"+collectionId);
    }

    public static RemoveTabFromCollection(collectionId: number, tabId: number){
        return BackendService.axios.delete(BackendService.baseUrl+"api/CollectionTabRelation/collection/"+collectionId+"/tab/"+tabId);
    }
}