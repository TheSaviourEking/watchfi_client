import AddWatchPage from "../pages/adminPage/products/add/AddWatchPage";
import EditWatch from "../pages/adminPage/products/edit/EditWatchPage";
import ProductsPage from "../pages/adminPage/products/ProductsPage";

const adminRoute = [
    // {
    //     path: '/admin/dashboard',
    //     component: '',
    //     isProtected: true
    // },
    {
        path: 'products',
        component: ProductsPage,
        isProtected: true
    },
    {
        path: 'products/add',
        component: AddWatchPage,
        isProtected: true
    },
    {
        path: 'products/:id/edit',
        // path: 'products/edit/:id',
        component: EditWatch,
        isProtected: true
    },
    {
        path: '*',
        component: <div>Finished</div>,
        isProtected: true
    },
]

export default adminRoute;