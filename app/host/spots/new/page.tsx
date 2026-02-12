'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/navbar'
import { ArrowLeft, Upload, X, ImagePlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

const AVAILABLE_TAGS = [
  'Techado',
  'Cochera sellada',
  'Completamente privada',
  'Privada',
  'Compartida (máx 5 autos)',
  'Vigilancia 24/7',
  'Cámaras de seguridad',
  'Iluminado',
  'Portón eléctrico',
  'Cabe SUV',
  'Cabe camioneta',
  'Acceso pavimentado',
]

const SCHEDULE_PRESETS = [
  { id: 'weekdays', label: 'Lunes a Viernes 9:00 - 18:00', schedule: { type: 'weekly', schedule: { monday: { start: '09:00', end: '18:00' }, tuesday: { start: '09:00', end: '18:00' }, wednesday: { start: '09:00', end: '18:00' }, thursday: { start: '09:00', end: '18:00' }, friday: { start: '09:00', end: '18:00' } } } },
  { id: 'everyday', label: 'Lunes a Domingo 9:00 - 21:00', schedule: { type: 'weekly', schedule: { monday: { start: '09:00', end: '21:00' }, tuesday: { start: '09:00', end: '21:00' }, wednesday: { start: '09:00', end: '21:00' }, thursday: { start: '09:00', end: '21:00' }, friday: { start: '09:00', end: '21:00' }, saturday: { start: '09:00', end: '21:00' }, sunday: { start: '09:00', end: '21:00' } } } },
  { id: 'custom', label: 'Personalizado', schedule: null },
]

const DAYS = [
  { id: 'monday', label: 'Lunes' },
  { id: 'tuesday', label: 'Martes' },
  { id: 'wednesday', label: 'Miércoles' },
  { id: 'thursday', label: 'Jueves' },
  { id: 'friday', label: 'Viernes' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
]

function generateFuzzyLocation(lat: number, lng: number) {
  const offset = 0.005
  return {
    lat_fuzzy: lat + (Math.random() - 0.5) * offset,
    lng_fuzzy: lng + (Math.random() - 0.5) * offset,
  }
}

export default function NewSpotPage() {
  const { profile } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [schedulePreset, setSchedulePreset] = useState('weekdays')
  const [customDays, setCustomDays] = useState<Record<string, { enabled: boolean; start: string; end: string }>>({
    monday: { enabled: false, start: '09:00', end: '18:00' },
    tuesday: { enabled: false, start: '09:00', end: '18:00' },
    wednesday: { enabled: false, start: '09:00', end: '18:00' },
    thursday: { enabled: false, start: '09:00', end: '18:00' },
    friday: { enabled: false, start: '09:00', end: '18:00' },
    saturday: { enabled: false, start: '09:00', end: '18:00' },
    sunday: { enabled: false, start: '09:00', end: '18:00' },
  })
  const [descriptionCount, setDescriptionCount] = useState(0)

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag])
    } else {
      toast.error('Máximo 5 tags')
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (photos.length + files.length > 5) {
      toast.error('Máximo 5 fotos')
      return
    }
    const newPhotos = [...photos, ...files]
    setPhotos(newPhotos)

    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setPhotoPreviews([...photoPreviews, ...newPreviews])
  }

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    const newPreviews = photoPreviews.filter((_, i) => i !== index)
    URL.revokeObjectURL(photoPreviews[index])
    setPhotos(newPhotos)
    setPhotoPreviews(newPreviews)
  }

  const getSchedule = () => {
    const preset = SCHEDULE_PRESETS.find((p) => p.id === schedulePreset)
    if (preset?.schedule) return preset.schedule

    const schedule: Record<string, any> = {}
    Object.entries(customDays).forEach(([day, config]) => {
      if (config.enabled) {
        schedule[day] = { start: config.start, end: config.end }
      }
    })
    return { type: 'weekly' as const, schedule }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profile) return

    if (photos.length < 1) {
      toast.error('Sube al menos 1 foto')
      return
    }

    if (selectedTags.length < 1) {
      toast.error('Selecciona al menos 1 tag')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get('title') as string
      const description = formData.get('description') as string
      const address = formData.get('address') as string
      const priceStr = formData.get('price') as string
      const price = parseInt(priceStr) * 100 // convert to cents

      if (price < 40000 || price > 90000) {
        toast.error('El precio debe estar entre $400 y $900 MXN')
        setLoading(false)
        return
      }

      // Upload photos to Supabase Storage
      const photoUrls: string[] = []
      for (const photo of photos) {
        const fileExt = photo.name.split('.').pop()
        const fileName = `${profile.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('spot-photos')
          .upload(fileName, photo)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('spot-photos')
          .getPublicUrl(fileName)

        photoUrls.push(urlData.publicUrl)
      }

      // For now use a fixed lat/lng for CDMX (later will use Google Maps autocomplete)
      const lat = 19.4326 + (Math.random() - 0.5) * 0.05
      const lng = -99.1332 + (Math.random() - 0.5) * 0.05
      const fuzzy = generateFuzzyLocation(lat, lng)

      const { error } = await supabase.from('spots').insert([
        {
          host_id: profile.id,
          title,
          description,
          address_exact: address,
          lat_exact: lat,
          lng_exact: lng,
          lat_fuzzy: fuzzy.lat_fuzzy,
          lng_fuzzy: fuzzy.lng_fuzzy,
          price_per_hour: price,
          photos: photoUrls,
          tags: selectedTags,
          availability_schedule: getSchedule(),
          is_active: true,
        },
      ])

      if (error) throw error

      toast.success('Anuncio publicado exitosamente')
      router.push('/host/spots')
    } catch (error: any) {
      console.error('Error creating spot:', error)
      toast.error(error.message || 'Error al publicar el anuncio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/host/spots"
          className="mb-6 inline-flex items-center text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a mis anuncios
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Nuevo Anuncio</h1>
          <p className="mt-2 text-zinc-400">Publica tu espacio de estacionamiento</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photos */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Fotos ({photos.length}/5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {photoPreviews.map((preview, idx) => (
                  <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-800">
                    <img
                      src={preview}
                      alt={`Foto ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute right-2 top-2 rounded-full bg-black/70 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}

                {photos.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-700 bg-black transition-colors hover:border-primary"
                  >
                    <ImagePlus className="h-8 w-8 text-zinc-500" />
                    <span className="text-xs text-zinc-500">Agregar foto</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />

              <p className="mt-3 text-xs text-zinc-500">
                Mínimo 1, máximo 5 fotos. JPG, PNG o WebP.
              </p>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título del anuncio</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ej: Cajón techado cerca del Foro Sol"
                  className="mt-2 bg-black"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">
                  Descripción ({descriptionCount}/100 palabras)
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe tu espacio: ubicación, acceso, características..."
                  className="mt-2 bg-black"
                  rows={4}
                  required
                  onChange={(e) => {
                    const words = e.target.value.trim().split(/\s+/).filter(Boolean).length
                    setDescriptionCount(words)
                  }}
                />
                {descriptionCount > 100 && (
                  <p className="mt-1 text-xs text-red-400">Máximo 100 palabras</p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Calle, número, colonia, CP..."
                  className="mt-2 bg-black"
                  required
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Solo se mostrará la zona aproximada hasta que se confirme un pago
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Tags ({selectedTags.length}/5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Precio</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="price">Precio por hora (MXN)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="600"
                className="mt-2 bg-black"
                min="400"
                max="900"
                required
              />
              <p className="mt-1 text-xs text-zinc-500">
                Rango permitido: $400 - $900 MXN por hora
              </p>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle>Horarios de Disponibilidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {SCHEDULE_PRESETS.map((preset) => (
                  <label
                    key={preset.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                      schedulePreset === preset.id
                        ? 'border-primary bg-primary/5'
                        : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="schedule_preset"
                      value={preset.id}
                      checked={schedulePreset === preset.id}
                      onChange={(e) => setSchedulePreset(e.target.value)}
                      className="text-primary"
                    />
                    <span className="text-sm text-white">{preset.label}</span>
                  </label>
                ))}
              </div>

              {schedulePreset === 'custom' && (
                <div className="mt-4 space-y-3">
                  {DAYS.map((day) => (
                    <div
                      key={day.id}
                      className="flex items-center gap-4 rounded-lg border border-zinc-800 p-3"
                    >
                      <label className="flex w-28 items-center gap-2">
                        <input
                          type="checkbox"
                          checked={customDays[day.id].enabled}
                          onChange={(e) =>
                            setCustomDays({
                              ...customDays,
                              [day.id]: { ...customDays[day.id], enabled: e.target.checked },
                            })
                          }
                          className="rounded"
                        />
                        <span className="text-sm text-white">{day.label}</span>
                      </label>

                      {customDays[day.id].enabled && (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={customDays[day.id].start}
                            onChange={(e) =>
                              setCustomDays({
                                ...customDays,
                                [day.id]: { ...customDays[day.id], start: e.target.value },
                              })
                            }
                            className="rounded-md border border-zinc-700 bg-black px-2 py-1 text-sm text-white"
                          />
                          <span className="text-zinc-500">a</span>
                          <input
                            type="time"
                            value={customDays[day.id].end}
                            onChange={(e) =>
                              setCustomDays({
                                ...customDays,
                                [day.id]: { ...customDays[day.id], end: e.target.value },
                              })
                            }
                            className="rounded-md border border-zinc-700 bg-black px-2 py-1 text-sm text-white"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" type="button" asChild>
              <Link href="/host/spots">Cancelar</Link>
            </Button>
            <Button className="flex-1" type="submit" disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar Anuncio'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
