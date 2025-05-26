import prisma from "@/app/lib/db";

export async function POST(request: Request)
{
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    const result = await prisma.user.create({
        data:{
           username: data.username.toString(),
           phone: data.phone.toString(), 
        }
    })

    return new Response(JSON.stringify(result), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
}