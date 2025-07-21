import React from 'react';
import { CreditCard, Bitcoin } from 'lucide-react';
import { useCheckout } from '@/hooks/useCheckout';

export const PaymentForm = () => {
    const { paymentMethod, setPaymentMethod } = useCheckout();

    return (
        <div className="bg-near-black p-6">
            <h2 className="text-2xl font-light mb-6">Payment details</h2>

            <div className="space-y-4">
                {/* <div
                    className={`flex items-center p-4 cursor-pointer transition-colors ${paymentMethod === 'card'
                        ? 'border-white bg-neutral-950'
                        : 'border-gray-600 hover:border-gray-500'
                        }`}
                    onClick={() => setPaymentMethod('card')}
                >
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${paymentMethod === 'card' ? 'bg-white' : 'border-gray-500'
                        }`} />
                    <CreditCard className="w-5 h-5 mr-3" />
                    <span>Online with bank card</span>
                </div> */}

                <div
                    className={`flex items-center p-4 cursor-pointer transition-colors ${paymentMethod === 'crypto'
                        ? 'border-white bg-neutral-950'
                        : 'border-gray-600 hover:border-gray-500'
                        }`}
                    onClick={() => setPaymentMethod('crypto')}
                >
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${paymentMethod === 'crypto' ? 'bg-white' : 'border-gray-500'
                        }`} />
                    <Bitcoin className="w-5 h-5 mr-3" />
                    <div>
                        <div>Pay with cryptocurrency</div>
                        <div className="text-sm text-gray-400">
                            You can pay with USDC, USDT and other crypto on solana
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};