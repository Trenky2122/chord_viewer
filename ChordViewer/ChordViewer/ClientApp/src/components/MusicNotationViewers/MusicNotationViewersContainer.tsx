import React, {useContext, useEffect, useState} from "react";
import {IMusicNotationViewer} from "./IMusicNotationViewer";
import MusicSheetViewer from "./MusicSheetViewer/MusicSheetViewer";
import {ChordNameViewer} from "./MusicSheetViewer/ChordNameViewer";
import LocalizedStrings from "react-localization";
import {KeyboardViewer} from "./MusicSheetViewer/KeyboardViewer";
import {TabsViewer} from "./MusicSheetViewer/TabsViewer";
import TabsContextMenu from "./MusicSheetViewer/ContextMenu/TabsContextMenu";
import {User} from "../../models/BackendModels";
import {UserContext} from "../../App";
import {useNavigate} from "react-router-dom";
import {Alert, Snackbar} from "@mui/material";
import {SnackbarStatus} from "../../models/LocalModels";
const MusicNotationViewersContainer = ()=>{
    let [currentUser, ]: [User, (user: User)=>void] = useContext(UserContext);
    let [actualToneKey, setActualToneKey] = useState("CEG");
    let [snackbarOpen, setSnackbarOpen] = useState(SnackbarStatus.Hidden);
    let navigate = useNavigate();
    let [viewers, setViewers] : [IMusicNotationViewer[], any ]= useState([]);
    useEffect(()=>{
        setViewers([]);
        let contextMenu = new TabsContextMenu("musicSheetContainer");
        let vws = [new ChordNameViewer("input1"),
            new TabsViewer("div2", contextMenu, currentUser.id, navigate, true, setSnackbarOpen),
            new MusicSheetViewer("canvas1", contextMenu), new KeyboardViewer("canvas2", contextMenu)];
        setViewers(vws);
        vws.forEach(viewer =>
            {
                viewer.RepresentativeElement?.addEventListener("notesUpdated", (e)=>
                {
                    let newToneKey = viewer.getActualToneKey();
                    console.log(e, newToneKey);
                    setActualToneKey(newToneKey);
                });
            }
        );
    }, [navigate, setSnackbarOpen, currentUser.id]);
    useEffect(()=>{
        viewers.forEach(viewer=>viewer.View(actualToneKey));
    }, [actualToneKey, viewers])
    let localization = new LocalizedStrings({
        en: {
            chord_name: "Chord name: ",
            tones: "Tones",
            piano: "Piano",
            tabs: "Tabs",
            success: "Successfully saved.",
            error: "Something went wrong."
        },
        sk: {
            chord_name: "Meno akordu: ",
            tones: "Noty",
            piano: "Klavír",
            tabs: "Taby",
            success: "Úspešne uložené.",
            error: "Nastala chyba."
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
            <div className={"row"}>
                <div className={"col"}>
                    <p>{localization.tabs}</p>
                    <div id={"div2"} />
                </div>
            </div>
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

export default MusicNotationViewersContainer;