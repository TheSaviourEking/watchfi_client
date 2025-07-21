import { useParams } from 'react-router';
import CollectionsDetailsHero from './CollectionDetailHero'
import WatchDetails from './WatchDetail'
import { useEffect, useState } from 'react';
import api from '../../config/apiConfig';

const CollectionDetailPage = () => {
    const { id } = useParams();
    const [collection, setCollection] = useState({});

    // console.log(collection, 'COLLECTION');

    const { name = '', primaryPhotoUrl, description = '', referenceCode = '', specificationHeadings = null, photos = [], detail = '', ...otherData } = collection;

    useEffect(() => {
        (async () => {
            try {
                const req = await fetch(api.getUrl('collectionDetails', id));
                const response = await req.json();
                // console.log(req, response)

                if (req.ok) {
                    // console.log(response, 'DATA')
                    // console.log(response, 'RESPONSE')
                    console.log(response.data, 'COLLECTION');
                    setCollection(response.data);
                } else {
                    setCollection({});
                    console.error('Network response was not ok', response);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        })();
    }, [id]);


    return (
        <>
            {/* <CollectionsDetailsHero detail={detail} name={name} description={description} image={primaryPhotoUrl} referenceCode={referenceCode} /> */}
            <CollectionsDetailsHero collection={collection} />
            <WatchDetails detail={detail} specifications={specificationHeadings} photos={photos} />
        </>
    )
}

export default CollectionDetailPage