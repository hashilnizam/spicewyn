import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - SpiceWyn</title>
      </Helmet>

      <div className="container-custom py-12">
        <h1 className="text-4xl font-display font-bold mb-8">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6 text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-primary-600" />
            <h3 className="font-bold mb-2">Email</h3>
            <p className="text-gray-600 dark:text-gray-400">support@spicewyn.com</p>
          </div>
          <div className="card p-6 text-center">
            <Phone className="w-12 h-12 mx-auto mb-4 text-primary-600" />
            <h3 className="font-bold mb-2">Phone</h3>
            <p className="text-gray-600 dark:text-gray-400">+91 9876543210</p>
          </div>
          <div className="card p-6 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-primary-600" />
            <h3 className="font-bold mb-2">Address</h3>
            <p className="text-gray-600 dark:text-gray-400">Mumbai, Maharashtra 400001</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
