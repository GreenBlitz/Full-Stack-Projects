// בס"ד

import type { FC } from "react";
import axios from "axios";

async function getSchool(){
  const response = await axios.get(
    "http://localhost:3000/school"
  );

console.log(response.data);
}

const App: FC = () => {
  getSchool();
  return ;
};

export default App;
