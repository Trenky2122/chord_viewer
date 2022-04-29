import LocalizedStrings from "react-localization";
import ContextMenu from "./ContextMenu";


class TabsContextMenu extends ContextMenu{
    public viewTab(x:number, y:number, parent: string, viewInEditor: boolean, moveFingerHere: boolean, removeThisString: boolean,
                   addLowerFretToView: boolean, addHigherFretToView: boolean, addString: boolean, removeString: boolean,
                   changeStringTune: boolean){
        this.currentX = x;
        this.currentY = y;
        let localization = new LocalizedStrings({
            en: {
                viewInEditor: "View in editor",
                moveFingerHere: "Move finger here",
                removeThisString: "Remove this string",
                addLowerFretToView: "Add lower fret to view",
                addHigherFretToView: "Add higher fret to view",
                addString: "Add string",
                removeString: "Remove string",
                changeStringTune: "Change string tune"
            },
            sk: {
                viewInEditor: "Zobraziť v editore",
                moveFingerHere: "Umiestniť prst sem",
                removeThisString: "Odstrániť strunu",
                addLowerFretToView: "Pridať nižší pražec do zobrazenia",
                addHigherFretToView: "Pridať vyšší pražec do zobrazenia",
                addString: "Pridať strunu",
                removeString: "Odstrániť strunu",
                changeStringTune: "Zmeniť ladenie struny"
            }
        })
        let list = "<ul class='contextMenu'>";
        if(viewInEditor)
            list+=this.createListItem(parent, "viewInEditorButton", "viewInEditor", localization.viewInEditor);
        if(moveFingerHere)
            list+=this.createListItem(parent, "moveFingerHereButton", "moveFingerHere", localization.moveFingerHere);
        if(removeThisString)
            list+=this.createListItem(parent, "removeThisStringButton", "removeThisString", localization.removeThisString);
        if(addLowerFretToView)
            list+=this.createListItem(parent, "addLowerFretToViewButton", "addLowerFretToView", localization.addLowerFretToView);
        if(addHigherFretToView)
            list+=this.createListItem(parent, "addHigherFretToViewButton", "addHigherFretToView", localization.addHigherFretToView);
        if(addString)
            list+=this.createListItem(parent, "addStringButton", "addString", localization.addString);
        if(removeString)
            list+=this.createListItem(parent, "removeStringButton", "removeString", localization.removeString);
        if(changeStringTune)
            list+=this.createListItem(parent, "changeStringTuneButton", "changeStringTune", localization.changeStringTune);
        list+="</ul>";
        this.el.innerHTML = list;
        this.show(x, y);
    }
}
export default TabsContextMenu;