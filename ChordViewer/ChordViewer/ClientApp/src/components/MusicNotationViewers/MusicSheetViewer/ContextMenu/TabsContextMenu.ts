import LocalizedStrings from "react-localization";
import ContextMenu from "./ContextMenu";


class TabsContextMenu extends ContextMenu{
    public viewTab(x:number, y:number, parent: string, viewInEditor: boolean, moveFingerHere: boolean, removeThisString: boolean,
                   addLowerFretToView: boolean, addHigherFretToView: boolean, addString: boolean, removeString: boolean,
                   changeStringTune: boolean, resetEditor: boolean){
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
                changeStringTune: "Change string tune",
                resetEditor: "Reset editor"
            },
            sk: {
                viewInEditor: "Zobraziť v editore",
                moveFingerHere: "Umiestniť prst sem",
                removeThisString: "Odstrániť strunu",
                addLowerFretToView: "Pridať nižší pražec do zobrazenia",
                addHigherFretToView: "Pridať vyšší pražec do zobrazenia",
                addString: "Pridať strunu",
                removeString: "Odstrániť strunu",
                changeStringTune: "Zmeniť ladenie struny",
                resetEditor: "Restovať editor"
            }
        })
        let list = "<ul class='contextMenu'>";
        if(viewInEditor)
            list+=this.createListItem(parent, "viewInEditorButton", "viewInEditor", localization.viewInEditor);
        if(moveFingerHere)
            list+=this.createListItemWithNumberInput(parent, "moveFingerHereButton", "moveFingerHere", localization.moveFingerHere, 4, 1);
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
            list+=this.createListItemWithDropdown(parent, "changeStringTuneButton", "changeStringTune",
                localization.changeStringTune, [["C", "C"], ["C#", "C#"], ["D", "D"], ["D#", "D#"], ["E", "E"],
                    ["F", "F"], ["F#", "F#"], ["G", "G"], ["G#", "G#"], ["A", "A"], ["A#", "A#"], ["B", "B"]]);
        if(resetEditor)
            list+=this.createListItem(parent, "resetEditorButton", "resetEditor", localization.resetEditor);
        list+="</ul>";
        this.el.innerHTML = list;
        this.show(x, y);
    }

    createListItemWithNumberInput(parent: string, id: string, event: string, text: string, maxValue: number, minValue: number): string {
        return "<li id='"+id+"' onclick='document.getElementById(\""+parent+"\")" +
            ".dispatchEvent(new CustomEvent(\""+event+"\", {detail: document.getElementById(\"input"+id+"\").value}));' class='contextMenuItem'>"
            +text+" <input type='number' id='input"+id+"' size='1' min='"+minValue.toString()+"' " +
            "max='"+maxValue+"'></li>";
    }

    createListItemWithDropdown(parent: string, id: string, event: string, text: string, options: [string, string][]): string {
        let retval = "<li id='"+id+"' onclick='document.getElementById(\""+parent+"\")" +
            ".dispatchEvent(new CustomEvent(\""+event+"\",  {detail: document.getElementById(\"input"+id+"\").value}));' class='contextMenuItem'>"+text;
        retval += " <select name='select' id='input"+id+"'>"
        options.forEach(opt => retval+="<option value='"+opt[0]+"'>"+opt[1]+"</option>")
        retval+="</select></li>";
        return retval;
    }
}
export default TabsContextMenu;