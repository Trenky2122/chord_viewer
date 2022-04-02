import React, {useEffect} from "react";
import {IMusicNotationViewer} from "./IMusicNotationViewer";
import MusicSheetViewer from "./MusicSheetViewer/MusicSheetViewer";

const MusicNotationViewersContainer = ()=>{
    let viewers : IMusicNotationViewer[] = [];
    viewers.push(new MusicSheetViewer("canvas1"))
    useEffect(()=>viewers.forEach(viewer => viewer.View("C#EbG#")));
    return (
        <div className={"container-fluid"}>
            <div className={"row"}>
                <div className={"col"}>
                    <canvas id={"canvas1"} width={420} height={200} />
                </div>
            </div>
        </div>
    )
}

export default MusicNotationViewersContainer;