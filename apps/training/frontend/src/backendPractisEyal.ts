import axios from "axios";

const response = await axios.get("http://localhost:4590/student");

console.log(response.data);
