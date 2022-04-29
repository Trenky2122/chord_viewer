import {IMusicNotationViewer} from "../IMusicNotationViewer";
import {BackendService} from "../../../service/BackendService";
import {Tab} from "../../../models/BackendModels";
import TabsContextMenu from "./ContextMenu/TabsContextMenu";

export class TabsViewer implements IMusicNotationViewer{
    RepresentativeElement: HTMLDivElement;

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
        colEditor.appendChild(this.createEditor(6));
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

    createEditor(strings: number): HTMLCanvasElement{
        let canvas = document.createElement("canvas");

        return this.createTabCanvas({id: 0, tabBarre:[], tabStrings: [], stringCount: strings, authorId: 0, toneKey:""} , canvas);
    }

    createTabCanvas(tab: Tab, canvas? :HTMLCanvasElement): HTMLCanvasElement{
        if(!canvas)
            canvas = document.createElement("canvas");
        canvas.addEventListener('contextmenu', (e: MouseEvent) => this.handleRightClick(e,"ll"), false);
        canvas.addEventListener('click', this.handleClick.bind(this), false);
        let width = 400;
        let height = 120;
        let xDelta = 15;
        let yDelta = 15;
        canvas.width = width + 2*xDelta;
        canvas.height = height + 2*yDelta;
        let ctx = canvas.getContext("2d");
        ctx!.strokeStyle = "#000000";
        ctx!.fillStyle = "#FF9999";
        ctx!.scale(1, 1);
        for(let i=0; i<tab.stringCount; i++){
            let string = tab.tabStrings.filter(s => s.stringOrder === i);
            let stringText = "";
            if(string.length > 0)
                stringText = string[0].tune;
            ctx!.beginPath();
            ctx!.strokeText(stringText, 0, i*height/(tab.stringCount-1) + yDelta);
            ctx!.moveTo(xDelta, i*height/(tab.stringCount-1) + yDelta);
            ctx!.lineTo(width + xDelta, i*height/(tab.stringCount-1) + yDelta);
            ctx!.stroke();
        }
        let minFret = Math.min(...tab.tabStrings.map(s => s.fret));
        let maxFret = Math.max(...tab.tabStrings.map(s => s.fret));
        if(maxFret - minFret < 5)
            minFret = maxFret - 5;
        if(minFret < 0){
            minFret = 0;
            maxFret = 5;
        }
        for (let i = 0; i<=maxFret-minFret; i++){
            ctx!.beginPath();
            ctx!.strokeText((i+minFret).toString(), i*width/(maxFret-minFret) + xDelta, yDelta/2)
            ctx!.moveTo(i*width/(maxFret-minFret) + xDelta, yDelta)
            ctx!.lineTo(i*width/(maxFret-minFret) + xDelta, height + yDelta)
            ctx!.stroke();
            console.log(i*width/(maxFret-minFret))
        }

        let radius = 10;

        for(let i=0; i<tab.stringCount; i++){
            let strings = tab.tabStrings.filter(s => s.stringOrder === i);
            if(strings.length > 0) {
                let ts = strings[0];
                ctx!.beginPath();
                ctx!.arc((ts.fret - minFret)* width / (maxFret - minFret) - width / (2 * (maxFret - minFret)) + xDelta,
                    i * height / (tab.stringCount - 1) + yDelta, radius, 0, Math.PI * 2);
                ctx!.fill();
                ctx!.beginPath();
                ctx!.strokeText(ts.suggestedFinger.toString(), (ts.fret - minFret) * width / (maxFret - minFret) - width / (2 * (maxFret - minFret)) + xDelta - 3,
                    i * height / (tab.stringCount - 1) + yDelta + 3);
                ctx!.stroke();
            }
            else {
                ctx!.beginPath();
                ctx!.strokeText("x",  xDelta - 3,
                    i * height / (tab.stringCount - 1) + yDelta + 3);
                ctx!.stroke();
            }
        }

        tab.tabBarre.forEach(b => {
           for(let i= 0; i<10; i++){
               ctx!.beginPath();
               ctx!.moveTo((b.fret - minFret) * width / (maxFret - minFret) - width / (2 * (maxFret - minFret)) + xDelta - radius,
                   b.stringBegin * height / (tab.stringCount - 1) + yDelta);
               ctx!.bezierCurveTo((b.fret - minFret) * width / (maxFret - minFret) - width / (2 * (maxFret - minFret)) + xDelta - radius,
                   b.stringBegin * height / (tab.stringCount - 1) + yDelta,
                   (b.fret-1 - minFret) * width / (maxFret - minFret) + xDelta + i - radius,
                   ((b.stringBegin+b.stringEnd)/2) * height / (tab.stringCount - 1) + yDelta,
                   (b.fret - minFret) * width / (maxFret - minFret) - width / (2 * (maxFret - minFret)) + xDelta - radius,
                   b.stringEnd * height / (tab.stringCount - 1) + yDelta);
               ctx!.stroke();
           }
           ctx!.strokeText(b.suggestedFinger.toString(), (b.fret-1 - minFret) * width / (maxFret - minFret) + xDelta + 2,
                ((b.stringBegin+b.stringEnd)/2) * height / (tab.stringCount - 1) + yDelta);
           ctx!.stroke();
        });
        console.log(tab);
        return canvas;
    }

    getActualToneKey(): string {
        return "";
    }

    handleRightClick(e: MouseEvent, targetId: string){
        e!.preventDefault();
        this.contextMenu.viewTab(e.pageX, e.pageY, targetId, true, true,
            true, true, true, true, true, true);
    }

    handleClick(e: MouseEvent){
        e.preventDefault();
        this.contextMenu.hide();
    }


}