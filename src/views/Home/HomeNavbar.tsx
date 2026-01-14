import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const HomeNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    //  const leftNavItems = [
    //     { label: 'HOME', scrollId: 'home' },
    //     { label: 'HOW IT WORKS', scrollId: 'how-it-works' },
    //     { label: 'FAQ', scrollId: 'faq' },
    // ]
    const leftNavItems = [
        { label: 'HOME', href: '/', type: 'navigate' as const }, // 👈 Navigate to homepage
        { label: 'HOW IT WORKS', scrollId: 'how-it-works', type: 'scroll' as const },
        { label: 'FAQ', scrollId: 'faq', type: 'scroll' as const },
    ]

    const rightNavItems = [
        { label: 'ABOUT US', href: '/about-us' },
        { label: 'CONTACT US', href: '/contactUs' },
        // we’ll handle LOG IN separately as a button
    ]

    // Scroll helper function
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            const navbarHeight = 100 // Adjust if your navbar height changes
            const top = element.offsetTop - navbarHeight

            window.scrollTo({
                top,
                behavior: 'smooth',
            })
        }
    }

    return (
        <header className=" z-50 w-full">
            <div className="mx-auto px-6 lg:px-25 py-[20px]">
                <div className="flex items-center justify-between h-24">
                    {/* Left Navigation - Desktop */}
                    <nav className="hidden lg:flex">
                        <ul className="flex">
                            {leftNavItems.map((item) => (
                                <li key={item.label}>
                                    {item.type === 'navigate' ? (
                                        <a
                                            href={item.href}
                                            className="flex items-center px-4 py-9 text-[#ffffff] font-poppins font-[500] text-[15px] uppercase tracking-wide hover:text-[#C7A30D] transition-colors"
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <button
                                            onClick={() => scrollToSection(item.scrollId!)}
                                            className="flex items-center px-4 py-9 text-[#ffffff] font-poppins font-[500] text-[15px] uppercase tracking-wide hover:text-[#C7A30D] transition-colors cursor-pointer bg-transparent border-none"
                                            aria-label={`Scroll to ${item.label}`}
                                        >
                                            {item.label}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Center Logo */}
                    {/* <div className="flex-shrink-0">
                        <a
                            href="/"
                            className="flex items-center justify-center p-2.5"
                        >
                            <img
                                src={LogoLink}
                                alt="Remember Memorials Logo"
                                className="h-50 w-auto "
                            />
                        </a>
                    </div> */}

                    {/* Right Navigation - Desktop */}
                    <nav className="hidden lg:flex">
                        <ul className="flex items-center">
                            {rightNavItems.map((item) => (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        className="flex items-center px-4 py-9 text-[#ffffff] font-poppins font-[500] text-[15px] uppercase tracking-wide hover:text-[#C7A30D] transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <a
                                    href="/sign-in"
                                    data-text="Sign In"
                                    className="relative flex justify-center items-center ml-4 bg-[linear-gradient(96.23deg,_#ECA024_5.01%,_#F9C94F_50.03%,_#EAA32A_95.05%)]
 text-[#011837] font-DMSerif Text font-[500] text-[15px] uppercase tracking-wide px-5 py-4 rounded-[1000px]"
                                >
                                    <span className="button-wrapper">
                                        Sign In
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 text-black hover:text-[#C7A30D] transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-200">
                        <nav className="py-4">
                            <div className="space-y-1">
                                {/* Left nav items */}
                                {leftNavItems.map((item) => (
                                    <div key={item.label}>
                                        {item.type === 'navigate' ? (
                                            <a
                                                href={item.href}
                                                className="block w-full text-left px-4 py-3 text-black font-poppins font-bold text-[15px] uppercase tracking-wide hover:text-[#C7A30D] hover:bg-gray-50 transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {item.label}
                                            </a>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    scrollToSection(item.scrollId!)
                                                    setIsMenuOpen(false)
                                                }}
                                                className="block w-full text-left px-4 py-3 text-black font-poppins font-bold text-[15px] uppercase tracking-wide hover:text-[#C7A30D] hover:bg-gray-50 transition-colors cursor-pointer bg-transparent border-none"
                                                aria-label={`Scroll to ${item.label}`}
                                            >
                                                {item.label}
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {/* Divider */}
                                <div className="border-t border-gray-200 my-2"></div>

                                {/* Right nav items */}
                                {rightNavItems.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="block px-4 py-3 text-black font-poppins font-bold text-[15px] uppercase tracking-wide hover:text-[#C7A30D] hover:bg-gray-50 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.label}
                                    </a>
                                ))}

                                {/* Login as button in mobile */}
                                <a
                                    href="/sign-in"
                                    className="block mx-4 mt-3 text-center bg-[#C7A30D] text-black font-poppins font-bold text-[15px] uppercase tracking-wide px-5 py-2.5 rounded-md shadow-[0_2px_4px_0_rgba(165,163,174,0.30)] hover:bg-[#B8940C] transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    LOG IN
                                </a>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}

export default HomeNavbar
