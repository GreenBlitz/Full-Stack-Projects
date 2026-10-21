import { useState } from "react";
const [searchName, setSearchName] = useState("");

const filteredDucks = ducks2.filter((duck) =>
  duck.name.trim().startsWith(searchName.trim()),
);

return (
  <div>
    <label>חפשי ברווז לפי השם:</label>

    <input
      type="text"
      value={searchName}
      onChange={(event) => setSearchName(event.target.value)}
      placeholder="הקלידי שם של ברווז..."
    />

    {searchName.trim() !== "" && (
      <ul>
        {filteredDucks.map((duck, index) => (
          <li key={index}>{duck.name.trim()}</li>
        ))}
      </ul>
    )}
  </div>
);
