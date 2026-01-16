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

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const fileURL = URL.createObjectURL(e.target.files[0])
            updateProfileField('photoURL', fileURL)
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
                country: selectedCountry?.value || profile.country, // Using selectedCountry value
                photoId: profile.photoId,
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
            setPassword('') // Clear password after successful update
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

    const profilePic =
        profile?.photoURL ||
        'https://api.builder.io/api/v1/image/assets/TEMP/c3a907805cc2ed46951553fa92d51390341a3196?width=164'

    // set default country as US
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
            {/* Profile Image Section */}
            <p className="text-xl DMSerif text-[#ffffff]  mb-6">
                Personal information
            </p>
            <div className="flex items-center gap-4">
                {/* Profile Preview */}
                <div className="relative">
                    <div className="w-[90px] h-[90px] rounded-full border-4 border-white bg-[#F5F5F5] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] p-1">
                        <img
                            src={profilePic}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full md:w-auto flex items-center justify-center gap-1 text-[#000000] font-inter font-bold text-sm px-3 py-2.5 rounded-[1000px] hover:opacity-90 transition-all"
                        style={{
                            background:
                                'linear-gradient(96.23deg, #ECA024 5.01%, #F9C94F 50.03%, #EAA32A 95.05%)',
                        }}
                    >
                        <Plus className="w-4 h-4" strokeWidth={1.5} />
                        Upload Image
                    </button>

                    <button
                        onClick={() =>
                            updateProfileField(
                                'photoURL',
                                'https://api.builder.io/api/v1/image/assets/TEMP/c3a907805cc2ed46951553fa92d51390341a3196?width=164',
                            )
                        }
                        className="w-full md:w-auto border border-[#D4D4D4] bg-[#2f3349] hover:bg-[#2f3349] text-[#ffffff] font-poppins font-bold text-sm px-3 py-2.5 rounded-[1000px] transition-colors"
                    >
                        Remove
                    </button>
                </div>

                {/* Hidden Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {/* Personal Information Form */}
            <div className="space-y-6 mt-6">
                {/* Name Fields */}
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

                {/* Email Field */}
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

                {/* Phone Number Field */}
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

                {/* Address Information Section */}
                <div className="pt-8">
                    <p className="DMSerif text-xl text-[#ffffff] leading-7 mb-6">
                        Address information
                    </p>

                    <div className="space-y-6">
                        {/* Country Field */}
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

                        {/* Address Field */}
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
                        {/* <div className="space-y-2">
                            <label className="block font-poppins font-semibold text-sm text-[#ffffff] leading-[21px]">
                                Address Line 2 (Optional)
                            </label>
                            <Input
                                type="text"
                                className="bg-[#383c56] text-white border-none"
                                value={profile?.street2 || ''}
                                onChange={(e) =>
                                    updateProfileField(
                                        'street2',
                                        e.target.value,
                                    )
                                }
                            />
                        </div> */}

                        {/* City and Postal Code */}
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

                {/* Save Button */}
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
