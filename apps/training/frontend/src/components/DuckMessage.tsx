export interface DuckMessageProps {
  ducksNumber: number;
}
export function DuckMessage({ ducksNumber }: DuckMessageProps) {
  return ducksNumber === 0 ? (
    <title>😭אין ברווזים😭</title>
  ) : ducksNumber >= 6 ? (
    <title>🚨האתר מוצף בברווזים🚨</title>
  ) : (
    <title>👍המצב בשליטה👍</title>
  );
}
