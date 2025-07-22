import { ChevronLeft, ChevronRight, ShoppingCart, AlertCircle } from 'lucide-react';
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

// Empty Cart Component
const EmptyCartState = ({ onContinueShopping }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-800/50 rounded-full p-6 mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h3>
        <p className="text-gray-400 text-center mb-8 max-w-md">
            Add some items to your cart to continue with checkout
        </p>
        <button
            onClick={onContinueShopping}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
            Continue Shopping
        </button>
    </div>
);

// Step Indicator Component
const StepIndicator = ({ currentStep, totalSteps }) => {
    const steps = [
        { number: 1, title: 'Checkout' },
        { number: 2, title: 'Review' },
        { number: 3, title: 'Payment' },
        { number: 4, title: 'Complete' }
    ];

    return (
        <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                    <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold",
                        {
                            "bg-blue-600 border-blue-600 text-white": currentStep >= step.number,
                            "border-gray-600 text-gray-400": currentStep < step.number
                        }
                    )}>
                        {step.number}
                    </div>
                    <span className={cn(
                        "ml-2 text-sm font-medium",
                        {
                            "text-white": currentStep >= step.number,
                            "text-gray-400": currentStep < step.number
                        }
                    )}>
                        {step.title}
                    </span>
                    {index < steps.length - 1 && (
                        <div className={cn(
                            "w-12 h-0.5 mx-4",
                            {
                                "bg-blue-600": currentStep > step.number,
                                "bg-gray-600": currentStep <= step.number
                            }
                        )} />
                    )}
                </div>
            ))}
        </div>
    );
};

// Loading Component
const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
);

// Error Boundary Component
const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 mb-6">
        <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <div>
                <p className="text-red-200">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
                    >
                        Try again
                    </button>
                )}
            </div>
        </div>
    </div>
);

export default function CheckoutPage() {
    const { addToCart, removeFromCart, cart, getTotalPrice } = useCartStore();
    const totalPrice = getTotalPrice();

    const {
        currentStep,
        setCurrentStep,
        validateStep,
        resetForm,
        isLoading,
        error
    } = useCheckout();

    const totalSteps = 4;
    const isCartEmpty = !cart || cart.length === 0;

    // If cart is empty, show empty state
    if (isCartEmpty && currentStep !== 4) {
        return (
            <section className='text-white'>
                <div className="min-h-screen py-24">
                    <div className="container max-w-4xl mx-auto">
                        <EmptyCartState
                            onContinueShopping={() => {
                                // Navigate to shop/products page
                                window.history.back();
                            }}
                        />
                    </div>
                </div>
            </section>
        );
    }

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(Math.min(currentStep + 1, totalSteps));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(Math.max(currentStep - 1, 1));
    };

    const handleSubmit = async () => {
        try {
            // Replace alert with proper success handling
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            setCurrentStep(4); // Go to success page
        } catch (error) {
            console.error('Order submission failed:', error);
            // Handle error state
        }
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset the form? All entered information will be lost.')) {
            resetForm();
        }
    };

    const renderStepContent = () => {
        if (isLoading) {
            return <LoadingSpinner />;
        }

        switch (currentStep) {
            case 1:
                return (
                    <div className="grid grid-cols-1 lg:grid-cols3 lg:grid-cols-2 gap-8">
                        <div className="lg:colspan-2 space-y-6">
                            <BillingForm />
                            <PaymentForm />
                        </div>
                        <div className="space-y-6">
                            <ProductDisplay
                                addToCart={addToCart}
                                removeFromCart={removeFromCart}
                                cart={cart}
                            />
                            <OrderSummary
                                currentStep={currentStep}
                                validateStep={validateStep}
                                handleNext={handleNext}
                                totalSteps={totalSteps}
                                cart={cart}
                                getTotalPrice={getTotalPrice}
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="max-w-4xl mx-auto space-y-8">
                        <BillingInfo handlePrevious={handlePrevious} />
                        <ProductDisplay cart={cart} />
                        <OrderSummary
                            currentStep={currentStep}
                            validateStep={validateStep}
                            handleNext={handleNext}
                            totalSteps={totalSteps}
                            cart={cart}
                            getTotalPrice={getTotalPrice}
                        />
                    </div>
                );
            case 3:
                return <PaymentStep cart={cart} totalPrice={totalPrice} handleNext={handleNext} />;
            case 4:
                return <PaymentSuccessFul />;
            default:
                return null;
        }
    };

    const renderStepHeader = () => {
        const headers = {
            1: "Checkout",
            2: "Order Summary",
            3: "Payment",
            4: "Order Complete"
        };
        return headers[currentStep] || "Checkout";
    };

    return (
        <section className='text-white'>
            <div className="min-h-screen py-24">
                <div className={cn("container mx-auto px-4", {
                    // 'max-w-9xl': currentStep === 1,
                    // 'max-w-4xl': currentStep === 2,
                    // 'max-w-3xl': currentStep === 3,
                    // 'max-w-2xl': currentStep === 4
                })}>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <h1 className='text-heading'>{renderStepHeader()}</h1>
                        {currentStep < 4 && (
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 bg-red-600/20 text-red-300 border border-red-600 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
                            >
                                Reset Form
                            </button>
                        )}
                    </div>

                    {/* Step Indicator */}
                    {currentStep < 4 && <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />}

                    {/* Error Message */}
                    {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}

                    {/* Step Content */}
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    {currentStep < 4 && (
                        <div className="mt-12 flex flex-col sm:flex-row justify-between gap-4">
                            {/* <button
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className={cn(
                                    "flex items-center justify-center px-6 py-3 rounded-lg transition-colors font-medium",
                                    {
                                        "bg-gray-700 text-white hover:bg-gray-600": currentStep > 1,
                                        "bg-gray-800 text-gray-500 cursor-not-allowed": currentStep === 1
                                    }
                                )}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous
                            </button> */}

                            {/* {currentStep < totalSteps - 1 ? (
                                <button
                                    onClick={handleNext}
                                    disabled={!validateStep(currentStep) || isLoading}
                                    className={cn(
                                        "flex items-center justify-center px-6 py-3 rounded-lg transition-colors font-medium",
                                        {
                                            "bg-blue-600 text-white hover:bg-blue-700": validateStep(currentStep) && !isLoading,
                                            "bg-gray-600 text-gray-400 cursor-not-allowed": !validateStep(currentStep) || isLoading
                                        }
                                    )}
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    ) : (
                                        <>
                                            Next
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className={cn(
                                        "px-8 py-3 rounded-lg transition-colors font-medium",
                                        {
                                            "bg-green-600 text-white hover:bg-green-700": !isLoading,
                                            "bg-gray-600 text-gray-400 cursor-not-allowed": isLoading
                                        }
                                    )}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        "Complete Order"
                                    )}
                                </button>
                            )} */}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}