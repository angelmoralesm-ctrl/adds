"use client"

import type React from "react"

import { useState } from "react"
import {
  ArrowLeft,
  Upload,
  X,
  DollarSign,
  Camera,
  Info,
  CheckCircle,
  AlertCircle,
  MapPin,
  Tag,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FadeIn, SlideUp, ScaleIn, Bounce } from "@/components/ui/animations"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const categorias = ["Tecnología", "Inmuebles", "Deportes", "Servicios", "Hogar", "Educación"]

export default function NuevoAnuncio() {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setCargando(true)

  const anuncioData = {
    titulo: formData.titulo,
    descripcion: formData.descripcion,
    precio: formData.precio,
    categoria: formData.categoria,
    contacto: formData.autor,
    image: imagenes[0] || "/placeholder.svg",
    ubicacion: "Santiago",
    autor: formData.autor

  }

  try {
    const res = await fetch("/api/anuncios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(anuncioData),
    })

    if (!res.ok) throw new Error("Error al crear el anuncio")

    const resultado = await res.json()
    console.log("Anuncio creado:", resultado)

    router.push("/")
  } catch (err) {
    console.error(err)
    alert("Ocurrió un error al publicar el anuncio.")
  } finally {
    setCargando(false)
  }
}


  const agregarImagen = () => {
    // Simular carga de imagen
    const nuevaImagen = `/placeholder.svg?height=200&width=300&text=Imagen${imagenes.length + 1}`
    setImagenes([...imagenes, nuevaImagen])
  }

  const eliminarImagen = (index: number) => {
    setImagenes(imagenes.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="flex items-center ml-4">
              <img src="/images/datawalt.png" alt="Datawalt Logo" className="h-6 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">Publicar nuevo anuncio</h1>
            </div>
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
                    <CardDescription>Completa los datos principales de tu anuncio</CardDescription>
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
                          <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
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
                    <CardDescription>Agrega una imagen para mostrar tu producto</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      {imagenes.map((imagen, index) => (
                        <motion.div
                          key={index}
                          className="relative group"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
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

                    <p className="text-sm text-gray-500">
                      Formatos soportados: JPG, PNG, WebP. Tamaño máximo: 5MB por imagen.
                    </p>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Consejos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Título claro</p>
                        <p className="text-gray-600">Usa palabras clave que la gente buscaría</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Buenas fotos</p>
                        <p className="text-gray-600">Imágenes nítidas y bien iluminadas</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Precio justo</p>
                        <p className="text-gray-600">Investiga precios similares en el mercado</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Evita estafas</p>
                        <p className="text-gray-600">Nunca aceptes pagos por adelantado</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScaleIn>

              <ScaleIn delay={0.5}>
                <div className="space-y-3">
                  <Bounce>
                    <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={cargando}>
                      {cargando ? (
                        <>
                          <span className="animate-spin mr-2">◌</span>
                          Publicando...
                        </>
                      ) : (
                        "Publicar anuncio"
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
