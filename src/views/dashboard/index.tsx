import React, { useState } from 'react'

import { Calendar, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useMemorialStore } from '@/store/memorialStore'
import AllMemories1 from '../../../public/img/others/All-memories1.png'
import AllMemories2 from '../../../public/img/others/All-memories2.png'
import AllMemories3 from '../../../public/img/others/All-memories3.png'
import { DatePicker, Select } from '@/components/ui'
import { SingleValue, StylesConfig } from 'react-select'
import ProgressBar from '@/components/ui/ProgressBar/ProgressBar'

const Dashboard = () => {
    const navigate = useNavigate()
    const { memorials, fetchMemorials, setActiveMemorialId } = useMemorialStore()

    useEffect(() => {
        fetchMemorials()
    }, [fetchMemorials])
    type Option = { value: string; label: string }

    const [memorialType, setMemorialType] = useState<SingleValue<Option>>(null)
    const [selectedTime, setSelectedTime] = useState<SingleValue<Option>>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const timeOptions = [
        { value: '10:00', label: '10:00' },
        { value: '11:00', label: '11:00' },
        { value: '12:00', label: '12:00' },
        // add more times as needed
    ]

    return (
        <>
            <div className="min-h-screen ">
                <div className=" mx-auto space-y-6">
                    {/* Dashboard Header */}
                    <div className=" rounded-lg shadow-[0_4px_18px_0_rgba(75,70,92,0.10)] p-6 bg-[#2f3349]">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-0.5 ">
                                <p className="md:text-2xl text-lg DMSerif font-[400] text-[#ffffff]">
                                    Dashboard
                                </p>
                                <p className="md:text-base text-sm font-poppins text-[#ffffff]">
                                    Manage your memorial settings and content
                                </p>
                            </div>
                            <button
                                onClick={() =>
                                    navigate('/dashboard/create-memorial')
                                }
                                className="bg-[#C7A30D] text-[#1A202C] font-poppins font-[400] md:font-medium md:text-base 
                                text-sm px-5 py-2.5 rounded-[1000px] shadow-[0_2px_4px_0_rgba(165,163,174,0.30)]
                                bg-[linear-gradient(96.23deg,_#ECA024_5.01%,_#F9C94F_50.03%,_#EAA32A_95.05%)] 
                                transition-colors]"
                            >
                                Create Memorial
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Upcoming Anniversary */}
                        <div className="bg-[#2f3349] rounded-lg shadow-[0_4px_18px_0_rgba(75,70,92,0.10)] p-5">
                            <div className="space-y-1">
                                <p className="text-sm font-poppins text-[#ffffff]">
                                    Upcoming Anniversary
                                </p>
                                <p className="md:text-[24px] text-lg font-[400] font-poppins  text-[#ffffff]">
                                    Jhon Winick
                                </p>
                                <p className="text-xs font-poppins text-[#ffffff]">
                                    16 Sep, 2025
                                </p>
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-[#2f3349] rounded-lg shadow-[0_4px_18px_0_rgba(75,70,92,0.10)] p-5">
                            <div className="space-y-1">
                                <p className="text-sm font-poppins text-[#ffffff]">
                                    upcoming Events
                                </p>
                                <p className="text-2xl font-poppins font-bold text-[#ffffff]">
                                    1
                                </p>
                                <p className="text-xs font-poppins text-[#ffffff]">
                                    16 Sep, 2025
                                </p>
                            </div>
                        </div>

                        {/* Total Memories */}
                        <div className="bg-[#2f3349] rounded-lg shadow-[0_4px_18px_0_rgba(75,70,92,0.10)] p-5">
                            <div className="space-y-1">
                                <p className="text-sm font-poppins text-[#ffffff]">
                                    Total Memories
                                </p>
                                <p className="text-2xl font-poppins font-bold text-[#ffffff]">
                                    12
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Memorial Presentation */}
                        <div className="bg-[#2f3349] rounded-lg shadow-[0_4px_18px_0_rgba(75,70,92,0.10)] p-6">
                            <div className="space-y-4">
                                <p className="text-lg font-poppins text-[#ffffff]">
                                    Memorial Presentation
                                </p>

                                {/* Dropdown */}
                                <div className="relative">
                                    <Select<Option>
                                        className="w-full cursor-pointer border-none"
                                        options={[
                                            {
                                                value: 'standard',
                                                label: 'Standard',
                                            },
                                            {
                                                value: 'classic',
                                                label: 'Classic',
                                            },
                                            {
                                                value: 'modern',
                                                label: 'Modern',
                                            },
                                        ]}
                                        value={memorialType}
                                        onChange={(newValue) =>
                                            setMemorialType(newValue)
                                        }
                                        styles={
                                            {
                                                singleValue: (base) => ({
                                                    ...base,
                                                    color: '#ffffff',
                                                }),
                                            } as StylesConfig<Option, false>
                                        }
                                    />
                                </div>

                                {/* Event Date & Time Section */}
                                <div className="pt-4 border-t border-[#44475b] space-y-4">
                                    <p className="text-sm font-poppins text-[#ffffff]">
                                        Event Date & Time
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        {/* Date Picker */}
                                        <div className="sm:col-span-2 relative">
                                            <DatePicker
                                                value={selectedDate}
                                                onChange={setSelectedDate}
                                                placeholder="Select Date"
                                                className="text-white bg-[#383C56] border border-[#383C56]"
                                            />
                                        </div>

                                        {/* Time Picker */}
                                        <div className="relative">
                                            <Select<Option>
                                                options={timeOptions}
                                                value={selectedTime}
                                                onChange={(newValue) =>
                                                    setSelectedTime(newValue)
                                                }
                                                className="w-full cursor-pointer border-none"
                                                placeholder="Select Time"
                                                styles={
                                                    {
                                                        singleValue: (
                                                            base,
                                                        ) => ({
                                                            ...base,
                                                            color: '#ffffff',
                                                        }),
                                                    } as StylesConfig<
                                                        Option,
                                                        false
                                                    >
                                                }
                                            />
                                        </div>
                                    </div>

                                    <p className="text-sm font-poppins text-[#ffffff]">
                                        The memorial page will display in Event
                                        Mode on this date and time.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Storage Space */}
                        <div className="bg-[#2f3349] rounded-lg shadow-[0_4px_18px_0_rgba(75,70,92,0.10)] p-6">
                            <div className="space-y-4">
                                <p className="md:text-lg text-base font-poppins text-[#ffffff]">
                                    Storage Space
                                </p>

                                {/* Main Progress Bar */}
                                <ProgressBar
                                    used={3.2}
                                    total={5}
                                    height={16}
                                    showValues={true}
                                    showTotal={true}
                                />

                                {/* Storage Details */}
                                <div className="pt-4 border-t border-[#F3F4F6] space-y-4">
                                    <p className="text-base font-poppins text-[#ffffff]">
                                        Storage Details
                                    </p>

                                    <div className="space-y-3">
                                        {/* Photos */}
                                        <ProgressBar
                                            label="Photos"
                                            used={1.8}
                                            total={3.2}
                                            height={8}
                                            showValues={true}
                                            showTotal={false}
                                        />

                                        {/* Videos */}
                                        <ProgressBar
                                            label="Videos"
                                            used={1.2}
                                            total={3.2}
                                            height={8}
                                            showValues={true}
                                            showTotal={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* All Memories Section */}
                    <div className=" ">
                        <div className="space-y-6">
                            {/* Header */}
                            <div className=" w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="md:text-2xl text-lg DMSerif font-medium text-[#ffffff]">
                                    All Memories
                                </p>
                                <span className="text-sm font-medium text-[#1F2937]">
                                    3.2 GB / 5 GB
                                </span>
                            </div>

                            {/* Memorial Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                                {memorials.map((memorial, index) => (
                                    <div
                                        key={index}
                                        className="group cursor-pointer"
                                        onClick={() => {
                                            setActiveMemorialId(memorial.id)
                                            navigate('/dashboard/memorial')
                                        }}
                                    >
                                        <div className="space-y-3">
                                            {/* Image */}
                                            <div className="rounded-lg overflow-hidden">
                                                <img
                                                    src={AllMemories1}
                                                    alt={memorial.personName}
                                                    className="w-full h-65 object-cover  transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>

                                            {/* Memorial Info */}
                                            <div className="space-y-2">
                                                {/* Years */}
                                                <div className="flex items-center justify-center gap-1">
                                                    <span className="text-xs font-manrope font-medium text-[#ffffff]">
                                                        {memorial.personName ? '2023' : ''}
                                                    </span>
                                                    <span className="text-xs font-manrope font-medium text-[#ffffff]">
                                                        -
                                                    </span>
                                                    <span className="text-xs font-manrope font-medium text-[#ffffff]">
                                                        {memorial.personName ? '2024' : ''}
                                                    </span>
                                                </div>

                                                {/* Name */}
                                                <p className="text-center text-base font-poppins md:font-medium font-normal text-[#ffffff] leading-tight">
                                                    {memorial.personName}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Dashboard
