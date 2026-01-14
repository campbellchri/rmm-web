import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/Accordion'
import AccountSvg from '../../../public/img/others/SVG (2).png'
import MemorialySvg from '../../../public/img/others/SVG (3).png'
import photoSvg from '../../../public/img/others/SVG (4).png'
import BillingSvg from '../../../public/img/others/SVG (5).png'

const faqData = [
    {
        category: 'Account & Login',
        icon: AccountSvg,
        items: [
            {
                question: 'How do I reset my password?',
                answer: 'Go to the login page and click “Forgot Password.” You’ll receive an email to reset it.',
            },
            {
                question: 'How do I update my profile information?',
                answer: 'Navigate to your account settings to update personal details, email, or password.',
            },
        ],
    },
    {
        category: 'Creating & Managing a Memorial',
        icon: MemorialySvg,
        items: [
            {
                question: 'How do I create my first memorial?',
                answer: 'Click on “Create Memorial” in your dashboard and follow the guided steps.',
            },
            {
                question: 'Can I transfer ownership of a memorial page?',
                answer: 'Yes, you can transfer ownership from the memorial settings page.',
            },
        ],
    },
    {
        category: 'Uploading Photos & Videos',
        icon: photoSvg,
        items: [
            {
                question: 'What file formats are supported?',
                answer: 'We support JPG, PNG, MP4, and MOV formats.',
            },
            {
                question: 'How many photos can I upload?',
                answer: 'There is no strict limit, but larger galleries may require a premium plan.',
            },
        ],
    },
    {
        category: 'Billing & Storage Plans',
        icon: BillingSvg,
        items: [
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, PayPal, and Apple Pay/Google Pay.',
            },
            {
                question: 'How do I upgrade my plan?',
                answer: 'Go to the Billing section under settings and choose your preferred plan.',
            },
        ],
    },
]

export default function FAQContent() {
    return (
        <div>
            <p
                className="md:text-2xl text-lg mb-6 mt-2 md:mt-0 DMSerif
            text-[#ffffff]"
            >
                Frequently Asked Questions
            </p>

            <div className="space-y-8">
                {faqData.map((section, sIndex) => (
                    <div
                        key={sIndex}
                        className="bg-[#2f3349] rounded-xl p-6 shadow-sm border-gray-100"
                    >
                        <div className="flex items-center gap-3 mb-4 md:text-lg text-base font-[500] font-poppins text-[#ffffff]">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2f3349]">
                                <img
                                    src={section.icon}
                                    alt={section.category}
                                    className="w-5 h-5"
                                />
                            </div>
                            {section.category}
                        </div>

                        {/* Accordion */}
                        <Accordion type="multiple" className="rounded-lg">
                            {section.items.map((item, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`section-${sIndex}-item-${index}`}
                                    className="px-4 border flex flex-col gap-2 border-[#383C56] rounded-lg mb-2 last:mb-0 bg-[#383c56]"
                                >
                                    <AccordionTrigger className="flex justify-between py-3 text-left text-[#ffffff] font-poppins text-sm font-[500]  hover:no-underline">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-4 py-3 text-left text-[#ffffff] font-poppins text-sm font-[500]">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                ))}
            </div>
        </div>
    )
}
