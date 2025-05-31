"use client"

import { useState } from "react"
import { ArrowLeft, Heart, MapPin, Calendar, User, Share2, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

// Datos de ejemplo para el detalle
const anuncioDetalle = {
  id: 1,
  titulo: "iPhone 14 Pro Max 256GB",
  descripcion:
    "Excelente estado, incluye cargador original y funda. Batería al 95%. Sin rayones ni golpes. Comprado hace 8 meses en tienda oficial Apple. Incluye caja original, cargador Lightning, cable USB-C a Lightning, y funda de silicona oficial. El teléfono ha sido usado con mucho cuidado, siempre con protector de pantalla y funda. Funciona perfectamente, todas las funciones operativas. Motivo de venta: cambio a Android.",
  precio: 850000,
  categoria: "Tecnología",
  ubicacion: "Santiago, Chile",
  fechaCreacion: "2024-01-15",
  autor: "Carlos Mendoza",
  telefono: "+56 9 1234 5678",
  favorito: true,
  imagenes: [
    "/placeholder.svg?height=400&width=600&text=iPhone1",
    "/placeholder.svg?height=400&width=600&text=iPhone2",
    "/placeholder.svg?height=400&width=600&text=iPhone3",
  ],
}

export default function DetalleAnuncio({ params }: { params: { id: string } }) {
  const [imagenActual, setImagenActual] = useState(0)
  const [favorito, setFavorito] = useState(anuncioDetalle.favorito)

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const toggleFavorito = () => {
    setFavorito(!favorito)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a anuncios
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
              <Button variant="outline" size="sm" onClick={toggleFavorito}>
                <Heart className={`w-4 h-4 mr-2 ${favorito ? "fill-red-500 text-red-500" : ""}`} />
                {favorito ? "Guardado" : "Guardar"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galería de imágenes */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={anuncioDetalle.imagenes[imagenActual] || "/placeholder.svg"}
                    alt={anuncioDetalle.titulo}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  {anuncioDetalle.imagenes.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex gap-2">
                        {anuncioDetalle.imagenes.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setImagenActual(index)}
                            className={`w-3 h-3 rounded-full ${index === imagenActual ? "bg-white" : "bg-white/50"}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {anuncioDetalle.imagenes.length > 1 && (
                  <div className="p-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {anuncioDetalle.imagenes.map((imagen, index) => (
                        <button
                          key={index}
                          onClick={() => setImagenActual(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            index === imagenActual ? "border-blue-500" : "border-gray-200"
                          }`}
                        >
                          <img
                            src={imagen || "/placeholder.svg"}
                            alt={`Vista ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información del anuncio */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{anuncioDetalle.titulo}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(anuncioDetalle.fechaCreacion).toLocaleDateString("es-CL")}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {anuncioDetalle.ubicacion}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-4">
                    {anuncioDetalle.categoria}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-green-600">{formatearPrecio(anuncioDetalle.precio)}</div>
              </CardHeader>
              <CardContent>
                <div>
                  <h3 className="font-semibold mb-3">Descripción</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{anuncioDetalle.descripcion}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información del vendedor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Vendedor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">{anuncioDetalle.autor}</p>
                    <p className="text-sm text-gray-500">Miembro desde enero 2023</p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Enviar mensaje
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      {anuncioDetalle.telefono}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consejos de seguridad */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consejos de seguridad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <p>Reúnete en un lugar público y seguro</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <p>Inspecciona el producto antes de pagar</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <p>No envíes dinero por adelantado</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <p>Desconfía de precios muy por debajo del mercado</p>
                </div>
              </CardContent>
            </Card>

            {/* Reportar anuncio */}
            <Card>
              <CardContent className="pt-6">
                <Button variant="outline" size="sm" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                  Reportar este anuncio
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
