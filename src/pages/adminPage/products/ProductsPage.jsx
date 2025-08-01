import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import api from '../../../config/apiConfig';
import axios from 'axios';
import { ErrorBoundary } from '../../../layouts/ErrorBoundary';

const ProductsPage = () => {
    const [watches, setWatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // const data = await axios.post(`${api.getUrl('customers')}`, {
    //             walletAddress: publicKey.toBase58(),
    //             pseudonym: name,
    //         })
    //         console.log(data.data, 'RESPONSE')

    useEffect(() => {

        const fetchWatches = async () => {
            try {
                // const response = await fetch('/api/v1/collections');
                console.log(api.getUrl('collections'))
                const response = await axios.get(api.getUrl('collections'));
                if (response.status !== 200) {
                    throw new Error('Failed to fetch watches');
                }
                console.log(response)
                setWatches(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchWatches();
    }, []);

    if (loading) return <div className="container mx-auto py-10">Loading...</div>;
    if (error) return <div className="container mx-auto py-10">Error: {error}</div>;

    return (
        <div className="container mx-auto py-10">
            <ErrorBoundary>
                <div className="flex items-center justify-end">
                    <Button>
                        <Link to="/admin/products/add">Add Watch</Link>
                    </Button>
                </div>

                <div className="mt-10">
                    <DataTable columns={columns} data={watches.data} />
                </div>
            </ErrorBoundary>
        </div>
    );
};

export default ProductsPage;