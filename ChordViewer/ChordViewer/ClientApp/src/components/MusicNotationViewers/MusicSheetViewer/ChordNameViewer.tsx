import {IMusicNotationViewer} from "../IMusicNotationViewer";
import {Utils} from "../../../utils/Utils";

enum ChordType{
    Dur,
    Mol,
    Dim,
    FifthSharp
}

export class ChordNameViewer implements IMusicNotationViewer{
    noteValues:{[name: string]: number}  = {
        "Cb": 11,
        "C": 0,
        "C#": 1,
        "Db": 1,
        "D": 2,
        "D#": 3,
        "Eb": 3,
        "E": 4,
        "E#": 5,
        "Fb": 4,
        "F": 5,
        "F#": 6,
        "Gb": 6,
        "G": 7,
        "G#": 8,
        "Ab": 8,
        "A": 9,
        "A#": 10,
        "Bb": 10,
        "B": 11,
        "B#": 0,
    }
    valueToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

    addedNoteNames : string[] = ["", "2b", "2", "2#", "", "4", "4#", "", "6b", "6", "7", "maj7"]
    private currentToneKey = "";
    public RepresentativeElement?: HTMLInputElement;
    constructor(private inputId: string) {
    }

    getActualToneKey(): string{
        let chordString = this.RepresentativeElement?.value!;
        let chord = {
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
        chord.add_4_sharp = chordString.indexOf("2b22#") !== -1;
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
        let tones = [chord.baseTone];
        let noteValue = 0;
        let note = "";
        let noteValue2 = 0;
        let note2 = "";
        switch (chord.chord_type){
            case ChordType.Dur:
                noteValue = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 4);
                note = this.valueToNote[noteValue];
                noteValue2 = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 7);
                note2 = this.valueToNote[noteValue2];
                tones.push(note);
                tones.push(note2);
                break;
            case ChordType.Mol:
                noteValue = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 3);
                note = this.valueToNote[noteValue];
                noteValue2 = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 7);
                note2 = this.valueToNote[noteValue2];
                tones.push(note);
                tones.push(note2);
                break;
            case ChordType.Dim:
                noteValue = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 3);
                note = this.valueToNote[noteValue];
                noteValue2 = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 6);
                note2 = this.valueToNote[noteValue2];
                tones.push(note);
                tones.push(note2);
                break;
            case ChordType.FifthSharp:
                noteValue = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 4);
                note = this.valueToNote[noteValue];
                noteValue2 = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 8);
                note2 = this.valueToNote[noteValue2];
                tones.push(note);
                tones.push(note2);
                break;
        }
        if(chord.add_2_flat){
            let noteValue = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 1);
            let note = this.valueToNote[noteValue];
            tones.push(note);
        }
        if(chord.add_2){
            let noteValue = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 2);
            let note = this.valueToNote[noteValue];
            tones.push(note);
        }
        if(chord.add_2_sharp){
            let noteValue = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 3);
            let note = this.valueToNote[noteValue];
            tones.push(note);
        }
        if(chord.add_4){
            let noteValue = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 5);
            let note = this.valueToNote[noteValue];
            tones.push(note);
        }
        if(chord.add_4_sharp){
            let noteValue = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 6);
            let note = this.valueToNote[noteValue];
            tones.push(note);
        }
        if(chord.add_6_flat){
            let noteValue = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 8);
            let note = this.valueToNote[noteValue];
            tones.push(note);
        }
        if(chord.add_6){
            let noteValue = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 9);
            let note = this.valueToNote[noteValue];
            tones.push(note);
        }
        if(chord.add_7_flat){
            let noteValue = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 10);
            let note = this.valueToNote[noteValue];
            tones.push(note);
        }
        if(chord.add_7){
            let noteValue = ChordNameViewer.getNoteInIntervalFromBase(this.noteValues[chord.baseTone], 11);
            let note = this.valueToNote[noteValue];
            tones.push(note);
        }
        console.log(tones);
        return tones.filter((t, i) => tones.indexOf(t)===i).sort().join("");
    }

    View(toneKey: string): boolean{
        if(this.currentToneKey === toneKey)
            return true;
        this.RepresentativeElement = document.getElementById(this.inputId) as HTMLInputElement;
        if(!this.RepresentativeElement)
            return false;
        this.currentToneKey=toneKey;
        let tones = Utils.GetNotesFromToneKey(toneKey);
        let toneValues = tones.map(t => this.noteValues[t]);
        let [baseIndex, fifth] = ChordNameViewer.getChordBase(toneValues);
        if(baseIndex === -1) {
            this.RepresentativeElement.value = "Unknown chord";
            return true;
        }
        let baseToneValue = toneValues[baseIndex];
        let chordTypeString = "";
        let chordType: ChordType = ChordType.Dur;
        if(fifth === 8){
            if(toneValues.indexOf((baseToneValue +4)%12) === -1){
                this.RepresentativeElement.value = "Unknown chord";
                return true;
            }
            chordTypeString = "5+";
            chordType = ChordType.FifthSharp;
        }
        else if(fifth === 6){
            if(toneValues.indexOf((baseToneValue +3)%12) === -1){
                this.RepresentativeElement.value = "Unknown chord";
                return true;
            }
            chordTypeString = "dim";
            chordType = ChordType.Dim;
        }
        else if(fifth === 7){
            if(toneValues.indexOf((baseToneValue +3)%12) !== -1){
                chordTypeString = "mi";
                chordType = ChordType.Mol;
            }
            else {
                toneValues=toneValues.filter(x => x !== ChordNameViewer.getNoteInIntervalFromBase(baseToneValue , 7)
                    && x !== ChordNameViewer.getNoteInIntervalFromBase(baseToneValue , 4));
            }
        }
        toneValues=ChordNameViewer.filterBaseChordTones(toneValues, baseIndex, chordType);
        let chordString = tones[baseIndex] + chordTypeString;
        for(let i=0; i<this.addedNoteNames.length; i++){
            if(toneValues.indexOf(ChordNameViewer.getNoteInIntervalFromBase(baseToneValue, i))!==-1){
                chordString+=this.addedNoteNames[i];
            }
        }
        this.RepresentativeElement.value = chordString;
        return true;
    }

    private static getChordBase(toneValues: number[]): [number, number]{
        for(let i=0; i<toneValues.length; i++){
            if(toneValues.indexOf(ChordNameViewer.getNoteInIntervalFromBase(toneValues[i], 7))!==-1){
                if(toneValues.indexOf(ChordNameViewer.getNoteInIntervalFromBase(toneValues[i], 3)) !== -1 ||
                    toneValues.indexOf(ChordNameViewer.getNoteInIntervalFromBase(toneValues[i], 4)) !== -1)
                    continue;
                return [i, 7];
            }
        }
        for(let i=0; i<toneValues.length; i++){
            if(toneValues.indexOf(ChordNameViewer.getNoteInIntervalFromBase(toneValues[i], 6))!==-1){
                return [i, 6];
            }
        }
        for(let i=0; i<toneValues.length; i++){
            if(toneValues.indexOf(ChordNameViewer.getNoteInIntervalFromBase(toneValues[i], 8))!==-1){
                return [i, 8];
            }
        }
        for(let i=0; i<toneValues.length; i++){
            if(toneValues.indexOf(ChordNameViewer.getNoteInIntervalFromBase(toneValues[i], 7))!==-1){
                return [i, 7];
            }
        }
        return [-1, 0];
    }

    private static getNoteInIntervalFromBase(baseNumber: number, interval: number): number{
        return (baseNumber + interval) % 12;
    }

    private static filterBaseChordTones(toneValues: number[], baseIndex: number, chordType: ChordType):number[]{
        let interval1 = 3;
        if(chordType === ChordType.Dur || chordType=== ChordType.FifthSharp)
            interval1 = 4;
        let interval2 = 7;
        if(chordType === ChordType.FifthSharp)
            interval2 = 8;
        if(chordType === ChordType.Dim)
            interval2 = 6;
        return toneValues.filter(x => x !== ChordNameViewer.getNoteInIntervalFromBase(toneValues[baseIndex], interval2)
            && x !== ChordNameViewer.getNoteInIntervalFromBase(toneValues[baseIndex], interval1)
            && x !== toneValues[baseIndex]);
    }
}
