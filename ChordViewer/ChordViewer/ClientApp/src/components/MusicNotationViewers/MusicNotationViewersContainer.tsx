import React, {useEffect, useMemo, useState} from "react";
import {IMusicNotationViewer} from "./IMusicNotationViewer";
import MusicSheetViewer from "./MusicSheetViewer/MusicSheetViewer";
import {ChordNameViewer} from "./MusicSheetViewer/ChordNameViewer";
import LocalizedStrings from "react-localization";
import {KeyboardViewer} from "./MusicSheetViewer/KeyboardViewer";
import ContextMenu from "./MusicSheetViewer/ContextMenu/ContextMenu";
const MusicNotationViewersContainer = ()=>{
    let [actualToneKey, setActualToneKey] = useState("CEG");
    let [viewers, setViewers] : [IMusicNotationViewer[], any ]= useState([]);
    useEffect(()=>{
        let contextMenu = new ContextMenu("musicSheetContainer");
        let vws = [new ChordNameViewer("input1"),
            new MusicSheetViewer("canvas1"), new KeyboardViewer("canvas2", contextMenu)];
        setViewers(vws);
        vws.forEach(viewer => {
            viewer.RepresentativeElement?.addEventListener("notesUpdated", ()=>{
                let newToneKey = viewer.getActualToneKey();
                console.log(newToneKey);
                setActualToneKey(newToneKey);
            });
        }
    )}, []);
    useEffect(()=>{
        viewers.forEach(viewer=>viewer.View(actualToneKey));
    }, [actualToneKey, viewers])
    let localization = new LocalizedStrings({
        en: {
            chord_name: "Chord name: ",
            tones: "Tones",
            piano: "Piano",
        },
        sk: {
            chord_name: "Meno akordu: ",
            tones: "Noty",
            piano: "Klavír",
        }
    });
    return (
            <div className={"container-fluid"} id={"musicSheetContainer"}>
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
                <div className={"row"}>
                    <div className={"col"}>
                        <p>{localization.piano}</p>
                        <canvas id={"canvas2"} width={420} height={100} />
                    </div>
                </div>
            </div>
    )
}

export default MusicNotationViewersContainer;