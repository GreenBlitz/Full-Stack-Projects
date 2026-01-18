// בס"ד


export type GameEventsCounter<T extends AllPossibleGameEvents> = Record<T, number> 

export type AllPossibleGameEvents = AlgaeEvent | CoralEvent;