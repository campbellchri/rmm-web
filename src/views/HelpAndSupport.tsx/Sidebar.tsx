import { HelpCircle, FileText, MessageSquare } from 'lucide-react'

interface SidebarProps {
    active: string
    onSelect: (value: string) => void
}

export default function Sidebar({ active, onSelect }: SidebarProps) {
    const items = [
        { label: 'FAQs', icon: HelpCircle },
        { label: 'Getting Started', icon: FileText },
        { label: 'Contact Support', icon: MessageSquare },
    ]

    return (
        <div
            className="bg-[#2f3349] rounded-lg shadow self-start 
                        flex flex-row justify-around w-full 
                        md:flex-col md:w-64"
        >
            <ul className="flex w-full flex-row justify-around md:flex-col md:space-y-3">
                {items.map(({ label, icon: Icon }) => (
                    <li
                        key={label}
                        onClick={() => onSelect(label)}
                        className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 cursor-pointer p-4 transition ${
                            label === items[0].label
                                ? 'rounded-t-md'
                                : label === items[items.length - 1].label
                                    ? 'rounded-b-md'
                                    : ''
                        }
                        ${
                            active === label
                                ? 'bg-[#FFB84C] text-[#222D38] font-semibold'
                                : 'text-white hover:text-[#ffffff]'
                        }`}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{label}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
