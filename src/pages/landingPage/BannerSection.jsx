const BannerSection = () => {
    return (
        <section>
            <div className="overflow-hidden lg:h-screen">
                <img
                    src={'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg'}
                    width={1920}
                    height={1080}
                    alt='image'
                    className='wscreen object-center object-contain'
                />
            </div>
        </section>
    )
}

export default BannerSection