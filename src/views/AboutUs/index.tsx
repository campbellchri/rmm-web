import HomeNavbar from '../Home/HomeNavbar'
import Footer from '../Home/HomeFooter'
import LinkLogo from '../../../public/img/others/Link.png'
import MissionImage from '../../../public/img/others/our-mission.png'
import { useState } from 'react'

const AboutUs = () => {
    const [openItems, setOpenItems] = useState<Record<number, boolean>>({})

    const toggleItem = (index: number) => {
        setOpenItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }))
    }

    const faqs = [
        {
            question: 'How long does it take to create a memorial?',
            answer: 'Creating a memorial typically takes just 10-15 minutes. Our intuitive interface guides you through each step, allowing you to upload photos, write stories, and customize your memorial with ease.',
        },
        {
            question: 'Is there a free option available?',
            answer: 'Yes, we offer a free basic memorial option that includes essential features like photo uploads, story sharing, and visitor guestbook. Premium options are available for those who want additional customization and features.',
        },
        {
            question: 'How long will the memorial stay online?',
            answer: "All memorials remain online indefinitely. We believe memories should last forever, so there's no expiration date on your memorial. You can update it anytime, and it will be accessible to loved ones for generations.",
        },
        {
            question: 'How long does it take to create a memorial?',
            answer: 'Creating a memorial typically takes just 10-15 minutes. Our intuitive interface guides you through each step, allowing you to upload photos, write stories, and customize your memorial with ease.',
        },
    ]
    return (
        <div className="flex flex-col min-h-screen" id="home">
            <HomeNavbar />
            <div className="flex-shrink-0 flex items-center justify-center">
                <img
                    src={LinkLogo}
                    alt="Remember Memorials Logo"
                    className="h-32 sm:h-40 md:h-52 lg:h-70 w-auto mt-[-40px] sm:mt-[-60px] md:mt-[-75px] lg:mt-[-90px]"
                />
            </div>
            <main className="flex-grow container-custom px-4 mx-auto lg:py-0 py-10">
                <div className="flex flex-col items-center justify-center gap-4 my-[40px] lg:my-[80px]">
                    <h1 className="font-normal text-[40px] md:text-[60px] lg:text-[75px] leading-[1.1] lg:leading-[60px] tracking-normal text-center align-middle font-Rosarivo text-[#FDF1C3]">
                        About Us
                    </h1>
                    <p className="font-rosarivo font-normal text-[24px] md:text-[30px] lg:text-[38px] leading-[1.3] lg:leading-[70px] tracking-normal text-center font-Rosarivo align-middle text-[#FDF1C3]">
                        At Remember Me Memorials, <br />
                        we believe every life deserves to be honored not just
                        <br /> remembered, but truly seen.
                    </p>
                </div>

                <div className=" w-full mx-auto flex flex-col lg:flex-row gap-4 items-center">
                    {/* Image Section */}
                    <div className=" rounded-lg overflow-hidden w-full lg:w-[50%] flex justify-center lg:justify-start">
                        <img
                            src={MissionImage}
                            alt="Hands holding a flower"
                            className="w-full h-auto max-w-[533px] lg:mr-auto object-cover"
                        />
                    </div>

                    {/* Text Content Section */}
                    <div className=" text-white space-y-6 w-full lg:w-[50%]">
                        <h1 className="font-Rosarivo font-normal text-[36px] md:text-[50px] lg:text-[70px] leading-[1.1] lg:leading-[60px] tracking-normal align-middle text-[#FDF1C3] text-center lg:text-left">
                            Our Mission
                        </h1>

                        <div className="space-y-4 ">
                            <p className="font-poppins font-normal text-[16px] leading-[26px] tracking-normal text-[#FFFBEA]">
                                Our mission is simple yet profound: honoring
                                every life by preserving the memories, voices,
                                and stories that time can't erase. A tombstone
                                may show only a name and two dates, but a life
                                is so much more than that. It's laughter around
                                the dinner table, lessons passed down through
                                generations, and love that still lives in the
                                hearts of those left behind. Through our digital
                                memorials and lasting thumbprint codes, we give
                                families a way to capture and share those
                                moments — beautifully, securely, and with
                                dignity. Each Remember Me Memorial is more than
                                a tribute — it's a gift to future generations.
                                Long after flowers have faded, families can
                                visit and truly know who they came from: to see
                                their ancestors' faces, hear their stories, and
                                feel the legacy that shaped them. When you
                                choose Remember Me Memorials, you're choosing
                                compassion, trust, and care. We handle every
                                story as if it were our own — helping families
                                turn remembrance into connection, and loss into
                                legacy...
                            </p>
                        </div>
                    </div>
                </div>

                <div className=" w-full mx-auto my-[50px] lg:my-[100px] space-y-6">
                    <h2 className="font-Rosarivo font-normal text-[32px] md:text-[45px] lg:text-[60px] leading-[1.1] lg:leading-[60px] tracking-normal align-middle text-[#FDF1C3] text-center mb-6">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`
                                pt-6 pb-4 transition-all duration-300
                                ${index !== 0 ? 'border-t border-t-[2px] border-gray-600/30' : ''}
                                ${index === faqs.length - 1 ? 'border-b border-b-[2px] border-gray-600/30 pb-8' : ''}
                                ${openItems[index] ? 'pb-8' : ''}
                                `}
                            >
                                <div
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleItem(index)}
                                >
                                    <span className="text-gray-300 text-sm font-mono mr-6">
                                        0{index + 1}
                                    </span>

                                    <span className="font-medium pr-4 text-center font-Rosarivo text-[18px] md:text-[22px] text-[#ffffff]">
                                        {faq.question}
                                    </span>

                                    <span className="text-gray-300 text-xl font-bold">
                                        {openItems[index] ? '−' : '+'}
                                    </span>
                                </div>

                                {openItems[index] && (
                                    <div className="mt-4 pl-12 text-gray-400 leading-relaxed text-base animate-fadeIn">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default AboutUs
