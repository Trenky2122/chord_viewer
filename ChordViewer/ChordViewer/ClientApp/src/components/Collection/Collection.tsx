import {useContext, useEffect, useState} from "react";
import {Constants} from "../../models/Constants";
import {BackendService} from "../../service/BackendService";
import {useNavigate, useParams} from "react-router-dom";
import {TabsViewer} from "../MusicNotationViewers/MusicSheetViewer/TabsViewer";
import TabsContextMenu from "../MusicNotationViewers/MusicSheetViewer/ContextMenu/TabsContextMenu";
import {Utils} from "../../utils/Utils";
import LocalizedStrings from "react-localization";
import {AxiosError} from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import {Tab} from "../../models/BackendModels";
import {Alert, Snackbar} from "@mui/material";
import {SnackbarStatus} from "../../models/LocalModels";
import {UserContext} from "../../App";

const Collection = ()=>{
    let [currentUser, ] = useContext(UserContext);
    let [collection, setCollection] = useState(Constants.defaultCollection);
    let [snackbarOpen, setSnackbarOpen] = useState(SnackbarStatus.Hidden);
    let {collectionId} = useParams();
    let navigate = useNavigate();
    let localization = new LocalizedStrings({
        en: {
            unauthorized: "You are not authorized to view this page." ,
            notFound: "Page was not found.",
            confirmDelete: "Are you sure you want to remove tab from this collection?",
            success: "Successfully removed.",
            error: "Something went wrong.",
        },
        sk:{
            unauthorized: "Nemáte oprávnenie na zobrazenie tejto stránky.",
            notFound: "Stránka sa nenašla.",
            confirmDelete: "Naozaj chcete odstrániť tab z tejto kolekcie?",
            success: "Úspešne odstránené.",
            error: "Nasatala chyba.",
        }
    })
    let removeTabFromCollection = (tab: Tab)=>{
        // eslint-disable-next-line no-restricted-globals
        if(confirm(localization.confirmDelete)) {
            BackendService.RemoveTabFromCollection(+collectionId!, tab.id).then(res =>{
              reloadTabs();
              setSnackbarOpen(SnackbarStatus.Success);
            }).catch(()=>setSnackbarOpen(SnackbarStatus.Error));
        }
    }

    let reloadTabs = () =>{
        BackendService.GetCollection(+collectionId!).then(res => setCollection(res.data)).catch((err: AxiosError) =>{
            switch (err.response!.status){
                case 403:
                    setMessage(localization.unauthorized);
                    break;
                case 404:
                    setMessage(localization.notFound);
                    break;
            }
            setSnackbarOpen(SnackbarStatus.Error);
        });
    }

    useEffect(()=>{
        reloadTabs()
    }, [collectionId])
    useEffect(()=>{
        collection.tabRelations!.forEach(rel => {
            let viewer = new TabsViewer("tab"+rel.tabId, new TabsContextMenu("wrapper"),
                0, navigate, false, ()=> {
                    return;
                });
            viewer.View("", [rel.tab!]);
        });
    }, [collection]);
    let [message, setMessage] = useState("");
    return (
        <div id={"wrapper"} className={"container-fluid"}>
            <div className={"row"}>
                <div className={"col"}>
                    <h2>{collection.name}</h2>
                </div>
            </div>
            {collection.tabRelations!.map(r => (
                <div className={"row mt-1"}>
                    <div className={"col-4"}>
                        <p style={{fontWeight: "bold"}}>{Utils.GetChordNameFromTab(r.tab!)}</p>
                    </div>
                    {(currentUser.id === collection.authorId || currentUser.isAdmin) && (<div className={"col-4"}>
                        <button onClick={()=>removeTabFromCollection(r.tab!)} className={"btn btn-danger"}>
                            <DeleteIcon />
                        </button>
                    </div>)}
                    <div className={"col-12 mt-1"} id={"tab"+r.tabId}></div>
                </div>))}
            {message}
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

export default Collection;