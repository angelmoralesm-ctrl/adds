"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Heart,
  Calendar,
  User,
  MapPin,
  Filter,
  DollarSign,
  Sparkles,
  TrendingUp,
  Tag,
  Award,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FadeIn, SlideUp, Bounce } from "@/components/ui/animations"
import Link from "next/link"
import { motion } from "framer-motion"
import prisma from "@/lib/prisma"


interface Anuncio {
  id: number
  titulo: string
  descripcion: string
  precio?: number
  categoria: string
  contacto: string
  favorito: boolean
  createdAt: string
  image: string
  ubicacion: string
  autor: string
  fechaCreacion: string
}

const categorias = ["Todas", "Tecnología", "Inmuebles", "Deportes", "Servicios", "Hogar", "Educación"]

export default function HomePage() {
  const [busqueda, setBusqueda] = useState("")
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas")
  const [isLoaded, setIsLoaded] = useState(false)
  const [anuncios, setAnuncios] = useState<Anuncio[]>([])


  useEffect(() => {
    const cargarAnuncios = async () => {
      try {
        const res = await fetch("/api/anuncios")
        const data = await res.json()
        const anunciosConFecha = data.map((anuncio: any) => ({
  ...anuncio,
  fechaCreacion: anuncio.createdAt,
  autor: anuncio.contacto,
  ubicacion: Math.random() < 0.5 ? "Santiago" : "Valparaíso",
}))

        setAnuncios(anunciosConFecha)
        setIsLoaded(true)
      } catch (error) {
        console.error("Error cargando anuncios:", error)
      }
    }
    cargarAnuncios()
  }, [])

  const toggleFavorito = (id: number) => {
    setAnuncios(anuncios.map((anuncio) => (anuncio.id === id ? { ...anuncio, favorito: !anuncio.favorito } : anuncio)))
  }

  const anunciosFiltrados = anuncios.filter((anuncio) => {
    const coincideBusqueda =
      anuncio.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      anuncio.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = categoriaSeleccionada === "Todas" || anuncio.categoria === categoriaSeleccionada
    return coincideBusqueda && coincideCategoria
  })

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img src="/images/datawalt.png" alt="Datawalt Logo" className="h-8 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">
                  <span className="text-red-500 ml-1">Adds</span>
                </h1>
              </Link>
            </div>
            <Link href="/nuevo">
              <Bounce>
                <Button className="bg-red-500 hover:bg-red-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Publicar Anuncio
                </Button>
              </Bounce>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y búsqueda */}
        <FadeIn>
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar anuncios..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={categoriaSeleccionada} onValueChange={setCategoriaSeleccionada}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Resultados */}
        <div className="mb-4">
          <div className="flex items-center">
            <Tag className="w-5 h-5 mr-2 text-gray-500" />
            <p className="text-gray-600">
              {anunciosFiltrados.length} anuncio{anunciosFiltrados.length !== 1 ? "s" : ""} encontrado
              {anunciosFiltrados.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Grid de anuncios */}
        {isLoaded ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {anunciosFiltrados.map((anuncio, index) => (
              <motion.div
                key={anuncio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover-scale overflow-hidden border-gray-200 shadow-sm">
                  <div className="relative">
                    <img
                      src={anuncio.image || "/placeholder.svg"}
                      alt={anuncio.titulo}
                      className="w-full h-48 object-cover"
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full w-8 h-8 p-0"
                      onClick={() => toggleFavorito(anuncio.id)}
                    >
                      <motion.div whileTap={{ scale: 1.4 }}>
                        <Heart
                          className={`w-4 h-4 ${anuncio.favorito ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                        />
                      </motion.div>
                    </Button>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{anuncio.titulo}</CardTitle>
                      <Badge variant="secondary" className="ml-2 shrink-0">
                        {anuncio.categoria}
                      </Badge>
                    </div>
                    <div className="flex items-center text-2xl font-bold text-red-500">
              <DollarSign className="w-5 h-5" />
              {formatearPrecio(anuncio.precio ?? 0).replace("$", "")}
            </div>
          </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="line-clamp-3 mb-4">{anuncio.descripcion}</CardDescription>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {anuncio.ubicacion}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {anuncio.autor}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(anuncio.fechaCreacion).toLocaleDateString("en-US")}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1 group" asChild>
                        <Link href={`/anuncio/${anuncio.id}`}>
                          Ver detalles
                          <Zap className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/editar/${anuncio.id}`}>Editar</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          // Esqueletos de carga
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={`skeleton-${index}`} className="hover:shadow-lg transition-shadow duration-200">
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <CardHeader className="pb-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                  <div className="flex gap-2 mt-4">
                    <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isLoaded && anunciosFiltrados.length === 0 && (
          <FadeIn delay={0.3}>
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron anuncios</h3>
              <p className="text-gray-500">Intenta cambiar los filtros o crear un nuevo anuncio</p>
            </div>
          </FadeIn>
        )}

        {/* Tendencias */}
        {isLoaded && anunciosFiltrados.length > 0 && (
          <SlideUp delay={0.4} className="mt-12">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 text-red-500 mr-2" />
                <h2 className="text-lg font-bold">Tendencias del mercado</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Categoría más popular</p>
                  <p className="font-bold">Tecnología</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Precio promedio</p>
                  <p className="font-bold">{formatearPrecio(788000)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Anuncios nuevos hoy</p>
                  <p className="font-bold">24</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Usuarios activos</p>
                  <p className="font-bold">1,245</p>
                </div>
              </div>
            </div>
          </SlideUp>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/images/datawalt.png" alt="Datawalt Logo" className="h-8 mr-2" />
              <h2 className="text-xl font-bold">
                <span>Datawalt</span>
                <span className="text-red-500">Adds</span>
              </h2>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                Términos
              </Link>
              <Link href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                Privacidad
              </Link>
              <Link href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                Ayuda
              </Link>
              <Link href="#" className="text-gray-500 hover:text-red-500 transition-colors">
                Contacto
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Datawalt Adds. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
