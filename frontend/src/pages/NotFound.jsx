import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from '@/components/ui/Button';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found - SpiceWyn</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
