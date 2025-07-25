import { Link } from 'react-router';

const NotFoundPage = () => {
    return (
        <div className='text-white'>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/">Go back to the home page</Link>
        </div>
    );
};

export default NotFoundPage;