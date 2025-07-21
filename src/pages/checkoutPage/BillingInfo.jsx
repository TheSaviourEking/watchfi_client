import { useCheckout } from '@/hooks/useCheckout';

const BillingInfo = () => {
    const { billingData } = useCheckout();
    const { name, phone, address, city, country } = billingData;

    return (
        < div className="border-y border-gray600 py-2 text-sm flex flex-col gap-4" >
            <h3 className="font-medium mb-2 text-subText">Billing Information</h3>
            <div className="text-gray-400 space-y-1">
                <span>{name}</span>{" "}-{" "}
                <span>{phone}</span>,{" "}
                <span>{address}</span>,{" "}
                <span>{city}</span>,{" "}
                <span>{country}</span>
            </div>

            <div className="mt-4">
                <button className='underline'>Edit</button>
            </div>
        </div >
    )
}

export default BillingInfo;