import React from 'react'
import Marquee from 'react-fast-marquee'

const items = [
    'Happiness',
    'A time for family',
    'Strongest bond',
    'Homemade happiness',
]

export default function InfiniteTextScroller() {
    return (
        <div className="relative w-full  bg-white">
            {/* fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />

            <Marquee
                speed={90} // px/sec like feel (tweak)
                direction="left"
                gradient={false} // we already have custom fade
                pauseOnHover={true}
                className="py-3 text-gray-400 "
            >
                {items.map((text, i) => (
                    <div key={i} className="flex items-center gap-6 mx-8">
                        <span className="text-base md:text-[48px] DMSerif ">
                            {text}
                        </span>
                        <span className="opacity-40 monteCarlo text-base md:text-[48px] ">
                            ＊
                        </span>
                    </div>
                ))}
            </Marquee>
        </div>
    )
}
