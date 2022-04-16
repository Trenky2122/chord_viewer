import LocalizedStrings from "react-localization";


class ContextMenu{
    private el: HTMLDivElement;
    private viewing: boolean=false;
    private currentX: number = 0;
    private currentY: number = 0;
    public get X(){
        return this.currentX;
    }
    public get Y(){
        return this.currentY;
    }
    constructor(wrapperId: string) {
        this.el = document.createElement("div");
        this.el.style.position = "absolute";
        this.el.style.display = "none";
        this.el.style.border = "1px solid #CCC";
        this.el.style.overflow = "visible";
        this.el.style.borderRadius = "5px";
        this.el.style.backgroundColor = "#FFF";
        document.getElementById(wrapperId)?.appendChild(this.el);
    }

    view(x:number, y:number, parent: string, addNote: boolean, removeNote: boolean,
         addSharp: boolean, addB: boolean, removeAccidental: boolean){
        this.currentX = x;
        this.currentY = y;
        let localization = new LocalizedStrings({
            en: {
                addNote: "Add this note",
                removeNote: "Remove this note",
                addSharp: "Add #",
                addB: "Add b",
                removeAccidentals: "Remove accidental"
            },
            sk: {
                addNote: "Pridať túto notu",
                removeNote: "Odstrániť túto notu",
                addSharp: "Pridať #",
                addB: "Pridať b",
                removeAccidentals: "Odstrániť predznamenanie"
            }
        })
        let list = "<ul class='contextMenu'>";
        if(addNote)
            list+="<li id='addChordButton' onclick='document.getElementById(\""+parent+"\")" +
                ".dispatchEvent(new CustomEvent(\"addNote\"));' class='contextMenuItem'>"+localization.addNote+"</li>";
        if(removeNote){
            list+="<li id='editChordButton' onclick='document.getElementById(\""+parent+"\")" +
                ".dispatchEvent(new CustomEvent(\"removeNote\"));' class='contextMenuItem'>"+localization.removeNote+"</li>"
        }
        if(addSharp){
            list+="<li id='addChordButton' onclick='document.getElementById(\""+parent+"\")" +
                ".dispatchEvent(new CustomEvent(\"addSharp\"));' class='contextMenuItem'>"+localization.addSharp+"</li>";
        }
        if(addB){
            list+="<li id='addChordButton' onclick='document.getElementById(\""+parent+"\")" +
                ".dispatchEvent(new CustomEvent(\"addB\"));' class='contextMenuItem'>"+localization.addB+"</li>";
        }
        if(removeAccidental){
            list+="<li id='addChordButton' onclick='document.getElementById(\""+parent+"\")" +
                ".dispatchEvent(new CustomEvent(\"removeAccidental\"));' class='contextMenuItem'>"+localization.removeAccidentals+"</li>";
        }
        list+="</ul>";
        this.el.innerHTML = list;
        this.el.style.display = "block";
        this.el.style.left = x + "px";
        this.el.style.top = y + "px";
        this.viewing = true;
    }

    hide(){
        this.el.style.display = "none";
        this.viewing=false;
    }

    toggleView(x:number, y:number, parent: string, addNote: boolean, removeNote: boolean,
               addSharp: boolean, addB: boolean, removeAccidental: boolean){
        console.log(x, y);
        if(this.viewing){
            this.hide();
        }
        else {
            this.view(x, y, parent, addNote, removeNote, addSharp, addB, removeAccidental);
        }
    }
}
export default ContextMenu;