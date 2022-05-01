export class Utils{
    public static get toneSequence(): string[]{
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
            if(Utils.toneSequence.indexOf(tones[i])===-1)
                return [];
        }
        tones = tones.filter((tone, i) => tones.indexOf(tone)===i);
        return tones;
    }
}