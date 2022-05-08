import LocalizedStrings from "react-localization";
import {FormEvent, useContext, useEffect, useState} from "react";
import {Collection, User} from "../../models/BackendModels";
import {Link} from "react-router-dom";
import {BackendService} from "../../service/BackendService";
import {UserContext} from "../../App";
import {
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    FormControlLabel,
    Snackbar, Alert
} from "@mui/material";
import {SnackbarStatus} from "../../models/LocalModels";

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
           share: "Share",
           selectUsers: "Select users that can access this collection.",
           save: "Save",
           cancel: "Cancel",
           success: "Sucessfully saved.",
           error: "Something went wrong."
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
           share: "Zdieľať",
           selectUsers: "Zvoľte používateľov, pre ktorých bude táto kolekcia prístupná.",
           save: "Uložiť",
           cancel: "Zrušiť",
           success: "Úspešne uložené.",
           error: "Nasatala chyba."
       }
    });
    let [user, setCurrentUser] = useContext(UserContext);
    let [myCollections, setMyCollections]: [Collection[], any] = useState([]);
    let [sharedCollections, setSharedCollections]: [Collection[], any] = useState([]);
    let [newCollectionName, setNewCollectionName]: [string, any] = useState("");
    let [message, setMessage]: [string, any] = useState("");
    let [shareDialogOpen, setShareDialogOpen] = useState(false);
    let [snackbarOpen, setSnackbarOpen] = useState(SnackbarStatus.Hidden);
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
            .then(res => {
                reloadCollections();
                setSnackbarOpen(SnackbarStatus.Success);
            }).catch(()=>{
                setSnackbarOpen(SnackbarStatus.Error);
        });
        setNewCollectionName("");
        setMessage("");
    }

    let openShareDialog = (c: Collection) => {
        BackendService.GetUsersForCollection(c.id).then(res => setSellectedCollectionUsers(res.data));
        setShareDialogOpen(true);
        setSelectedCollectionId(c.id);
        setSelectedCollectionPublicStatus(c.isPublic);
    }

    let reloadCollections = ()=>{
        BackendService.UserOwnCollections().then(res => setMyCollections(res.data));
        BackendService.UserSharedCollections().then(res => setSharedCollections(res.data));
    }
    let handleSubmit = ()=>{
        console.log(selectedCollectionUsers);
        BackendService.ChangeCollectionPublicStatus(selectedCollectionId, selectedCollectionPublicStatus).then(res => reloadCollections());
        BackendService.SetUsersForCollection(selectedCollectionId, selectedCollectionUsers.map(x => x.id))
            .then(()=>setSnackbarOpen(SnackbarStatus.Success)).catch(()=>setSnackbarOpen(SnackbarStatus.Error));
        setShareDialogOpen(false);
    }
    let toggleUser = (user: User)=>{
        let index = selectedCollectionUsers.findIndex(u => u.id === user.id);
        if(index === -1){
            setSellectedCollectionUsers([...selectedCollectionUsers, user]);
        }
        else {
            selectedCollectionUsers.splice(index, 1);
            setSellectedCollectionUsers([...selectedCollectionUsers]);
        }
    }
    let [selectedCollectionId, setSelectedCollectionId] = useState(0);
    let [selectedCollectionPublicStatus, setSelectedCollectionPublicStatus] = useState(false);
    useEffect(()=>{
       reloadCollections();
       BackendService.GetAllUsers().then(res => setAllUsers(res.data.filter(x => x.id !== user.id)));
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
                                        openShareDialog(c);
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
            </div>
            <Dialog open={shareDialogOpen} onClose={()=>setShareDialogOpen(false)}>
                <DialogTitle>{localization.share}</DialogTitle>
                <DialogContent>
                    <FormControlLabel
                        control={<Checkbox checked={selectedCollectionPublicStatus}
                                           onChange={event => setSelectedCollectionPublicStatus(event.target.checked)}
                        />} label={localization.public} />
                    <h3>{localization.selectUsers}</h3>
                    {allUsers.map(u => (<FormControlLabel
                        control={<Checkbox checked={selectedCollectionUsers.findIndex(su => su.id === u.id)!==-1}
                                           onChange={()=>toggleUser(u)}
                        />} label={u.userName} />))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setShareDialogOpen(false)}>{localization.cancel}</Button>
                    <Button onClick={handleSubmit}>{localization.save}</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbarOpen !== SnackbarStatus.Hidden} autoHideDuration={3000} onClose={()=>setSnackbarOpen(SnackbarStatus.Hidden)}>
                {(snackbarOpen === SnackbarStatus.Success) ?
                    (<Alert severity="success" sx={{ width: '100%' }}>
                        {localization.success}
                    </Alert>):( snackbarOpen === SnackbarStatus.Error ?
                    (<Alert severity="error" sx={{ width: '100%' }}>
                        {localization.error}
                    </Alert>): (<div />))}
            </Snackbar>
        </div>
    )
}

export default Profile;