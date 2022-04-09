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
        return tones;
    }
}