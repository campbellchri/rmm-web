'use client'

import { useState, useMemo, useEffect } from 'react'
import countryList from 'react-select-country-list'
import { Input } from '@/components/ui/Input'
import Select from '../Select'
import dialCodes from '@/components/ui/PhonePicker/DialCodes.json'

type CountryOption = {
    value: string
    label: any
    dialCode: string
}

interface PhoneInputProps {
    value: string
    onChange: (val: string) => void
    className?: string
}

export default function PhoneInput({
    value,
    onChange,
    className,
}: PhoneInputProps) {
    const [selectedCountry, setSelectedCountry] =
        useState<CountryOption | null>(null)

    // ✅ country data merged with dial codes
    const options = useMemo(() => {
        return countryList()
            .getData()
            .map((c) => {
                const dialCode =
                    dialCodes.find((d) => d.code === c.value)?.dial_code || ''

                return {
                    value: c.value,
                    dialCode,
                    label: (
                        <div className="flex items-center gap-2">
                            <img
                                src={`https://flagcdn.com/w20/${c.value.toLowerCase()}.png`}
                                alt={c.label}
                                className="w-6 h-6 rounded-full"
                            />
                            <span>
                                {c.label} {dialCode}
                            </span>
                        </div>
                    ),
                }
            })
    }, [])

    // ✅ default country = US
    useEffect(() => {
        const us = options.find((o) => o.value === 'US') || null
        setSelectedCountry(us)
    }, [options])

    return (
        <div className="flex flex-col gap-4 lg:flex-row">
            {/* Country Code Select */}
            <div className="lg:w-58 w-full">
                <Select
                    options={options}
                    value={selectedCountry}
                    onChange={(opt) => setSelectedCountry(opt)}
                    className={className}
                />
            </div>

            {/* Phone Number Input */}
            <div className="flex-1 flex items-center">
                <Input
                    type="tel"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter phone number"
                    className="bg-[#383c56] text-white border-none"
                />
            </div>
        </div>
    )
}
