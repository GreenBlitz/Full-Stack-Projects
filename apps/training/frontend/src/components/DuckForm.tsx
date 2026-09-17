import { useState } from "react";
import { createPortal } from "react-dom";

export function DuckForm() {
  const [inputs, setInputs] = useState({
    duckName: "",
    duckColor: "",
    duckAge: -1,
  });

  const [submittedDuck, setSubmittedDuck] = useState<null | typeof inputs>(
    null,
  );

  function handleChange(e: any) {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    setSubmittedDuck(inputs);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Name: </label>
        <input
          name="duckName"
          type="text"
          value={inputs.duckName}
          onChange={handleChange}
          required
        />
        <br />
        <label>Color: </label>
        <input
          name="duckColor"
          type="text"
          value={inputs.duckColor}
          onChange={handleChange}
          required
        />
        <br />
        <label>Age: </label>
        <input
          name="duckAge"
          type="number"
          value={inputs.duckAge}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Add Duck</button>
      </form>
      {submittedDuck &&
        createPortal(
          submittedDuck,
          document.body,
        )}
    </>
  );
}
