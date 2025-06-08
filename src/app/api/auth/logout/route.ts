import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Выход выполнен успешно' },
      { status: 200 }
    )
    
    response.cookies.set({
      name: 'token',
      value: '',
      maxAge: -1,
      path: '/',
    })
    
    return response
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Ошибка сервера при выходе' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Метод не разрешён. Используйте POST.' },
    { status: 405, headers: { 'Allow': 'POST' } }
  )
}