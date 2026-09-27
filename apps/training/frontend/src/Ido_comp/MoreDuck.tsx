import { useState } from "react";

export function MoreDuck() {
  const [name, setName] = useState("");
  const [colour, setColour] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    console.log("It was " + name + ", he killed him");
    console.log("He is " + colour);
    console.log("And he is " + age + " years old");
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
        type="text"
      />

      <br />
      <br />

      <button 
      style={{ background: "#185372", color: "#fc9dff" }}
      type="submit"> la more duck la wiwi
      </button>
    </form>
  );
}