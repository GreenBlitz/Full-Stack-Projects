import { useState } from "react";
import type { DuckProps } from "./Duck";

interface la_more_prop {
  the_duck_list: DuckProps[];
  set_the_duck_list: React.Dispatch<
    React.SetStateAction<
      {
        name: string;
        colour: string;
        age: number;
      }[]
    >
  >;
}

export function MoreDuck({ the_duck_list, set_the_duck_list }: la_more_prop) {
  const [name, setName] = useState("");
  const [colour, setColour] = useState("");
  const [age, setAge] = useState(-1);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const the_fake_duck_list = the_duck_list.map((duck) => duck);
    the_fake_duck_list.push({ name: name, colour: colour, age: age });
    set_the_duck_list(the_fake_duck_list);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Duck Name</label>
      <br />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      />

      <br />
      <br />

      <label>Duck Colour</label>
      <br />
      <input
        value={colour}
        onChange={(e) => setColour(e.target.value)}
        type="text"
      />

      <br />
      <br />

      <label>Duck Age</label>
      <br />
      <input
        value={age}
        onChange={(e) => setAge(e.target.value)}
        type="number"
      />

      <br />
      <br />

      <button
        style={{
          background: "#185372",
          color: "#fc9dff",
          border: "2px solid #fc9dff",
          borderRadius: "50px",
          padding: "8px 16px",
          cursor: "pointer",
          marginBottom: "16px",
        }}
        type="submit"
      >
        {" "}
        la more duck la wiwi
      </button>
    </form>
  );
}
