import { ArrowLeft } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Billing() {
    const [showPlans, setShowPlans] = useState(false)

    return (
        <div className=" mx-auto  min-h-screen">
            {!showPlans ? (
                <>
                    {/* Billing Section */}
                    <p className="md:text-xl text-base font-poppins text-[#ffffff]  md:font-bold font-semibold mb-4">
                        Billing
                    </p>
                    <div className="bg-[#383c56]  rounded-lg p-4 flex flex-col gap-5 mb-6 ">
                        <div className="flex items-center gap-2">
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    width="40"
                                    height="40"
                                    rx="20"
                                    fill="#00BC7D"
                                />
                                <path
                                    d="M26.7071 19.8008L17.9571 29.1758C17.8644 29.2747 17.742 29.3408 17.6084 29.3641C17.4748 29.3874 17.3372 29.3666 17.2165 29.3049C17.0958 29.2432 16.9984 29.1438 16.939 29.0219C16.8797 28.8999 16.8616 28.762 16.8876 28.6289L18.0329 22.9L13.5305 21.2094C13.4338 21.1732 13.3476 21.1136 13.2796 21.036C13.2115 20.9584 13.1637 20.8651 13.1405 20.7645C13.1173 20.6639 13.1194 20.5591 13.1465 20.4595C13.1737 20.3599 13.2251 20.2686 13.2962 20.1937L22.0462 10.8187C22.1389 10.7198 22.2613 10.6537 22.3949 10.6304C22.5285 10.6071 22.666 10.6279 22.7868 10.6896C22.9075 10.7514 23.0049 10.8507 23.0642 10.9726C23.1236 11.0946 23.1416 11.2325 23.1157 11.3656L21.9673 17.1008L26.4696 18.7891C26.5656 18.8255 26.6511 18.885 26.7187 18.9623C26.7862 19.0396 26.8336 19.1324 26.8568 19.2324C26.88 19.3324 26.8781 19.4366 26.8515 19.5357C26.8248 19.6348 26.7742 19.7259 26.704 19.8008H26.7071Z"
                                    fill="#F5F5F5"
                                />
                            </svg>
                            <div className="flex items-start flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-poppins font-bold text-[#ffffff] ">
                                        Business board basic
                                    </span>
                                    <span className="bg-[#05EB7624] text-[#10B981] font-poppins text-xs px-2 py-1 rounded-xl">
                                        Active
                                    </span>
                                </div>
                                <p className="text-sm text-[#ffffff]">
                                    Billing monthly | Next payment on{' '}
                                    <b>02/10/2025</b> for <b>$59.90</b>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-col md:flex-row">
                            <button className="px-4 py-2 border font-bold border-yellow-500 text-yellow-600 rounded-2xl hover:bg-yellow-50">
                                Cancel Subscription
                            </button>
                            <button
                                onClick={() => setShowPlans(true)}
                                className="px-4 py-2 bg-yellow-500 font-bold text-[#000000] rounded-2xl hover:bg-yellow-600"
                            >
                                Upgrade Plan
                            </button>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <p className="md:text-lg text-base  font-poppins md:font-bold font-semibold text-[#ffffff] mb-2">
                        Payment method
                    </p>
                    <div className="flex justify-between items-center flex-col md:flex-row mb-6 gap-3">
                        <div className="flex items-center gap-3">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                                alt="Mastercard"
                                className="w-10"
                            />
                            <div>
                                <p className="font-semibold font-poppins text-[#ffffff]">
                                    Carolyn Perkins •••• 8461
                                </p>
                                <p className="text-sm text-[#ffffff]">
                                    Expired Jun 2025
                                </p>
                            </div>
                        </div>
                        <button className="px-4 py-2 border text-[#FFB84C] border-[#FFB84C] rounded-2xl font-bold hover:bg-gray-100 ">
                            Update Card Information
                        </button>
                    </div>

                    {/* Transaction History */}
                    <p className="md:text-lg text-base font-poppins md:font-bold font-semibold text-[#ffffff] mb-2">
                        Transaction history
                    </p>
                    <table className="w-full text-left ">
                        <thead>
                            <tr className="border-b text-white">
                                <th className="py-2 ">PRODUCT</th>
                                <th className="py-2">STATUS</th>
                                <th className="py-2">DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                {
                                    product: 'Mock premium pack',
                                    status: 'Pending',
                                    statusColor: 'bg-yellow-500',
                                    date: '12/10/2021',
                                },
                                {
                                    product:
                                        'Business board basic subscription',
                                    status: 'Paid',
                                    statusColor: 'bg-green-500',
                                    date: '11/13/2021',
                                },
                                {
                                    product:
                                        'Business board basic subscription',
                                    status: 'Paid',
                                    statusColor: 'bg-green-500',
                                    date: '10/13/2021',
                                },
                                {
                                    product:
                                        'Business board basic subscription',
                                    status: 'Paid',
                                    statusColor: 'bg-green-500',
                                    date: '09/13/2021',
                                },
                            ].map((item, idx) => (
                                <tr key={idx} className="border-b text-white">
                                    <td className="py-2">{item.product}</td>
                                    <td className="py-2 flex items-center gap-2">
                                        <span
                                            className={`w-2 h-2 rounded-full ${item.statusColor}`}
                                        ></span>
                                        {item.status}
                                    </td>
                                    <td className="py-2">{item.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <>
                    <div className="flex items-center  gap-2 mb-4 ">
                        <button
                            onClick={() => setShowPlans(false)}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <p className="text-xl font-poppins font-bold text-[#171717]">
                            Billing
                        </p>
                    </div>
                    {/* Subscription Plans */}
                    <p className="text-lg font-poppins font-bold mb-6 text-[#171717]">
                        Subscription Plans
                    </p>
                    <div className="grid lg:grid-cols-4 gap-6 ">
                        {[
                            {
                                name: 'Basic',
                                price: '$5',
                                per: '/month',
                                storage: '5 GB Storage',
                                features: [
                                    'Photo uploads',
                                    'Basic sharing',
                                    '1 year hosting',
                                ],
                                buttonText: 'Upgrade',
                                current: false,
                            },
                            {
                                name: 'Premium',
                                price: '$15',
                                per: '/month',
                                storage: '15 GB Storage',
                                features: [
                                    'Video uploads',
                                    'Advanced sharing',
                                    '5 year hosting',
                                    'Custom domain',
                                ],
                                buttonText: 'Current Plan',
                                current: true,
                            },
                            {
                                name: 'Ultimate',
                                price: '$25',
                                per: '/month',
                                storage: '50 GB Storage',
                                features: [
                                    'Unlimited media',
                                    'Advanced analytics',
                                    'Lifetime hosting',
                                    'Custom domain',
                                    'Priority support',
                                ],
                                buttonText: 'Upgrade',
                                current: false,
                            },
                        ].map((plan, idx) => (
                            <div
                                key={idx}
                                className={`relative p-6 rounded-lg border min-h-[320px] flex flex-col justify-between ${
                                    plan.current
                                        ? 'bg-yellow-50 border-yellow-400'
                                        : 'border-gray-300'
                                }`}
                            >
                                {/* Badge for Current Plan */}
                                {plan.current && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                                        Current
                                    </span>
                                )}

                                <div>
                                    <p className="text-lg font-semibold text-[#171717] font-serif">
                                        {plan.name}
                                    </p>
                                    <p className="text-2xl text-black font-bold mt-2">
                                        {plan.price}
                                        <span className="text-gray-500 text-base">
                                            {plan.per}
                                        </span>
                                    </p>
                                    <p className="mt-1 text-gray-600">
                                        {plan.storage}
                                    </p>
                                    <ul className="mt-4 space-y-2">
                                        {plan.features.map((feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center gap-2 text-gray-700"
                                            >
                                                ✅ {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Button */}
                                <button
                                    disabled={plan.current}
                                    className={`mt-6 w-full py-2 rounded font-semibold ${
                                        plan.current
                                            ? 'bg-white text-yellow-600 border border-yellow-400'
                                            : 'bg-yellow-500 text-white hover:bg-yellow-600'
                                    }`}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-center text-sm text-gray-500">
                        Payments secured by{' '}
                    </p>
                </>
            )}
        </div>
    )
}
