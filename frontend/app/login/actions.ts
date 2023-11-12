"use server";

import { redirect } from "next/navigation";
import { User } from "@/payload-types";
import { cookies } from "next/headers";

const cookieStore = cookies();

export const submitHandler = async (data: FormData) => {
  const email = data.get("email")!;
  const password = data.get("password")!;

  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const res = await fetch(process.env.NEXT_PUBLIC_API + "/api/users/login", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    redirect("/login?message=Error+logging+you+in");
  }

  const user: { exp: number; message: string; token: string; user: User } =
    await res.json();
  cookieStore.set("user", JSON.stringify(user), { expires: user.exp });
};

export const getUserDetails = () => {
  const user = cookieStore.get("user");

  if (user?.value) {
    return user;
  }

  return false;
};
