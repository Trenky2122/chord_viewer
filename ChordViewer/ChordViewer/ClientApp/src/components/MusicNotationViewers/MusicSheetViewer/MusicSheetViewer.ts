import {IMusicNotationViewer} from "../IMusicNotationViewer";
import {Accidental, Vex, Voice} from "vexflow";
import {Utils} from "../../../utils/Utils";


export class MusicSheetViewer implements IMusicNotationViewer{
    constructor(private canvasElementId: string) {
    }

    RepresentativeElement?: HTMLCanvasElement;

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
        let notes = [
            new VF.StaveNote({clef: "treble", keys: tones.map(tone => tone.toLowerCase() + ("ab".indexOf(tone.substring(0, 1).toLowerCase())!==-1?"/4":"/5")), duration: "q" }),
        ];

        let voice = new VF.Voice({ num_beats: 1,  beat_value: 4}).setMode(Voice.Mode.SOFT);
        voice.addTickables(notes);
        Accidental.applyAccidentals([voice], "C");
        new VF.Formatter().joinVoices([voice]).format([voice], 400);

        voice.draw(context, stave);
        return true;
    }
}

export default MusicSheetViewer;