import { useEffect, useState } from "react";
import axios from "axios";
import { useDebounceCallback } from "usehooks-ts";

// בס"ד
function App() {
  function getSchool() {
    axios.get("http://localhost:3001/school").then((response) => {
      console.log(response.data);
    });
  }

  useEffect(() =>   getSchool(), []);
}
export default App;
