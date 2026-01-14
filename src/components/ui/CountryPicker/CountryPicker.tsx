'use client'
import React, { useMemo, useState } from 'react'
import countryList from 'react-select-country-list'
import Select from '../Select'

type CountryOption = {
    value: string
    label: React.ReactNode
}

interface CountrySelectProps {
    value: CountryOption | null
    onChange: (value: CountryOption | null) => void
    placeholder?: string
}

export default function CountrySelect({
    value,
    onChange,
    placeholder = 'Select a country',
}: CountrySelectProps) {
    const options = useMemo(() => {
        const list = countryList().getData()
        return list.map((c) => ({
            value: c.value,
            label: (
                <div className="flex items-center gap-2">
                    <img
                        src={`https://flagcdn.com/w20/${c.value.toLowerCase()}.png`}
                        alt={c.label}
                        className="w-6 h-6 rounded-full"
                    />
                    <span>{c.label}</span>
                </div>
            ),
        }))
    }, [])

    return (
        <Select
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full"
            // classNames={{
            //     control: () =>
            //         'h-12 rounded-xl border border-gray-300 shadow-sm hover:border-gray-400',
            //     placeholder: () => 'text-gray-400 font-poppins text-sm',
            //     singleValue: () => 'font-poppins text-sm',
            // }}
        />
    )
}
