export class Utils{
    public static GetNotesFromToneKey(toneKey: string):string[]{
        let tones = [];
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
            if(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].indexOf(tones[i])===-1)
                return [];
        }
        return tones;
    }
}