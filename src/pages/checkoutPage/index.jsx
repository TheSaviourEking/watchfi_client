import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCheckout } from '@/hooks/useCheckout';
import { cn } from '@/lib/utils';
import { OrderSummary } from './OrderSummary';
import { ProductDisplay } from './ProductDisplay';
import { BillingForm } from './BillingForm';
import { PaymentForm } from './PaymentForm';
import PaymentStep from './PaymentStep';
import PaymentSuccessFul from './PaymentSuccessful';
import useCartStore from '../../store/cart.store';
import BillingInfo from './BillingInfo';

export default function CheckoutPage() {
    const { addToCart, removeFromCart, cart, getTotalPrice } = useCartStore();
    const totalPrice = getTotalPrice()

    const {
        currentStep,
        setCurrentStep,
        validateStep,
        resetForm
    } = useCheckout();

    const totalSteps = 4;

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(Math.min(currentStep + 1, totalSteps));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(Math.max(currentStep - 1, 1));
    };

    const handleSubmit = () => {
        alert('Order submitted successfully!');
        resetForm();
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows3 lg:auto-rows-minmax100-auto gap-8 lg:grid-flow-col">
                            <div className='grid grid-cols-1 lg:row-span2 gap-5'>
                                <BillingForm className="max-h-fit h-fit" />
                                <PaymentForm />
                            </div>
                            <div className="grid grid-cols-1 lg:row-span-full gap-5">
                                <ProductDisplay addToCart={addToCart} removeFromCart={removeFromCart} cart={cart} classname="row-span-2" />
                                <OrderSummary currentStep={currentStep} validateStep={validateStep} handleNext={handleNext} totalSteps={totalSteps} cart={cart} getTotalPrice={getTotalPrice} />
                            </div>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className='max- mx-auto'>
                            <BillingInfo />
                            <ProductDisplay cart={cart} />
                            <OrderSummary currentStep={currentStep} validateStep={validateStep} handleNext={handleNext} totalSteps={totalSteps} cart={cart} getTotalPrice={getTotalPrice} />
                        </div>
                    </>
                );
            case 3:
                return (
                    <PaymentStep cart={cart} totalPrice={totalPrice} />
                );
            case 4:
                return (
                    <PaymentSuccessFul />
                )

            default:
                return null;
        }
    };

    const renderStepHeader = () => {
        switch (currentStep) {
            case 1:
                return (
                    "Checkout"
                );

            case 2:
                return (
                    "Order Summary"
                )

            case 3:
                return (
                    "Payment"
                )
        }
    }

    return (
        <section>
            <div className="min-h-screen py-24">
                <div className={cn("container", {
                    'max-w-5xl': currentStep === 2
                })}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className='text-heading'>{renderStepHeader()} </h2>
                        <button
                            onClick={resetForm}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Reset Form
                        </button>
                    </div>

                    {/* <StepIndicator currentStep={currentStep} totalSteps={totalSteps} /> */}

                    {renderStepContent()}

                    {/* <div className={cn(`mt-8 flex justify-between`, {
                        'justify-end': currentStep === 1
                    })}>
                        {
                            currentStep !== 1 && (
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentStep === 1}
                                    className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Previous
                                </button>
                            )
                        }

                        {currentStep < totalSteps ? (
                            <button
                                onClick={handleNext}
                                disabled={!validateStep(currentStep)}
                                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                CONTINUE
                            </button>
                        )}
                    </div> */}
                </div>
            </div>
        </section>
    );
}