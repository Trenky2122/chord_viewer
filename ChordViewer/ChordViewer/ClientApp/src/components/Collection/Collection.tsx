import {useEffect, useState} from "react";
import {Constants} from "../../models/Constants";
import {BackendService} from "../../service/BackendService";
import {useParams} from "react-router-dom";
import {TabsViewer} from "../MusicNotationViewers/MusicSheetViewer/TabsViewer";
import TabsContextMenu from "../MusicNotationViewers/MusicSheetViewer/ContextMenu/TabsContextMenu";
import {Utils} from "../../utils/Utils";

const Collection = ()=>{
    let [collection, setCollection] = useState(Constants.defaultCollection);
    let {collectionId} = useParams();
    useEffect(()=>{
        BackendService.GetCollection(+collectionId!).then(res => setCollection(res.data));
    }, [collectionId])
    useEffect(()=>{
        collection.tabRelations!.forEach(rel => {
            let viewer = new TabsViewer("tab"+rel.tabId, new TabsContextMenu("wrapper"), 0,false);
            viewer.View("", [rel.tab!]);
        });
    }, [collection]);
    return (
        <div id={"wrapper"} className={"container-fluid"}>
            {collection.tabRelations!.map(r => (
                <div className={"row"}>
                    <div className={"col-1"}>
                        <p style={{fontWeight: "bold"}}>{Utils.GetChordNameFromTab(r.tab!)}</p>
                    </div>
                    <div className={"col-12"} id={"tab"+r.tabId}></div>
                </div>))}
        </div>
    )
}

export default Collection;