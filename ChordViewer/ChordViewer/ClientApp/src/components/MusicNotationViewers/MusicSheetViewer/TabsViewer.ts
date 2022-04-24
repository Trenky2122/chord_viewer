import {IMusicNotationViewer} from "../IMusicNotationViewer";
import {BackendService} from "../../../service/BackendService";
import {Tab} from "../../../models/BackendModels";

export class TabsViewer implements IMusicNotationViewer{
    RepresentativeElement: HTMLDivElement;

    constructor(private parentDivId: string) {
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
        canvases.forEach(canvas => this.RepresentativeElement.appendChild(canvas));
    }

    createTabCanvas(tab: Tab): HTMLCanvasElement{
        let canvas = document.createElement("canvas");
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
            ctx!.strokeText(i.toString(), i*width/(maxFret-minFret) + xDelta, yDelta/2)
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
                ctx!.arc(ts.fret * width / (maxFret - minFret) - width / (2 * (maxFret - minFret)) + xDelta,
                    i * height / (tab.stringCount - 1) + yDelta, radius, 0, Math.PI * 2);
                ctx!.fill();
                ctx!.beginPath();
                ctx!.strokeText(ts.suggestedFinger.toString(), ts.fret * width / (maxFret - minFret) - width / (2 * (maxFret - minFret)) + xDelta - 3,
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
               ctx!.moveTo(b.fret * width / (maxFret - minFret) - width / (2 * (maxFret - minFret)) + xDelta - radius,
                   b.stringBegin * height / (tab.stringCount - 1) + yDelta);
               ctx!.bezierCurveTo(b.fret * width / (maxFret - minFret) - width / (2 * (maxFret - minFret)) + xDelta - radius,
                   b.stringBegin * height / (tab.stringCount - 1) + yDelta,
                   (b.fret) * width / (maxFret - minFret) - width / ((maxFret - minFret)) + xDelta + i - radius,
                   ((b.stringBegin+b.stringEnd)/2) * height / (tab.stringCount - 1) + yDelta,
                   b.fret * width / (maxFret - minFret) - width / (2 * (maxFret - minFret)) + xDelta - radius,
                   b.stringEnd * height / (tab.stringCount - 1) + yDelta);
               ctx!.stroke();
           }
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