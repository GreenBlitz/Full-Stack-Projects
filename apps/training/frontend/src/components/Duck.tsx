import { useEffect } from "react";
import { useState, type Dispatch, type SetStateAction } from "react";

export interface DuckProps {
  name: string;
  color: string;
  age: number;
}

export function Duck({ name, color, age }: DuckProps) {
  return (
    <>
      <div className="border-2 border-purple-500 max-w-fit">
        <link href="CSS.css" rel="stylesheet" />
        <span className="font-sans">name: {name}</span>
        <br />
        <span className="font-sans">color: {color}</span>
        <br />
        <span className="font-sans">age: {age}</span>
        <br />
      </div>
      <br />
    </>
  );
}
