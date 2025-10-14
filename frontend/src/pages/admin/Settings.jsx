import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { adminGetSettings } from '@/services/api';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

const Settings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => adminGetSettings(),
  });

  const settings = data?.data?.data || {};

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Settings - Admin - SpiceWyn</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-display font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Site Name" value={settings.site_name || ''} />
              <Input label="Site Tagline" value={settings.site_tagline || ''} />
              <Input label="Contact Email" value={settings.contact_email || ''} />
              <Input label="Contact Phone" value={settings.contact_phone || ''} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Store Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Currency" value={settings.currency || ''} />
              <Input label="Tax Rate (%)" type="number" value={settings.tax_rate || ''} />
              <Input label="Free Shipping Threshold" type="number" value={settings.free_shipping_threshold || ''} />
              <Input label="Shipping Cost" type="number" value={settings.shipping_cost || ''} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <Input label="Meta Title" value={settings.meta_title || ''} />
              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea
                  value={settings.meta_description || ''}
                  className="input w-full min-h-[100px]"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Social Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Facebook URL" value={settings.facebook_url || ''} />
              <Input label="Instagram URL" value={settings.instagram_url || ''} />
              <Input label="WhatsApp Number" value={settings.whatsapp_number || ''} />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
