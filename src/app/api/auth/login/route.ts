import { NextResponse } from 'next/server'
import prisma from '../../../../../db'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json()

    if (!phone || !password) {
      return NextResponse.json(
        { message: 'Требуется указать адрес электронной почты и пароль' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { phone },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Неверные учётные данные' },
        { status: 401 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Неверные учётные данные' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    const response = NextResponse.json(
      { message: 'Вы успешно вошли' },
      { status: 200 }
    )

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600,
      sameSite: 'strict',
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Метод не разрешен' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { message: 'Метод не разрешен' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Метод не разрешен' },
    { status: 405 }
  )
}