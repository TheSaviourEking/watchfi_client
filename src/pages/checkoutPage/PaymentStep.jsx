import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useCheckout } from '@/hooks/useCheckout'
import { CITIES, COUNTRIES, PRODUCT_DATA } from '@/lib/constants';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createTransferInstruction, getAssociatedTokenAddress, getAccount, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import axios from 'axios';
import { formatCurrency } from '../../lib/utils';

const serverUrl = `${import.meta.env.VITE_BACKEND_URL}`;

const PaymentStep = ({ cart, totalPrice }) => {
    const { connection } = useConnection();
    const { publicKey, signTransaction } = useWallet();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('SOL');
    const [userTokenAccounts, setUserTokenAccounts] = useState({ SOL: 0, USDC: 0 });
    const [prices, setPrices] = useState({ SOL: 0, USDC: 0 });

    const { billingData: { name, phone, address, city, country }, setBillingData } = useCheckout();

    const BUSINESS_WALLET = new PublicKey(import.meta.env.VITE_BUSINESS_WALLET_ADDRESS);
    const USDC_MINT = new PublicKey(
        import.meta.env.VITE_SOLANA_NETWORK === 'devnet'
            ? '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
            : 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    );

    useEffect(() => {
        const getUserBalances = async () => {
            if (!publicKey) return;
            try {
                const solBalance = await connection.getBalance(publicKey);
                let usdcBalance = 0;
                try {
                    const usdcTokenAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey);
                    const accountInfo = await getAccount(connection, usdcTokenAccount);
                    usdcBalance = Number(accountInfo.amount) / 1000000; // USDC has 6 decimals
                } catch (error) {
                    // User doesn't have USDC account
                }
                setUserTokenAccounts({ SOL: solBalance / LAMPORTS_PER_SOL, USDC: usdcBalance });
            } catch (error) {
                console.error('Error fetching balances:', error);
                setPaymentStatus('Failed to fetch wallet balances.');
            }
        };
        getUserBalances();
    }, [publicKey, connection]);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin&vs_currencies=usd');
                const data = await response.data;
                setPrices({ SOL: data.solana.usd, USDC: data['usd-coin'].usd });
            } catch (error) {
                console.error('Error fetching prices:', error);
                setPrices({ SOL: 100, USDC: 1 }); // Fallback prices
                setPaymentStatus('Failed to fetch price data. Using fallback prices.');
            }
        };
        fetchPrices();
    }, []);

    const calculateOrder = () => {
        const usdValue = totalPrice;
        return {
            usdValue,
            solAmount: prices.SOL ? usdValue / prices.SOL : 0,
            usdcAmount: prices.USDC ? usdValue / prices.USDC : 0,
        };
    };

    const handlePaymentppp = async () => {
        if (!publicKey) {
            setPaymentStatus('Please connect your wallet.');
            return;
        }

        const orderData = calculateOrder();
        const requiredBalance = paymentMethod === 'SOL' ? orderData.solAmount : orderData.usdcAmount;
        const userBalance = userTokenAccounts[paymentMethod] || 0;

        if (userBalance < requiredBalance) {
            setPaymentStatus(`Insufficient ${paymentMethod} balance. Required: ${requiredBalance.toFixed(6)}, Available: ${userBalance.toFixed(6)}`);
            // return;
        }

        setIsProcessing(true);
        setPaymentStatus('Creating booking...');

        try {
            // Note: You'll need to define these variables or get them from your checkout context
            // const customerId = // get from context or props
            // const cartItems = // get from context or props  
            // const shipmentAddress = // get from context or props

            const customerId = publicKey;

            // check if custormer exists
            // const datad = await axios.post(`${api.baseURL}/customers`, {
            //     walletAddress: publicKey.toBase58(),
            //     pseudonym: name,
            // });

            const data = await axios.post(`${api.getUrl('customers')}`, {
                walletAddress: publicKey.toBase58(),
                pseudonym: name,
            })
            console.log(data.data, 'RESPONSE')

            // Update customer wallet address
            // await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/customers/${customerId}/wallet`, {
            //     walletAddress: publicKey.toBase58(),
            //     pseudonym
            // });

            // Create booking
            // const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/bookings`, {
            //     customerId,
            //     watchItems: cart.map(c => ({
            //         id: c.id,
            //         quantity: c.quantity,
            //         price: Number(c.price),
            //     })),
            //     discount: 0,
            //     usdValue: orderData.usdValue,
            //     shipmentAddress: `${address}, ${city}, ${country}`,
            //     walletAddress: publicKey.toBase58(),
            //     receiverWallet: publicKey.toBase58(),
            //     senderWallet: publicKey.toBase58(),
            //     paymentType: paymentMethod.toUpperCase(),
            //     transactionHash: '99999r',
            //     discount: 0

            // });

            const response = await axios.post(`${api.getUrl('bookings')}`, {
                customerId,
                watchItems: cart.map(c => ({
                    id: c.id,
                    quantity: c.quantity,
                    price: Number(c.price),
                })),
                discount: 0,
                usdValue: orderData.usdValue,
                shipmentAddress: `${address}, ${city}, ${country}`,
                walletAddress: publicKey.toBase58(),
                receiverWallet: publicKey.toBase58(),
                senderWallet: publicKey.toBase58(),
                paymentType: paymentMethod.toUpperCase(),
                transactionHash: '99999r',
                discount: 0

            });

            // const { transaction: serializedTx, bookingId } = response.data;

            // Deserialize and sign transaction
            const transaction = Transaction.from(Buffer.from(serializedTx, 'base64'));

            if (paymentMethod === 'USDC') {
                const userUSDCAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey);
                const businessUSDCAccount = await getAssociatedTokenAddress(USDC_MINT, BUSINESS_WALLET);
                transaction.add(
                    createTransferInstruction(
                        userUSDCAccount,
                        businessUSDCAccount,
                        publicKey,
                        Math.round(orderData.usdcAmount * 1000000), // USDC has 6 decimals
                        [],
                        TOKEN_PROGRAM_ID
                    )
                );
            }

            const signedTx = await signTransaction(transaction);

            // Verify transaction
            setPaymentStatus('Confirming transaction...');
            // const verifyResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/bookings/verify`, {
            //     bookingId,
            //     signedTx: signedTx.serialize().toString('base64'),
            // });

            const verifyResponse = await axios.post(`${api.getUrl('verifyBookings')}`, {
                bookingId,
                signedTx: signedTx.serialize().toString('base64'),
            });

            setPaymentStatus(`Payment successful! Signature: ${verifyResponse.data.signature}`);
        } catch (error) {
            console.error('Payment failed:', error);
            setPaymentStatus(`Payment failed: ${error.response?.data?.error || error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePayment = async () => {
        if (!publicKey || !signTransaction) {
            setPaymentStatus('Please connect your wallet.');
            return;
        }

        const orderData = calculateOrder();
        const requiredBalance =
            paymentMethod === 'SOL' ? orderData.solAmount : orderData.usdcAmount;
        // paymentMethod === 'SOL' ? 2 : orderData.usdcAmount;

        const userBalance = userTokenAccounts[paymentMethod] || 0;

        if (userBalance < requiredBalance) {
            setPaymentStatus(
                `Insufficient ${paymentMethod} balance. Required: ${requiredBalance.toFixed(6)}, Available: ${userBalance.toFixed(6)}`
            );
            return;
        }

        const rentExempt = 5000;      // worst-case fee
        const maxSendable = Math.floor(userBalance * LAMPORTS_PER_SOL) - rentExempt;
        const sendLamports = Math.min(
            Math.round(requiredBalance * LAMPORTS_PER_SOL),
            maxSendable
        );

        if (sendLamports <= 0) {
            setPaymentStatus('Not enough SOL to cover transfer + fees.');
            return;
        }

        setIsProcessing(true);
        setPaymentStatus('Sending transaction...');

        try {
            // 1. Build the transfer instruction
            let tx = new Transaction();
            if (paymentMethod === 'SOL') {
                tx.add(
                    SystemProgram.transfer({
                        fromPubkey: publicKey,
                        toPubkey: BUSINESS_WALLET,
                        lamports: Math.round(requiredBalance * LAMPORTS_PER_SOL),
                    })
                );
            } else {
                const userATA = await getAssociatedTokenAddress(USDC_MINT, publicKey);
                const businessATA = await getAssociatedTokenAddress(USDC_MINT, BUSINESS_WALLET);
                tx.add(
                    createTransferInstruction(
                        userATA,
                        businessATA,
                        publicKey,
                        Math.round(requiredBalance * 1_000_000) // 6 decimals
                    )
                );
            }

            // 2. Get latest blockhash & sign
            tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            tx.feePayer = publicKey;
            const signed = await signTransaction(tx);

            // 3. Send & confirm
            const txSig = await connection.sendRawTransaction(signed.serialize());
            await connection.confirmTransaction(txSig, 'confirmed');

            console.log(txSig, 'ts sig');

            alert('We here on booking creation');

            // 4. Create booking with real tx signature
            const newBooking = await axios.post(`${serverUrl}/bookings`, {
                customerId: publicKey.toBase58(),
                watchItems: cart,
                discount: 0,
                usdValue: orderData.usdValue,
                shipmentAddress: `${address}, ${city}, ${country}`,
                senderWallet: publicKey.toBase58(),
                receiverWallet: BUSINESS_WALLET.toBase58(),
                paymentType: paymentMethod.toUpperCase(),
                transactionHash: txSig,
                paymentStatus: 'PAID',
            });

            setPaymentStatus(`Payment successful! Signature: ${txSig}`);
            return newBooking.data
        } catch (err) {
            console.error(err);
            setPaymentStatus(`Payment failed: ${err.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const orderData = calculateOrder();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 grid-flow-col">
            <div className='row-span-full'>
                <CryptoForm
                    orderData={orderData}
                    publicKey={publicKey}
                    paymentMethod={paymentMethod}
                    userTokenAccounts={userTokenAccounts}
                    isProcessing={isProcessing}
                    paymentStatus={paymentStatus}
                    setPaymentMethod={setPaymentMethod}
                    cart={cart}
                    prices={prices}
                    totalPrice={totalPrice}
                    handlePayment={handlePayment} // Pass the handlePayment function
                />
            </div>

            <div className="row-span-1">
                <OrderSummary
                    paymentMethod={paymentMethod}
                    handlePayment={handlePayment}
                    totalPrice={totalPrice}
                />
            </div>
        </div>
    )
}

export default PaymentStep;

const CryptoForm = ({
    orderData,
    publicKey,
    paymentMethod,
    userTokenAccounts,
    handlePayment, // Receive handlePayment as prop
    isProcessing,
    paymentStatus,
    setPaymentMethod,
    cart,
    prices,
    totalPrice
}) => {
    const { billingData, setBillingData } = useCheckout();

    const handlePaymentMethodChange = (value) => {
        console.log(value, 'value')
        setPaymentMethod(value.toUpperCase())
    }

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        handlePayment(); // Call the payment function
    }

    console.log(orderData, 'orderData', paymentMethod, 'Payment Method', userTokenAccounts, 'User Accounts', publicKey, 'Public key', prices, 'PRICES')

    return (
        <>
            <div className="bg-near-black p-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Connect Wallet *
                            </label>
                            <WalletMultiButton />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Select Token*
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                className="w-full bg-transparent border-b border-slate-600 py-2 px-3 text-white focus:border-white focus:outline-none"
                            >
                                {['SOL', 'USDC']?.map(token => (
                                    <option key={token} value={token}>
                                        {token}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Amount*
                            </label>
                            <div className="py-2 px-0 text-white">
                                {paymentMethod === 'SOL'
                                    ? formatCurrency(orderData.solAmount)
                                    : formatCurrency(orderData.usdcAmount)
                                } {paymentMethod}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                USD Value*
                            </label>
                            <div className="py-2 px-0 text-white">
                                {/* ${orderData.usdValue?.toFixed(2)} */}
                                ${formatCurrency(orderData.usdValue)}
                            </div>
                        </div>
                    </div>

                    {/* Display wallet balance */}
                    <div className="text-sm text-gray-300">
                        Wallet Balance: {formatCurrency(userTokenAccounts[paymentMethod], 3)} {paymentMethod}
                    </div>

                    {/* Display payment status */}
                    {paymentStatus && (
                        <div className={`text-sm p-2 rounded ${paymentStatus.includes('successful')
                            ? 'bg-green-900 text-green-300'
                            : paymentStatus.includes('failed') || paymentStatus.includes('Insufficient')
                                ? 'bg-red-900 text-red-300'
                                : 'bg-yellow-900 text-yellow-300'
                            }`}>
                            {paymentStatus}
                        </div>
                    )}

                    <Button
                        type='submit'
                        className='w-full'
                        disabled={isProcessing || !publicKey}
                    >
                        {isProcessing ? 'Processing...' : 'Buy Now'}
                    </Button>
                </form>
            </div>
        </>
    )
}

const OrderSummary = ({ paymentMethod, totalPrice }) => {
    const SUPPORTED_CARDS = ['visa', 'mastercard', 'amex'];

    return (
        <div className="text-white w-full">
            <div className="space-y-4 mb-6 bg-near-black p-6 ">
                <div className="flex justify-between gap-4">
                    <span className="text-gray-300">Original price</span> {"  "}
                    <span>${formatCurrency(totalPrice)}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-300">Savings</span>
                    {/* <span>0</span> */}
                    <span className='text-xs italic'>Discount Plans on the way. You not eligible yet!</span>
                </div>

                <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>${formatCurrency(totalPrice - 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}