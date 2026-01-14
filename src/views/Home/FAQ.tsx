import { Phone, Mail, MapPin, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Input, Notification, toast, Button } from '@/components/ui'
import { useForm } from 'react-hook-form'
import {
    apiGetContactUsDetails,
    ContactUsDetailResponse,
    apiPostComplaint,
    ComplaintRequest,
} from '@/services/ContactUsService'

const FAQ = () => {
    const [contactDetails, setContactDetails] =
        useState<ContactUsDetailResponse | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            message: '',
        },
    })

    useEffect(() => {
        const fetchContactDetails = async () => {
            try {
                const data = await apiGetContactUsDetails()
                setContactDetails(data)
            } catch (error) {
                console.error('Failed to fetch contact details:', error)
            }
        }
        fetchContactDetails()
    }, [])

    const onSubmit = async (data: any) => {
        try {
            const payload: ComplaintRequest = {
                userName: data.fullName,
                userEmail: data.email,
                userPhoneNumber: data.phone,
                messageType: 'message',
                subject: 'FAQ Inquiry',
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

    const contactInfo = [
        {
            icon: Phone,
            label: '24/7 Helpline',
            value: contactDetails?.phoneNumber || '(555) 987-6789',
            href: contactDetails ? `tel:${contactDetails.phoneNumber}` : 'tel:+15559876789',
        },
        {
            icon: Mail,
            label: 'Email',
            value: contactDetails?.emailAddress || 'care@remember.me',
            href: contactDetails ? `mailto:${contactDetails.emailAddress}` : 'mailto:care@remember.me',
        },
        {
            icon: MapPin,
            label: 'Location',
            value: contactDetails
                ? `${contactDetails.addressLine1} ${contactDetails.addressLine2}, ${contactDetails.city}, ${contactDetails.state} ${contactDetails.zipCode}`
                : 'Mumbai, Maharashtra, India',
            href: '#',
        },
    ]

    return (
        <div className="md:my-[200px]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 flex flex-col items-center gap-4">
                    <p className="font-lato font-normal text-[18px] leading-[33.87px] tracking-[1.06px] text-center uppercase text-[#D4AF37]">
                        Get In Touch
                    </p>
                    <h2 className="font-playfair font-semibold text-[34px] leading-[48.92px] text-center text-white">
                        We're Here for You
                    </h2>
                    <p className="font-lato font-normal text-[18px] leading-[35.98px] text-center text-white">
                        Available 24/7 to support you through every step
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="flex flex-col gap-[80px]">
                        <div className="flex flex-col gap-8">
                            <h3 className="font-playfair font-semibold text-[26px] leading-[36.69px] text-white">
                                Reach Out Anytime
                            </h3>
                            <p className="font-lato font-normal text-[16px] leading-[26px] text-white">
                                Our compassionate team is available around the
                                clock to assist you with immediate needs or to
                                answer any questions about our services.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {contactInfo.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    className="flex items-start gap-4 group"
                                >
                                    <div
                                        className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center bg-[linear-gradient(96.23deg,#ECA024_5.01%,#F9C94F_50.03%,#EAA32A_95.05%)]
"
                                    >
                                        <item.icon className="w-5 h-5 text-[#013439]" />
                                    </div>
                                    <div>
                                        <p className="font-lato font-normal text-[18px] leading-[35.98px] text-white">
                                            {item.label}
                                        </p>
                                        <p className="font-lato font-normal text-[18px] leading-[35.98px] text-white">
                                            {item.value}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-card border-border rounded-2xl p-8 bg-[#1E2532]">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm mb-2 text-white"
                                >
                                    Full Name*
                                </label>
                                <Input
                                    id="fullName"
                                    {...register('fullName', {
                                        required: 'Full Name is required',
                                    })}
                                    placeholder="John Doe"
                                    className="bg-[#1E2532] !border-2 !border-white/20 text-white"
                                />
                                {errors.fullName && (
                                    <span className="text-red-500 text-xs">
                                        {errors.fullName.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm text-muted-foreground mb-2 text-white"
                                >
                                    Email Address*
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                    placeholder="john@example.com"
                                    className="bg-[#1E2532] !border-2 !border-white/20 text-white"
                                />
                                {errors.email && (
                                    <span className="text-red-500 text-xs">
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm text-muted-foreground mb-2 text-white"
                                >
                                    Phone Number
                                </label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    {...register('phone')}
                                    placeholder="(555) 123-4567"
                                    className="bg-[#1E2532] !border-2 !border-white/20 text-white"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm text-muted-foreground mb-2 text-white"
                                >
                                    Message*
                                </label>
                                <Input
                                    id="message"
                                    {...register('message', {
                                        required: 'Message is required',
                                    })}
                                    placeholder="Tell us how we can help..."
                                    rows={4}
                                    textArea
                                    className="bg-[#1E2532] !border-2 !border-white/20 text-white"
                                />
                                {errors.message && (
                                    <span className="text-red-500 text-xs">
                                        {errors.message.message}
                                    </span>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="solid"
                                disabled={isSubmitting}
                                className="w-full gap-2 bg-gradient-to-r from-[#ECA024] via-[#F9C94F] to-[#EAA32A] rounded-[1000px] flex items-center justify-center text-[#011837]"
                            >
                                {isSubmitting ? (
                                    'Sending...'
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FAQ
