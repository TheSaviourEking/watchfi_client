import { useCheckout } from '@/hooks/useCheckout';
import { button } from 'motion/react-client';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router';

export const OrderSummary = ({ cart = [], getTotalPrice = () => { }, currentStep = 0, totalSteps = 0, handleNext, validateStep }) => {
    // const { billingData, paymentMethod } = useCheckout();

    return (
        <div className="bg-nearblack p-6 text-white">
            <h2 className="text-2xl font-light mb-6">Order summary</h2>

            {/* Order Review */}
            {/* <div className="border-t border-gray-600 pt-4 text-sm">
                <h3 className="font-medium mb-2">Order Review</h3>
                <div className="text-gray-400 space-y-1">
                    <div>Name: {billingData.name}</div>
                    <div>Phone: {billingData.phone}</div>
                    <div>Address: {billingData.address}</div>
                    <div>Location: {billingData.city}, {billingData.country}</div>
                    <div>Payment: {paymentMethod === 'card' ? 'Bank Card' : 'Cryptocurrency'}</div>
                </div>
            </div> */}

            {/* <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                    <span className="text-gray-300">Original price</span>
                    <span>${PRODUCT_DATA.price.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-300">Savings</span>
                    <span>0</span>
                </div>

                <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>${PRODUCT_DATA.price.toLocaleString()}</span>
                    </div>
                </div>
            </div> */}

            {
                cart && cart.length > 0 && (
                    <table className="w-full mb-6 text-left">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="pb-2">Item</th>
                                <th className="pb-2">Price</th>
                                <th className="pb-2">Savings</th>
                                <th className="pb-2">Total</th>
                            </tr>
                        </thead>
                        {cart.map((item, index) => {
                            return (
                                // <div className="space-y-4 mb-6 flex items-center justify-between">
                                //     <div className="flex justify-between gap-2">
                                //         <span className="text-gray-300">Original price</span>
                                //         <span>${PRODUCT_DATA.price.toLocaleString()}</span>
                                //     </div>

                                //     <div className="flex justify-between">
                                //         <span className="text-gray-300">Savings</span>
                                //         <span>0</span>
                                //     </div>

                                //     <div className="border-l border-gray-600 pt-4">
                                //         <div className="flex justify-between font-medium text-lg">
                                //             <span>Total</span>
                                //             <span>${PRODUCT_DATA.price.toLocaleString()}</span>
                                //         </div>
                                //     </div>
                                // </div>

                                // <table className="w-full mb-6 text-left">
                                // <thead>
                                //     <tr className="border-b border-gray-700">
                                //         <th className="pb-2">Item</th>
                                //         <th className="pb-2">Price</th>
                                //         <th className="pb-2">Savings</th>
                                //         <th className="pb-2">Total</th>
                                //     </tr>
                                // </thead>

                                <tbody key={index}>
                                    {/* Example Row: Product */}
                                    <tr className="border-b border-gray-800">
                                        <td className="py-4 text-gray-300">{item.name} <span className='text-xs bg-neutral-800 rounded-sm p-2 px-4'>x {item.quantity}</span></td>
                                        <td className="py-4">${item.price}</td>
                                        <td className="py-4">$0</td>
                                        <td className="py-4 font-medium">${item.totalPrice}</td>
                                    </tr>

                                    {/* Optional: Add more rows here if needed */}
                                    {/* e.g. Discounts, taxes, etc. */}
                                </tbody>
                                // </table>
                            )
                        })}

                    </table>
                )
            }

            <div className="borde border-gray-600 pt-4">
                <div className="flex justify-between font-medium text-lg">
                    <span>Total Due Payment:</span>
                    <span>${getTotalPrice()}</span>
                </div>
            </div>

            <div className="flex w-full gap-2 mt-3">
                {currentStep === 2 && (
                    <Link to={'/collectons'} className="flex-1 items-center flex justify-center">
                        {/* <Button
                        variant={'ghost'}
                        className="flex-1"
                    > */}
                        Return to Shopping
                        {/* </Button> */}
                    </Link>
                )}

                {currentStep < totalSteps && (
                    <Button
                        onClick={handleNext}
                        disabled={!validateStep(currentStep)}
                        className="flex-1 items-center justify-center px-6 py-3 "
                    // className="flex-1 flex items-center justify-center px-6 py-3 bg-white text-white  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    // className="flex-1 flex items-center justify-center px-6 py-3 bg-white text-white  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    >
                        CONTINUE
                    </Button>
                )}
            </div>


            {/* Order Review */}
            {/* <div className="border-t border-gray-600 pt-4 text-sm">
                <h3 className="font-medium mb-2">Order Review</h3>
                <div className="text-gray-400 space-y-1">
                    <div>Name: {billingData.name}</div>
                    <div>Phone: {billingData.phone}</div>
                    <div>Address: {billingData.address}</div>
                    <div>Location: {billingData.city}, {billingData.country}</div>
                    <div>Payment: {paymentMethod === 'card' ? 'Bank Card' : 'Cryptocurrency'}</div>
                </div>
            </div> */}
        </div >
    );
};