import CollectionDetailPage from "../pages/collectionDetail";
import CollectionsPage from "../pages/collectionPage/CollectionsPage";

const routes = [
    {
        path: '/collections',
        component: CollectionsPage
    },
    {
        path: '/collections/new-releases',
        component: CollectionsPage
    },
    {
        path: '/collections/:id',
        component: CollectionDetailPage
    },
    {
        path: '/collections/*',
        component: CollectionDetailPage
    }
]

export default routes;

{/* <Route path="/collections/*" element={<CollectionsPage />} /> */ }