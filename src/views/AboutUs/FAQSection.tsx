import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQSection = () => {
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
        <div className="w-full mx-auto my-[50px] lg:my-[100px] space-y-6">
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
                        ${openItems[index] ? 'pb-8 ' : ''}
                        `}
                    >
                        <div
                            className="flex items-center justify-between cursor-pointer group"
                            onClick={() => toggleItem(index)}
                        >
                            <div className="flex items-center w-full relative">
                                <span className={`absolute left-0 text-[16px] md:text-[20px] font-Rosarivo transition-colors duration-300 ${openItems[index] ? 'text-[#F9C94F]' : 'text-white'}`}>
                                    0{index + 1}
                                </span>

                                <div className="mx-auto flex flex-col items-center justify-center w-[500px] text-center">
                                    <h3 className={`font-Rosarivo text-[18px] md:text-[22px] transition-colors duration-300 ${openItems[index] ? 'text-[#F9C94F]' : 'text-white'}`}>
                                        {faq.question}
                                    </h3>

                                    <AnimatePresence>
                                        {openItems[index] && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-6 text-white leading-[1.6] text-[16px] md:text-[16px]">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="absolute right-0">
                                    {openItems[index] ? (
                                        <X className="w-6 h-6 text-[#F9C94F] transition-transform duration-300" />
                                    ) : (
                                        <Plus className="w-6 h-6 text-white transition-transform duration-300" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FAQSection
