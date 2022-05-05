import {useNavigate} from "react-router-dom";
import {BackendService} from "../../service/BackendService";
import {AxiosError} from "axios";
import LocalizedStrings from "react-localization";
import {useContext, useState} from "react";
import {UserContext} from "../../App";
import {Button} from "reactstrap";

const SignUp = () => {
    let navigate = useNavigate();
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if(password !== password2){
            setMessage(localization.passwordsDoNotMatch);
            return false;
        }
        if(password.length < 8){
            setMessage(localization.passwordTooShort);
            return false;
        }
        BackendService.CreateUser(username, password).then((res)=> {
            setCurrentUser(res.data);
            navigate("/");
        }).catch((err: AxiosError)=> {
            if(err.response!.status === 400){
                setMessage(localization.usernameAlreadyExists);
            }
        });
    }
    const localization = new LocalizedStrings({
        en: {
            username: "Username",
            password: "Password",
            password2: "Repeat password",
            submit: "Create account",
            submitFailed: "Wrong username or password",
            submitSuccessful: "You logged in successfully",
            usernameAlreadyExists: "User with given username already exists",
            passwordsDoNotMatch: "Passwords do not match",
            passwordTooShort: "Password must be at least 8 characters long",
        },
        sk: {
            username: "Používateľské meno",
            password: "Heslo",
            password2: "Zopakujte heslo",
            submit: "Vytvoriť účet",
            submitFailed: "Neprávne používateľské meno alebo heslo",
            submitSuccessful: "Prihásenie bolo úspešné",
            usernameAlreadyExists: "Používateľ s daným menom už existuje",
            passwordsDoNotMatch: "Heslá sa nezhodujú",
            passwordTooShort: "Heslo musí obsahovať aspoň 8 znakov",
        }
    });
    let [currentUser, setCurrentUser] = useContext(UserContext);
    if(currentUser.id !== 0)
        navigate("/");
    const [username, setUsername]: [string, any] = useState("");
    const [password, setPassword]: [string, any] = useState("");
    const [password2, setPassword2]: [string, any] = useState("");
    const [message, setMessage]: [string, any] = useState("");
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
                    <div className={"col"}>
                        <label className={"float-end"} htmlFor={"password2"}>{localization.password2}</label>
                    </div>
                    <div className={"col"}>
                        <input autoComplete={"current-password"} id={"password2"} required type={"password"} value={password2} onChange={(e) => {
                            setPassword2(e.target.value)
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

export default SignUp;