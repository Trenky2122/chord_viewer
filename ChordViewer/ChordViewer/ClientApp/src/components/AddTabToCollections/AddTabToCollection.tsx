import {useParams} from "react-router-dom";
import {TabsViewer} from "../MusicNotationViewers/MusicSheetViewer/TabsViewer";
import TabsContextMenu from "../MusicNotationViewers/MusicSheetViewer/ContextMenu/TabsContextMenu";
import {useEffect} from "react";
import {BackendService} from "../../service/BackendService";

const AddTabToCollection = ()=>{
    let {tabId} = useParams();
    useEffect(()=>{
        let viewer = new TabsViewer("tabView", new TabsContextMenu("tabView"), 0,false);
        BackendService.GetTab(+tabId!).then(res => viewer.View("", [res.data]));
    })
    return(
        <div className={"container-fluid"}>
            <div className={"row"}>
                <div className={"col"} id={"tabView"} />
            </div>
            <div className={"row"}>
                <div className={"col"}>
                    
                </div>
            </div>
        </div>
    )
}

export default AddTabToCollection;