import { Button } from '@/components/ui/button'
import { Hexagon, LayoutDashboard, Library, Menu } from 'lucide-react'
import { Link } from 'react-router'

const Sidebar = () => {
    const sidebarMenu = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
        { name: "Inventory", icon: Library, path: "/admin/products" },
        { name: "Brands", icon: Hexagon, path: "/admin/brands" },
    ]
    return (
        <aside className='w-64 h-full p-4 border-r-2'>
            {
                sidebarMenu.map((item, index) => {
                    return (
                        <Button asChild key={index} variant="ghost" className="w-full justify-start mb-2">
                            <Link to={item.path} className="flex items-center gap-2">
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        </Button>
                    )
                })
            }
        </aside>
    )
}

export default Sidebar