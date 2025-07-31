import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import api from '../../../../config/apiConfig';

// Extended Watch type to include brand relation
export const WatchWithBrand = {
    id: String,
    primaryPhotoUrl: String,
    name: String,
    brand: {
        name: String,
        logoUrl: String,
    },
    referenceId: String,
    priceInCents: Number,
    isAvailable: Boolean,
    isFeatured: Boolean,
    isNew: Boolean,
    isPopular: Boolean,
    createdAt: Date,
};

// Action handlers component
function ActionCell({ watch }) {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEdit = () => {
        console.log('Editing watch:', watch.id);
        navigate(`/admin/products/edit/${watch.id}`);
    };

    const handleView = () => {
        navigate(`/admin/watches/${watch.id}`);
    };

    const handleDelete = async () => {
        const confirmDelete = confirm(`Are you sure you want to delete ${watch.name}?`);
        if (confirmDelete) {
            try {
                setIsDeleting(true);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/collections/${watch.id}`, {
                    method: 'DELETE',
                });

                // const response = await api.getUrl('')

                if (response.ok) {
                    window.location.reload(); // Refresh to mimic router.refresh()
                } else {
                    throw new Error('Failed to delete watch');
                }
            } catch (error) {
                console.error('Error deleting watch:', error);
                alert('Failed to delete watch. Please try again.');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleView} className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="cursor-pointer text-red-600"
                    disabled={isDeleting}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Price formatter
function formatPrice(priceInCents) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(priceInCents / 100);
}

// Boolean badge component
function BooleanBadge({ value, trueLabel, falseLabel }) {
    return (
        <Badge variant={value ? 'default' : 'secondary'}>
            {value ? trueLabel : falseLabel}
        </Badge>
    );
}

export const columns = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
            <div className="font-mono text-xs text-muted-foreground">
                {row.original.id.substring(0, 8)}...
            </div>
        ),
    },
    {
        accessorKey: 'primaryPhotoUrl',
        header: 'Photo',
        cell: ({ row }) => {
            const photoUrl = row.original.primaryPhotoUrl || '/placeholder-watch.png';
            return (
                <div className="relative w-12 h-12">
                    <img
                        src={photoUrl}
                        alt={row.original.name}
                        className="object-cover rounded-md w-full h-full"
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder-watch.png';
                        }}
                    />
                </div>
            );
        },
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
            <div className="font-medium">{row.original.name}</div>
        ),
    },
    {
        accessorKey: 'brand',
        header: 'Brand',
        cell: ({ row }) => {
            const brand = row.original.brand;
            const logoUrl = brand?.logoUrl || '/default-logo.png';
            const brandName = brand?.name || 'No Brand';

            return (
                <div className="flex gap-2 items-center">
                    <div className="relative w-6 h-6">
                        <img
                            src={logoUrl}
                            alt={brandName}
                            className="object-contain rounded-full w-full h-full"
                            onError={(e) => {
                                e.currentTarget.src = '/default-logo.png';
                            }}
                        />
                    </div>
                    <span className="font-medium">{brandName}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'referenceId',
        header: 'Reference ID',
        cell: ({ row }) => (
            <div className="font-mono text-sm">{row.original.referenceId}</div>
        ),
    },
    {
        accessorKey: 'priceInCents',
        header: 'Price',
        cell: ({ row }) => (
            <div className="font-semibold">{formatPrice(row.original.priceInCents)}</div>
        ),
    },
    {
        accessorKey: 'isAvailable',
        header: 'Status',
        cell: ({ row }) => (
            <BooleanBadge
                value={row.original.isAvailable}
                trueLabel="Available"
                falseLabel="Unavailable"
            />
        ),
    },
    {
        accessorKey: 'isFeatured',
        header: 'Featured',
        cell: ({ row }) => (
            <BooleanBadge
                value={row.original.isFeatured}
                trueLabel="Yes"
                falseLabel="No"
            />
        ),
    },
    {
        accessorKey: 'isNew',
        header: 'New',
        cell: ({ row }) => (
            <BooleanBadge
                value={row.original.isNew}
                trueLabel="New"
                falseLabel="Regular"
            />
        ),
    },
    {
        accessorKey: 'isPopular',
        header: 'Popular',
        cell: ({ row }) => (
            <BooleanBadge
                value={row.original.isPopular}
                trueLabel="Popular"
                falseLabel="Regular"
            />
        ),
    },
    {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {new Date(row.original.createdAt).toLocaleDateString()}
            </div>
        ),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ActionCell watch={row.original} />,
    },
];