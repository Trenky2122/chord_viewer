import LocalizedStrings from "react-localization";
import {FormEvent, useContext, useEffect, useState} from "react";
import {Collection, User} from "../../models/BackendModels";
import {Link} from "react-router-dom";
import {BackendService} from "../../service/BackendService";
import {UserContext} from "../../App";
import {Button, Checkbox, Dialog, DialogContent, DialogActions, DialogTitle} from "@mui/material";

const Profile = ()=>{
    let localization = new LocalizedStrings({
       en: {
           myCollections: "My tab collections",
           sharedCollections: "Tab collections shared with me",
           newCollectionName: "Name of new collection: ",
           createCollection: "Create collection",
           collectionNameEmpty: "Collection name can not be empty.",
           collectionWithThisNameAlreadyExists: "You already have collection with this name.",
           name: "Name",
           public: "Public",
           yes: "Yes",
           no: "No",
           author: "Author",
           makePublic: "Make public",
           makePrivate: "Make private",
           share: "Share"
       },
       sk: {
           myCollections: "Moje kolekcie tabov",
           sharedCollections: "Kolekcie tabov zdieľané so mnou",
           newCollectionName: "Meno novej kolekcie",
           createCollection: "Vytvoriť kolekciu",
           collectionNameEmpty: "Meno kolekcie nesmie byť prázdne.",
           collectionWithThisNameAlreadyExists: "Vo vašich kolekciách už existuje kolekcia s daným menom.",
           name: "Meno",
           public: "Verejná",
           yes: "Áno",
           no: "Nie",
           author: "Autor",
           makePublic: "Nastaviť ako verejnú",
           makePrivate: "Nastaviť ako súkromnú",
           share: "Zdieľať"
       }
    });
    let [user, setCurrentUser] = useContext(UserContext);
    let [myCollections, setMyCollections]: [Collection[], any] = useState([]);
    let [sharedCollections, setSharedCollections]: [Collection[], any] = useState([]);
    let [newCollectionName, setNewCollectionName]: [string, any] = useState("");
    let [message, setMessage]: [string, any] = useState("");
    let [shareDialogOpen, setShareDialogOpen] = useState(false);
    let [allUsers, setAllUsers] : [User[], any] = useState([]);
    let [selectedCollectionUsers, setSellectedCollectionUsers]: [User[], any] = useState([]);

    let createCollection = (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(newCollectionName.length === 0){
            setMessage(localization.collectionNameEmpty);
            return false;
        }
        if(myCollections.findIndex(x => x.name === newCollectionName)!==-1){
            setMessage(localization.collectionWithThisNameAlreadyExists);
            return false;
        }
        BackendService.CreateCollection({id: 0, name: newCollectionName, isPublic: false, authorId: user.id})
            .then(res => reloadCollections());
        setNewCollectionName("");
        setMessage("");
    }
    let reloadCollections = ()=>{
        BackendService.UserOwnCollections().then(res => setMyCollections(res.data));
        BackendService.UserSharedCollections().then(res => setSharedCollections(res.data));
    }
    let handleSubmit = ()=>{
        BackendService.ChangeCollectionPublicStatus(clickedCollectionId, selectedCollectionPublicStatus).then(res => reloadCollections());
        setShareDialogOpen(false);
    }
    let [clickedCollectionId, setCLickedCollectionId] = useState(0);
    let [selectedCollectionPublicStatus, setSelectedCollectionPublicStatus] = useState(false);
    useEffect(()=>{
       reloadCollections();
       BackendService.GetAllUsers().then(res => setAllUsers(res.data));
    }, [user]);
    return(
        <div className={"container-fluid"}>
            <div className={"row"}>
                <div className={"col-12"}>
                    <form onSubmit={(e) => createCollection(e)}>
                        <label htmlFor={"newCollectionName"}>{localization.newCollectionName}</label>
                        <input className={"ms-1"} type={"text"} id={"newCollectionName"} value={newCollectionName}
                               onChange={(e)=> setNewCollectionName(e.target.value)}/>
                        <input type={"submit"} className={"ms-1"} value={localization.createCollection}/>
                    </form>
                </div>
                <div className={"col"} style={{color: "#FF0000", height: "20px"}}>
                    {message}
                </div>
            </div>
            <div className={"row"}>
                <div className={"col-12 col-lg-6"}>
                    <h2>{localization.myCollections}</h2>
                    <table className={"table table-light table-striped"}>
                        <thead>
                        <tr>
                            <th>{localization.name}</th>
                            <th>{localization.public}</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {myCollections.map(c => (
                            <tr>
                                <td>
                                    <Link to={"/collection/"+c.id}>{c.name}</Link>
                                </td>
                                <td>
                                    {c.isPublic? localization.yes : localization.no}
                                </td>
                                <td>
                                    <button className={"btn btn-primary"} onClick={()=>{
                                        setShareDialogOpen(true);
                                        setCLickedCollectionId(c.id);
                                        setSelectedCollectionPublicStatus(c.isPublic);
                                    }}>
                                        {localization.share}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className={"col-12 col-lg-6"}>
                    <h2>{localization.sharedCollections}</h2>
                    <table className={"table table-light table-striped"}>
                        <thead>
                        <tr>
                            <th>{localization.name}</th>
                            <th>{localization.author}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sharedCollections.map(c => (
                            <tr>
                                <td>
                                    <Link to={"/collection/"+c.id}>{c.name}</Link>
                                </td>
                                <td>
                                    {c.author?.userName}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <Dialog open={shareDialogOpen} onClose={()=>setShareDialogOpen(false)}>
                    <DialogTitle>{localization.share}</DialogTitle>
                    <DialogContent>
                        <Checkbox checked={selectedCollectionPublicStatus} onChange={event => setSelectedCollectionPublicStatus(event.target.checked)} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setShareDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Subscribe</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    )
}

export default Profile;