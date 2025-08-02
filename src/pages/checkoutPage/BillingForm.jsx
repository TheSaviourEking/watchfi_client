import { useState, useEffect } from 'react';
import { useCheckout } from '@/hooks/useCheckout';
import { cn } from '../../lib/utils';
import BillingInfo from './BillingInfo';

export const BillingForm = ({ className = "" }) => {
    const { billingData, setBillingData } = useCheckout();

    // State for geo data and loading
    const [geoData, setGeoData] = useState({
        countries: [],
        cities: [],
        loading: true,
        error: null
    });

    // Load the geo library when component mounts
    useEffect(() => {
        const loadGeoData = async () => {
            try {
                const { Country } = await import('country-state-city');
                const countries = Country.getAllCountries();

                setGeoData(prev => ({
                    ...prev,
                    countries,
                    loading: false
                }));
            } catch (error) {
                console.error('Failed to load geo data:', error);
                setGeoData(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Failed to load location data'
                }));
            }
        };

        loadGeoData();
    }, []);

    // Load cities when country changes
    useEffect(() => {
        const loadCities = async () => {
            if (!billingData.country) {
                setGeoData(prev => ({ ...prev, cities: [] }));
                return;
            }

            try {
                const { City } = await import('country-state-city');
                const cities = City.getCitiesOfCountry(billingData.country);

                setGeoData(prev => ({
                    ...prev,
                    cities
                }));
            } catch (error) {
                console.error('Failed to load cities:', error);
                setGeoData(prev => ({
                    ...prev,
                    cities: []
                }));
            }
        };

        loadCities();
    }, [billingData.country]);

    const handleInputChange = (field, value) => {
        setBillingData({ [field]: value });

        // Reset city when country changes
        if (field === 'country') {
            setBillingData({ city: '' });
        }
    };

    if (geoData.loading) {
        return (
            <div className={cn("bg-near-black p-6", className)}>
                <h2 className="text-2xl font-light mb-6">Billing address</h2>
                <div className="flex items-center justify-center py-8">
                    <div className="text-gray-400">Loading location data...</div>
                </div>
            </div>
        );
    }

    if (geoData.error) {
        return (
            <div className={cn("bg-near-black p-6", className)}>
                <h2 className="text-2xl font-light mb-6">Billing address</h2>
                <div className="flex items-center justify-center py-8">
                    <div className="text-red-400">{geoData.error}</div>
                </div>
            </div>
        );
    }

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
                            className="w-fit w-24 bg-transparent border-b border-r border-gray-600 py-2 px-3 text-white focus:border-white focus:outline-none"
                        >
                            <option value="">Select</option>
                            {geoData.countries.map(country => (
                                <option key={country.isoCode} value={country.isoCode}>
                                    {country.flag} +{country.phonecode
                                        ?.replace(/^\+/, '')
                                        ?.split(' and ')[0]}
                                </option>
                            ))}
                        </select>
                        <input
                            type="tel"
                            value={billingData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="123 456 7890"
                            className="flex-1 border-l px-2 bg-transparent border-b border-gray-600 py-2 px-0 text-white placeholder-gray-500 focus:border-white focus:outline-none"
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
                            <option value="">Select country</option>
                            {geoData.countries.map(country => (
                                <option key={country.isoCode} value={country.isoCode}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-2">
                            City*
                        </label>
                        <select
                            value={billingData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            disabled={!billingData.country}
                            className="w-full bg-transparent border-b border-slate-600 py-2 px-3 text-white focus:border-white focus:outline-none disabled:opacity-50"
                        >
                            <option value="">
                                {billingData.country ? 'Select city' : 'Select country first'}
                            </option>
                            {geoData.cities.map((city, index) => (
                                <option key={index} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};