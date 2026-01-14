import { cloneElement } from 'react'
import 'swiper/css'

import type { CommonProps } from '@/@types/common'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import AuthsideImg1 from '../../../../public/img/others/Art.png'
import AuthsideImg2 from '../../../../public/img/others/Art (1).png'

type SideProps = CommonProps

// Add your slider images here
const sliderImages = [AuthsideImg1, AuthsideImg2]

const Side = ({ children, ...rest }: SideProps) => {
    return (
        <div className="flex h-[100vh] p-6 bg-[#25293C] dark:bg-gray-800">
            {/* Left Section */}
            <div className="flex flex-col justify-start  md:justify-start 2xl:justify-center items-center flex-1 overflow-y-auto scrollbar-hide">
                <div className="w-full xl:max-w-[450px] px-8 max-w-full">
                    {children
                        ? cloneElement(children as React.ReactElement, {
                              ...rest,
                          })
                        : null}
                </div>
                <p className="font-poppins fixed bottom-6 font-normal text-[12px] leading-[100%] tracking-wide text-center align-middle text-[#959CB6]">
                    © 2025 ALL RIGHTS RESERVED
                </p>
            </div>

            {/* Right Section with Infinite Slider */}
            <div className=" px-10 lg:flex flex-col flex-1 justify-between  hidden rounded-3xl items-end relative xl:max-w-[710px] 2xl:max-w-[900px] overflow-hidden">
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{ delay: 2000, disableOnInteraction: false }}
                    loop={true}
                    slidesPerView={1}
                    className="h-full w-full rounded-3xl"
                >
                    {sliderImages.map((src, idx) => (
                        <SwiperSlide key={idx}>
                            <img
                                src={src}
                                className="h-full w-full object-cover rounded-3xl"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default Side
