import { Marquee } from '@/components/ui/marquee'
import { cn } from '@/lib/utils';

const BrandsSection = () => {

    const items = [
        "Rolex", "Casio", "Philippe Patek", "Michael Kauss", "Frank Muller", "Cullinan"
    ];

    return (
        <section>
            <div className="containe">
                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">

                    <Marquee duration={20} className="py-4 max-w-full" pauseOnHover>
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="px-6 py-3 text-white rounded-full whitespace-nowrap mx-2 text-9xl"
                            >
                                {item}
                            </div>
                        ))}
                    </Marquee>

                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
                </div>
            </div>
        </section>
    )
}

export default BrandsSection;


const ReviewCard = ({
    img,
    name,
    username,
    body,
}) => {
    return (
        <figure
            className={cn(
                "relative h-full w-fit sm:w-36 cursor-pointer overflow-hidden rounded-xl border p-4",
                // light styles
                // "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                // dark styles
                "border-gray-50/[.1] bg-gray-50/[.10] hover:bg-gray-50/[.15]",
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    );
};