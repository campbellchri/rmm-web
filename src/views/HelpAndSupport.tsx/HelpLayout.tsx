import { useState } from 'react'
import Sidebar from './Sidebar'
import FAQContent from './FAQContent'

export default function Layout() {
    const [activePage, setActivePage] = useState('FAQs')

    return (
        <div className="flex flex-col md:flex-row gap-3 ">
            {/* <Sidebar active={activePage} onSelect={setActivePage} /> */}

            <div className="flex-1 md:ml-8 ">
                {activePage === 'FAQs' && <FAQContent />}
                {activePage === 'Getting Started' && (
                    <h1 className="text-2xl font-bold">
                        Getting Started Content
                    </h1>
                )}
                {activePage === 'Contact Support' && (
                    <h1 className="text-2xl font-bold">
                        Contact Support Content
                    </h1>
                )}
            </div>
        </div>
    )
}
