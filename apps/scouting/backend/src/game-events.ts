// בס"ד
export type CoralEvent = "L1" | "L2" | "L3" | "L4"

export type AlgaeEvent = "Net" | "Processor"

export type GameEventsCounter<T extends AllPossibleGameEvents> = Record<T, number> 

export type AllPossibleGameEvents = AlgaeEvent | CoralEvent