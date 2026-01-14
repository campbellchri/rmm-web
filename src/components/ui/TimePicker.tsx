// src/components/ui/TimePicker.tsx
import React, { useState } from 'react'
import { Clock } from 'lucide-react'

interface TimePickerProps {
    label?: string
    value?: string
    onChange?: (time: string) => void
}

const TimePicker: React.FC<TimePickerProps> = ({ label, value, onChange }) => {
    const [time, setTime] = useState(value || '')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTime(e.target.value)
        onChange?.(e.target.value)
    }

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type="time"
                    value={time}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-smfocus:ring-2  outline-none"
                />
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
        </div>
    )
}

export default TimePicker
