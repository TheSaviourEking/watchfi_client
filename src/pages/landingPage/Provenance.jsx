import HeroText from "../../components/HeroText";

const Provenance = () => {
    return (
        <section>
            <div className='container'>
                <div className="flex flex-col-reverse lg:flex-row w-full h-screen items-center gap-8">
                    <div className='lg:basis-8/12'>
                        <img
                            src={'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg'}
                            alt='text'
                            width={1550}
                            height={1550}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>

                    <div className='max-w-xl'>
                        <HeroText
                            classname="max-w-3xl"
                            header={'Certified Provenance'}
                            text="
                            Each watch is paired with a unique NFT containing ownership details, certification, and provenance.
                            "
                            cta={{
                                variant: 'ghost',
                                ctaText: "Learn More",
                                href: '/home'
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Provenance;