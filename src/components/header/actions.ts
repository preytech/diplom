import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export async function createUser(formData: FormData) {
  console.log(formData);
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
    method: "POST",
    body: formData,
  });
  return result.json();
}

// export async function authUser(formData: FormData) {
//     console.log(formData)

//     const result = await signIn("credentials", {
//         phone: formData.get("phone"),
//         password: formData.get("password"),
//         redirect: false,
//       });
// }
