import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        margin: "8px 0",
        padding: "12px",
      }}
    >
      {children}
    </div>
  );
}
