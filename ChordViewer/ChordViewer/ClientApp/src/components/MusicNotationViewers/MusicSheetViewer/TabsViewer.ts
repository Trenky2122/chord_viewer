import {IMusicNotationViewer} from "../IMusicNotationViewer";
import {BackendService} from "../../../service/BackendService";
import {Tab} from "../../../models/BackendModels";

export class TabsViewer implements IMusicNotationViewer{
    RepresentativeElement: HTMLDivElement;

    constructor(private parentDivId: string) {
        this.RepresentativeElement = document.getElementById(parentDivId) as HTMLDivElement;
    }

    View(toneKey: string): boolean {
        this.RepresentativeElement.innerHTML = "";
        BackendService.GetTabsForToneKey(toneKey).then(res => this.createTabContainerWithTabs(res.data));
        return true;
    }

    createTabContainerWithTabs(tabs: Tab[]){
        let canvases = tabs.map(t => this.createTabCanvas(t));
        canvases.forEach(canvas => this.RepresentativeElement.appendChild(canvas));
    }

    createTabCanvas(tab: Tab): HTMLCanvasElement{
        let canvas = document.createElement("canvas");
        canvas.addEventListener('click', this.handleClick.bind(this), false);
        let width = 400;
        let height = 120;
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext("2d");
        ctx!.strokeStyle = "#000000";
        ctx!.fillStyle = "#FFFF00";
        ctx!.scale(1, 1);
        for(let i=0; i<tab.stringCount; i++){
            ctx!.beginPath();
            ctx!.moveTo(0, i*height/(tab.stringCount-1))
            ctx!.lineTo(width, i*height/(tab.stringCount-1))
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
            ctx!.moveTo(i*width/(maxFret-minFret), 0)
            ctx!.lineTo(i*width/(maxFret-minFret), height)
            ctx!.stroke();
            console.log(i*width/(maxFret-minFret))
        }
        tab.tabStrings.forEach(ts => {
            ctx!.beginPath();
            ctx!.arc(ts.fret*width/(maxFret-minFret) - width/(2*(maxFret-minFret)),
            ts.stringOrder*height/(tab.stringCount-1), 10, 0, Math.PI*2);
            ctx!.stroke();
        });
        console.log(tab);
        return canvas;
    }

    getActualToneKey(): string {
        return "";
    }

    handleClick(e: MouseEvent){
        console.log(e.offsetX, e.offsetY);
    }

}