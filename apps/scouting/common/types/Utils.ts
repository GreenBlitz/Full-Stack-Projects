// בס"ד


type AtMostUnion<T extends unknown[]> = 
  T extends [infer _, ...infer Rest] 
    ? T | AtMostUnion<Rest> 
    : [];


export type AtMost<T, N extends number, Result extends unknown[] = []> = 
  Result['length'] extends N 
    ? Result | AtMostUnion<Result>
    : AtMost<T, N, [T, ...Result]>;