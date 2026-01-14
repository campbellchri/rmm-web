import React, { useState, useEffect } from 'react'
import cn from '@/utils/classNames'
import HomeNavbar from '../Home/HomeNavbar'
import Footer from '../Home/HomeFooter'
import { Input } from '@/components/ui'
const LinkLogo = '/img/others/Link.png'
import { useForm } from 'react-hook-form'
import { apiGetContactUsDetails, ContactUsDetailResponse, apiPostComplaint, ComplaintRequest } from '@/services/ContactUsService'
import { Notification, toast } from '@/components/ui'

const ContactUs = () => {
    const [contactDetails, setContactDetails] = useState<ContactUsDetailResponse | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            message: '',
        }
    })

    useEffect(() => {
        const fetchContactDetails = async () => {
            try {
                const data = await apiGetContactUsDetails()
                setContactDetails(data)
            } catch (error) {
                console.error('Failed to fetch contact details:', error)
                toast.push(
                    <Notification title="Error" type="danger">
                        Failed to fetch contact details.
                    </Notification>,
                )
            }
        }
        fetchContactDetails()
    }, [])

    const onSubmit = async (data: any) => {
        try {
            const payload: ComplaintRequest = {
                userName: data.name,
                userEmail: data.email,
                userPhoneNumber: data.phone,
                messageType: 'message',
                subject: 'General Inquiry',
                messageContent: data.message,
            }
            await apiPostComplaint(payload)
            toast.push(
                <Notification title="Success" type="success">
                    Message sent successfully!
                </Notification>,
            )
            reset()
        } catch (error) {
            console.error('Failed to send message:', error)
            toast.push(
                <Notification title="Failed" type="danger">
                    Failed to send message. Please try again later.
                </Notification>,
            )
        }
    }

    return (
        <>
            <div className="relative bg-[url('/img/others/contactUS-bg.png')] bg-cover bg-center min-h-[400px] lg:min-h-[668px]">
                <div className="px-4 lg:px-10 mx-auto w-[100%]">
                    <HomeNavbar />
                    <div className="flex-shrink-0 flex items-center justify-center">
                        <img
                            src={LinkLogo}
                            alt="Remember Memorials Logo"
                            className="h-32 sm:h-40 md:h-52 lg:h-70 w-auto mt-[-40px] sm:mt-[-60px] md:mt-[-75px] lg:mt-[-90px]"
                        />
                    </div>
                    <section className="overflow-hidden py-20 dark:bg-dark lg:py-[120px] max-w-[1280px] mx-auto ">
                        <h1 className="font-Rosarivo font-normal text-[40px] md:text-[60px] lg:text-[75px] leading-[1.2] lg:leading-[60px] tracking-normal align-middle text-[#FDF1C3] absolute bottom-10 lg:bottom-20">
                            Contact Us
                        </h1>
                    </section>
                </div>
            </div>
            <div className="py-10 lg:py-20 bg-[#25293c]">
                <div className="container-custom w-full mx-auto flex flex-col lg:flex-row  gap-8">
                    {/* Left Column - Contact Info */}
                    <div className="w-full lg:w-[50%]">
                        <div className="py-4">
                            <h2 className="font-Rosarivo font-normal text-[30px] md:text-[40px] lg:text-[48px] leading-[126%] tracking-[-0.02em] text-white">
                                Let's Start A Conversation
                            </h2>
                            <p className="font-jakarta font-normal text-[15px] pt-4 leading-[150%] tracking-normal text-white">
                                It is a long established fact that a reader will
                                be distracted by the readable content of a page
                                when looking at its layout.
                            </p>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-8 pt-4">
                            <div className="flex items-start space-x-4">
                                <div className="bg-[#383c56] rounded-full p-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-gray-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.995 1.995 0 01-2.828 0l-4.244-4.244a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-PlusJakartaSans font-[400] text-[14px] leading-[140%] tracking-[-0.02em] text-white">
                                        Location
                                    </h3>
                                    <p className="font-Rosarivo font-normal text-[18px] leading-[150%] tracking-normal text-white">
                                        {contactDetails ? (
                                            <>
                                                {contactDetails.addressLine1} {contactDetails.addressLine2}, {contactDetails.city}, {contactDetails.state} {contactDetails.zipCode}
                                            </>
                                        ) : (
                                            '2118 Thornridge Cir. Syracuse, Connecticut 35624'
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-[#383c56] rounded-full p-2">
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M15 16L14.8039 16.9806C15.2461 17.069 15.6928 16.8506 15.8944 16.4472L15 16ZM8 9L7.55279 8.10557C7.14944 8.30724 6.93098 8.75392 7.01942 9.19612L8 9ZM8.35402 8.82299L8.80123 9.71742H8.80123L8.35402 8.82299ZM9.31654 6.29136L10.245 5.91997L9.31654 6.29136ZM8.50289 4.25722L7.57441 4.62861V4.62861L8.50289 4.25722ZM19.7428 15.4971L19.3714 16.4256L19.7428 15.4971ZM17.7086 14.6835L18.08 13.755L18.08 13.755L17.7086 14.6835ZM15.177 15.646L16.0714 16.0932L16.0714 16.0932L15.177 15.646ZM16 11C16 11.5523 16.4477 12 17 12C17.5523 12 18 11.5523 18 11H17H16ZM16.6955 9.46927L17.6194 9.08658L16.6955 9.46927ZM14.5307 7.30448L14.9134 6.3806L14.5307 7.30448ZM13 6C12.4477 6 12 6.44772 12 7C12 7.55228 12.4477 8 13 8V7V6ZM20 11C20 11.5523 20.4477 12 21 12C21.5523 12 22 11.5523 22 11H21H20ZM20.391 7.93853L21.3149 7.55585L20.391 7.93853ZM16.0615 3.60896L16.4442 2.68508V2.68508L16.0615 3.60896ZM13 2C12.4477 2 12 2.44772 12 3C12 3.55228 12.4477 4 13 4V3V2ZM21 17.3541H20V19H21H22V17.3541H21ZM5 3V4H6.64593V3V2H5V3ZM15 16C15.1961 15.0194 15.1964 15.0195 15.1967 15.0195C15.1968 15.0195 15.197 15.0196 15.1972 15.0196C15.1975 15.0197 15.1978 15.0198 15.198 15.0198C15.1985 15.0199 15.1989 15.02 15.199 15.02C15.1994 15.0201 15.1992 15.0201 15.1985 15.0199C15.1969 15.0196 15.1931 15.0187 15.187 15.0174C15.1749 15.0147 15.154 15.01 15.125 15.0029C15.067 14.9888 14.9769 14.9655 14.8603 14.9313C14.6267 14.8626 14.2897 14.7505 13.8939 14.5809C13.0978 14.2397 12.0919 13.6777 11.2071 12.7929L10.5 13.5L9.79289 14.2071C10.9081 15.3223 12.1522 16.0103 13.1061 16.4191C13.5853 16.6245 13.9983 16.7624 14.296 16.85C14.445 16.8938 14.5658 16.9252 14.6523 16.9463C14.6956 16.9568 14.7304 16.9648 14.7558 16.9704C14.7686 16.9732 14.779 16.9754 14.7871 16.9771C14.7911 16.978 14.7945 16.9787 14.7973 16.9792C14.7987 16.9795 14.8 16.9798 14.8011 16.98C14.8016 16.9801 14.8021 16.9802 14.8026 16.9803C14.8028 16.9804 14.8031 16.9804 14.8033 16.9805C14.8036 16.9805 14.8039 16.9806 15 16ZM10.5 13.5L11.2071 12.7929C10.3223 11.9081 9.76035 10.9022 9.41915 10.1061C9.24953 9.71031 9.13744 9.37329 9.06874 9.13971C9.03446 9.02314 9.01117 8.933 8.99706 8.87498C8.99001 8.84599 8.98526 8.82508 8.98259 8.81298C8.98125 8.80693 8.98044 8.80308 8.98011 8.80154C8.97995 8.80076 8.97991 8.80056 8.97999 8.80095C8.98003 8.80115 8.9801 8.80149 8.9802 8.80197C8.98025 8.80222 8.9803 8.8025 8.98037 8.80282C8.9804 8.80298 8.98045 8.80324 8.98047 8.80332C8.98052 8.8036 8.98058 8.80388 8 9C7.01942 9.19612 7.01948 9.19642 7.01954 9.19673C7.01957 9.19685 7.01963 9.19718 7.01968 9.19741C7.01977 9.19788 7.01988 9.19839 7.01999 9.19894C7.02021 9.20003 7.02046 9.20128 7.02075 9.20269C7.02133 9.20549 7.02204 9.20891 7.02288 9.21293C7.02457 9.22096 7.0268 9.2314 7.02962 9.24415C7.03525 9.26965 7.0432 9.3044 7.05372 9.34768C7.07477 9.43419 7.10617 9.55499 7.15001 9.70404C7.23756 10.0017 7.37547 10.4147 7.58085 10.8939C7.98965 11.8478 8.67767 13.0919 9.79289 14.2071L10.5 13.5ZM8 9L8.44721 9.89443L8.80123 9.71742L8.35402 8.82299L7.9068 7.92856L7.55279 8.10557L8 9ZM9.31654 6.29136L10.245 5.91997L9.43136 3.88583L8.50289 4.25722L7.57441 4.62861L8.38807 6.66275L9.31654 6.29136ZM19.7428 15.4971L20.1142 14.5686L18.08 13.755L17.7086 14.6835L17.3373 15.6119L19.3714 16.4256L19.7428 15.4971ZM15.177 15.646L14.2826 15.1988L14.1056 15.5528L15 16L15.8944 16.4472L16.0714 16.0932L15.177 15.646ZM17.7086 14.6835L18.08 13.755C16.6314 13.1755 14.9804 13.8032 14.2826 15.1988L15.177 15.646L16.0714 16.0932C16.304 15.628 16.8544 15.4188 17.3373 15.6119L17.7086 14.6835ZM8.35402 8.82299L8.80123 9.71742C10.1968 9.01965 10.8245 7.36864 10.245 5.91997L9.31654 6.29136L8.38807 6.66275C8.58122 7.14564 8.37198 7.69597 7.9068 7.92856L8.35402 8.82299ZM6.64593 3V4C7.05484 4 7.42255 4.24895 7.57441 4.62861L8.50289 4.25722L9.43136 3.88583C8.97577 2.74685 7.87265 2 6.64593 2V3ZM21 17.3541H22C22 16.1274 21.2531 15.0242 20.1142 14.5686L19.7428 15.4971L19.3714 16.4256C19.751 16.5775 20 16.9452 20 17.3541H21ZM19 21V20C10.7157 20 4 13.2843 4 5H3H2C2 14.3888 9.61116 22 19 22V21ZM19 21V22C20.6569 22 22 20.6569 22 19H21H20C20 19.5523 19.5523 20 19 20V21ZM3 5H4C4 4.44772 4.44772 4 5 4V3V2C3.34315 2 2 3.34315 2 5H3ZM17 11H18C18 10.3434 17.8707 9.69321 17.6194 9.08658L16.6955 9.46927L15.7716 9.85195C15.9224 10.2159 16 10.606 16 11H17ZM16.6955 9.46927L17.6194 9.08658C17.3681 8.47995 16.9998 7.92876 16.5355 7.46447L15.8284 8.17157L15.1213 8.87868C15.3999 9.15726 15.6209 9.48797 15.7716 9.85195L16.6955 9.46927ZM15.8284 8.17157L16.5355 7.46447C16.0712 7.00017 15.52 6.63188 14.9134 6.3806L14.5307 7.30448L14.1481 8.22836C14.512 8.37913 14.8427 8.6001 15.1213 8.87868L15.8284 8.17157ZM14.5307 7.30448L14.9134 6.3806C14.3068 6.12933 13.6566 6 13 6V7V8C13.394 8 13.7841 8.0776 14.1481 8.22836L14.5307 7.30448ZM21 11H22C22 9.8181 21.7672 8.64778 21.3149 7.55585L20.391 7.93853L19.4672 8.32122C19.8189 9.17049 20 10.0807 20 11H21ZM20.391 7.93853L21.3149 7.55585C20.8626 6.46392 20.1997 5.47177 19.364 4.63604L18.6569 5.34315L17.9497 6.05025C18.5998 6.70026 19.1154 7.47194 19.4672 8.32122L20.391 7.93853ZM18.6569 5.34315L19.364 4.63604C18.5282 3.80031 17.5361 3.13738 16.4442 2.68508L16.0615 3.60896L15.6788 4.53284C16.5281 4.88463 17.2997 5.40024 17.9497 6.05025L18.6569 5.34315ZM16.0615 3.60896L16.4442 2.68508C15.3522 2.23279 14.1819 2 13 2V3V4C13.9193 4 14.8295 4.18106 15.6788 4.53284L16.0615 3.60896Z"
                                            fill="white"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-PlusJakartaSans font-[400] text-[14px] leading-[140%] tracking-[-0.02em] text-white">
                                        Phone Number
                                    </h3>
                                    <p className="font-Rosarivo font-normal text-[18px] leading-[150%] tracking-normal text-white">
                                        {contactDetails?.phoneNumber || '(171) 555 2111'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-[#383c56] rounded-full p-2">
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M6 8L9.7812 10.5208C11.1248 11.4165 12.8752 11.4165 14.2188 10.5208L18 8M6 21H18C20.2091 21 22 19.2091 22 17V7C22 4.79086 20.2091 3 18 3H6C3.79086 3 2 4.79086 2 7V17C2 19.2091 3.79086 21 6 21Z"
                                            stroke="white"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-PlusJakartaSans font-[400] text-[14px] leading-[140%] tracking-[-0.02em] text-white">
                                        Email Address
                                    </h3>
                                    <p className="font-Rosarivo font-normal text-[18px] leading-[150%] tracking-normal text-white">
                                        {contactDetails?.emailAddress || 'rememberme@demo.com'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="w-full lg:w-[50%]">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="font-PlusJakartaSans font-[400] text-[14px] leading-[140%] tracking-[-0.02em] text-[#fff]"
                                >
                                    Name
                                </label>
                                <Input
                                    type="text"
                                    {...register('name', { required: 'Name is required' })}
                                    className="bg-[#383c56] border-none text-white placeholder-gray-400"
                                    placeholder="Enter your name"
                                />
                                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block font-PlusJakartaSans font-[400] text-[14px] leading-[140%] tracking-[-0.02em] text-[#fff]"
                                >
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    {...register('email', { 
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    className="bg-[#383c56] border-none text-white placeholder-gray-400"
                                    placeholder="Enter your email"
                                />
                                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block font-PlusJakartaSans font-[400] text-[14px] leading-[140%] tracking-[-0.02em] text-[#fff]"
                                >
                                    Mobile Number
                                </label>
                                <Input
                                    type="tel"
                                    {...register('phone')}
                                    className="bg-[#383c56] border-none text-white placeholder-gray-400"
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div>
                                <Input
                                    textArea
                                    {...register('message', { required: 'Message is required' })}
                                    rows={6}
                                    className="bg-[#383c56] border-none text-white placeholder-gray-400 resize-none"
                                    placeholder="Type your message here..."
                                />
                                {errors.message && <span className="text-red-500 text-xs">{errors.message.message}</span>}
                            </div>

                            <button
                                type="submit"
                                className="font-DMSerif font-normal text-[16px] text-center align-middle
                                bg-[linear-gradient(96.23deg,_#ECA024_5.01%,_#F9C94F_50.03%,_#EAA32A_95.05%)]
                                px-6 lg:px-10
                                py-2 lg:py-3
                                rounded-[1000px]
                                text-[#011837]
                                w-auto
                                "
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ContactUs
