"use server";

export async function createUser(formData: FormData) {
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        method: "POST",
        body: formData
    })
    // return result.json()
}