import React, {useEffect, useMemo, useState} from "react";
import {IMusicNotationViewer} from "./IMusicNotationViewer";
import MusicSheetViewer from "./MusicSheetViewer/MusicSheetViewer";
import {ChordNameViewer} from "./MusicSheetViewer/ChordNameViewer";
const MusicNotationViewersContainer = ()=>{
    let viewers : IMusicNotationViewer[] = useMemo(()=>[new ChordNameViewer("input1"),
        new MusicSheetViewer("canvas1")], [])
    let [actualToneKey, setActualToneKey] = useState("CEG");
    useEffect(()=>viewers.forEach(viewer => {
            viewer.View(actualToneKey);
            viewer.RepresentativeElement?.addEventListener("input", ()=>{
                let newToneKey = viewer.getActualToneKey();
                console.log(newToneKey);
                setActualToneKey(newToneKey);
            });
        }
    ), [actualToneKey, viewers]);
    return (
            <div className={"container-fluid"}>
                <div className={"row"}>
                    <div className={"col"} id={"div1"}>
                        <input type={"text"} id={"input1"}/>
                    </div>
                    <div className={"col"}>
                        <canvas id={"canvas1"} width={420} height={200} />
                    </div>
                </div>
            </div>
    )
}

export default MusicNotationViewersContainer;