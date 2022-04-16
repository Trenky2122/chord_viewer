import {IMusicNotationViewer} from "../IMusicNotationViewer";
import {Accidental, Vex, Voice} from "vexflow";
import {Utils} from "../../../utils/Utils";
import ContextMenu from "./ContextMenu/ContextMenu";


export class MusicSheetViewer implements IMusicNotationViewer{
    constructor(private canvasElementId: string, private contextMenu: ContextMenu) {
        this.RepresentativeElement=document.getElementById(this.canvasElementId) as HTMLCanvasElement;
        this.RepresentativeElement.addEventListener('contextmenu', this.handleRightClick.bind(this), false);
        this.RepresentativeElement.addEventListener('click', this.handleClick.bind(this), false);
        this.RepresentativeElement.addEventListener('addNote', this.addNote.bind(this), false);
        this.RepresentativeElement.addEventListener('removeNote', this.removeNote.bind(this), false);
        this.RepresentativeElement.addEventListener('addSharp', this.addNoteSharp.bind(this), false);
        this.RepresentativeElement.addEventListener('removeSharp', this.removeNoteSharp.bind(this), false);
    }
    private lastClickedNote = "";
    RepresentativeElement: HTMLCanvasElement;

    getActualToneKey(): string{
        return this.currentNotes.sort().join("");
    }

    public View(toneKey: string): boolean {
        if(toneKey === this.actualToneKey)
            return true;
        if(this.RepresentativeElement == null)
            return false;
        this.actualToneKey = toneKey;
        let VF = Vex.Flow;

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

        this.currentNotes = Utils.GetNotesFromToneKey(toneKey);
        if(this.currentNotes.length === 0){
            stave.setContext(context).draw();
            return true;
        }
        let chord1: [string, number][] = this.currentNotes.map(tone => [tone.toLowerCase() , "ab".indexOf(tone.substring(0, 1).toLowerCase())!==-1?3:4]);
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

    private actualToneKey = "";
    private currentNotes: string[] = [];

    handleRightClick(e: MouseEvent){
        e.preventDefault();
        let note = this.getNoteFromYPosition(e.offsetY);
        let containsClean = this.currentNotes.indexOf(note) !== -1;
        let containsSharp = this.currentNotes.indexOf(note+ "#") !== -1;
        this.contextMenu.view(e.pageX, e.pageY, this.canvasElementId, !containsClean,
            containsClean, !containsSharp, containsSharp);
        this.lastClickedNote = note;
    }

    handleClick(e: MouseEvent){
        e.preventDefault();
        this.contextMenu.hide();
    }

    private getNoteFromYPosition(y: number): string{
        let positions = ["A", "G", "F", "E", "D", "C", "B"];
        return positions[Math.floor((y+2)/5) % 7];
    }

    addNote(){
        this.currentNotes.push(this.lastClickedNote);
        this.currentNotes = this.currentNotes.sort();
        this.contextMenu.hide();
        this.RepresentativeElement.dispatchEvent(new CustomEvent("notesUpdated"));
    }

    removeNote(){
        this.currentNotes = this.currentNotes.filter(x => x !== this.lastClickedNote);
        this.contextMenu.hide();
        this.RepresentativeElement.dispatchEvent(new CustomEvent("notesUpdated"));
    }

    addNoteSharp(){
        this.currentNotes.push(this.lastClickedNote+"#");
        this.currentNotes = this.currentNotes.sort();
        this.contextMenu.hide();
        this.RepresentativeElement.dispatchEvent(new CustomEvent("notesUpdated"));
    }

    removeNoteSharp(){
        this.currentNotes = this.currentNotes.filter(x => x !== this.lastClickedNote+"#");
        this.contextMenu.hide();
        this.RepresentativeElement.dispatchEvent(new CustomEvent("notesUpdated"));
    }
}

export default MusicSheetViewer;