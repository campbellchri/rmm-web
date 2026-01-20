import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useMemorialStore } from '@/store/memorialStore'
import AllMemories1 from '../../../public/img/others/All-memories1.png'
import { DatePicker, Select } from '@/components/ui'
import { SingleValue, StylesConfig } from 'react-select'
import ProgressBar from '@/components/ui/ProgressBar/ProgressBar'
import { apiGetDashboardDetail } from '@/services/axios/MemorialModeService'
import dayjs from 'dayjs'

const Dashboard = () => {
    const navigate = useNavigate()
    const { memorials, setActiveMemorialId } = useMemorialStore()
    const [dashboardStats, setDashboardStats] = useState<any>(null)

    useEffect(() => {
        fetchDashboardStats()
    }, [])

    const fetchDashboardStats = async () => {
        try {
            const res = await apiGetDashboardDetail()
            setDashboardStats(res)
        } catch (error) {
            console.error('Error fetching dashboard stats:', error)
        }
    }
    type Option = { value: string; label: string }

    const [memorialType, setMemorialType] = useState<SingleValue<Option>>(null)
    const [selectedTime, setSelectedTime] = useState<SingleValue<Option>>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const timeOptions = [
        { value: '10:00', label: '10:00' },
        { value: '11:00', label: '11:00' },
        { value: '12:00', label: '12:00' },
    ]

    const parseGB = (val: string | undefined) => {
        if (!val) return 0
        return parseFloat(val.replace(' GB', ''))
    }

    return (
        <>
            <div className="min-h-screen ">
                <div className=" mx-auto space-y-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#2f3349] rounded-lg shadow-[0_4px_18px_0_rgba(75,70,92,0.10)] p-5">
                            <div className="space-y-1">
                                <p className="text-sm font-poppins text-[#ffffff]">
                                    Upcoming Anniversary
                                </p>
                                <p className="md:text-[24px] text-lg font-[400] font-poppins  text-[#ffffff]">
                                    {dashboardStats?.upcomingAnniversary?.personName || 'No upcoming anniversaries'}
                                </p>
                                {dashboardStats?.upcomingAnniversary?.personDeathDate && (
                                    <p className="text-xs font-poppins text-[#ffffff]">
                                        {dayjs(dashboardStats.upcomingAnniversary.personDeathDate).format('DD MMM, YYYY')}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#2f3349] rounded-lg shadow-[0_4px_18px_0_rgba(75,70,92,0.10)] p-5">
                            <div className="space-y-1">
                                <p className="text-sm font-poppins text-[#ffffff]">
                                    Upcoming Events
                                </p>
                                <p className="text-2xl font-poppins font-bold text-[#ffffff]">
                                    {dashboardStats?.upcomingEvents || 0}
                                </p>
                                {dashboardStats?.nextEvent?.eventStart && (
                                    <p className="text-xs font-poppins text-[#ffffff]">
                                        {dayjs(dashboardStats.nextEvent.eventStart).format('DD MMM, YYYY')}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#2f3349] rounded-lg shadow-[0_4px_18px_0_rgba(75,70,92,0.10)] p-5">
                            <div className="space-y-1">
                                <p className="text-sm font-poppins text-[#ffffff]">
                                    Total Memories
                                </p>
                                <p className="text-2xl font-poppins font-bold text-[#ffffff]">
                                    {dashboardStats?.memorialCount || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-[#2f3349] rounded-lg shadow-[0_4px_18px_0_rgba(75,70,92,0.10)] p-6">
                            <div className="space-y-4">
                                <p className="text-lg font-poppins text-[#ffffff]">
                                    Memorial Presentation
                                </p>

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

                                <div className="pt-4 border-t border-[#44475b] space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-poppins text-[#ffffff]">
                                            Event Date & Time
                                        </p>
                                        {dashboardStats?.nextEvent?.eventDuration && (
                                            <span className="text-xs text-gray-400">
                                                Duration: {dashboardStats.nextEvent.eventDuration}
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <div className="sm:col-span-2 relative">
                                            <DatePicker
                                                value={selectedDate || (dashboardStats?.nextEvent?.eventStart ? dayjs(dashboardStats.nextEvent.eventStart).toDate() : null)}
                                                onChange={setSelectedDate}
                                                placeholder="Select Date"
                                                className="text-white bg-[#383C56] border border-[#383C56]"
                                            />
                                        </div>

                                        <div className="relative">
                                            <Select<Option>
                                                options={timeOptions}
                                                value={selectedTime || (dashboardStats?.nextEvent?.eventStart ? {
                                                    value: dayjs(dashboardStats.nextEvent.eventStart).format('HH:mm'),
                                                    label: dayjs(dashboardStats.nextEvent.eventStart).format('HH:mm')
                                                } : null)}
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

                        <div className="bg-[#2f3349] rounded-lg shadow-[0_4px_18px_0_rgba(75,70,92,0.10)] p-6">
                            <div className="space-y-4">
                                <p className="md:text-lg text-base font-poppins text-[#ffffff]">
                                    Storage Space
                                </p>

                                <ProgressBar
                                    used={parseGB(dashboardStats?.storageDetail?.usedGB)}
                                    total={parseGB(dashboardStats?.storageDetail?.limitGB)}
                                    height={16}
                                    showValues={true}
                                    showTotal={true}
                                />

                                <div className="pt-4 border-t border-[#F3F4F6] space-y-4">
                                    <p className="text-base font-poppins text-[#ffffff]">
                                        Storage Details
                                    </p>

                                    <div className="space-y-3">
                                        <ProgressBar
                                            label="Photos"
                                            used={parseGB(dashboardStats?.storageDetail?.photosGB)}
                                            total={parseGB(dashboardStats?.storageDetail?.limitGB)}
                                            height={8}
                                            showValues={true}
                                            showTotal={false}
                                        />

                                        <ProgressBar
                                            label="Videos"
                                            used={parseGB(dashboardStats?.storageDetail?.videosGB)}
                                            total={parseGB(dashboardStats?.storageDetail?.limitGB)}
                                            height={8}
                                            showValues={true}
                                            showTotal={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="space-y-6">
                            <div className=" w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="md:text-2xl text-lg DMSerif font-medium text-[#ffffff]">
                                    All Memories
                                </p>
                                <span className="text-sm font-medium text-[#1F2937]">
                                    {dashboardStats?.storageDetail?.usedGB || '0GB'} / {dashboardStats?.storageDetail?.limitGB || '5GB'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                                {(dashboardStats?.memorials || memorials)?.map((memorial: any, index: number) => (
                                    <div
                                        key={index}
                                        className="group cursor-pointer"
                                        onClick={() => {
                                            setActiveMemorialId(memorial.id)
                                            const landingMode =
                                                (memorial as any).template
                                                    ?.landingMode
                                                    ?.landingModeType ||
                                                (memorial as any).landingMode
                                                    ?.landingModeType ||
                                                (memorial as any).landingModeType

                                            console.log(
                                                'Memorial Navigation Check:',
                                                {
                                                    id: memorial.id,
                                                    landingMode,
                                                    memorialObj: memorial,
                                                },
                                            )

                                            if (
                                                landingMode === 'video-only-mode'
                                            ) {
                                                navigate('/dashboard/video-memorial')
                                            } else if (
                                                landingMode === 'event-mode'
                                            ) {
                                                navigate('/dashboard/event-memorial')
                                            } else {
                                                navigate('/dashboard/memorial')
                                            }
                                        }}
                                    >
                                        <div className="space-y-3">
                                            <div className="rounded-lg overflow-hidden">
                                                <img
                                                    src={memorial.personProfilePicture || AllMemories1}
                                                    alt={memorial.personName}
                                                    className="w-full h-65 object-cover  transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-center gap-1">
                                                    <span className="text-xs font-manrope font-medium text-[#ffffff]">
                                                        {memorial.personBirthDate ? dayjs(memorial.personBirthDate).format('YYYY') : ''}
                                                    </span>
                                                    <span className="text-xs font-manrope font-medium text-[#ffffff]">
                                                        -
                                                    </span>
                                                    <span className="text-xs font-manrope font-medium text-[#ffffff]">
                                                        {memorial.personDeathDate ? dayjs(memorial.personDeathDate).format('YYYY') : ''}
                                                    </span>
                                                </div>

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
