import { useEffect, useState } from 'react'
import { Bell, ChevronDown, X, Upload as UploadIcon, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DatePicker, Input, Select, toast, Notification } from '@/components/ui'
import { useForm, Controller } from 'react-hook-form'
import {
    apiGetMemorialById,
    apiUpdateMemorial,
    apiSetFeaturedMemorial,
} from '@/services/axios/MemorialModeService'
import { useMemorialStore } from '@/store/memorialStore'
import dayjs from 'dayjs'
import Upload from '@/components/ui/Upload'
import { Gender } from '@/constants/memorial.constant'

export default function EditMemorial() {
    const navigate = useNavigate()
    const { activeMemorialId, fetchMemorials } = useMemorialStore()
    const [isLoading, setIsLoading] = useState(false)
    const [memorialData, setMemorialData] = useState<any>(null)

    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [featuredFiles, setFeaturedFiles] = useState<File[]>([])
    const [videoFiles, setVideoFiles] = useState<File[]>([])
    const [photoFiles, setPhotoFiles] = useState<File[]>([])
    const [lifeStoryFiles, setLifeStoryFiles] = useState<File[]>([])

    const { control, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            personName: '',
            personGender: 'Male',
            personBirthDate: null as Date | null,
            personDeathDate: null as Date | null,
            favQuote: '',
            favoriteSaying: '',
            quoteBy: '',
            videoTitle: '',
            lifeStory: '',
        },
    })

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' },
    ]

    useEffect(() => {
        const loadMemorial = async () => {
            if (!activeMemorialId) return
            setIsLoading(true)
            try {
                const res: any = await apiGetMemorialById(activeMemorialId)
                if (res) {
                    setMemorialData(res)
                    // Populate form
                    reset({
                        personName: res.personName || '',
                        personGender: res.gender || 'Male', // Adjust based on API response field
                        personBirthDate: res.personBirthDate
                            ? new Date(res.personBirthDate)
                            : null,
                        personDeathDate: res.personDeathDate
                            ? new Date(res.personDeathDate)
                            : null,
                        favQuote: res.favQuote || '',
                        favoriteSaying: res.favSaying || '',
                        quoteBy: res.favoriteSayings?.[0]?.authorName || '', // Assuming structure
                        videoTitle:
                            res.userMedia?.find(
                                (m: any) => m.type === 'video',
                            )?.videoTitle || '',
                        lifeStory: res.lifeStoryText || '',
                    })

                    // Handle existing media (basic implementation)
                    if (res.personProfilePicture) {
                        setProfileImage(res.personProfilePicture)
                    }
                }
            } catch (error) {
                console.error('Error fetching memorial:', error)
                toast.push(
                    <Notification type="danger" title="Error">
                        Failed to load memorial details
                    </Notification>,
                )
            } finally {
                setIsLoading(false)
            }
        }
        loadMemorial()
    }, [activeMemorialId, reset])

    const onSubmit = async (data: any) => {
        if (!activeMemorialId || !memorialData) return

        try {
            const payload = {
                ...memorialData, // Keep existing IDs and structure
                personName: data.personName,
                // personGender: data.personGender, // Ensure backend supports this or map if needed
                personBirthDate: data.personBirthDate
                    ? dayjs(data.personBirthDate).format('YYYY-MM-DD')
                    : null,
                personDeathDate: data.personDeathDate
                    ? dayjs(data.personDeathDate).format('YYYY-MM-DD')
                    : null,
                favQuote: data.favQuote,
                favSaying: data.favoriteSaying,
                // Update media array - this logic merges existing with new dummy uploads
                // For a real app, you'd upload files first and get IDs/URLs.
                // Keeping it consistent with CreateMemorial dummy logic for now.
                userMedia: [
                    ...(memorialData.userMedia || []),
                    ...photoFiles.map((file, idx) => ({
                        id: `new-photo-${idx}`, // dummy id
                        mimeType: file.type,
                        fileURL: URL.createObjectURL(file), // temp local url
                        fileId: `file-id-${idx}`,
                        type: 'photo',
                        isActive: true,
                        sortOrder: 0,
                    })),
                ],
                // Update specific fields if they exist in the form
                lifeStoryText: data.lifeStory,
            }

             // Handle specific fields based on structure requirements
             if (data.favoriteSaying || data.quoteBy) {
                // If the backend expects userTributes or favoriteSayings array
                 payload.favoriteSayings = [{ // or update existing if possible
                     content: data.favoriteSaying,
                     authorName: data.quoteBy
                 }]
             }
             
             // Update video title in the payload if a video exists
             if (payload.userMedia) {
                 const vidIndex = payload.userMedia.findIndex((m: any) => m.type === 'video')
                 if (vidIndex > -1) {
                     payload.userMedia[vidIndex].videoTitle = data.videoTitle
                 }
             }

            await apiUpdateMemorial(activeMemorialId, payload)

            toast.push(
                <Notification type="success" title="Success">
                    Memorial updated successfully!
                </Notification>,
            )
            navigate(-1) // Go back
        } catch (error) {
            console.error('Error updating memorial:', error)
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to update memorial
                </Notification>,
            )
        }
    }

    const handleSetFeatured = async () => {
        try {
            if (!activeMemorialId) {
                toast.push(
                    <Notification type="danger" title="Error">
                        Memorial ID not found.
                    </Notification>,
                )
                return
            }
            await apiSetFeaturedMemorial({ memorialId: activeMemorialId })
            toast.push(
                <Notification type="success" title="Success">
                    Memorial set as featured successfully!
                </Notification>,
            )
        } catch (error) {
            console.error('Error setting featured memorial:', error)
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to set memorial as featured.
                </Notification>,
            )
        }
    }

    if (isLoading) {
        return <div className="p-8 text-white text-center">Loading...</div>
    }

    return (
        <div className="min-h-screen max-w-6xl mx-auto">
            <div className="max-w-5xl mx-auto py-8">
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-1 text-[#ffffff] hover:text-[#ffffff]"
                            >
                                <ArrowLeft />
                            </button>
                            <p className="DMSerif md:text-2xl text-lg text-[#ffffff]">
                                Edit Memorial
                            </p>
                        </div>

                        <button
                            onClick={handleSetFeatured}
                            className="md:px-6 px-3 md:py-2.5 py-1 border border-[#4EB1C9] text-[#4EB1C9] rounded-md font-poppins text-base hover:bg-[#4EB1C9]/10 transition-colors"
                        >
                            Set As Featured
                        </button>
                    </div>

                    {/* Profile Section */}
                    <div className="bg-[#2F3349] rounded-lg shadow-sm p-6 space-y-6">
                        {/* Profile Image */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="relative">
                                <img
                                    src={
                                        profileImage ||
                                        'https://api.builder.io/api/v1/image/assets/TEMP/a7809ad43cf0f39ee3e0aa352ea024b9c33b1907?width=248'
                                    }
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover"
                                />
                            </div>
                            <button className="md:px-6 px-3 md:py-2.5 py-1 border border-[#4EB1C9] text-[#4EB1C9] rounded-md font-poppins md:text-[21.26px] text-base hover:bg-[#4EB1C9]/10 transition-colors">
                                Upload New
                            </button>
                             {/* Note: File upload logic for profile pic can be added here similar to CreateMemorial */}
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            {/* Name and Gender Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    name="personName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Full Name"
                                            className="text-white bg-[#383C56] border-none"
                                        />
                                    )}
                                />
                                <div className="relative">
                                    <Controller
                                        name="personGender"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={genderOptions.find(
                                                    (o) => o.value === field.value,
                                                )}
                                                onChange={(option: any) =>
                                                    field.onChange(option.value)
                                                }
                                                options={genderOptions}
                                                placeholder="Gender"
                                                className="w-full font-poppins text-white bg-[#383C56] border-none"
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <Controller
                                        name="personBirthDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
                                                placeholder="Date of Birth"
                                                type="date"
                                                className="text-white bg-[#383C56] border-none"
                                            />
                                        )}
                                    />
                                </div>
                                <div className="relative">
                                    <Controller
                                        name="personDeathDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
                                                placeholder="Date of Death"
                                                type="date"
                                                className="text-white bg-[#383C56] border-none"
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="font-poppins text-base font-medium text-[#ffffff]">
                                    Write a Quote (Optional)
                                </label>
                                <div className="relative">
                                    <Controller
                                        name="favQuote"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                placeholder="Enter a meaningful quote..."
                                                className="w-full h-28 px-4 py-3 border border-[#CDD5E1] rounded bg-[#383C56] font-poppins text-sm text-[#ffffff] resize-none focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                                maxLength={150}
                                            />
                                        )}
                                    />
                                    <div className="absolute bottom-3 right-3 font-poppins text-xs text-[#ffffff]">
                                        {watch('favQuote').length}/150
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#2F3349] rounded-lg shadow-sm p-6">
                        <p className="font-poppins font-[500] text-lg text-[#ffffff] mb-4">
                             Upload featured photo
                        </p>
                         <Upload
                            accept="image/*"
                            uploadLimit={1}
                            onChange={setFeaturedFiles}
                         />
                    </div>

                    <div className="bg-[#2F3349] rounded-lg shadow-sm p-6">
                        <p className="font-poppins font-[500] text-lg text-[#ffffff] mb-4">
                            Upload Video
                        </p>
                        <Upload
                            accept="video/*"
                            uploadLimit={1}
                            onChange={setVideoFiles}
                        />

                        <div className="mt-6 space-y-2">
                            <label className="font-poppins text-sm text-[#ffffff]">
                                Video Title
                            </label>
                            <Controller
                                name="videoTitle"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md bg-[#383C56] font-poppins text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="bg-[#2F3349] rounded-lg shadow-sm p-6">
                         <p className="font-poppins font-[500] text-lg text-[#ffffff] mb-4">
                            Upload Photo
                        </p>
                        <Upload
                            accept="image/*"
                            multiple
                            onChange={setPhotoFiles}
                        />
                    </div>

                    <div className="bg-[#2F3349] rounded-lg shadow-sm p-6">
                        <p className="font-poppins text-lg text-[#ffffff] mb-4">
                            Favorite Sayings
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="font-poppins text-sm text-[#ffffff]">
                                    Favorite Sayings (Optional)
                                </label>
                                <Controller
                                    name="favoriteSaying"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="Enter favorite saying"
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md bg-[#383C56] font-poppins text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                        />
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-poppins text-sm text-[#ffffff]">
                                    Quote By (Optional)
                                </label>
                                <Controller
                                    name="quoteBy"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="Enter who said the quote"
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md bg-[#383C56] font-poppins text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#2F3349] rounded-lg shadow-sm p-6">
                        <p className="font-poppins text-lg text-[#2D3748] mb-4">
                            Life Story
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="w-full sm:w-60">
                                <Upload
                                    accept="image/*"
                                    uploadLimit={1}
                                    onChange={setLifeStoryFiles}
                                />
                            </div>

                            <div className="flex-1 w-full">
                                <div className="relative">
                                    <Controller
                                        name="lifeStory"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                placeholder="Write the life story..."
                                                className="w-full h-60 px-4 py-3 border border-[#CDD5E1] rounded bg-[#383C56] font-poppins text-sm text-[#ffffff] resize-none focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                                maxLength={500}
                                            />
                                        )}
                                    />
                                    <div className="absolute bottom-3 right-3 font-poppins text-xs text-[#ffffff]">
                                        {watch('lifeStory').length}/500
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mx-auto bg-[#2F3349] border-t border-[#E5E7EB] px-6 py-6 rounded-lg shadow-sm">
                <div className="mx-auto flex items-center justify-between">
                    <button className="px-6 py-2.5 border border-[#4EB1C9] text-[#4EB1C9] rounded-md font-poppins text-base hover:bg-[#4EB1C9]/10 transition-colors">
                        Preview
                    </button>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        className="px-6 py-2.5 bg-[#C7A30D] text-black rounded-[1000px] font-poppins text-base hover:bg-[#B8940C] transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}
