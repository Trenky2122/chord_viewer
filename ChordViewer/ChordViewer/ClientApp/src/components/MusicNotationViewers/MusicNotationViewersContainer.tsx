import React, {useEffect, useMemo, useState} from "react";
import {IMusicNotationViewer} from "./IMusicNotationViewer";
import MusicSheetViewer from "./MusicSheetViewer/MusicSheetViewer";
import {ChordNameViewer} from "./MusicSheetViewer/ChordNameViewer";
import LocalizedStrings from "react-localization";
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
    let localization = new LocalizedStrings({
        en: {
            chord_name: "Chord name: ",
            tones: "Tones"
        },
        sk: {
            chord_name: "Meno akordu: ",
            tones: "Noty"
        }
    });
    return (
            <div className={"container-fluid"}>
                <div className={"row"}>
                    <label className={"me-1"} htmlFor={"input1"}>{localization.chord_name}</label>
                </div>
                <div className={"row"}>
                    <div className={"col"} id={"div1"}>
                        <input type={"text"} id={"input1"}/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col"}>
                        <p>{localization.tones}</p>
                        <canvas id={"canvas1"} width={420} height={200} />
                    </div>
                </div>
            </div>
    )
}

export default MusicNotationViewersContainer;