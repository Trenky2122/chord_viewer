import {IMusicNotationViewer} from "../IMusicNotationViewer";
import {Utils} from "../../../utils/Utils";

export class KeyboardViewer implements IMusicNotationViewer{
    RepresentativeElement?: HTMLCanvasElement;
    positionToNote = ["C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A", "B", "C"]
    constructor(private canvasId: string) {
    }

    View(toneKey: string): boolean {
        this.RepresentativeElement = document.getElementById(this.canvasId) as HTMLCanvasElement;
        if(!this.RepresentativeElement)
            return false;
        let tones = Utils.GetNotesFromToneKey(toneKey);
        let ctx = this.RepresentativeElement.getContext("2d");
        let width = this.RepresentativeElement.offsetWidth;
        let height = this.RepresentativeElement.offsetHeight;
        ctx!.strokeStyle = "#000000";
        ctx!.fillStyle = "#000000";
        ctx!.clearRect(0, 0, width, height)
        for(let i=5; i<=11; i++) {
            if (i !== 15 && tones.indexOf(this.positionToNote[i]) !== -1) {
                ctx!.fillStyle = "#00ff48";
                ctx!.fillRect(i * width / 15, 0, width / 15, height);
                ctx!.fillStyle = "#000000";
            }
        }
        for(let i=15; i>=0; i--){
            ctx!.beginPath();
            ctx!.moveTo(i*width/15, 0)
            ctx!.lineTo(i*width/15, height)
            ctx!.stroke();
            if(i!==2 && i!==6 && i!==9 && i!==13 && i!==14 && i!==15){
                if(i>=5 && i<=11 && tones.indexOf(this.positionToNote[i]+"#") !== -1){
                    ctx!.fillStyle = "#FF003D";
                }
                ctx!.fillRect(i*width/15 + 3*width/60, 0, width/30, 3*height/5)
                ctx!.fillStyle = "#000000";
            }
        }

        ctx!.beginPath();
        ctx!.moveTo(0, 0)
        ctx!.lineTo(width, 0)
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.moveTo(width, height)
        ctx!.lineTo(0, height)
        ctx!.stroke();

        return true;
    }

    getActualToneKey(): string {
        return "";
    }

}