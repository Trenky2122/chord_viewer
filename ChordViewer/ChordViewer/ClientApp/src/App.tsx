import React, {Context, createContext, useEffect, useState} from 'react';
import { Route, Routes } from 'react-router';
import './custom.css'
import {BrowserRouter} from "react-router-dom";
import Home from "./components/Home";
import NavMenu from "./components/NavMenu";
import {User} from "./models/BackendModels";
import {Constants} from "./models/Constants";
import {BackendService} from "./service/BackendService";
import LogIn from "./components/LogIn/LogIn";
import SignUp from "./components/SignUp/SignUp";
import Profile from "./components/Profile/Profile";

export const UserContext: Context<[User, (user: User)=>void]> = createContext([Constants.defaultUser, (user: User)=>{return;}])
const App = ()=>{
    useEffect(() => {
        BackendService.GetCurrentUser().then((res) => {
            setUser(res.data);
        }).catch((err)=>{
            console.log(err);
            setUser(Constants.defaultUser);
        })
    }, []);
    const [user, setUser] = useState(Constants.defaultUser);
    const userStateContext: [User, (user: User)=>void] = [user, setUser];
    return (
        <div className={"wrapper"}>
            <UserContext.Provider value={userStateContext}>
                <BrowserRouter>
                    <NavMenu />
                    <Routes>
                        <Route path={"/"} element={<Home />} />
                        <Route path={"/login"} element={<LogIn />} />
                        <Route path={"/signup"} element={<SignUp />} />
                        <Route path={"/profile"} element={<Profile />} />
                    </Routes>
                </BrowserRouter>
            </UserContext.Provider>
        </div>
    );
}
export default App;
