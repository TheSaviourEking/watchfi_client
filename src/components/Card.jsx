import { motion } from 'motion/react'

const Card = ({ data }) => {
    console.log(data, 'DATA IN COMPONENT')
    const { name, price, referenceCode, primaryPhotoUrl } = data;
    // return (
    //     <motion.button
    //         className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden md:h-[40rem] md:w-96"
    //     >
    //         <div className="relative bg-near-black z-10 h-full w-full flex-1">
    //             <img
    //                 src={data.primaryPhotoUrl}
    //                 alt={data.title}
    //                 className="absolute inset-0 z-10 object-cover"
    //             />
    //         </div>

    //         <div className="relative z-40 py-2  flex-shrink-0">
    //             <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
    //             <div className="relative z-40 py-4 px-2">
    //                 <motion.p
    //                     layoutId={layout ? `category-${data.category}` : undefined}
    //                     className="text-left text-sm font-medium text-white md:text-base"
    //                 >
    //                     {data.category}
    //                 </motion.p>
    //                 <motion.p
    //                     layoutId={layout ? `title-${data.title}` : undefined}
    //                     className="mt-2 max-w-xs text-left text-xl [text-wrap:balance] text-white md:text-xl"
    //                 >
    //                     {data.title}
    //                 </motion.p>
    //             </div>
    //         </div>
    //     </motion.button>
    // )

    return (
        <div className=''>
            <div className="aspect-square w-full">
                <img src={primaryPhotoUrl} alt={name} style={{ aspectRatio: '281 / 341', width: '100%' }} className='w-full h-full' />
            </div>
            <div className='grid gap-2 p-2'>
                <p>{name}</p>
                <span className='text-slate-50 text-sm'>{referenceCode}</span>
                <span>${price}</span>
            </div>
        </div>
    )
}

export default Card;