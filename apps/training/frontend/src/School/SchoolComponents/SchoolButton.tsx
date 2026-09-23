
import axios from "axios";
import { useState } from "react";

async function getSchool() {
  const response = await axios.get(
    "http://localhost:3001/school"
  );
  return response.data;
}

export function SchoolButton() {
  const [school, setSchool] = useState<{ name: string; city: string }>();

  async function handleClick() {
    const schoolData = await getSchool();
    setSchool(schoolData);
  }

  return (
    <>
      <button onClick={handleClick}>Load School</button>
      {school && <p>{school.name} - {school.city}</p>}
    </>
  );
}