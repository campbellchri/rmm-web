import ConnectionsWithFamilies from './ConnectionsWithFamilies'
import FamilyReunions from './FamilyReunion'
import FAQ from './FAQ'
import Footer from './HomeFooter'
import MemorialCategories from './MemorialCategories'
import MemorialFeatures from './MemorialFeatures'
import UpcommingAnniverseries from './UpcommingAnniverseries'
import headerImage from '../../../public//img/others/herosectionimg.png'
import HomeNavbar from './HomeNavbar'
import LogoLink from '../../../public/img/others/Link.png'
import 'aos/dist/aos.css'

const Index = () => {

    return (
        <div className="overflow-hidden" id="home">
            <HomeNavbar />
            <div>
                <div >
                    <div className="container-custom px-4 mx-auto lg:py-0 py-10 ">
                         <div className="flex-shrink-0 flex items-center justify-center">
                     
                            <img
                                src={LogoLink}
                                alt="Remember Memorials Logo"
                                className="h-32 sm:h-40 md:h-52 lg:h-70 w-auto mt-[-40px] sm:mt-[-60px] md:mt-[-75px] lg:mt-[-90px]"
                            />
                    </div>

                        <div className='flex flex-col items-center gap-4 sm:gap-6 md:gap-8'>
                            <p className="text-[#FDF1C3] font-Rosarivo font-normal text-[28px] sm:text-[40px] md:text-[60px] lg:text-[89.72px] leading-[34px] sm:leading-[48px] md:leading-[72px] lg:leading-[107.66px] text-center align-middle px-2">
                            Honoring Every Life With Listing Memories
                            </p>
                            <p className="text-[#FFFDE8] font-poppins font-normal text-[16px] sm:text-[22px] md:text-[28px] lg:text-[32.9px] leading-[24px] sm:leading-[32px] md:leading-[40px] lg:leading-[46.06px] text-center align-middle px-4">
                            Create a lasting digital memorial with photos, videos, and memories—accessible anytime by scanning a QR code.
                            </p>

                            <button
                                className="font-DMSerif font-normal text-[18px] sm:text-[22px] md:text-[25px] lg:text-[24px] text-center align-middle
                                bg-[linear-gradient(96.23deg,_#ECA024_5.01%,_#F9C94F_50.03%,_#EAA32A_95.05%)]
                                px-6 sm:px-8 md:px-10 lg:px-13
                                py-2 sm:py-3 md:py-4
                                rounded-[1000px]
                                text-[#011837]
                                w-auto
                                "
                            >
                            Create Memorial
                            </button>
                        </div>


                    </div>
                </div>

                <div id="how-it-works">
                    <ConnectionsWithFamilies />
                </div>

                <UpcommingAnniverseries />
                <MemorialFeatures />
                <MemorialCategories />
                <FamilyReunions />
                <div id="faq">
                    <FAQ />
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Index
