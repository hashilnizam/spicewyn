import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { adminGetSettings } from '@/services/api';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import ThemeSelector from '@/components/ThemeSelector';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

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

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header with Sparkle Effect */}
        <motion.div 
          variants={itemVariants}
          className="mb-8 flex items-center gap-3"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-8 h-8 text-primary-500" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Customize your store appearance and configuration
            </p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Theme Settings - Featured Section */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 card-nature border-2">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-bold text-primary-700 dark:text-primary-400">
                  🎨 Appearance & Themes
                </h2>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block px-2 py-1 text-xs font-semibold bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full"
                >
                  NEW
                </motion.span>
              </div>
              <ThemeSelector />
            </Card>
          </motion.div>

          {/* General Settings */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 hover:shadow-ios-lg transition-shadow duration-300">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>⚙️</span>
                General Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Site Name" value={settings.site_name || ''} />
                <Input label="Site Tagline" value={settings.site_tagline || ''} />
                <Input label="Contact Email" value={settings.contact_email || ''} />
                <Input label="Contact Phone" value={settings.contact_phone || ''} />
              </div>
            </Card>
          </motion.div>

          {/* Store Settings */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 hover:shadow-ios-lg transition-shadow duration-300">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🏪</span>
                Store Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Currency" value={settings.currency || ''} />
                <Input label="Tax Rate (%)" type="number" value={settings.tax_rate || ''} />
                <Input label="Free Shipping Threshold" type="number" value={settings.free_shipping_threshold || ''} />
                <Input label="Shipping Cost" type="number" value={settings.shipping_cost || ''} />
              </div>
            </Card>
          </motion.div>

          {/* SEO Settings */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 hover:shadow-ios-lg transition-shadow duration-300">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🔍</span>
                SEO Settings
              </h2>
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
          </motion.div>

          {/* Social Media */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 hover:shadow-ios-lg transition-shadow duration-300">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>📱</span>
                Social Media
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Facebook URL" value={settings.facebook_url || ''} />
                <Input label="Instagram URL" value={settings.instagram_url || ''} />
                <Input label="WhatsApp Number" value={settings.whatsapp_number || ''} />
              </div>
            </Card>
          </motion.div>

          {/* Save Button with Animation */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-end"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="btn-nature">
                Save Changes
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Settings;
