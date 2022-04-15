import {IMusicNotationViewer} from "../IMusicNotationViewer";
import {Accidental, Vex, Voice} from "vexflow";
import {Utils} from "../../../utils/Utils";


export class MusicSheetViewer implements IMusicNotationViewer{
    constructor(private canvasElementId: string) {
    }

    RepresentativeElement?: HTMLCanvasElement;

    getActualToneKey(){
        return "";
    }
    private actualToneKey = "";

    public View(toneKey: string): boolean {
        if(toneKey === this.actualToneKey)
            return true;
        this.actualToneKey = toneKey;
        let VF = Vex.Flow;
        this.RepresentativeElement=document.getElementById(this.canvasElementId) as HTMLCanvasElement;

        let WorkspaceInformation = {
            // The <canvas> element in which you're going to work
            canvas: document.getElementById(this.canvasElementId) as HTMLCanvasElement,
            // Vex creates a canvas with specific dimensions
            canvasWidth: 100,
            canvasHeight: 100
        };

        let renderer = new VF.Renderer(
            WorkspaceInformation.canvas,
            VF.Renderer.Backends.CANVAS
        );

        let context = renderer.getContext();
        context.clearRect(0, 0, this.RepresentativeElement.offsetWidth, this.RepresentativeElement.offsetHeight)

        context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");


        let stave = new VF.Stave(10, 40, 400);
        stave.addClef("treble").addTimeSignature("4/4");
        stave.setContext(context).draw();

        let tones = Utils.GetNotesFromToneKey(toneKey);
        if(tones.length === 0){
            stave.setContext(context).draw();
            return true;
        }
        let chord1: [string, number][] = tones.map(tone => [tone.toLowerCase() , "ab".indexOf(tone.substring(0, 1).toLowerCase())!==-1?3:4]);
        let chord2: [string, number][] = chord1.slice();
        let newLast: [string, number] = [...chord2[0]];
        newLast[1] = newLast[1]+1;
        chord2.splice(0, 1);
        chord2.push(newLast);
        let chord3 = chord2.slice();
        newLast = [...chord3[0]];
        newLast[1] = newLast[1]+1;
        chord3.splice(0, 1);
        chord3.push(newLast);
        let chord4 = chord3.slice();
        newLast = [...chord4[0]];
        newLast[1] = newLast[1]+1;
        chord4.splice(0, 1);
        chord4.push(newLast);
        let notes = [
            new VF.StaveNote({clef: "treble", keys: chord1.map(c => c[0]+"/"+c[1]), duration: "q" }),
            new VF.StaveNote({clef: "treble", keys: chord2.map(c => c[0]+"/"+c[1]), duration: "q" }),
            new VF.StaveNote({clef: "treble", keys: chord3.map(c => c[0]+"/"+c[1]), duration: "q" }),
            new VF.StaveNote({clef: "treble", keys: chord4.map(c => c[0]+"/"+c[1]), duration: "q" }),
        ];

        let voice = new VF.Voice({ num_beats: 4,  beat_value: 4}).setMode(Voice.Mode.STRICT);
        voice.addTickables(notes);
        Accidental.applyAccidentals([voice], "C");
        new VF.Formatter().joinVoices([voice]).format([voice], 400);

        voice.draw(context, stave);
        return true;
    }
}

export default MusicSheetViewer;