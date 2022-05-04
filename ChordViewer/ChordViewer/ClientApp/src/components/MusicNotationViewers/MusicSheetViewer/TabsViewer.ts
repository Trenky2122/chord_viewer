import {IMusicNotationViewer} from "../IMusicNotationViewer";
import {BackendService} from "../../../service/BackendService";
import {Tab, TabString} from "../../../models/BackendModels";
import TabsContextMenu from "./ContextMenu/TabsContextMenu";
import {Utils} from "../../../utils/Utils";

export class TabsViewer implements IMusicNotationViewer{
    RepresentativeElement: HTMLDivElement;
    tabInEditor: Tab = {id: 0, tabBarre:[], tabStrings: [], stringCount: 6, authorId: 0, toneKey:""};
    editorContext?: CanvasRenderingContext2D;
    editorMinfret: number=25;
    editorMaxfret: number=0;
    width = 400;
    height = 120;
    xDelta = 15;
    yDelta = 15;
    lastClickedString = 0;
    lastClickedFret = 0;
    barreStartFret?: number;
    barreStartFinger?: number;
    barreStartString?: number;
    private editorId = "editor_canvas";
    constructor(private parentDivId: string, private contextMenu: TabsContextMenu, private userId: number) {
        this.RepresentativeElement = document.getElementById(parentDivId) as HTMLDivElement;
        this.RepresentativeElement.innerHTML = "";
    }

    View(toneKey: string): boolean {
        console.log(toneKey);
        this.RepresentativeElement.innerHTML = "";
        this.createTabContainerWithTabs(toneKey);
        return true;
    }

    createTabContainerWithTabs(toneKey: string){
        this.RepresentativeElement.innerHTML = "";
        let containerFluid = document.createElement("div");
        containerFluid.className = "container-fluid";
        this.RepresentativeElement.appendChild(containerFluid);
        let mainRow = document.createElement("div");
        mainRow.className = "row";
        containerFluid.appendChild(mainRow);
        let colTabs = document.createElement("div");
        colTabs.className = "col";
        mainRow.appendChild(colTabs);
        let colEditor = document.createElement("div");
        colEditor.className = "col";
        mainRow.appendChild(colEditor);
        colEditor.innerHTML="<p>Tab editor</p>"
        let containerEditor = document.createElement("div");
        containerEditor.className="container-fluid";
        colEditor.appendChild(containerEditor);
        let row1Editor = document.createElement("div");
        row1Editor.className="row";
        containerEditor.appendChild(row1Editor);
        let row2Editor = document.createElement("div");
        row2Editor.className="row";
        containerEditor.appendChild(row2Editor);
        let col1Editor = document.createElement("div");
        col1Editor.className="col";
        row1Editor.appendChild(col1Editor);
        let col2Editor = document.createElement("div");
        col2Editor.className="col-3";
        row2Editor.appendChild(col2Editor);
        let col3Editor = document.createElement("div");
        col3Editor.className="col";
        row2Editor.appendChild(col3Editor);
        col1Editor.appendChild(this.createEditor());
        let synchronizeButton=document.createElement("button");
        synchronizeButton.type = "button";
        synchronizeButton.innerHTML= "Synchronize";
        synchronizeButton.className ="btn btn-primary";
        synchronizeButton.addEventListener("click", ()=>this.synchronizeWithOthers());
        col2Editor.appendChild(synchronizeButton);
        let saveButton=document.createElement("button");
        saveButton.type = "button";
        saveButton.innerHTML= "Save";
        saveButton.className ="btn btn-primary";
        saveButton.addEventListener("click", ()=>this.saveTab());
        col3Editor.appendChild(saveButton);
        let containerTabs = document.createElement("div");
        containerTabs.className = "container-fluid";
        colTabs.appendChild(containerTabs);
        BackendService.GetTabsForToneKey(toneKey).then(res => {
            let canvases = res.data.map(t => this.createTabCanvas(t));
            canvases.forEach(canvas => {
                let col = document.createElement("div");
                col.className = "col";
                col.appendChild(canvas);
                let row = document.createElement("div");
                row.className = "row";
                row.appendChild(col);
                containerTabs.appendChild(row);
            });
        });
    }

    createEditor(): HTMLCanvasElement{
        let canvas = document.createElement("canvas");
        this.editorContext = canvas.getContext("2d")!;
        canvas.id = this.editorId;
        canvas.addEventListener("addString", ()=>this.addString());
        canvas.addEventListener("removeString", ()=>this.removeString());
        canvas.addEventListener("addHigherFretToView", ()=>this.addHigherFret());
        canvas.addEventListener("addLowerFretToView", ()=>this.addLowerFret());
        canvas.addEventListener("resetEditor", ()=>this.resetEditor());
        canvas.addEventListener("changeStringTune", (ev: any)=>this.changeStringTune(ev.detail));
        canvas.addEventListener("moveFingerHere", (ev: any)=>this.moveFingerHere(+ev.detail));
        canvas.addEventListener("removeThisString", ()=>this.removeLastClickedString());
        canvas.addEventListener("startBarreHere", (ev: any)=>this.startBarreHere(+ev.detail));
        canvas.addEventListener("stopBarre", ()=>this.finishBarreHere());
        canvas.addEventListener("removeBarre", ()=>this.removeBarre());
        canvas.addEventListener("resetEditorStandard", ()=>this.resetToStandard());
        return this.createTabCanvas(this.tabInEditor , canvas);
    }

    createTabCanvas(tab: Tab, canvas? :HTMLCanvasElement): HTMLCanvasElement{
        let isEditor = true;
        if(!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = tab.id.toString()+"_tab";
            isEditor = false;
            canvas.addEventListener('viewInEditor', ()=>this.setTabToEditor(tab));
        }
        canvas.addEventListener('contextmenu', (e: MouseEvent) => this.handleRightClick(e, canvas!.id), false);
        canvas.addEventListener('click', this.handleClick.bind(this), false);
        canvas.width = this.width + 2*this.xDelta;
        canvas.height = this.height + 2*this.yDelta;
        let ctx = canvas.getContext("2d");
        this.redrawTabOnCanvas(ctx!, tab, isEditor);
        return canvas;
    }

    setTabToEditor(tab: Tab){
        this.tabInEditor = {...tab};
        this.tabInEditor.id = 0;
        this.tabInEditor.tabStrings.forEach(s => s.id=0);
        this.tabInEditor.tabBarre.forEach(b => b.id=0);
        this.editorMinfret = 25;
        this.editorMaxfret = 0;
        this.redrawTabOnCanvas(this.editorContext!, this.tabInEditor, true);
        this.contextMenu.hide();
    }

    redrawTabOnCanvas(ctx: CanvasRenderingContext2D, tab: Tab, isEditor: boolean){
        ctx.clearRect(0, 0, 500, 500);
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#FF9999";
        ctx.scale(1, 1);
        for(let i=0; i<tab.stringCount; i++){
            let string = tab.tabStrings.filter(s => s.stringOrder === i);
            let stringText = "";
            if(string.length > 0)
                stringText = string[0].tune;
            ctx.beginPath();
            ctx.strokeText(stringText, 0, i*this.height/(tab.stringCount-1) + this.yDelta);
            ctx.moveTo(this.xDelta, i*this.height/(tab.stringCount-1) + this.yDelta);
            ctx.lineTo(this.width + this.xDelta, i*this.height/(tab.stringCount-1) + this.yDelta);
            ctx.stroke();
        }
        let minFret = Math.min(...tab.tabStrings.map(s => s.fret));
        let maxFret = Math.max(...tab.tabStrings.map(s => s.fret));
        if(maxFret - minFret < 5)
            minFret = maxFret - 5;
        if(minFret < 0){
            minFret = 0;
            maxFret = 5;
        }
        if(isEditor){
            minFret = Math.min(minFret, this.editorMinfret);
            maxFret = Math.max(maxFret, this.editorMaxfret);
            this.editorMinfret = minFret;
            this.editorMaxfret = maxFret;
        }
        for (let i = 0; i<=maxFret-minFret; i++){
            ctx.beginPath();
            ctx.strokeText((i+minFret).toString(), i*this.width/(maxFret-minFret) + this.xDelta, this.yDelta/2);
            ctx.moveTo(i*this.width/(maxFret-minFret) + this.xDelta, this.yDelta);
            ctx.lineTo(i*this.width/(maxFret-minFret) + this.xDelta, this.height + this.yDelta);
            ctx.stroke();
        }

        let radius = 10;

        for(let i=0; i<tab.stringCount; i++){
            let strings = tab.tabStrings.filter(s => s.stringOrder === i);
            if(strings.length > 0) {
                let ts = strings[0];
                ctx.beginPath();
                ctx.arc((ts.fret - minFret - 0.5)* this.width / (maxFret - minFret) + this.xDelta,
                    i * this.height / (tab.stringCount - 1) + this.yDelta, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.strokeText(ts.suggestedFinger.toString(),
                    (ts.fret - minFret-0.5) * this.width / (maxFret - minFret)  + this.xDelta - 3,
                    i * this.height / (tab.stringCount - 1) + this.yDelta + 3);
                ctx.stroke();
            }
            else {
                ctx.beginPath();
                ctx.strokeText("x",  this.xDelta - 3,
                    i * this.height / (tab.stringCount - 1) + this.yDelta + 3);
                ctx.stroke();
            }
        }

        tab.tabBarre.forEach(b => {
            for(let i= 0; i<10; i++){
                ctx.beginPath();
                ctx.moveTo((b.fret - minFret) * this.width / (maxFret - minFret) - this.width / (2 * (maxFret - minFret)) + this.xDelta - radius,
                    b.stringBegin * this.height / (tab.stringCount - 1) + this.yDelta);
                ctx.bezierCurveTo((b.fret - minFret) * this.width / (maxFret - minFret) - this.width / (2 * (maxFret - minFret)) + this.xDelta - radius,
                    b.stringBegin * this.height / (tab.stringCount - 1) + this.yDelta,
                    (b.fret-1 - minFret) * this.width / (maxFret - minFret) + this.xDelta + i - radius,
                    ((b.stringBegin+b.stringEnd)/2) * this.height / (tab.stringCount - 1) + this.yDelta,
                    (b.fret - minFret) * this.width / (maxFret - minFret) - this.width / (2 * (maxFret - minFret)) + this.xDelta - radius,
                    b.stringEnd * this.height / (tab.stringCount - 1) + this.yDelta);
                ctx.stroke();
            }
            ctx.strokeText(b.suggestedFinger.toString(), (b.fret-1 - minFret) * this.width / (maxFret - minFret) + this.xDelta + 2,
                ((b.stringBegin+b.stringEnd)/2) * this.height / (tab.stringCount - 1) + this.yDelta);
            ctx.stroke();
        });

        if(isEditor && this.barreStartFret){
            ctx.beginPath();
            ctx.fillStyle = "#CCCCCC";
            ctx.arc((this.barreStartFret - minFret - 0.7)* this.width / (maxFret - minFret) + this.xDelta,
                this.barreStartString! * this.height / (tab.stringCount - 1) + this.yDelta, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.strokeText(this.barreStartFinger!.toString(),
                (this.barreStartFret - minFret -0.7) * this.width / (maxFret - minFret) + this.xDelta - 3,
                this.barreStartString! * this.height / (tab.stringCount - 1) + this.yDelta + 3);
            ctx.stroke();
        }
    }

    getActualToneKey(): string {
        return this.getToneStringForTab(this.tabInEditor);
    }

    synchronizeWithOthers(){
        this.RepresentativeElement.dispatchEvent(new CustomEvent("notesUpdated"));
    }

    getToneStringForTab(tab: Tab): string{
        let notes: string[] = [];
        tab.tabStrings.forEach(s => notes.push(TabsViewer.getNoteInIntervalFromBase(s.tune, s.fret)))
        return notes.filter((n, i) => notes.indexOf(n)===i).sort().join("");
    }

    handleRightClick(e: MouseEvent, targetId: string){
        e!.preventDefault();
        this.lastClickedString=this.getEditorStringFromOffsetPosition(e.offsetY);
        this.lastClickedFret=this.getEditorFretFromOffsetPosition(e.offsetX);
        this.contextMenu.viewTab(e.pageX, e.pageY, targetId,
            targetId!==this.editorId,
            targetId===this.editorId && this.lastClickedFret>=0 && this.lastClickedString>=0,
            targetId===this.editorId && this.lastClickedFret>=0 && this.lastClickedString>=0,
            targetId===this.editorId&& this.editorMinfret>0,
            targetId===this.editorId, targetId===this.editorId,
            targetId===this.editorId,
            targetId===this.editorId && this.lastClickedString>=0?
                this.tabInEditor.tabStrings.filter(x => x.stringOrder===this.lastClickedString)[0]?.tune??"C":undefined,
            targetId===this.editorId,
            targetId===this.editorId &&  this.lastClickedFret>=0 && this.lastClickedString>=0 && !this.barreStartFret,
            targetId===this.editorId && this.lastClickedString>0 && this.barreStartFret!==undefined,
            targetId===this.editorId &&
            this.tabInEditor.tabBarre.filter(x => x.fret===this.lastClickedFret &&
                this.lastClickedString>=x.stringBegin && this.lastClickedString<=x.stringEnd).length>=1);
    }

    getEditorStringFromOffsetPosition(y: number){
        let string = (this.tabInEditor.stringCount -1)*(y - this.yDelta)/this.height;
        return Math.round(string);
    }

    getEditorFretFromOffsetPosition(x: number){
        let fret = (x - this.xDelta)*(this.editorMaxfret - this.editorMinfret)/this.width + this.editorMinfret + 0.5;
        return Math.round(fret);
    }

    handleClick(e: MouseEvent){
        e.preventDefault();
        this.contextMenu.hide();
    }

    addString(){
        this.tabInEditor.stringCount+=1;
        this.redrawTabOnCanvas(this.editorContext!, this.tabInEditor, true);
        this.contextMenu.hide();
    }

    removeString(){
        this.tabInEditor.stringCount-=1;
        this.redrawTabOnCanvas(this.editorContext!, this.tabInEditor, true);
        this.contextMenu.hide();
    }

    addHigherFret(){
        this.editorMaxfret+=1;
        console.log(this.editorMaxfret);
        this.redrawTabOnCanvas(this.editorContext!, this.tabInEditor, true);
        this.contextMenu.hide();
    }

    addLowerFret(){
        this.editorMinfret+=1;
        this.redrawTabOnCanvas(this.editorContext!, this.tabInEditor, true);
        this.contextMenu.hide();
    }

    resetEditor(){
        this.tabInEditor = {id: 0, tabBarre:[], tabStrings: [], stringCount: 6, authorId: 0, toneKey:""};
        this.editorMinfret = 25;
        this.editorMaxfret = 0;
        this.redrawTabOnCanvas(this.editorContext!, this.tabInEditor, true);
        this.contextMenu.hide();
    }

    changeStringTune(tune: string){
        let stringIndex = this.tabInEditor.tabStrings.findIndex(x => x.stringOrder === this.lastClickedString);
        let string: TabString = this.tabInEditor.tabStrings[stringIndex];
        if(stringIndex === -1){
            string = {id: 0, stringOrder: this.lastClickedString, tune: tune, tabId: 0, suggestedFinger: 0, fret: 0}
            this.tabInEditor.tabStrings.push(string);
        }
        string.tune = tune;
        this.redrawTabOnCanvas(this.editorContext!, this.tabInEditor, true);
        this.contextMenu.hide();
    }

    moveFingerHere(finger: number){
        let stringIndex = this.tabInEditor.tabStrings.findIndex(x => x.stringOrder === this.lastClickedString);
        let string: TabString = this.tabInEditor.tabStrings[stringIndex];
        if(stringIndex === -1){
            string = {id: 0, stringOrder: this.lastClickedString, tune: "C", tabId: 0, suggestedFinger: 0, fret: 0}
            this.tabInEditor.tabStrings.push(string);
        }
        string.fret = this.lastClickedFret;
        string.suggestedFinger = finger;
        this.redrawTabOnCanvas(this.editorContext!, this.tabInEditor, true);
        this.contextMenu.hide();
    }

    removeLastClickedString(){
        this.tabInEditor.tabStrings = this.tabInEditor.tabStrings.filter(x => x.stringOrder !== this.lastClickedString);
        this.redrawTabOnCanvas(this.editorContext!, this.tabInEditor, true);
        this.contextMenu.hide();
    }

    startBarreHere(finger: number){
        this.barreStartFret = this.lastClickedFret;
        this.barreStartString = this.lastClickedString;
        this.barreStartFinger = finger;
        this.contextMenu.hide();
        this.redrawTabOnCanvas(this.editorContext!, this.tabInEditor, true);
        this.contextMenu.hide();
    }

    finishBarreHere(){
        let begin = Math.min(this.barreStartString!, this.lastClickedString);
        let end = Math.max(this.barreStartString!, this.lastClickedString);
        for(let i=begin; i<=end; i++){
            let stringIndex = this.tabInEditor.tabStrings.findIndex(x => x.stringOrder === i);
            let string: TabString = this.tabInEditor.tabStrings[stringIndex];
            if(stringIndex === -1){
                string = {id: 0, stringOrder: this.lastClickedString, tune: "C", tabId: 0, suggestedFinger: 0, fret: 0}
                this.tabInEditor.tabStrings.push(string);
            }
            string.fret = Math.max(string.fret, this.barreStartFret!);
            string.suggestedFinger = string.fret === this.barreStartFret ? this.barreStartFinger! : string.suggestedFinger;
        }
        this.tabInEditor.tabBarre.push({id: 0, tabId: 0, fret: this.barreStartFret!, stringEnd: end,
        stringBegin: begin, suggestedFinger: this.barreStartFinger!});
        this.redrawTabOnCanvas(this.editorContext!, this.tabInEditor, true);
        this.barreStartFret = undefined;
        this.barreStartFinger = undefined;
        this.barreStartString = undefined;
        this.contextMenu.hide();
    }

    removeBarre(){
        this.tabInEditor.tabBarre = this.tabInEditor.tabBarre.filter(x => !(x.fret===this.lastClickedFret &&
            this.lastClickedString>=x.stringBegin && this.lastClickedString<=x.stringEnd));
        this.redrawTabOnCanvas(this.editorContext!, this.tabInEditor, true);
        this.contextMenu.hide();
    }

    saveTab(){
        this.tabInEditor.toneKey = this.getActualToneKey();
        this.tabInEditor.authorId = this.userId;
        BackendService.SaveTab(this.tabInEditor).then(()=>this.synchronizeWithOthers());
    }

    resetToStandard(){
        this.tabInEditor.tabBarre = [];
        this.tabInEditor.tabStrings = [
            {id: 0, tabId: 0, fret: 0, stringOrder: 0, tune: "E", suggestedFinger: 0},
            {id: 0, tabId: 0, fret: 0, stringOrder: 1, tune: "B", suggestedFinger: 0},
            {id: 0, tabId: 0, fret: 0, stringOrder: 2, tune: "G", suggestedFinger: 0},
            {id: 0, tabId: 0, fret: 0, stringOrder: 3, tune: "D", suggestedFinger: 0},
            {id: 0, tabId: 0, fret: 0, stringOrder: 4, tune: "A", suggestedFinger: 0},
            {id: 0, tabId: 0, fret: 0, stringOrder: 5, tune: "E", suggestedFinger: 0},
        ];
        this.redrawTabOnCanvas(this.editorContext!, this.tabInEditor, true);
        this.contextMenu.hide();
    }

    private static getNoteInIntervalFromBase(baseTone: string, interval: number): string{
        let baseNumber = Utils.toneSequence.indexOf(baseTone);
        return Utils.toneSequence[(baseNumber + interval) % 12];
    }
}