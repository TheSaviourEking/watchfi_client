import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import React from 'react'

const PaymentSuccessFul = () => {
    return (
        <div className='p-6 flex flex-col max-w-lg mx-auto'>
            <h2 className='text-subText'>Payment Successful</h2>
            <p className='my-8'>Your payment for Royal Oak Offshore Selfwinding Chronograph is successful. You will receive an email with your shipping details.</p>
            <span className="my-8">
                Your tracking number is
                <Button variant={'ghost'}>
                    #129071724091740174
                    <span className='mr-2'>
                        <Copy />
                    </span>
                </Button>
            </span>
            <Button>
                Mint NFT
            </Button>
        </div>
    )
}

export default PaymentSuccessFul;