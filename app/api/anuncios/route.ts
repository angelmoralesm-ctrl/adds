// app/api/anuncios/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  // Si viene query ?id=, se obtiene un anuncio específico, si no, todos
  const url = new URL(req.url)
  const id = url.searchParams.get("id")

  if (id) {
    const anuncio = await prisma.anuncio.findUnique({
      where: { id: parseInt(id) },
    })

    if (!anuncio) {
      return NextResponse.json({ error: "Anuncio no encontrado" }, { status: 404 })
    }

    return NextResponse.json(anuncio)
  } else {
    const anuncios = await prisma.anuncio.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(anuncios)
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { titulo, descripcion, precio, categoria, contacto, image,autor,ubicacion } = body

    const nuevoAnuncio = await prisma.anuncio.create({
      data: {
        titulo,
        descripcion,
        precio: precio ? parseFloat(precio) : 0,
        categoria,
        autor,
        image,
        ubicacion,
        contacto
        
      },
    })

    return NextResponse.json(nuevoAnuncio)
  } catch (error) {
    console.error("Error al crear el anuncio:", error)
    return NextResponse.json({ error: "Error al crear el anuncio" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Falta el id del anuncio" }, { status: 400 })
    }

    const body = await req.json()
    const { titulo, descripcion, precio, categoria, contacto, image, favorito } = body

    const anuncioActualizado = await prisma.anuncio.update({
      where: { id: parseInt(id) },
      data: {
        titulo,
        descripcion,
        precio: precio !== undefined ? parseFloat(precio) : undefined,
        categoria,
        contacto,
        image,
        favorito,
      },
    })

    return NextResponse.json(anuncioActualizado)
  } catch (error) {
    console.error("Error al actualizar el anuncio:", error)
    return NextResponse.json({ error: "Error al actualizar el anuncio" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const body = await req.json()
  const {id} = body

  console.log(body);

  try {
    // Borra el anuncio con ese id
    await prisma.anuncio.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Anuncio eliminado" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Anuncio no encontrado o error al eliminar" }, { status: 404 });
  }
}
