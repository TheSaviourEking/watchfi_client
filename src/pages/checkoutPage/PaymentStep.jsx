import { useState, useEffect, lazy, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { useCheckout } from '@/hooks/useCheckout'
import { formatCurrency } from '../../lib/formatters'
import api from '../../config/apiConfig'

// Lazy load the heavy crypto components
const CryptoForm = lazy(() => import('./CryptoForm'))

const PaymentStep = ({ cart, totalPrice, handleNext = null }) => {
    const [paymentMethod, setPaymentMethod] = useState('SOL')
    const [showCrypto, setShowCrypto] = useState(false)
    
    const { billingData: { name, phone, address, city, country } } = useCheckout()

    // Only load crypto components when user chooses crypto payment
    const handleCryptoPayment = () => {
        setShowCrypto(true)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 grid-flow-col">
            <div className='row-span-full'>
                {!showCrypto ? (
                    <PaymentMethodSelector 
                        onCryptoSelect={handleCryptoPayment}
                        totalPrice={totalPrice}
                    />
                ) : (
                    <Suspense fallback={<CryptoLoadingFallback />}>
                        <CryptoForm
                            cart={cart}
                            totalPrice={totalPrice}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            handleNext={handleNext}
                        />
                    </Suspense>
                )}
            </div>

            <div className="row-span-1">
                <OrderSummary
                    paymentMethod={paymentMethod}
                    totalPrice={totalPrice}
                />
            </div>
        </div>
    )
}

// Light component for payment method selection
const PaymentMethodSelector = ({ onCryptoSelect, totalPrice }) => {
    return (
        <div className="bg-near-black p-6">
            <h3 className="text-xl font-light mb-6">Choose Payment Method</h3>
            
            <div className="space-y-4">
                <button
                    onClick={onCryptoSelect}
                    className="w-full p-4 border border-gray-600 hover:border-white transition-colors text-left"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-white font-medium">Cryptocurrency</h4>
                            <p className="text-gray-400 text-sm">Pay with SOL or USDC</p>
                        </div>
                        <div className="text-white">
                            {formatCurrency(totalPrice)}
                        </div>
                    </div>
                </button>
                
                <button
                    disabled
                    className="w-full p-4 border border-gray-600 opacity-50 cursor-not-allowed text-left"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-gray-400 font-medium">Credit Card</h4>
                            <p className="text-gray-500 text-sm">Coming soon</p>
                        </div>
                        <div className="text-gray-400">
                            {formatCurrency(totalPrice)}
                        </div>
                    </div>
                </button>
            </div>
        </div>
    )
}

// Loading fallback for crypto components
const CryptoLoadingFallback = () => (
    <div className="bg-near-black p-6">
        <div className="animate-pulse">
            <div className="h-6 bg-gray-700 mb-4 w-1/3"></div>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 bg-gray-700"></div>
                    <div className="h-12 bg-gray-700"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 bg-gray-700"></div>
                    <div className="h-12 bg-gray-700"></div>
                </div>
                <div className="h-12 bg-gray-700 w-full"></div>
            </div>
        </div>
        <div className="text-center text-gray-400 mt-4">
            Loading crypto payment options...
        </div>
    </div>
)

const OrderSummary = ({ paymentMethod, totalPrice }) => {
    return (
        <div className="text-white w-full">
            <div className="space-y-4 mb-6 bg-near-black p-6">
                <div className="flex justify-between gap-4">
                    <span className="text-gray-300">Original price</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-300">Savings</span>
                    <span className='text-xs italic'>Discount Plans on the way. You not eligible yet!</span>
                </div>

                <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>{formatCurrency(totalPrice)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentStep