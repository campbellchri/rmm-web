import { useState, useEffect } from 'react'
import HomeNavbar from '../Home/HomeNavbar'
import Footer from '../Home/HomeFooter'
import LinkLogo from '../../../public/img/others/Link.png'
import { privacyPolicyData } from '../../utils/constant'
import { apiGetLegalDocument, type LegalDocument } from '@/services/LegalService'
import Loading from '@/components/shared/Loading'
import dayjs from 'dayjs'

const PrivacyPolicy = () => {
    const [data, setData] = useState<LegalDocument[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPrivacyPolicy = async () => {
            try {
                const response = await apiGetLegalDocument('privacy_policy')
                if (response) {
                    const normalizedData = Array.isArray(response)
                        ? response
                        : [response]
                    if (normalizedData.length > 0 && normalizedData[0].id) {
                        setData(normalizedData)
                    }
                }
            } catch (error) {
                console.error('Failed to fetch privacy policy:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPrivacyPolicy()
    }, [])

    const firstDoc = data[0]

    return (
        <div className="flex flex-col min-h-screen bg-[#25293c]">
            <HomeNavbar />

            <div className="flex-shrink-0 flex items-center justify-center">
                <img
                    src={LinkLogo}
                    alt="Remember Memorials Logo"
                    className="h-32 sm:h-40 md:h-52 lg:h-70 w-auto mt-[-40px] sm:mt-[-60px] md:mt-[-75px] lg:mt-[-90px]"
                />
            </div>

            <main className="flex-grow max-w-[90%] md:max-w-[80%] lg:max-w-[75%] w-full px-4 mx-auto pb-20">
                <Loading loading={loading}>
                    <div className="flex flex-col items-center gap-4 my-[40px] lg:my-[80px]">
                        <h1 className="font-Rosarivo text-[28px] sm:text-[40px] md:text-[56px] lg:text-[70px] text-[#FDF1C3] text-center">
                            {privacyPolicyData.title}
                        </h1>

                        <p className="font-Rosarivo text-[16px] sm:text-[24px] md:text-[32px] lg:text-[40px] text-[#FDF1C3] text-center">
                            {firstDoc
                                ? `Effective Date: ${dayjs(firstDoc.effectiveDate).format('MMMM DD, YYYY')}`
                                : privacyPolicyData.effectiveDate}
                        </p>
                    </div>

                    <div className="text-white space-y-8 font-poppins text-justify leading-relaxed">
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <section key={item.id}>
                                    {data.length > 1 && (
                                        <h2 className="font-Rosarivo text-[20px] sm:text-[24px] lg:text-[30px] text-[#FDF1C3] mb-4">
                                            {index + 1}. {item.type.replace(/_/g, ' ').toUpperCase()}
                                        </h2>
                                    )}
                                    <div className="md:text-[16px] text-[#FFFBEA] whitespace-pre-line">
                                        {item.content}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <>
                                <p className="md:text-[16px] text-[#FFFBEA]">
                                    {privacyPolicyData.intro}
                                </p>

                                {privacyPolicyData.sections.map((section) => (
                                    <section key={section.id}>
                                        <h2 className="font-Rosarivo text-[20px] sm:text-[24px] lg:text-[30px] text-[#FDF1C3]">
                                            {section.id}. {section.heading}
                                        </h2>

                                        <p className="md:text-[16px] text-[#FFFBEA] whitespace-pre-line">
                                            {section.content}
                                        </p>
                                    </section>
                                ))}
                            </>
                        )}
                    </div>
                </Loading>
            </main>

            <Footer />
        </div>
    )
}

export default PrivacyPolicy
