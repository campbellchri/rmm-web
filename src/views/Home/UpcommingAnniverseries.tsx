import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import familyHands from '/img/others/familyHands.png'
import plantingMemory from '/img/others/plantingMemory.png'
import { apiGetSubscriptionPackages } from '@/services/SubscriptionService'
import type { SubscriptionPackage } from '@/@types/subscription'

const dummyPackages: SubscriptionPackage[] = [
    {
        id: 'dummy-1',
        packageName: 'Basic Package',
        price: 9.99,
        priceUnit: 'Month',
        storageAmount: 5,
        storageUnit: 'GB',
        iconURL: familyHands,
        features: ['Ideal for individual tributes and small family memories.'],
        iconId: 'icon-1',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'dummy-2',
        packageName: 'Standard Package',
        price: 19.99,
        priceUnit: 'Month',
        storageAmount: 20,
        storageUnit: 'GB',
        iconURL: plantingMemory,
        features: ['Perfect for honoring a lifetime of memories with more storage.'],
        iconId: 'icon-2',
        isActive: true,
        sortOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'dummy-3',
        packageName: 'Premium Package',
        price: 29.99,
        priceUnit: 'Month',
        storageAmount: 100,
        storageUnit: 'GB',
        iconURL: familyHands,
        features: ['Comprehensive package for large collections and high-quality videos.'],
        iconId: 'icon-3',
        isActive: true,
        sortOrder: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
]

const UpcommingAnniverseries = () => {
    const [packages, setPackages] = useState<SubscriptionPackage[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await apiGetSubscriptionPackages()
                if (data && data.length > 0) {
                    setPackages(data)
                } else {
                    setPackages(dummyPackages)
                }
            } catch (error) {
                console.error('Failed to fetch subscription packages:', error)
                setPackages(dummyPackages)
            } finally {
                setLoading(false)
            }
        }

        fetchPackages()
    }, [])

    return (
        <div className="mt-8">
            <div className="max-w-7xl mx-auto px-2 pt-16 ">
                <div className="flex flex-col gap-16 lg:gap-16">
                    <div className="text-center mb-16">
                        <p className="font-lato font-normal text-[21.17px] leading-[33.87px] tracking-[1.06px] text-center uppercase text-[#D4AF37]">
                            Our Packages
                        </p>
                        <h2 className="font-playfair font-semibold text-[37.63px] leading-[48.92px] text-center text-white">
                            Honor Their Memory Each Year
                        </h2>
                        <p className="font-lato font-normal text-[21.17px] leading-[35.98px] text-center text-white">
                            We offer a range of comprehensive packages to honor your
                            loved ones with dignity and grace
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-full text-center text-white">
                                Loading packages...
                            </div>
                        ) : (
                            packages.map((pkg) => (
                                <div key={pkg.id} className="flex flex-col">
                                    <div className="group relative rounded-2xl overflow-hidden bg-card">
                                        <div className="w-full overflow-hidden aspect-[4/3]">
                                            <img
                                                src={pkg.iconURL || familyHands}
                                                alt={pkg.packageName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h3 className="font-lato font-normal text-[18.81px] leading-[28.22px] text-white">
                                                {pkg.packageName}
                                            </h3>
                                            <p className="font-lato font-normal text-[14.11px] leading-[18.81px] text-white whitespace-pre-line">
                                                {`Price: $${pkg.price}/${pkg.priceUnit}\nStorage: ${pkg.storageAmount}${pkg.storageUnit}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Honoring Memories Section */}
                                    <div className="p-8">
                                        <p className="font-lato font-normal text-[16.46px] leading-[26.75px] text-white">
                                            {pkg.features?.[0] || 'Honoring cherished memories with compassionate care and thoughtful attention to detail.'}
                                        </p>
                                        <a
                                            href="#"
                                            className="font-lato font-normal text-[16.46px] leading-[23.52px] text-[#EAA32A] flex items-center gap-2 mt-4"
                                        >
                                            View Details
                                            <ArrowRight className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpcommingAnniverseries
