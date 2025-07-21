import { useCheckout } from '@/hooks/useCheckout';
import { COUNTRIES, CITIES } from '@/lib/constants';
import { cn } from '../../lib/utils';
import { Country, State, City } from 'country-state-city';
import BillingInfo from './BillingInfo';

export const BillingForm = ({ className = "" }) => {
    const { billingData, setBillingData } = useCheckout();

    const handleInputChange = (field, value) => {
        setBillingData({ [field]: value });
    };

    return (
        <div className={cn("bg-near-black p-6", className)}>
            <h2 className="text-2xl font-light mb-6">Billing address</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-300 mb-2">
                        Name (Pseudo name preferably)*
                    </label>
                    <input
                        type="text"
                        value={billingData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter name"
                        className="w-full bg-transparent border-b border-gray-600 py-2 px-0 text-white placeholder-gray-500 focus:border-white focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-300 mb-2">
                        Phone Number*
                    </label>
                    <div className="flex">
                        <select
                            value={billingData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            className="wfit w-24 bg-transparent border-b border-r border-gray-600 py-2 px-3 text-white focus:border-white focus:outline-none"
                        >
                            {
                                Country.getAllCountries().map(country => (
                                    <option key={country.isoCode} value={country.isoCode}>
                                        {country.flag} +{country.phonecode
                                            .replace(/^\+/, '')
                                            .split(' and ')[0]}
                                    </option>
                                ))
                            }
                        </select>
                        <input
                            type="tel"
                            value={billingData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="123 456 7890"
                            className="flex-1 border-l px-2 bg-transparent border-b border-gray-600 py-2 px0 text-white placeholder-gray-500 focus:border-white focus:outline-none"
                        />

                    </div>
                    
                </div>

                <div>
                    <label className="block text-sm text-gray-300 mb-2">
                        Your Address*
                    </label>
                    <input
                        type="text"
                        value={billingData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter here your address"
                        className="w-full bg-transparent border-b border-gray-600 py-2 px-0 text-white placeholder-gray-500 focus:border-white focus:outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">
                            Country*
                        </label>
                        <select
                            value={billingData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            className="w-full bg-transparent border-b border-slate-600 py-2 px-3 text-white focus:border-white focus:outline-none"
                        >
                            {
                                Country.getAllCountries().map(country => (
                                    <option key={country.isoCode} value={country.isoCode}>
                                        {country.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-2">
                            City*
                        </label>
                        <select
                            value={billingData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="w-full bg-transparent border-b border-slate-600 py-2 px-3 text-white focus:border-white focus:outline-none"
                        >
                            <option value="">Select city</option>
                            {/* {CITIES[billingData.country]?.map(city => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))} */}

                            {
                                City.getCitiesOfCountry(billingData.country).map((city, index) => (
                                    <option key={index} value={city.name}>
                                        {city.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};