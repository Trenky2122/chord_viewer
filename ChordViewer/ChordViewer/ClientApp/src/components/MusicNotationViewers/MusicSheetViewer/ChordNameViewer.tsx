import {IMusicNotationViewer} from "../IMusicNotationViewer";
import {Utils} from "../../../utils/Utils";

export enum ChordType{
    Dur,
    Mol,
    Dim,
    FifthSharp,
    Pow
}

export class ChordNameViewer implements IMusicNotationViewer{

    valueToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]


    private currentToneKey = "";
    public RepresentativeElement?: HTMLInputElement;
    constructor(private inputId: string) {
        this.RepresentativeElement = document.getElementById(this.inputId) as HTMLInputElement;
        this.RepresentativeElement.addEventListener("keyup",
            ()=>this.RepresentativeElement?.dispatchEvent(new CustomEvent("notesUpdated")));
    }

    getActualToneKey(): string{
        let chordString = this.RepresentativeElement?.value!;
        let chord: {chord_type: ChordType, baseTone: string, add_2_flat: boolean,
        add_2: boolean, add_2_sharp: boolean, add_4: boolean, add_4_sharp: boolean,
        add_6_flat: boolean, add_6: boolean, add_7_flat: boolean, add_7: boolean} = {
            baseTone: "C",
            chord_type: ChordType.Dur,
            add_2_flat: false,
            add_2: false,
            add_2_sharp: false,
            add_4: false,
            add_4_sharp: false,
            add_6_flat: false,
            add_6: false,
            add_7_flat: false,
            add_7: false,
        };
        if (chordString.split(" ").join("") === "") {
            return "";
        }
        chordString = chordString.replace("♭", "b");
        chordString = chordString.replace("♯", "#")
        chord.baseTone = chordString.substring(0, 1);
        if (chordString.length > 1 && (chordString.charAt(1) === "b" || chordString.charAt(1) === "#"))
            chord.baseTone = chordString.substring(0, 2);
        if (chordString.length > 2 && (
            (chordString.charAt(1) === "b" && chordString.charAt(1) === "b") || (chordString.charAt(1) === "#" && chordString.charAt(1) === "#")))
            chordString.substring(0, 3);
        chord.add_2_flat = chordString.indexOf("2b") !== -1;
        chord.add_2_sharp = chordString.indexOf("2#") !== -1;
        chord.add_2 = chordString.indexOf("2") !== -1 && !chord.add_2_sharp && !chord.add_2_flat;
        if (chord.add_2_flat)
            chord.add_2 = chordString.indexOf("2b2") !== -1;
        if (chord.add_2_sharp)
            chord.add_2 = chordString.indexOf("22#") !== -1;
        if (chord.add_2_sharp && chord.add_2_flat)
            chord.add_2 = chordString.indexOf("2b22#") !== -1;
        chord.add_4_sharp = chordString.indexOf("4#") !== -1;
        chord.add_4 = chordString.indexOf("4") !== -1 && !chord.add_4_sharp
        if (chord.add_4_sharp)
            chord.add_4 = chordString.indexOf("44#") !== -1;
        chord.add_6_flat = chordString.indexOf("6b") !== -1;
        chord.add_6 = chordString.indexOf("6") !== -1 && !chord.add_6_flat;
        if (chord.add_6_flat)
            chord.add_6 = chordString.indexOf("6b6") !== -1;
        chord.add_7 = chordString.indexOf("maj7") !== -1;
        chord.add_7_flat = chordString.indexOf("7") !== -1 && !chord.add_7;
        if (chord.add_7)
            chord.add_7_flat = chordString.indexOf("7maj7") !== -1;
        chord.chord_type = ChordType.Dur;
        if (chordString.indexOf("mi") !== -1)
            chord.chord_type = ChordType.Mol;
        else if (chordString.indexOf("dim") !== -1)
            chord.chord_type = ChordType.Dim;
        else if (chordString.indexOf("5+") !== -1)
            chord.chord_type = ChordType.FifthSharp;
        else if (chordString.indexOf("pow") !== -1)
            chord.chord_type = ChordType.Pow;
        let tones = [chord.baseTone];
        let noteInterval = 0;
        let note2Interval = -1;
        switch (chord.chord_type){
            case ChordType.Dur:
                noteInterval = 4;
                note2Interval = 7;
                break;
            case ChordType.Mol:
                noteInterval = 3;
                note2Interval = 7;
                break;
            case ChordType.Dim:
                noteInterval = 3;
                note2Interval = 6;
                break;
            case ChordType.FifthSharp:
                noteInterval = 4;
                note2Interval = 8;
                break;
            case ChordType.Pow:
                noteInterval = 7;
        }
        tones.push(this.valueToNote[Utils.GetNoteNumberInIntervalFromBase(Utils.NoteValues[chord.baseTone], noteInterval)]);
        if(note2Interval !== -1)
            tones.push(this.valueToNote[Utils.GetNoteNumberInIntervalFromBase(Utils.NoteValues[chord.baseTone], note2Interval)]);
        let addedNoteIntervals: number[] = [];
        if(chord.add_2_flat){
            addedNoteIntervals.push(1);
        }
        if(chord.add_2){
            addedNoteIntervals.push(2);
        }
        if(chord.add_2_sharp){
            addedNoteIntervals.push(3);
        }
        if(chord.add_4){
            addedNoteIntervals.push(5);
        }
        if(chord.add_4_sharp){
            addedNoteIntervals.push(6);
        }
        if(chord.add_6_flat){
            addedNoteIntervals.push(8);
        }
        if(chord.add_6){
            addedNoteIntervals.push(9);
        }
        if(chord.add_7_flat){
            addedNoteIntervals.push(10);
        }
        if(chord.add_7){
            addedNoteIntervals.push(11);
        }
        addedNoteIntervals.forEach(i => {
            tones.push(this.valueToNote[Utils.GetNoteNumberInIntervalFromBase(Utils.NoteValues[chord.baseTone], i)])
        })
        return tones.filter((t, i) => tones.indexOf(t)===i).sort().join("");
    }

    View(toneKey: string): boolean{
        if(this.currentToneKey === toneKey || toneKey === "")
            return true;
        if(!this.RepresentativeElement)
            return false;
        this.currentToneKey=toneKey;
        this.RepresentativeElement.value = Utils.GetChordNameFromToneKey(toneKey);
        return true;
    }
}
