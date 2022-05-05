import LocalizedStrings from "react-localization";
import List from "reactstrap/lib/List";
import {FormEvent, FormEventHandler, useContext, useEffect, useState} from "react";
import {Collection} from "../../models/BackendModels";
import ListInlineItem from "reactstrap/lib/ListInlineItem";
import {Link} from "react-router-dom";
import {BackendService} from "../../service/BackendService";
import {UserContext} from "../../App";

const Profile = ()=>{
    let localization = new LocalizedStrings({
       en: {
           myCollections: "My tab collections",
           sharedCollections: "Tab collections shared with me",
           newCollectionName: "Name of new collection: ",
           createCollection: "Create collection"
       },
       sk: {
           myCollections: "Moje kolekcie tabov",
           sharedCollections: "Kolekcie tabov zdieľané so mnou",
           newCollectionName: "Meno novej kolekcie",
           createCollection: "Vytvoriť kolekciu"
       }
    });
    let [user, setCurrentUser] = useContext(UserContext);
    let [myCollections, setMyCollections]: [Collection[], any] = useState([]);
    let [sharedCollections, setSharedCollections]: [Collection[], any] = useState([]);
    let [newCollectionName, setNewCollectionName]: [string, any] = useState("");
    let createCollection = (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        BackendService.CreateCollection({id: 0, name: newCollectionName, isPublic: false, authorId: user.id})
            .then(res => reloadCollections());
        setNewCollectionName("");
    }
    let reloadCollections = ()=>{
        BackendService.UserOwnCollections(user.id).then(res => setMyCollections(res.data));
        BackendService.UserSharedCollections(user.id).then(res => setSharedCollections(res.data));
    }
    useEffect(()=>{
       reloadCollections();
    }, [user]);
    return(
        <div className={"container-fluid"}>
            <div className={"row"}>
                <div className={"col"}>
                    <form onSubmit={(e) => createCollection(e)}>
                        <label htmlFor={"newCollectionName"}>{localization.newCollectionName}</label>
                        <input className={"ms-1"} type={"text"} id={"newCollectionName"} value={newCollectionName}
                               onChange={(e)=> setNewCollectionName(e.target.value)}/>
                        <input type={"submit"} className={"ms-1"} value={localization.createCollection}/>
                    </form>
                </div>
            </div>
            <div className={"row"}>
                <div className={"col-12 col-lg-6"}>
                    <h2>{localization.myCollections}</h2>
                    <ul>
                        {myCollections.map(col => (<li><Link to={"/collection/"+col.id}>{col.name}</Link></li>))}
                    </ul>
                </div>
                <div className={"col-12 col-lg-6"}>
                    <h2>{localization.sharedCollections}</h2>
                    <ul>
                        {sharedCollections.map(col => (<li><Link to={"/collection/"+col.id}>{col.name}</Link></li>))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Profile;