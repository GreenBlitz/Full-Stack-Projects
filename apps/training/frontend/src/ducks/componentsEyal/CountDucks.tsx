import type { Duck } from "./DuckCard";
import { Card } from "../../Card";

export function CountDuck({ ducks }: { ducks: Duck[] }) {
  if (ducks.length <= 0) {
    return (
      <Card>
        {" "}
        <p style={{ color: "red" }}> there are no ducks "crying emoji"</p>
      </Card>
    );
  }
  if (ducks.length >= 6) {
    return (
      <Card>
        {" "}
        <p style={{ color: "red" }}> there are too many ducks "alarm emoji" </p>
      </Card>
    );
  }
  return (
    <Card>
      <p style={{ color: "green" }}>
        {" "}
        there are an expected amount of ducks "thumbs up emoji"{" "}
      </p>
    </Card>
  );
}
