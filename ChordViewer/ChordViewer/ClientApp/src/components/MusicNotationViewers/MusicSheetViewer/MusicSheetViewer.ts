import {IMusicNotationViewer} from "../IMusicNotationViewer";


export class MusicSheetViewer implements IMusicNotationViewer{
    constructor(private canvasElementId: string) {
    }

    notePositions:{[name: string]: number}  = {
        "Cb": 9,
        "C": 9,
        "C#": 9,
        "Db": 10,
        "D": 10,
        "D#": 10,
        "Eb": 11,
        "E": 11,
        "E#": 11,
        "Fb": 12,
        "F": 12,
        "F#": 12,
        "Gb": 13,
        "G": 13,
        "G#": 13,
        "Ab": 7,
        "A": 7,
        "A#": 7,
        "Bb": 8,
        "B": 8,
        "B#": 8,
    }

    public View(toneKey: string): boolean {
        // @ts-ignore
        let canvas: HTMLCanvasElement = document.getElementById(this.canvasElementId);
        if(!canvas)
            return false;
        let ctx = canvas.getContext("2d");
        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;
        ctx!.strokeStyle = "#000000"
        ctx!.fillStyle = "#000000"
        ctx!.fillText("\uD834\uDD1E", width/4, height/2);
        ctx!.clearRect(0, 0, width, height)
        for(let i=0; i<5; i++){
            ctx!.beginPath();
            ctx!.moveTo(0, (i+1)*(height/7))
            ctx!.lineTo(width, (i+1)*(height/7))
            ctx!.stroke();
        }
        let tones = [];
        for(let i=0; i<toneKey.length; i++){
            let begin = i;
            let end = i+1;
            while(end<toneKey.length && (toneKey[end] == "#"||toneKey[end] == "b")){
                end++;
                i++;
            }
            tones.push(toneKey.substring(begin, end));
        }
        let takenPositions: number[] = [];
        tones.forEach(tone => {
            ctx!.beginPath();
            let xcoordinate = width/2;
            let position = this.notePositions[tone];
            if(takenPositions.indexOf(position) != -1)
                xcoordinate +=height/7;
            else
                takenPositions.push(position, position-1, position+1);
            ctx!.arc(xcoordinate, height-(height/14)*(position), height/14, 0, 2*Math.PI)
            ctx!.stroke();
        })
        return true;
    }
}

export default MusicSheetViewer;