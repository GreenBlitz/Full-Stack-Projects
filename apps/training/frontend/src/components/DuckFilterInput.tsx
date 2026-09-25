export interface DuckFilterInputProps {
  setFilter: (value: string) => void;
}

export function DuckFilterInput({ setFilter }: DuckFilterInputProps) {
  return (
    <>
      <label htmlFor="duck-filter">Filter Ducks</label>
      <input
        id="duck-filter"
        type="text"
        onChange={(event) => setFilter(event.target.value)}
      />
    </>
  );
}
