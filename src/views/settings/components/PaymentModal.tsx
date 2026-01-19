import React, { useState, useEffect } from 'react'
import { Dialog } from '@/components/ui'
import { Heart, Star, Crown, CreditCard, Lock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { useBillingStore, Plan } from '@/store/billingStore'

const plans: Plan[] = [
    {
        id: 'essential',
        name: 'Essential Tribute',
        price: 5,
        storage: '5GB storage',
        features: ['500 Photo Uploads', 'Basic Sharing', '1 Year Hosting'],
        icon: <Heart className="text-[#F9C94F]" size={20} />,
    },
    {
        id: 'premium',
        name: 'Premium Legacy',
        price: 15,
        storage: '15GB storage',
        features: ['2000 Photo Uploads', 'Video Support', '5 Year Hosting', 'Custom Domain'],
        icon: <Star className="text-[#F9C94F]" size={20} />,
    },
    {
        id: 'eternal',
        name: 'Eternal Archive',
        price: 25,
        storage: '30GB storage',
        features: ['Unlimited Uploads', 'Lifetime Hosting', 'Priority Support', 'Custom Branding'],
        icon: <Crown className="text-[#F9C94F]" size={20} />,
    },
]

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    initialPlanId?: string
    onSuccess?: (plan: any) => void
}

const PaymentModal = ({ isOpen, onClose, initialPlanId, onSuccess }: PaymentModalProps) => {
    const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId || 'premium')
    const [isSuccess, setIsSuccess] = useState(false)
    const { setSubscription, setActivePlan, setIsUpgrading } = useBillingStore()

    useEffect(() => {
        if (isOpen) {
            setSelectedPlanId(initialPlanId || 'premium')
            setIsSuccess(false)
        }
    }, [isOpen, initialPlanId])

    const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[1]

    const tax = selectedPlan.price * 0.1
    const total = selectedPlan.price + tax

    const handlePay = () => {
        setIsSuccess(true)
        setSubscription(true)
        setActivePlan(selectedPlan)
        setIsUpgrading(false)
        if (onSuccess) {
            onSuccess(selectedPlan)
        }
    }

    const handleContinue = () => {
        setIsSuccess(false)
        onClose()
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={1000}
            contentClassName="p-0 bg-[#0F172A] border border-gray-800 rounded-2xl overflow-hidden"
        >
            <div className="p-8 text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="text-center mb-8">
                    <p className="text-[#D4AF37] font-Arial text-[16px] font-[400] mb-2 uppercase">SECURE PAYMENT</p>
                    <h2 className="text-[30px] font-[600] mb-2 text-white font-playfair">Complete Your Purchase</h2>
                    <p className="text-white font-[400] text-[12px] font-Arial">Select your plan and enter your payment details to get started</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
                    {/* Left Column */}
                    <div className="flex-1 space-y-6 ">
                        {/* <div className='bg-[#1e2532] p-6 rounded-[12px] border-[0.5px] border-[#343b46] h-[60vh] flex flex-col'>
                            <h3 className="text-lg font-[600] mb-4 text-white font-playfair">Select Your Plan</h3>
                            <div className={`space-y-3 overflow-y-auto custom-scrollbar pr-2 ${isSuccess ? 'opacity-50 pointer-events-none' : ''}`}>
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        onClick={() => setSelectedPlanId(plan.id)}
                                        className={`relative p-4 rounded-xl border cursor-pointer transition-all ${selectedPlanId === plan.id
                                            ? 'bg-[#272c32] border-[#F9C94F]'
                                            : 'bg-[#141d2d]/50 border-gray-800 hover:border-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-gray-800 rounded-lg">
                                                    {plan.icon}
                                                </div>
                                                <div>
                                                    <p className={`font-bold ${selectedPlanId === plan.id ? 'text-[#F9C94F]' : 'text-gray-300'}`}>
                                                        {plan.name}
                                                    </p>
                                                    <div className="flex items-baseline gap-1 mt-1">
                                                        <span className="text-[#F9C94F] font-bold">${plan.price}</span>
                                                        <span className="text-gray-500 text-xs">/month</span>
                                                    </div>
                                                    <p className="text-gray-500 text-xs mt-1">{plan.storage}</p>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlanId === plan.id ? 'border-[#F9C94F]' : 'border-gray-600'
                                                }`}>
                                                {selectedPlanId === plan.id && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#F9C94F]" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                        <div className="bg-[#1e2532] p-6 rounded-[12px] border-[0.5px] border-[#343b46] h-[60vh] flex flex-col">
                            <h3 className="text-lg font-[600] mb-4 text-white font-playfair">
                                Select Your Plan
                            </h3>

                            <div
                                className={`grid grid-rows-${plans.length} gap-3 flex-1 ${isSuccess ? 'opacity-50 pointer-events-none' : ''
                                    }`}
                            >
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        onClick={() => setSelectedPlanId(plan.id)}
                                        className={`relative p-4 rounded-xl border cursor-pointer transition-all h-full flex items-center ${selectedPlanId === plan.id
                                            ? 'bg-[#272c32] border-[#F9C94F]'
                                            : 'bg-[#141d2d]/50 border-gray-800 hover:border-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-gray-800 rounded-lg">
                                                    {plan.icon}
                                                </div>
                                                <div>
                                                    <p
                                                        className={`font-bold ${selectedPlanId === plan.id
                                                            ? 'text-[#F9C94F]'
                                                            : 'text-gray-300'
                                                            }`}
                                                    >
                                                        {plan.name}
                                                    </p>
                                                    <div className="flex items-baseline gap-1 mt-1">
                                                        <span className="text-[#F9C94F] font-bold">
                                                            ${plan.price}
                                                        </span>
                                                        <span className="text-gray-500 text-xs">/month</span>
                                                    </div>
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        {plan.storage}
                                                    </p>
                                                </div>
                                            </div>

                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlanId === plan.id
                                                    ? 'border-[#F9C94F]'
                                                    : 'border-gray-600'
                                                    }`}
                                            >
                                                {selectedPlanId === plan.id && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#F9C94F]" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className="bg-[#1e2532] p-6 rounded-xl border border-gray-800">
                            <h3 className="text-sm font-bold font-Arial mb-4 text-white">Order Summary</h3>
                            <div className="space-y-2 text-sm text-gray-400">
                                <div className="flex justify-between">
                                    <span className='font-Arial font-[400] text-white text-[12px]'>{selectedPlan.name}</span>
                                    <span className='font-Arial font-[400] text-white text-[12px]'>${selectedPlan.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className='font-Arial font-[400] text-white text-[12px]'>Tax</span>
                                    <span className='font-Arial font-[400] text-white text-[12px]'>${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-800 mt-4 pt-4 flex justify-between text-lg font-bold text-white">
                                    <span className='font-Arial font-[400] text-white text-[12px]'>Total</span>
                                    <span className="text-[#F9C94F]">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-[#a5a8ad] mt-4">Billed monthly. Cancel anytime.</p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 lg:h-[70%] space-y-6 bg-[#1e2532] p-6 rounded-2xl border border-gray-800 flex flex-col justify-center min-h-[400px]">
                        {!isSuccess ? (
                            <>
                                <div className="flex items-center gap-2 mb-4">
                                    <CreditCard className="text-[#F9C94F]" size={20} />
                                    <h3 className="text-lg font-[600] text-white font-playfair">Payment Details</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1.5 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full bg-[#0F172A] border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#F9C94F] transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1.5 ml-1">Card Information</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="1234 5678 9812 3456"
                                                className="w-full bg-[#0F172A] border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#F9C94F] transition-colors pr-10"
                                            />
                                            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-3">
                                            <input
                                                type="text"
                                                placeholder="MM / YY"
                                                className="bg-[#0F172A] border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#F9C94F] transition-colors"
                                            />
                                            <input
                                                type="text"
                                                placeholder="CVC"
                                                className="bg-[#0F172A] border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#F9C94F] transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1.5 ml-1">Cardholder Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full bg-[#0F172A] border border-gray-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#F9C94F] transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="bg-[#303332] text-[14px] font-Arial p-4 rounded-lg flex gap-3 items-start border border-[#D4AF374D]">
                                    <Lock className="text-[#F9C94F] mt-0.5" size={16} />
                                    <p className="text-[11px] text-gray-400 leading-relaxed">
                                        Your payment information is encrypted and secure. We never store your card details.
                                    </p>
                                </div>

                                <button
                                    onClick={handlePay}
                                    className="w-full bg-[linear-gradient(180deg,#ECA024_0%,#F9C94F_50%,#EAA32A_100%)]
 text-[#0A2E5C] font-bold py-3 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-md"
                                >
                                    <Lock size={18} /> Pay ${total.toFixed(2)}
                                </button>

                                <div className="text-center mt-6">
                                    <p className="text-[10px] text-[#9a9da3] uppercase font-Arial tracking-widest mb-3">Accepted Payment Methods</p>
                                    <div className="flex justify-center gap-3 grayscale opacity-60">
                                        <span className="!bg-[#0A1628] px-2 py-1 rounded text-[10px] border border-gray-800 font-bold">Visa</span>
                                        <span className="bg-[#0A1628] px-2 py-1 rounded text-[10px] border border-gray-800 font-bold">Mastercard</span>
                                        <span className="bg-[#0A1628] px-2 py-1 rounded text-[10px] border border-gray-800 font-bold">Amex</span>
                                        <span className="bg-[#0A1628] px-2 py-1 rounded text-[10px] border border-gray-800 font-bold">Discover</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center space-y-6 py-8">
                                <div className="flex justify-center">
                                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 40C0 17.9086 17.9086 0 40 0C62.0914 0 80 17.9086 80 40C80 62.0914 62.0914 80 40 80C17.9086 80 0 62.0914 0 40Z" fill="#D4AF37" fill-opacity="0.2" />
                                        <path d="M53.3327 30L34.9993 48.3333L26.666 40" stroke="#D4AF37" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-[32px] font-[600] font-playfair font-bold text-[#FFFFFF]">Payment Successful!</h3>
                                    <p className="text-gray-400 text-sm font-Arial font-[400]">
                                        Thank you for subscribing to <span className="text-[#D4AF37] font-bold">{selectedPlan.name}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={handleContinue}
                                    className="w-full bg-[linear-gradient(180deg,#ECA024_0%,#F9C94F_50%,#EAA32A_100%)]
 text-[#0A2E5C] font-bold py-4 rounded-full hover:opacity-90 transition-opacity text-lg mt-8 shadow-lg shadow-yellow-500/10"
                                >
                                    Continue to Dashboard
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default PaymentModal
