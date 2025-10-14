import { Helmet } from 'react-helmet-async';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - SpiceWyn</title>
      </Helmet>

      <div className="container-custom py-12">
        <h1 className="text-4xl font-display font-bold mb-8">About SpiceWyn</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Premium spices direct from farms to your kitchen.
          </p>
          <p>
            SpiceWyn is your trusted source for authentic, farm-fresh spices. We work directly with farmers
            to bring you the finest quality spices at the best prices.
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
