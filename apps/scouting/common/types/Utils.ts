// בס"ד

type AtMostUnion<T extends any[]> = 
  T extends [infer _, ...infer Rest] 
    ? T | AtMostUnion<Rest> 
    : [];
export type AtMost<T, N extends number, Result extends any[] = []> = 
  Result['length'] extends N 
    ? Result | AtMostUnion<Result>
    : AtMost<T, N, [T, ...Result]>;