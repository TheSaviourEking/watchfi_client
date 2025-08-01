import { X, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router"

const footerData = [
    {
        heading: 'Watches',
        data: [
            { text: "All Watches", href: "/collections" },
            { text: 'Top Picks', href: "#toppicks" },
            { text: 'New Releases', href: '/releases' },
            { text: 'For Men', href: '/for-men' },
            { text: 'For Women', href: 'for-women' },
        ],
    },
    {
        heading: 'Resources',
        data: [
            { text: "FAQs", href: "/faqs" },
            { text: 'Authenticity Guide', href: "/auth-guide" },
            { text: 'NFT ownership', href: '/nft-ownership' },
            { text: 'Support', href: '/support' },
            { text: 'Blockchain Basics', href: '/blockchain-basics' },
        ],
    },
    {
        heading: 'Company',
        data: [
            { text: "About WatchFi", href: "/about" },
            { text: 'Terms and Condition', href: "/terms-and-conditions" },
            { text: 'Privacy Policy', href: '/privacy-policy' },
            { text: 'Refund Policy', href: '/refund-policy' },
            { text: 'Contact us', href: '/contact' },
        ],
    },
];

const brandData = [
    { icon: Youtube, href: 'x' },
    { icon: X, href: 'x' },
    { icon: Linkedin, href: 'x' },
]

const Footer = () => {
    const CustomLink = ({ children, to }) => {
        return (
            <Link to={`/${to}`}>{children}</Link>
        )
    }

    return (
        <section className='text-white'>
            <div className="container py-12 lg:py-24 px-5">
                <div className="flex flex-col lg:flex-row">
                    <div className='flex-1 mb-5 lg:mb-0'>
                        <img src="/logo.svg" />
                        <div className='flex gap-2 text-gray-400 mt-5'>
                            {
                                brandData.map((data, idx) => {
                                    return (
                                        <a key={idx} href={data.href}>{<data.icon />}</a>
                                    )
                                })
                            }
                        </div>
                    </div>

                    {
                        footerData.map((fdata, idx) => {
                            const { heading, data } = fdata;
                            return (
                                <div key={idx} className='flex-1 mb-5 lg:mb-0'>
                                    <h2 className='mb-3 text-sm font-semibold leading-[150%] uppercase'>{heading}</h2>
                                    <div className="flex gap-2 flex-col text-gray-400">
                                        {
                                            data.map((data, index) => {
                                                const { text, href } = data;

                                                return (
                                                    <CustomLink key={index} to={`${href}`}>{text}</CustomLink>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="text-center mt-10 bg-[#1e1e1e] lg:py-4 lg:px-2 py-2 px-1 text-sm italic">
                &copy; {new Date().getFullYear()} WatchFi. All Rights Reserved
            </div>
        </section>
    )
}

export default Footer