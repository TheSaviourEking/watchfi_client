import { BrowserRouter, Route, Routes } from "react-router";
import collectionRoute from "./collection.route";
import homeRoute from "./home.route";
import { DashboardLayout, RootLayout } from "../layouts";
import RouteGuard from "./RouteGuard";
import adminRoute from "./admin.route";
import checkoutRoute from "./checkout.route";
import wishlistRoute from "./wishlist.route";
import cartRoute from "./cart.route";
import { ScrollToTop } from "../components/ScrollToTop";

const publicRoutes = [
    ...homeRoute,
    ...collectionRoute,
    ...checkoutRoute,
    ...wishlistRoute,
    ...cartRoute
]

const protectedRoutes = [
    ...adminRoute,
]

const renderRoutes = (routes, isProtected = false) => {
    return routes.map((item, index) => (
        <Route
            key={index}
            path={item.path}
            element={
                item.isProtected || isProtected ? (
                    <RouteGuard component={item.component} />
                ) : (
                    <item.component />

                )
            }
        />
    ))
}

const router = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<RootLayout />}>
                    {renderRoutes(publicRoutes)}
                </Route>

                {/* Dashboard Layout */}
                <Route path="/" element={<DashboardLayout />}>
                    {renderRoutes(protectedRoutes, true)}
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default router;