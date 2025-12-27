'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface SlotPickerProps {
  onSlotSelect?: (slot: { date: string; time: string; duration: number }) => void
}

export function SlotPicker({ onSlotSelect }: SlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedDuration, setSelectedDuration] = useState(1)

  const handleSelect = () => {
    if (selectedDate && selectedTime && onSlotSelect) {
      onSlotSelect({
        date: selectedDate,
        time: selectedTime,
        duration: selectedDuration,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="date">Fecha del evento</Label>
        <input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mt-2 w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="time">Hora inicio</Label>
          <input
            id="time"
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="mt-2 w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-white"
          />
        </div>
        <div>
          <Label htmlFor="duration">Duración</Label>
          <select
            id="duration"
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(Number(e.target.value))}
            className="mt-2 w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-white"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
              <option key={hours} value={hours}>
                {hours} {hours === 1 ? 'hora' : 'horas'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedDate && selectedTime && (
        <Button onClick={handleSelect} className="w-full">
          Continuar
        </Button>
      )}
    </div>
  )
}
