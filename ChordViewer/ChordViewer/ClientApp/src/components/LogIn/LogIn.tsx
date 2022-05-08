import {useNavigate} from "react-router-dom";
import {BackendService} from "../../service/BackendService";
import {useContext, useState} from "react";
import {AxiosError} from "axios";
import {UserContext} from "../../App";
import LocalizedStrings from "react-localization";
import {Button} from "reactstrap";

const LogIn = ()=>{
    let navigate = useNavigate();
    let [currentUser, setCurrentUser] = useContext(UserContext);
    if(currentUser.id !== 0)
        navigate("/");
    const handleSubmit = (e: any) => {
        e.preventDefault();
        BackendService.LogIn(username, password).then((res)=> {
            setCurrentUser(res.data);
        }).catch((err: AxiosError)=> {
            if(err.response!.status === 401){
                setMessage(localization.submitFailed);
            }
        });
    }
    let [message, setMessage] = useState("");
    const localization = new LocalizedStrings({
        en: {
            username: "Username",
            password: "Password",
            submit: "Submit",
            submitFailed: "Wrong username or password",
            submitSuccessful: "You logged in successfully",
            forgotPassword: "Forgot password"
        },
        sk: {
            username: "Používateľské meno",
            password: "Heslo",
            submit: "Prihlásiť",
            submitFailed: "Neprávne používateľské meno alebo heslo",
            submitSuccessful: "Prihásenie bolo úspešné",
            forgotPassword: "Zabudnuté heslo"
        }
    });
    const [username, setUsername]: [string, any] = useState("");
    const [password, setPassword]: [string, any] = useState("");
    return (
        <div className={"container-fluid"}>
            <form onSubmit={handleSubmit}>
                <div className={"row"}>
                    <div className={"col"}>
                        <label className={"float-end"} htmlFor={"username"}>{localization.username}</label>
                    </div>
                    <div className={"col"}>
                        <input autoComplete={"username"} id={"username"} type={"text"} required value={username} onChange={(e) => {
                            setUsername(e.target.value)
                        }}/>
                    </div>
                </div>
                <div className={"row mt-1"}>
                    <div className={"col"}>
                        <label className={"float-end"} htmlFor={"password"}>{localization.password}</label>
                    </div>
                    <div className={"col"}>
                        <input autoComplete={"current-password"} id={"password"} required type={"password"} value={password} onChange={(e) => {
                            setPassword(e.target.value)
                        }}/>
                    </div>
                </div>
                <div className={"row mt-1"}>
                    <div className={"col"}/>
                    <div className={"col"}>
                        <Button variant={"contained"} color={"primary"} type={"submit"}>{localization.submit}</Button>
                    </div>
                </div>
                <div className={"row mt-1"}>
                    <div className={"col"}/>
                    <div className={"col"} style={{"color":"#FF0000"}}>
                        {message}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default LogIn;