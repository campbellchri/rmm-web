import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
const Logo = '/img/others/logo.png'

const Footer = () => {
    const [email, setEmail] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Newsletter signup:', email)
        setEmail('')
    }
    return (
        <footer
            className="text-white"
            style={{
                background:
                    'linear-gradient(180deg, #0B1C3C 0%, #11284D 50%, #3B2F5C 100%)',
            }}
        >
            <div className="max-w-7xl mt-4 mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="max-w-[300px]">
                                <img
                                    className="w-full"
                                    src={Logo}
                                    alt="app logo"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 max-w-xl">
                            <p className="font-poppins text-lg font-medium text-[#F5F5F5] leading-relaxed">
                                Honoring every life by preserving the memories,
                                voices, and stories that time can't erase.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <p className="font-poppines text-lg font-normal text-white">
                                Quick links
                            </p>
                            <nav className="space-y-3">
                                {[
                                    { label: 'Home', path: '/' },
                                    { label: 'How It Works', path: '#' },
                                    { label: 'FAQ', path: '#' },
                                    { label: 'Create Memorial', path: '#' },
                                    {
                                        label: 'Terms and Conditions',
                                        path: '/terms-and-conditions',
                                    },
                                    {
                                        label: 'Privacy Policy',
                                        path: '/privacy-policy',
                                    },
                                ].map((link) => (
                                    <Link
                                        key={link.label}
                                        to={link.path}
                                        className="block font-poppins text-base font-medium text-[#B8B8B8] hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="space-y-6 ">
                            <h3
                                className="font-playfair text-lg font-normal "
                                style={{ color: '#D4AF37' }}
                            >
                                Connect With Us
                            </h3>
                            <div className="flex items-center justify-start gap-4">
                                <a
                                    href="#"
                                    className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full shadow-[0_0_17.64px_0_#FFB84C33] bg-[#FFD36B1A]"
                                    aria-label="Facebook"
                                >
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                    </svg>
                                </a>

                                <a
                                    href="#"
                                    className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full shadow-[0_0_17.64px_0_#FFB84C33] bg-[#FFD36B1A]"
                                    aria-label="Instagram"
                                >
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        viewBox="0 0 24 24"
                                    >
                                        <rect
                                            x="2"
                                            y="2"
                                            width="20"
                                            height="20"
                                            rx="5"
                                            ry="5"
                                        />
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                        <line
                                            x1="17.5"
                                            y1="6.5"
                                            x2="17.51"
                                            y2="6.5"
                                        />
                                    </svg>
                                </a>

                                <a
                                    href="#"
                                    className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full shadow-[0_0_17.64px_0_#FFB84C33] bg-[#FFD36B1A]"
                                    aria-label="Twitter"
                                >
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                                    </svg>
                                </a>

                                <a
                                    href="#"
                                    className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full shadow-[0_0_17.64px_0_#FFB84C33] bg-[#FFD36B1A]"
                                    aria-label="LinkedIn"
                                >
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                        <rect
                                            x="2"
                                            y="9"
                                            width="4"
                                            height="12"
                                        />
                                        <circle cx="4" cy="4" r="2" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom section */}
            <div className="border-t border-gray-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-[#B8B8B8] font-lato font-normal text-[16px] leading-[35.98px]">
                        © 2025 Remember Me Memorials. All rights reserved.
                        Turning remembrance into connection, and loss into
                        legacy.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
