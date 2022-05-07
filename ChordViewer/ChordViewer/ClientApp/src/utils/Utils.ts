import {Tab} from "../models/BackendModels";
import {ChordType} from "../components/MusicNotationViewers/MusicSheetViewer/ChordNameViewer";

export class Utils{
    public static get NoteValues():{[name: string]: number}{
        return {
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
    }

    static get AddedNoteNames() : string[] {
      return ["", "2b", "2", "2#", "", "4", "4#", "", "6b", "6", "7", "maj7"];
    }

    public static get ToneSequence(): string[]{
        return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    }
    public static GetNotesFromToneKey(toneKey: string):string[]{
        let tones: string[] = [];
        for(let i=0; i<toneKey.length; i++){
            let begin = i;
            let end = i+1;
            while(end<toneKey.length && (toneKey[end] === "#"||toneKey[end] === "b")){
                end++;
                i++;
            }
            tones.push(toneKey.substring(begin, end));
        }
        for (let i=0; i<tones.length; i++){
            if(Utils.ToneSequence.indexOf(tones[i])===-1)
                return [];
        }
        tones = tones.filter((tone, i) => tones.indexOf(tone)===i);
        return tones;
    }


    public static GetToneStringForTab(tab: Tab): string{
        let notes: string[] = [];
        tab.tabStrings.forEach(s => notes.push(Utils.GetNoteInIntervalFromBase(s.tune, s.fret)))
        return notes.filter((n, i) => notes.indexOf(n)===i).sort().join("");
    }


    public static GetNoteInIntervalFromBase(baseTone: string, interval: number): string{
        let baseNumber = Utils.ToneSequence.indexOf(baseTone);
        return Utils.ToneSequence[(baseNumber + interval) % 12];
    }

    public static GetChordNameFromToneKey(toneKey: string): string{
        let tones = Utils.GetNotesFromToneKey(toneKey);
        let toneValues = tones.map(t => this.NoteValues[t]);
        let [baseIndex, fifth] = Utils.GetChordBase(toneValues);
        if(baseIndex === -1) {
            return "Unknown chord";
        }
        let baseToneValue = toneValues[baseIndex];
        let chordTypeString = "";
        let chordType: ChordType = ChordType.Dur;
        if(fifth === 8){
            if(toneValues.indexOf((baseToneValue +4)%12) === -1){
                return "Unknown chord";
            }
            chordTypeString = "5+";
            chordType = ChordType.FifthSharp;
        }
        else if(fifth === 6){
            if(toneValues.indexOf((baseToneValue +3)%12) === -1){
                return "Unknown chord";
            }
            chordTypeString = "dim";
            chordType = ChordType.Dim;
        }
        else if(fifth === 7){
            if(toneValues.indexOf((baseToneValue +3)%12) !== -1){
                chordTypeString = "mi";
                chordType = ChordType.Mol;
            }
            else if(toneValues.indexOf((baseToneValue +4)%12) !== -1) {
                chordType = ChordType.Dur;
            }
            else {
                chordType = ChordType.Pow;
                chordTypeString = "pow";
            }
        }
        toneValues=Utils.FilterBaseChordTones(toneValues, baseIndex, chordType);
        let chordString = tones[baseIndex] + chordTypeString;
        for(let i=0; i<this.AddedNoteNames.length; i++){
            if(toneValues.indexOf(Utils.GetNoteNumberInIntervalFromBase(baseToneValue, i))!==-1){
                chordString+=this.AddedNoteNames[i];
            }
        }
        return chordString;
    }

    private static GetChordBase(toneValues: number[]): [number, number]{
        for(let i=0; i<toneValues.length; i++){
            if(toneValues.indexOf(Utils.GetNoteNumberInIntervalFromBase(toneValues[i], 7))!==-1){
                if(toneValues.indexOf(Utils.GetNoteNumberInIntervalFromBase(toneValues[i], 3)) === -1 &&
                    toneValues.indexOf(Utils.GetNoteNumberInIntervalFromBase(toneValues[i], 4)) === -1)
                    continue;
                return [i, 7];
            }
        }
        for(let i=0; i<toneValues.length; i++){
            if(toneValues.indexOf(Utils.GetNoteNumberInIntervalFromBase(toneValues[i], 6))!==-1){
                return [i, 6];
            }
        }
        for(let i=0; i<toneValues.length; i++){
            if(toneValues.indexOf(Utils.GetNoteNumberInIntervalFromBase(toneValues[i], 8))!==-1){
                return [i, 8];
            }
        }
        for(let i=0; i<toneValues.length; i++){
            if(toneValues.indexOf(Utils.GetNoteNumberInIntervalFromBase(toneValues[i], 7))!==-1){
                return [i, 7];
            }
        }
        return [-1, 0];
    }

    private static FilterBaseChordTones(toneValues: number[], baseIndex: number, chordType: ChordType):number[]{
        let interval1 = 3;
        if(chordType === ChordType.Dur || chordType=== ChordType.FifthSharp)
            interval1 = 4;
        let interval2 = 7;
        if(chordType === ChordType.FifthSharp)
            interval2 = 8;
        if(chordType === ChordType.Dim)
            interval2 = 6;
        return toneValues.filter(x => x !== Utils.GetNoteNumberInIntervalFromBase(toneValues[baseIndex], interval2)
            && x !== Utils.GetNoteNumberInIntervalFromBase(toneValues[baseIndex], interval1)
            && x !== toneValues[baseIndex]);
    }

    public static GetNoteNumberInIntervalFromBase(baseNumber: number, interval: number): number{
        return (baseNumber + interval) % 12;
    }

    public static GetChordNameFromTab(tab: Tab): string{
        return this.GetChordNameFromToneKey(this.GetToneStringForTab(tab));
    }
}