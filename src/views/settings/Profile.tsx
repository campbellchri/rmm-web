import { Input, Select, Upload, Notification, toast } from '@/components/ui'
import { ChevronDown, Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import CountrySelect from '@/components/ui/CountryPicker/CountryPicker'
import countryList from 'react-select-country-list'
import PhoneInput from '@/components/ui/PhonePicker/PhonePicker'
import {
    apiGetCurrentUser,
    apiProfileUpdate,
} from '@/services/axios/ProfileService'
import { useProfileStore, UserProfile } from '@/store/profileStore'
import { apiUploadMedia, apiDeleteProfilePhoto } from '@/services/MediaService'
import { useMediaStore } from '@/store/mediaStore'
import { useSessionUser } from '@/store/authStore'
import { useAvatarStore } from '@/store/avatarStore'

export default function Profile() {
    const {
        profile,
        loading,
        isSaving,
        password,
        setProfile,
        setLoading,
        setIsSaving,
        setPassword,
        updateProfileField,
    } = useProfileStore()

    const setUser = useSessionUser((state) => state.setUser)
    const { setAvatar, setPhotoId, setPhotoURL } = useAvatarStore()

    const [isUploading, setIsUploading] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const { addMedia, getMedia } = useMediaStore()

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const key = `${file.name}-${file.size}`
            const stored = getMedia(key)

            if (stored) {
                updateProfileField('photoURL', stored.fileURL)
                updateProfileField('photoId', stored.fileId)
                setPhotoURL(stored.fileURL)
                setPhotoId(stored.fileId)
                return
            }

            const formData = new FormData()
            formData.append('files', file)

            try {
                setIsUploading(true)
                const response: any = await apiUploadMedia(formData)
                if (response && response.length > 0) {
                    const uploadedImage = response[0]
                    addMedia(key, uploadedImage)
                    updateProfileField('photoURL', uploadedImage.fileURL)
                    updateProfileField('photoId', uploadedImage.uploadId)
                    setUser({ avatar: uploadedImage.fileURL })
                    setPhotoURL(uploadedImage.fileURL)
                    setPhotoId(uploadedImage.uploadId)
                    setAvatar(uploadedImage.fileURL)
                }
            } catch (error) {
                console.error('Failed to upload image', error)
                toast.push(
                    <Notification title="Upload Failed" type="danger">
                        Failed to upload image. Please try again.
                    </Notification>,
                )
            } finally {
                setIsUploading(false)
            }
        }
    }

    const handleRemoveImage = async () => {
        if (!profile?.photoId) {
            updateProfileField(
                'photoURL',
                'https://api.builder.io/api/v1/image/assets/TEMP/c3a907805cc2ed46951553fa92d51390341a3196?width=164',
            )
            updateProfileField('photoId', null)
            setUser({ avatar: '' })
            setPhotoURL(null)
            setPhotoId(null)
            return
        }

        try {
            setIsRemoving(true)
            await apiDeleteProfilePhoto(profile.photoId)
            updateProfileField(
                'photoURL',
                'https://api.builder.io/api/v1/image/assets/TEMP/83dc85ca9155608ff3d7e17a997653fd5f9ed739?width=248',
            )
            updateProfileField('photoId', null)
            setUser({ avatar: '' })
            setPhotoURL(null)
            setPhotoId(null)
            toast.push(
                <Notification title="Image Removed" type="success">
                    Profile image has been removed.
                </Notification>,
            )
        } catch (error) {
            console.error('Failed to remove image', error)
            toast.push(
                <Notification title="Removal Failed" type="danger">
                    Failed to remove image. Please try again.
                </Notification>,
            )
        } finally {
            setIsRemoving(false)
        }
    }
    const [selectedCountry, setSelectedCountry] = useState<any>(null)
    const options = useMemo(() => countryList().getData(), [])

    const fetchUserData = async () => {
        try {
            setLoading(true)
            const data = await apiGetCurrentUser<UserProfile>()
            if (data) {
                setProfile(data)
                setUser({ avatar: data.photoURL || '' })
            }
        } catch (error) {
            console.error('Failed to fetch user data', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!profile) return

        try {
            setIsSaving(true)
            const payload: any = {
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                phone: profile.phone,
                callingCode: profile.callingCode,
                street1: profile.street1,
                street2: profile.street2,
                city: profile.city,
                state: profile.state,
                postal: profile.postal,
                gender: profile.gender,
                country: selectedCountry?.value || profile.country,
                photoId: profile.photoId,
                photoURL: profile.photoURL,
            }

            if (password) {
                payload.password = password
            }

            await apiProfileUpdate(payload)

            toast.push(
                <Notification title="Profile Updated" type="success">
                    Your profile has been updated successfully.
                </Notification>,
            )
            setPassword('')
        } catch (error: any) {
            toast.push(
                <Notification title="Update Failed" type="danger">
                    {error?.response?.data?.message ||
                        'Failed to update profile. Please try again.'}
                </Notification>,
            )
        } finally {
            setIsSaving(false)
        }
    }

    useEffect(() => {
        if (!profile) {
            fetchUserData()
        }
    }, [])

    const profilePic = profile?.photoURL || 'https://api.builder.io/api/v1/image/assets/TEMP/83dc85ca9155608ff3d7e17a997653fd5f9ed739?width=248'

    useEffect(() => {
        const countryValue = profile?.country || profile?.callingCode || 'US'
        const country = options.find((c) => c.value === countryValue)
        if (country) {
            setSelectedCountry({
                value: country.value,
                label: (
                    <div className="flex items-center gap-2">
                        <img
                            src={`https://flagcdn.com/w20/${country.value.toLowerCase()}.png`}
                            alt={country.label}
                            className="w-6 h-6 rounded-full"
                        />
                        <span>{country.label}</span>
                    </div>
                ),
            })
        } else {
            const us = options.find((c) => c.value === 'US')
            if (us) {
                setSelectedCountry({
                    value: us.value,
                    label: (
                        <div className="flex items-center gap-2">
                            <img
                                src={`https://flagcdn.com/w20/${us.value.toLowerCase()}.png`}
                                alt={us.label}
                                className="w-6 h-6 rounded-full"
                            />
                            <span>{us.label}</span>
                        </div>
                    ),
                })
            }
        }
    }, [options, profile?.country, profile?.callingCode])

    if (loading) {
        return <div className="text-white">Loading profile...</div>
    }

    return (
        <>
            <p className="text-xl DMSerif text-[#ffffff]  mb-6">
                Personal information
            </p>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="w-[90px] h-[90px] rounded-full border-4 border-white bg-[#F5F5F5] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] p-1">
                        <img
                            src={profilePic}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full md:w-auto flex items-center justify-center gap-1 text-[#000000] font-inter font-bold text-sm px-3 py-2.5 rounded-[1000px] hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background:
                                'linear-gradient(96.23deg, #ECA024 5.01%, #F9C94F 50.03%, #EAA32A 95.05%)',
                        }}
                    >
                        {isUploading ? (
                            'Uploading...'
                        ) : (
                            <>
                                <Plus className="w-4 h-4" strokeWidth={1.5} />
                                Upload Image
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleRemoveImage}
                        disabled={isRemoving || isUploading}
                        className="w-full md:w-auto border border-[#D4D4D4] bg-[#2f3349] hover:bg-[#2f3349] text-[#ffffff] font-poppins font-bold text-sm px-3 py-2.5 rounded-[1000px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isRemoving ? 'Removing...' : 'Remove'}
                    </button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            <div className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block font-poppins font-semibold text-sm text-[#ffffff] leading-[21px]">
                            First name
                        </label>
                        <Input
                            type="text"
                            className="bg-[#383c56] text-white border-none"
                            value={profile?.firstName || ''}
                            onChange={(e) =>
                                updateProfileField('firstName', e.target.value)
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block font-poppins font-semibold text-sm text-[#ffffff] leading-[21px]">
                            Last name
                        </label>
                        <Input
                            type="text"
                            className="bg-[#383c56] text-white border-none"
                            value={profile?.lastName || ''}
                            onChange={(e) =>
                                updateProfileField('lastName', e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block font-poppins font-semibold text-sm text-[#ffffff] leading-[21px]">
                        Email
                    </label>
                    <div className="relative">
                        <Input
                            type="email"
                            className="bg-[#383c56] text-white border-none"
                            value={profile?.email || ''}
                            onChange={(e) =>
                                updateProfileField('email', e.target.value)
                            }
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 font-inter font-semibold text-sm text-[#C7A30D]">
                            Verified
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block font-poppins font-semibold text-sm text-[#ffffff]">
                        Phone number
                    </label>
                    <PhoneInput
                        value={profile?.phone || ''}
                        onChange={(val) => {
                            updateProfileField('phone', val)
                        }}
                        className="bg-[#383c56] border-none rounded-lg"
                    />
                </div>

                <div className="pt-8">
                    <p className="DMSerif text-xl text-[#ffffff] leading-7 mb-6">
                        Address information
                    </p>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block font-poppins font-semibold text-sm text-[#ffffff] leading-[21px]">
                                Country
                            </label>
                            <CountrySelect
                                value={selectedCountry}
                                onChange={(val) => {
                                    setSelectedCountry(val)
                                    updateProfileField('country', val?.value)
                                }}
                                className="bg-[#383c56] border-none rounded-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block font-poppins font-semibold text-sm text-[#ffffff] leading-[21px]">
                                Address
                            </label>
                            <Input
                                type="text"
                                className="bg-[#383c56] text-white border-none"
                                placeholder='Enter your address'
                                value={profile?.street1 || ''}
                                onChange={(e) =>
                                    updateProfileField(
                                        'street1',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block font-poppins font-semibold text-sm text-[#ffffff] leading-[21px]">
                                    City
                                </label>
                                <Input
                                    type="text"
                                    className="bg-[#383c56] text-white border-none"
                                    value={profile?.city || ''}
                                    onChange={(e) =>
                                        updateProfileField(
                                            'city',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block font-poppins font-semibold text-sm text-[#ffffff] leading-[21px]">
                                    Postal Code
                                </label>
                                <Input
                                    type="text"
                                    className="bg-[#383c56] text-white border-none"
                                    value={profile?.postal || ''}
                                    onChange={(e) =>
                                        updateProfileField(
                                            'postal',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#C7A30D] text-white font-poppins font-bold text-sm px-5 py-3.5 rounded-xl hover:bg-[#B8940C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </>
    )
}
