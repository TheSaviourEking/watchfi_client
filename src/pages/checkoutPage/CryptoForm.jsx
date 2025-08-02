// components/CryptoForm.jsx
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useCheckout } from '@/hooks/useCheckout'
import { formatCurrency } from '../../lib/formatters'
import api from '../../config/apiConfig'

// Lazy load Solana libraries when component mounts
let solanaLibs = null

const loadSolanaLibs = async () => {
    if (solanaLibs) return solanaLibs

    const [
        walletAdapter,
        walletAdapterUI,
        web3,
        splToken,
        axios
    ] = await Promise.all([
        import('@solana/wallet-adapter-react'),
        import('@solana/wallet-adapter-react-ui'),
        import('@solana/web3.js'),
        import('@solana/spl-token'),
        import('axios')
    ])

    solanaLibs = {
        useWallet: walletAdapter.useWallet,
        useConnection: walletAdapter.useConnection,
        WalletMultiButton: walletAdapterUI.WalletMultiButton,
        PublicKey: web3.PublicKey,
        Transaction: web3.Transaction,
        SystemProgram: web3.SystemProgram,
        LAMPORTS_PER_SOL: web3.LAMPORTS_PER_SOL,
        createTransferInstruction: splToken.createTransferInstruction,
        getAssociatedTokenAddress: splToken.getAssociatedTokenAddress,
        getAccount: splToken.getAccount,
        TOKEN_PROGRAM_ID: splToken.TOKEN_PROGRAM_ID,
        axios: axios.default
    }

    return solanaLibs
}

const CryptoForm = ({ cart, totalPrice, paymentMethod, setPaymentMethod, handleNext }) => {
    const [libs, setLibs] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Solana state
    const [connection, setConnection] = useState(null)
    const [wallet, setWallet] = useState({ publicKey: null, signTransaction: null })
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState('')
    const [userTokenAccounts, setUserTokenAccounts] = useState({ SOL: 0, USDC: 0 })
    const [prices, setPrices] = useState({ SOL: 0, USDC: 0 })

    const { billingData: { name, phone, address, city, country } } = useCheckout()

    // Load Solana libraries on component mount
    useEffect(() => {
        const initializeSolana = async () => {
            try {
                const loadedLibs = await loadSolanaLibs()
                setLibs(loadedLibs)

                // Initialize connection after libs are loaded
                const { useConnection, useWallet } = loadedLibs
                // Note: These hooks need to be called at component level
                // This is a simplified version - you might need to restructure

                setLoading(false)
            } catch (err) {
                console.error('Failed to load Solana libraries:', err)
                setError('Failed to load crypto payment system')
                setLoading(false)
            }
        }

        initializeSolana()
    }, [])

    // Fetch prices
    useEffect(() => {
        if (!libs) return

        const fetchPrices = async () => {
            try {
                const response = await libs.axios.get(
                    'https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin&vs_currencies=usd'
                )
                const data = response.data
                setPrices({ SOL: data.solana.usd, USDC: data['usd-coin'].usd })
            } catch (error) {
                console.error('Error fetching prices:', error)
                setPrices({ SOL: 100, USDC: 1 }) // Fallback prices
                setPaymentStatus('Using fallback crypto prices')
            }
        }

        fetchPrices()
    }, [libs])

    const calculateOrder = () => {
        const usdValue = totalPrice
        return {
            usdValue,
            solAmount: prices.SOL ? usdValue / prices.SOL : 0,
            usdcAmount: prices.USDC ? usdValue / prices.USDC : 0,
        }
    }

    const handlePayment = async () => {
        if (!wallet.publicKey || !wallet.signTransaction) {
            setPaymentStatus('Please connect your wallet.')
            return
        }

        if (!libs) {
            setPaymentStatus('Crypto libraries not loaded')
            return
        }

        const orderData = calculateOrder()
        const requiredBalance = paymentMethod === 'SOL' ? orderData.solAmount : orderData.usdcAmount
        const userBalance = userTokenAccounts[paymentMethod] || 0

        if (userBalance < requiredBalance) {
            setPaymentStatus(
                `Insufficient ${paymentMethod} balance. Required: ${requiredBalance.toFixed(6)}, Available: ${userBalance.toFixed(6)}`
            )
            return
        }

        setIsProcessing(true)
        setPaymentStatus('Sending transaction...')

        try {
            const BUSINESS_WALLET = new libs.PublicKey(import.meta.env.VITE_BUSINESS_WALLET_ADDRESS)
            const USDC_MINT = new libs.PublicKey(
                import.meta.env.VITE_SOLANA_NETWORK === 'devnet'
                    ? '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
                    : 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
            )

            // Build transaction
            let tx = new libs.Transaction()

            if (paymentMethod === 'SOL') {
                tx.add(
                    libs.SystemProgram.transfer({
                        fromPubkey: wallet.publicKey,
                        toPubkey: BUSINESS_WALLET,
                        lamports: Math.round(requiredBalance * libs.LAMPORTS_PER_SOL),
                    })
                )
            } else {
                const userATA = await libs.getAssociatedTokenAddress(USDC_MINT, wallet.publicKey)
                const businessATA = await libs.getAssociatedTokenAddress(USDC_MINT, BUSINESS_WALLET)
                tx.add(
                    libs.createTransferInstruction(
                        userATA,
                        businessATA,
                        wallet.publicKey,
                        Math.round(requiredBalance * 1_000_000) // 6 decimals
                    )
                )
            }

            // Get latest blockhash & sign
            tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
            tx.feePayer = wallet.publicKey
            const signed = await wallet.signTransaction(tx)

            // Send & confirm
            const txSig = await connection.sendRawTransaction(signed.serialize())
            await connection.confirmTransaction(txSig, 'confirmed')

            // Create booking
            const newBooking = await libs.axios.post(api.getUrl('bookings'), {
                customerId: wallet.publicKey.toBase58(),
                watchItems: cart,
                discount: 0,
                usdValue: orderData.usdValue,
                shipmentAddress: `${address}, ${city}, ${country}`,
                senderWallet: wallet.publicKey.toBase58(),
                receiverWallet: BUSINESS_WALLET.toBase58(),
                paymentType: paymentMethod.toUpperCase(),
                transactionHash: txSig,
                paymentStatus: 'PAID',
            })

            setPaymentStatus(`Payment successful! Signature: ${txSig}`)

            if (handleNext) {
                setTimeout(() => handleNext(4), 2000)
            }

        } catch (err) {
            console.error(err)
            setPaymentStatus(`Payment failed: ${err.message}`)
        } finally {
            setIsProcessing(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-near-black p-6">
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                    <div className="text-gray-400">Loading crypto payment system...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-near-black p-6">
                <div className="text-center py-8">
                    <div className="text-red-400 mb-4">{error}</div>
                    <Button onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    return <CryptoFormContent
        libs={libs}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        userTokenAccounts={userTokenAccounts}
        setUserTokenAccounts={setUserTokenAccounts}
        wallet={wallet}
        setWallet={setWallet}
        connection={connection}
        setConnection={setConnection}
        calculateOrder={calculateOrder}
        handlePayment={handlePayment}
        isProcessing={isProcessing}
        paymentStatus={paymentStatus}
        prices={prices}
    />
}

// Separate the actual form content to keep it clean
const CryptoFormContent = ({
    libs,
    paymentMethod,
    setPaymentMethod,
    userTokenAccounts,
    setUserTokenAccounts,
    wallet,
    setWallet,
    connection,
    setConnection,
    calculateOrder,
    handlePayment,
    isProcessing,
    paymentStatus,
    prices
}) => {
    const orderData = calculateOrder()

    // This is where you'd need to properly integrate the wallet hooks
    // For now, this is a simplified version
    useEffect(() => {
        // Initialize wallet connection here
        // You might need to restructure this to use proper React hooks
    }, [libs])

    const handleSubmit = (e) => {
        e.preventDefault()
        handlePayment()
    }

    return (
        <div className="bg-near-black p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">
                            Connect Wallet *
                        </label>
                        {libs?.WalletMultiButton && <libs.WalletMultiButton />}
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-2">
                            Select Token*
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value.toUpperCase())}
                            className="w-full bg-transparent border-b border-slate-600 py-2 px-3 text-white focus:border-white focus:outline-none"
                        >
                            {['SOL', 'USDC'].map(token => (
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
                    disabled={isProcessing || !wallet.publicKey}
                >
                    {isProcessing ? 'Processing...' : 'Buy Now'}
                </Button>
            </form>
        </div>
    )
}

export default CryptoForm