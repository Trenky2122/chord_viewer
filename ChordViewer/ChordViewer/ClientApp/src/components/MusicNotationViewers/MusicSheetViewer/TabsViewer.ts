import {IMusicNotationViewer} from "../IMusicNotationViewer";
import {BackendService} from "../../../service/BackendService";
import {Tab} from "../../../models/BackendModels";
import TabsContextMenu from "./ContextMenu/TabsContextMenu";

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
    constructor(private parentDivId: string, private contextMenu: TabsContextMenu) {
        this.RepresentativeElement = document.getElementById(parentDivId) as HTMLDivElement;
    }

    View(toneKey: string): boolean {
        console.log(toneKey);
        this.RepresentativeElement.innerHTML = "";
        BackendService.GetTabsForToneKey(toneKey).then(res => this.createTabContainerWithTabs(res.data));
        return true;
    }

    createTabContainerWithTabs(tabs: Tab[]){
        let canvases = tabs.map(t => this.createTabCanvas(t));
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
        colEditor.appendChild(this.createEditor());
        let containerTabs = document.createElement("div");
        containerTabs.className = "container-fluid";
        colTabs.appendChild(containerTabs);
        canvases.forEach(canvas => {
            let col = document.createElement("div");
            col.className = "col";
            col.appendChild(canvas);
            let row = document.createElement("div");
            row.className = "row";
            row.appendChild(col);
            containerTabs.appendChild(row);
        });
    }

    createEditor(): HTMLCanvasElement{
        let canvas = document.createElement("canvas");
        this.editorContext = canvas.getContext("2d")!;
        canvas.id = "editor_canvas";
        canvas.addEventListener("addString", ()=>this.addString());
        canvas.addEventListener("removeString", ()=>this.removeString());
        canvas.addEventListener("addHigherFretToView", ()=>this.addHigherFret());
        canvas.addEventListener("addLowerFretToView", ()=>this.addLowerFret());
        canvas.addEventListener("resetEditor", ()=>this.resetEditor());
        canvas.addEventListener("changeStringTune", (ev: any)=>this.changeStringTune(ev.detail));
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
        this.tabInEditor = tab;
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
                    (ts.fret - minFret) * this.width / (maxFret - minFret) - this.width / (2 * (maxFret - minFret)) + this.xDelta - 3,
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
    }

    getActualToneKey(): string {
        return "";
    }

    handleRightClick(e: MouseEvent, targetId: string){
        e!.preventDefault();
        this.lastClickedString=this.getEditorStringFromOffsetPosition(e.offsetY);
        this.lastClickedFret=this.getEditorFretFromOffsetPosition(e.offsetX);
        this.contextMenu.viewTab(e.pageX, e.pageY, targetId,
            targetId!=="editor_canvas", targetId==="editor_canvas",
            targetId==="editor_canvas", targetId==="editor_canvas",
            targetId==="editor_canvas", targetId==="editor_canvas",
            targetId==="editor_canvas", targetId==="editor_canvas",
            targetId==="editor_canvas");
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
        console.log(tune);
        let stringIndex = this.tabInEditor.tabStrings.findIndex(x => x.stringOrder === this.lastClickedString);
    }
}