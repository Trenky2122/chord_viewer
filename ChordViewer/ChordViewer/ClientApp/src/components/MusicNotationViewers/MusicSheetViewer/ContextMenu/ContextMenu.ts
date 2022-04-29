import LocalizedStrings from "react-localization";


class ContextMenu{
    protected el: HTMLDivElement;
    protected viewing: boolean=false;
    protected currentX: number = 0;
    protected currentY: number = 0;
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
         addSharp: boolean, removeSharpNote: boolean){
        this.currentX = x;
        this.currentY = y;
        let localization = new LocalizedStrings({
            en: {
                addNote: (addSharp||removeSharpNote)?"Add this note (♮)":"Add this note",
                removeNote: "Remove this note",
                addSharp: "Add this note with #",
                removeAccidentals: "Remove note with #"
            },
            sk: {
                addNote: (addSharp||removeSharpNote)?"Pridať túto notu (♮)":"Pridať túto notu",
                removeNote: "Odstrániť túto notu",
                addSharp: "Pridať túto notu s #",
                removeAccidentals: "Odstrániť notu aj s #"
            }
        })
        let list = "<ul class='contextMenu'>";
        if(addNote)
            list += this.createListItem(parent, "addChordButton", "addNote", localization.addNote);
        if(removeNote)
            list += this.createListItem(parent, "editChordButton", "removeNote", localization.removeNote);
        if(addSharp)
            list += this.createListItem(parent, "addChordButton", "addSharp", localization.addSharp);
        if(removeSharpNote){
            list += this.createListItem(parent, "removeChordButton", "removeSharp", localization.removeAccidentals)
        }
        list+="</ul>";
        this.el.innerHTML = list;
        this.show(x, y);
    }

    protected show(x: number, y: number){
        this.el.style.display = "block";
        this.el.style.left = x + "px";
        this.el.style.top = y + "px";
        this.viewing = true;
    }

    hide(){
        this.el.style.display = "none";
        this.viewing=false;
    }

    createListItem(parent: string, id: string, event: string, text: string): string{
        return "<li id='"+id+"' onclick='document.getElementById(\""+parent+"\")" +
            ".dispatchEvent(new CustomEvent(\""+event+"\"));' class='contextMenuItem'>"+text+"</li>"
    }
}
export default ContextMenu;