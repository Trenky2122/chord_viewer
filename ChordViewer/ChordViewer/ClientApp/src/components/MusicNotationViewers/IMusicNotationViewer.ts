export interface IMusicNotationViewer{
    View(toneKey: string): boolean;
    getActualToneKey(): string;
    RepresentativeElement?: HTMLElement;
}