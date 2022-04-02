import {IMusicNotationViewer} from "../IMusicNotationViewer";
import {Accidental, Vex, Voice} from "vexflow";


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
        let VF = Vex.Flow;

// We created an object to store the information about the workspace
        var WorkspaceInformation = {
            // The <canvas> element in which you're going to work
            canvas: document.getElementById(this.canvasElementId) as HTMLCanvasElement,
            // Vex creates a canvas with specific dimensions
            canvasWidth: 100,
            canvasHeight: 100
        };

// Create a renderer with Canvas
        var renderer = new VF.Renderer(
            WorkspaceInformation.canvas,
            VF.Renderer.Backends.CANVAS
        );

// Expose the context of the renderer
        var context = renderer.getContext();

// And give some style to our SVG
        context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");


        /**
         * Creating a new stave
         */
// Create a stave of width 400 at position x10, y40 on the SVG.
        var stave = new VF.Stave(10, 40, 400);
// Add a clef and time signature.
        stave.addClef("treble").addTimeSignature("4/4");
// Set the context of the stave our previous exposed context and execute the method draw !
        stave.setContext(context).draw();


        /**
         * Draw notes
         */
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
        let notes = [
            new VF.StaveNote({clef: "treble", keys: tones.map(tone => tone.toLowerCase() + "/4"), duration: "q" }),

        ];

        var voice = new VF.Voice({num_beats: 1,  beat_value: 4}).setMode(Voice.Mode.SOFT);
        voice.addTickables(notes);
        Accidental.applyAccidentals([voice], "C");
        var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);

        voice.draw(context, stave);
        return true;
    }
}

export default MusicSheetViewer;