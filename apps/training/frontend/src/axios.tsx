import axios from "axios";
async function getSchool() {
  const response = await axios.get("http://localhost:3000/school");

  console.log(response.data);
}
async function creatStudent(student: unknown) {
  await axios.post("http://localhost:3000/students", student);
}
