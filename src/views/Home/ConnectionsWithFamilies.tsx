import { Button } from '@/components/ui/Button'
// import { Upload, FileText, Lock, Calendar, Heart, MessageCircle, Share2, QrCode } from "lucide-react";
import createConnectionimage from '../../../public/img/others/Group 1321314729.png'
import uploadConncetionimage from '../../../public/img/others/uploadimage.png'
import shareConncetionimage from '../../../public/img/others/shareimage.png'
import celebrateConncetionimage from '../../../public/img/others/Group 1321314731.png'
import InfiniteTextScroller from '@/components/ui/ScrollerText'
import aboutImg from '../../../public/img/others/About.png'
import heartIcon from '../../assets/svg/heart.svg'
import serviceIcon from '../../assets/svg/service.svg'
import userIcon from '../../assets/svg/user.svg'

const ConnectionsWithFamilies = () => {
    return (
        <div className=" min-h-screen w-full mt-10 ">
            {/* Hero Section */}
            {/* <section className="max-w-6xl mx-auto px-4 pt-16 pb-8">
                <div
                    data-aos="fade-right"
                    data-aos-delay="200"
                    data-aos-duration="1200"
                    data-aos-once="false "
                    className="text-center"
                >
                    <div
                        data-aos="fade-right"
                        data-aos-delay="200"
                        data-aos-duration="1200"
                        data-aos-once="false "
                        className="mb-2"
                    >
                        <span className="text-memorial-text text-[#000000] font-poppins  text[18px]  uppercase">
                            How it Works
                        </span>
                    </div>
                    <p
                        data-aos="fade-right"
                        data-aos-delay="200"
                        data-aos-duration="1200"
                        data-aos-once="false "
                        className="md:text-[48px] text-3xl  font-[400]  DMSerif text-black leading-tight py-4"
                    >
                        Connect with other {''}
                        <span className="md:text-[48px] text-3xl  font-[400]   monteCarlo  text-black  leading-tight">
                            family members{' '}
                        </span>
                    </p>
                    <p
                        data-aos="fade-right"
                        data-aos-delay="200"
                        data-aos-duration="1200"
                        data-aos-once="false "
                        className="text-base md:text-lg text-memorial-text-secondary font-poppins  mx-auto leading-relaxed mb-8 px-4"
                    >
                        The informality of family life is a blessed condition
                        that allows us all to become our best while looking our
                        worst.
                    </p>
                    <div className="flex justify-center">
                        <button
                            data-aos="fade-right"
                            data-aos-delay="200"
                            data-aos-duration="1200"
                            data-aos-once="false"
                            data-text="Start Your Memorial Today"
                            className="button-animate  px-9 py-4 rounded-xl font-poppins font-400 text-sm md:text-base text-[#000] bg-[#C7A30D]  relative flex justify-start items-center overflow-hidden hover:bg-[#B8940C] transition-colors "
                        >
                            <span className="button-wrapper">
                                Start Your Memorial Today
                            </span>
                        </button>
                    </div>
                </div>
            </section> */}

            {/* How It Works Section */}
            <section className="max-w-7xl mx-auto px-4 md:py-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-10">
        
        {/* Left Column - Text Content */}
        <div className="space-y-6">
          <h2 className="font-lato font-normal text-[20.16px] leading-[32.25px] tracking-[1.01px] uppercase text-[#D4AF37]">
            ABOUT US
          </h2>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-[#ffffff]">
            Every Life Deserves to Be Honored
          </h1>
          
          <div className="space-y-6 font-normal font-lato text-[#E0E0E0]">
            <p>
              At Remember Me Memorials, we believe every life deserves to be honored — not just remembered, but truly seen. Our mission is simple yet profound: honoring every life by preserving the memories, voices, and stories that time can't erase.
            </p>
            
            <p>
              A tombstone may show only a name and two dates, but a life is so much more than that. It's laughter around the dinner table, lessons passed down through generations, and love that still lives in the hearts of those left behind.
            </p>
            
            <p>
              Through our digital memorials and lasting thumbprint codes, we give families a way to capture and share these moments — beautifully, securely, and with dignity.
            </p>
            
            <p>
              Each Remember Me Memorial is more than a tribute — it's a gift to future generations. Long after flowers have faded, families can visit and truly know who they came from: to see their ancestors' faces, hear their stories, and feel the legacy that shaped them.
            </p>
          </div>
        </div>
        
        {/* Right Column - Image & Quote */}
        <div className="relative">
          <div className=" overflow-hidden">
            <img 
              src={aboutImg} 
              alt="Hands holding a white flower"
              className="w-full h-auto object-cover"
            />
          </div>

        </div>
      </div>
      
      {/* Stats Section */}
      <div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
        { icon: userIcon, value: "10,000+", label: "Memorials Created" },
        { icon: serviceIcon, value: "50+", label: "Years of Memories" },
        { icon: heartIcon, value: "100%", label: "Satisfaction Rate" },
        ].map((stat, index) => (
          <div 
            key={index} 
            className="bg-[#1E2532] rounded-xl p-6 border-t-2 border-yellow-500 hover:border-yellow-400 transition-colors duration-300 text-center"
          >
            <div className="flex justify-center mb-4">
              <img src={stat.icon} alt={stat.label} className="w-12 h-12" />
            </div>
            <div className="text-2xl font-bold text-yellow-300">{stat.value}</div>
            <div className="text-gray-300 mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

            </section>
            <div className="pb-10">
                {/* <InfiniteTextScroller /> */}
            </div>
        </div>
    )
}
export default ConnectionsWithFamilies
