import axios, {AxiosResponse} from "axios";
import {User} from "../models/BackendModels";
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

    public static GetTabsForToneKey(toneKey: string){
        return BackendService.axios.get(BackendService.baseUrl + "api/Tab/tabsForToneKey/"+escape(toneKey));
    }
}