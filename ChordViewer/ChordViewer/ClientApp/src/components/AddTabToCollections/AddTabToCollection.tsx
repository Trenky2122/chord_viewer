import {useNavigate, useParams} from "react-router-dom";
import {TabsViewer} from "../MusicNotationViewers/MusicSheetViewer/TabsViewer";
import TabsContextMenu from "../MusicNotationViewers/MusicSheetViewer/ContextMenu/TabsContextMenu";
import {useEffect, useState} from "react";
import {BackendService} from "../../service/BackendService";
import {Collection, CollectionTabRelation} from "../../models/BackendModels";
import LocalizedStrings from "react-localization";

const AddTabToCollection = ()=>{
    let {tabId} = useParams();
    let localization = new LocalizedStrings({
        en: {
            submit: "Submit"
        },
        sk: {
            submit: "Uložiť"
        }
    });
    useEffect(()=>{
        let viewer = new TabsViewer("tabView", new TabsContextMenu("tabView"), 0,
            navigate,false, ()=> {
                return;
            });
        BackendService.GetTab(+tabId!).then(res => viewer.View("", [res.data]));
        BackendService.GetCollectionsNotContainingTab(+tabId!).then(res => setCollections(res.data));
    }, [tabId]);
    let [selectedColIds, setSelectedColIds]: [number[], any] = useState([]);
    let [collections, setCollections]: [Collection[], any] = useState([]);
    let navigate = useNavigate();
    let submit = () => {
        let relations: CollectionTabRelation[] = selectedColIds.map(i => ({id: 0, tabId: +tabId!, collectionId: i}));
        BackendService.CreateCollectionTabRelations(relations).then(res => navigate("/"));
    }
    return(
        <div className={"container-fluid"}>
            <div className={"row"}>
                <div className={"col"} id={"tabView"} />
            </div>
            <div className={"row"}>
                <div className={"col"}>
                    <ul>
                        {collections.map(col => (
                            <li onClick={() => {
                                let index = selectedColIds.indexOf(col.id);
                                if(index!==-1){
                                    selectedColIds.splice(index, 1);
                                }
                                else {
                                    selectedColIds.push(col.id);
                                }
                                setSelectedColIds([...selectedColIds]);
                            }} className={selectedColIds.indexOf(col.id)!==-1?"selectedLi selectLi":"selectLi"}>{col.name}</li>
                        ))}
                    </ul>
                    <button onClick={()=>submit()} className={"btn btn-primary"}>{localization.submit}</button>
                </div>
            </div>
        </div>
    )
}

export default AddTabToCollection;