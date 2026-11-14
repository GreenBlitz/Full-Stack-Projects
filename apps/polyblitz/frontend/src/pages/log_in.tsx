import type { FormEvent } from "react";
import axios from "axios";
import type { PublicUser } from "../App";

export function Login({ onLogin }: { onLogin: (user: PublicUser) => void }) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const name = String(formData.get("name"));
      const password = String(formData.get("password"));
      const response = await axios.post(
        "http://localhost:4590/api/Users/login",
        { name: name, password: password },
      );
      console.log("Login successful:", response.data);
      onLogin(response.data);
      form.reset();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="enter user name" />
      <input name="password" placeholder="enter password" />
      <button type="submit">login</button>
    </form>
  );
}
