import type { FormEvent } from "react";
import axios from "axios";
import type { PublicUser } from "@repo/polyblitz-types";
import { FrontEndURL } from "../App";

export function AddUser({
  onSignUp,
}: {
  onSignUp: (user: PublicUser) => void;
}) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await axios.post(`${FrontEndURL}/Users/User`, {
        name: String(formData.get("name")),
        password: String(formData.get("password")),
      });
      console.log(response.data);
      onSignUp(response.data);
      form.reset();
    } catch (error) {
      console.error("Could not sign in:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="enter user name" />
      <input name="password" placeholder="enter password" />
      <button type="submit">sign in</button>
    </form>
  );
}
