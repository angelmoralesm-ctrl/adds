"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Upload, X, Trash2, Camera, Info, MapPin, Tag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FadeIn, SlideUp, ScaleIn, Bounce } from "@/components/ui/animations"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const categorias = ["Tecnología", "Inmuebles", "Deportes", "Servicios", "Hogar", "Educación"]

export default function EditarAnuncio({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    categoria: "",
    ubicacion: "",
    autor: "",
  })
  const [imagenes, setImagenes] = useState<string[]>([])
  const [cargando, setCargando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
  async function cargarAnuncio() {
    setIsLoaded(false)
    try {
      console.log(params.id);
      const res = await fetch(`/api/anuncios/${params.id}`)
      if (!res.ok) throw new Error("Anuncio no encontrado")
      const anuncioReal = await res.json()

      setFormData({
        titulo: anuncioReal.titulo,
        descripcion: anuncioReal.descripcion,
        precio: anuncioReal.precio.toString(),
        categoria: anuncioReal.categoria,
        ubicacion: anuncioReal.ubicacion,
        autor: anuncioReal.autor,
      })
      setImagenes(anuncioReal.imagenes || [])
      setIsLoaded(true)
    } catch (error) {
      console.error("Error al cargar anuncio:", error)
      // Aquí podrías mostrar un error en UI o redirigir
    }
  }
  cargarAnuncio()
}, [params.id])


  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    // Simular actualización
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Actualizando anuncio:", params.id, formData)
    console.log("Imágenes:", imagenes)

    setCargando(false)
    router.push("/")
  }

  const handleEliminar = async () => {
    setEliminando(true)

    const res = await fetch("/api/anuncios", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params.id),
    })

    if (!res.ok) throw new Error("Error al borrar el anuncio");

    const resultado = await res.json()
    console.log("Anuncio eliminado:", resultado)

    setEliminando(false)
    
  }  

  const agregarImagen = () => {
    const nuevaImagen = `/placeholder.svg?height=200&width=300&text=Nueva${imagenes.length + 1}`
    setImagenes([...imagenes, nuevaImagen])
  }

  const eliminarImagen = (index: number) => {
    setImagenes(imagenes.filter((_, i) => i !== index))
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-red-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando anuncio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div className="flex items-center ml-4">
                <img src="/images/datawalt.png" alt="Datawalt Logo" className="h-6 mr-2" />
                <h1 className="text-xl font-semibold text-gray-900">Editar anuncio</h1>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="animate-fade-in">
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. El anuncio será eliminado permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleEliminar}
                    disabled={eliminando}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {eliminando ? (
                      <>
                        <span className="animate-spin mr-2">◌</span>
                        Eliminando...
                      </>
                    ) : (
                      "Eliminar anuncio"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario principal */}
            <div className="lg:col-span-2 space-y-6">
              <FadeIn>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="w-5 h-5 mr-2 text-red-500" />
                      Información básica
                    </CardTitle>
                    <CardDescription>Actualiza los datos de tu anuncio</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="titulo" className="flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-gray-500" />
                        Título del anuncio *
                      </Label>
                      <Input
                        id="titulo"
                        placeholder="Ej: iPhone 14 Pro Max en excelente estado"
                        value={formData.titulo}
                        onChange={(e) => handleInputChange("titulo", e.target.value)}
                        required
                        className="transition-all focus:border-red-500 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="descripcion">Descripción *</Label>
                      <Textarea
                        id="descripcion"
                        placeholder="Describe tu producto o servicio con el mayor detalle posible..."
                        rows={6}
                        value={formData.descripcion}
                        onChange={(e) => handleInputChange("descripcion", e.target.value)}
                        required
                        className="transition-all focus:border-red-500 focus:ring-red-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="precio" className="flex items-center">
                          Precio (CLP) *
                        </Label>
                        <Input
                          id="precio"
                          type="number"
                          placeholder="0"
                          value={formData.precio}
                          onChange={(e) => handleInputChange("precio", e.target.value)}
                          required
                          className="transition-all focus:border-red-500 focus:ring-red-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="categoria">Categoría *</Label>
                        <Select
                          value={formData.categoria}
                          onValueChange={(value) => handleInputChange("categoria", value)}
                        >
                          <SelectTrigger className="transition-all focus:border-red-500 focus:ring-red-500">
                            <SelectValue placeholder="Selecciona una categoría" />
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

                    <div>
                      <Label htmlFor="ubicacion" className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        Ubicación *
                      </Label>
                      <Input
                        id="ubicacion"
                        placeholder="Ej: Santiago, Chile"
                        value={formData.ubicacion}
                        onChange={(e) => handleInputChange("ubicacion", e.target.value)}
                        required
                        className="transition-all focus:border-red-500 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="autor" className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        Tu nombre *
                      </Label>
                      <Input
                        id="autor"
                        placeholder="Nombre completo o empresa"
                        value={formData.autor}
                        onChange={(e) => handleInputChange("autor", e.target.value)}
                        required
                        className="transition-all focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              {/* Imágenes */}
              <SlideUp delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="w-5 h-5 mr-2 text-red-500" />
                      Imágenes
                    </CardTitle>
                    <CardDescription>Gestiona las imágenes de tu anuncio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      {imagenes.map((imagen, index) => (
                        <motion.div
                          key={index}
                          className="relative group"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <img
                            src={imagen || "/placeholder.svg"}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => eliminarImagen(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </motion.div>
                      ))}

                      {imagenes.length < 5 && (
                        <Bounce>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-24 border-dashed border-red-200 hover:border-red-500 transition-colors"
                            onClick={agregarImagen}
                          >
                            <Upload className="w-6 h-6 mb-2 text-red-500" />
                            <span className="text-sm">Agregar imagen</span>
                          </Button>
                        </Bounce>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </SlideUp>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ScaleIn delay={0.3}>
                <Card>
                  <CardHeader>
                    <CardTitle>Vista previa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Título</p>
                        <p className="font-medium">{formData.titulo || "Sin título"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Precio</p>
                        <p className="text-lg font-bold text-red-500 flex items-center">
                          <span className="text-sm mr-1">$</span>
                          {formData.precio ? Number.parseInt(formData.precio).toLocaleString("es-CL") : "0"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Categoría</p>
                        <p>{formData.categoria || "Sin categoría"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ubicación</p>
                        <p>{formData.ubicacion || "Sin ubicación"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScaleIn>

              <ScaleIn delay={0.4}>
                <div className="space-y-3">
                  <Bounce>
                    <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={cargando}>
                      {cargando ? (
                        <>
                          <span className="animate-spin mr-2">◌</span>
                          Guardando...
                        </>
                      ) : (
                        "Guardar cambios"
                      )}
                    </Button>
                  </Bounce>
                  <Button type="button" variant="outline" className="w-full" asChild>
                    <Link href="/">Cancelar</Link>
                  </Button>
                </div>
              </ScaleIn>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
