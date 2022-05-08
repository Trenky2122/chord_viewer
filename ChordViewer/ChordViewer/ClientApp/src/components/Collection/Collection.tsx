import {useEffect, useState} from "react";
import {Constants} from "../../models/Constants";
import {BackendService} from "../../service/BackendService";
import {useNavigate, useParams} from "react-router-dom";
import {TabsViewer} from "../MusicNotationViewers/MusicSheetViewer/TabsViewer";
import TabsContextMenu from "../MusicNotationViewers/MusicSheetViewer/ContextMenu/TabsContextMenu";
import {Utils} from "../../utils/Utils";
import LocalizedStrings from "react-localization";
import {AxiosError, AxiosResponse} from "axios";

const Collection = ()=>{
    let [collection, setCollection] = useState(Constants.defaultCollection);
    let {collectionId} = useParams();
    let navigate = useNavigate();
    let localization = new LocalizedStrings({
        en: {
            unauthorized: "You are not authorized to view this page." ,
            notFound: "Page was not found."
        },
        sk:{
            unauthorized: "Nemáte oprávnenie na zobrazenie tejto stránky.",
            notFound: "Stránka sa nenašla."
        }
    })
    useEffect(()=>{
        BackendService.GetCollection(+collectionId!).then(res => setCollection(res.data)).catch((err: AxiosError) =>{
            switch (err.response!.status){
                case 403:
                    setMessage(localization.unauthorized);
                    break;
                case 404:
                    setMessage(localization.notFound);
                    break;
            }
        });
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
                <div className={"row"}>
                    <div className={"col-4"}>
                        <p style={{fontWeight: "bold"}}>{Utils.GetChordNameFromTab(r.tab!)}</p>
                    </div>
                    <div className={"col-12"} id={"tab"+r.tabId}></div>
                </div>))}
            {message}
        </div>
    )
}

export default Collection;