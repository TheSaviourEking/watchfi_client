import { useState, useEffect } from "react";
import { Card, Carousel } from "../../components/ui/apple-cards-carousel";
import api from "../../config/apiConfig";
import { Link } from "react-router";

const WatchDetails = ({ specifications, photos }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        (
            async () => {
                try {
                    const req = await fetch(api.getUrl('collections'));
                    const response = await req.json();

                    if (req.ok) {
                        const { data, pagination, success } = response;
                        setData(data)
                        // console.log(data, 'RESPONSE', success);
                    } else {
                        setData([]);
                        console.error('Network response was not ok', response);
                    }
                } catch (error) {
                    console.error('Fetch error:', error);
                }
            }
        )();
    }, []);

    // const slides = slideImages.map((image, index) => (
    //     // <div className="relative z-10 flex h-80 w-56 flex-col items-start justify-end overflow-hidden md:h-[40rem] md:w-96 bg-neutral900 bg-red-500" >
    //     <div className="relative z-10 flex h-40 w-56 flex-col items-start justify-end overflow-hidden md:h-[20rem] md:w-96" >
    //         {/* <div key={index} className="relative z-40 py-4"> */}
    //         {image}
    //         {/* </div> */}
    //     </div >
    // ))

    const slides = photos.map(({ photoUrl, id, createdAt }, index) => (
        <div key={id ? id : index} className="relative z-10 flex h-40 w-56 flex-col items-start justify-end overflow-hidden md:h-[20rem] md:w-96" >
            <img src={photoUrl} alt={createdAt} className="h-full w-full object-cover" />
        </div >
    ))

    const recommendationData = data.map((data, index) => (
        <Card key={index} card={data} index={index} />
    ));


    return (
        <section>
            {/* <Carousel controls={false} data={photos} /> */}
            {/* <Carousel items={slides}  /> */}
            <div className="container mx-auto relative p-0">
                <div className="relative left1/2 left0 -ml[50vw] w-[90vw] bg-blue500 text-white p-6 pl-0">
                    <Carousel items={slides} />
                    {/* <Carousel visibleSlides={5}>
                        {slides}
                    </Carousel> */}
                </div>
            </div>

            <div className="container">
                <h2 className="mb-10 text-heading">SPECIFICATIONS</h2>

                {specifications && Array.isArray(specifications) && specifications.length > 0 ? (
                    specifications.map(({ heading, description, specificationPoints }, index) => (
                        <div key={index} className="mb-6">
                            <h3 className="text-subText mb-2">{heading}</h3>
                            <div className="mt-4">
                                <p className="">
                                    {description}
                                </p>
                                {specificationPoints && specificationPoints.length > 0 ? (
                                    specificationPoints.map(({ label, value }, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <span className="">{label}</span>
                                            {'-'}
                                            <span>{value}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No specifications available.</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No specifications found.</p>
                )}
            </div>

            {/* <div className="container mt-10">
                <h2 className="text-heading max-w-md">Others you might like</h2>
                <Carousel controls={false} />
                <div className="containe mx-auto relative p-0">
                    <div className="relative left1/2 left0 -ml[50vw] w-[90vw] bg-blue500 text-white p-6 pl-0">

                        <Carousel visibleSlides={5}>
                            {slides}
                        </Carousel>

                        <Carousel items={slides} />
                    </div>
                </div>
            </div> */}
            <div className="container">
                <h2 className="text-heading max-w-md">Others you might like</h2>
                <div className="containe mx-auto relative p-0">
                    <div className="relative left1/2 left0 -ml[50vw] w-[90vw] bg-blue500 text-white p-6 pl-0">
                        <Carousel items={recommendationData} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WatchDetails;
