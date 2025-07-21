import { cn } from '@/lib/utils';
import { Minus } from 'lucide-react';
import useCartStore from '../../store/cart.store';
import { Plus } from 'lucide-react';
import { Carousel } from '../../components/ui/apple-cards-carousel';

export const ProductDisplay = ({ classname = '', cart = [], addToCart = null, removeFromCart = null }) => {
    // const { addToCart, removeFromCart } = useCartStore();

    const slides = cart.map((item, index) => {
        return (
            <div key={index} className={cn("w-ful border border-neutral-900 p-6 text-white flex flex-col items-center", classname)}>
                <div className="text-sm mb4">
                    {item.name}
                </div>
                <div className="text-sm mb4">
                    Ref:{' '}{item.referenceCode}
                </div>

                <div className="w-64 h-64 rounded-lg mb6 flex items-center justify-center">
                    {/* <div className="w-48 h-48 bg-gray-700 rounded-full flex items-center justify-center"> */}
                    {/* <div className="text-6xl">⌚</div> */}
                    <img className='w-48 h-48' src={item.primaryPhotoUrl} alt="" />
                    {/* </div> */}
                </div>

                <div className='flex w-full items-center justify-between'>
                    <span>Quantity: {item.quantity}</span>

                    {
                        addToCart && removeFromCart && (
                            <div className="flex gap-1">
                                <button onClick={() => addToCart(item)}><Plus /></button>
                                <button onClick={() => removeFromCart(item)}><Minus /></button>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    })
    return (
        <>
            {/* <div className='flex flex-wrap scroll overflow-y-scroll gap-2 py-2 h-96 w-full bg-near-black justifybetween justify-center items-center'>
                {
                    cart && cart.length > 0 && cart.map((item, index) => {
                        return (
                            <div key={index} className={cn("w-ful border border-neutral-900 p-6 text-white flex flex-col items-center", classname)}>
                                <div className="text-sm mb4">
                                    {item.name}
                                </div>
                                <div className="text-sm mb4">
                                    Ref:{' '}{item.referenceCode}
                                </div>

                                <div className="w-64 h-64 rounded-lg mb6 flex items-center justify-center">
                                    <img className='w-48 h-48' src={item.primaryPhotoUrl} alt="" />
                                </div>

                                <div className='flex w-full items-center justify-between'>
                                    <span>Quantity: {item.quantity}</span>

                                    {
                                        addToCart && removeFromCart && (
                                            <div className="flex gap-1">
                                                <button onClick={() => addToCart(item)}><Plus /></button>
                                                <button onClick={() => removeFromCart(item)}><Minus /></button>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div> */}

            <div className="bg-near-blac">
                <Carousel items={slides} className='md:pt-2 md:pb-4' />
            </div>
        </>
    );
};