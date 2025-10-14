import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Plus } from 'lucide-react';
import { adminGetBanners } from '@/services/api';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const Banners = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => adminGetBanners(),
  });

  const banners = data?.data?.data || [];

  return (
    <>
      <Helmet>
        <title>Banners - Admin - SpiceWyn</title>
      </Helmet>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display font-bold">Banners</h1>
          <Button>
            <Plus className="w-5 h-5" />
            Add Banner
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-2 p-12 flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner._id} className="card overflow-hidden">
                <img
                  src={banner.image.desktop}
                  alt={banner.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold">{banner.title}</h3>
                    <Badge variant={banner.isActive ? 'success' : 'danger'}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{banner.subtitle}</p>
                  <div className="text-xs text-gray-500">
                    Placement: {banner.placement} | Clicks: {banner.clickCount}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Banners;
