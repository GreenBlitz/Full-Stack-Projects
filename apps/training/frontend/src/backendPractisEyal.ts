import axios from "axios";

const response = await axios.get(
    "http://localhost:3001/student"
);

console.log(response.data);

