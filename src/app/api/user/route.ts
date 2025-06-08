import bcrypt from "bcryptjs";
import prisma from "../../../../db";

export async function POST(request: Request) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  const result = await prisma.user.create({
    data: {
      password: (await bcrypt.hash(data.password.toString(), 8)).toString(),
      name: data.name.toString(),
      phone: data.phone.toString(),
    },
  });

  if (!result) {
    return new Response(JSON.stringify(null), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(result), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
