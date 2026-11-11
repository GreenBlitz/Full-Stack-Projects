import type { FormEvent } from "react";
import axios from "axios";

export function AddUser() {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await axios.post(
        "http://localhost:4590/api/Users/User",
        {
          name: String(formData.get("name")),
          password: String(formData.get("password")),
        },
      );
      console.log(response.data);
      form.reset();
    } catch (error) {
      console.error("Could not add user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="enter user name" />
      <input name="password" placeholder="enter password" />
      <button type="submit">Add User</button>
    </form>
  );
}
