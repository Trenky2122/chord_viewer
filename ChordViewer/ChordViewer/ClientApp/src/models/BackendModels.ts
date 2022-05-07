export interface User{
    id: number;
    userName: string;
    isAdmin: boolean;
}

export interface Tab{
    id: number;
    toneKey: string;
    authorId: number;
    author?: User;
    stringCount: number;
    tabStrings: TabString[];
    tabBarre: TabBarre[];
}

export interface TabString{
    id: number;
    stringOrder: number;
    tune: string;
    fret: number;
    suggestedFinger: number;
    tabId: number;
    tab?: Tab;
}

export interface TabBarre{
    id: number;
    tabId: number;
    tab?: Tab;
    fret: number;
    stringBegin: number;
    stringEnd: number;
    suggestedFinger: number;
}

export interface Collection{
    id: number;
    name: string;
    authorId: number;
    author?: User;
    isPublic: boolean;
    tabRelations?: CollectionTabRelation[];
    userRelations?: CollectionUserRelation[];
}

export interface CollectionTabRelation{
    id: number;
    tabId: number;
    collectionId: number;
    tab?: Tab;
}

export interface CollectionUserRelation{
    id: number;
    userId: number;
    collectionId: number;
}
