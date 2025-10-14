import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, MapPin, Heart, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const Profile = () => {
  const { user } = useAuthStore();
  const { items: wishlist } = useWishlistStore();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <Helmet>
        <title>My Profile - SpiceWyn</title>
      </Helmet>

      <div className="container-custom py-8">
        <h1 className="text-3xl font-display font-bold mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold">{user?.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'addresses' && <AddressesTab />}
            {activeTab === 'wishlist' && <WishlistTab wishlist={wishlist} />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>
    </>
  );
};

const ProfileTab = () => {
  const { user } = useAuthStore();

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
      <div className="space-y-4">
        <Input label="Full Name" value={user?.name || ''} readOnly />
        <Input label="Email" type="email" value={user?.email || ''} readOnly />
        <Input label="Mobile" value={user?.mobile || ''} readOnly />
        <div>
          <p className="text-sm font-medium mb-2">Loyalty Points</p>
          <div className="text-2xl font-bold text-primary-600">{user?.loyaltyPoints || 0} Points</div>
        </div>
      </div>
    </Card>
  );
};

const AddressesTab = () => {
  const { user } = useAuthStore();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Saved Addresses</h2>
        <Button>Add New Address</Button>
      </div>
      {user?.addresses?.length > 0 ? (
        <div className="space-y-4">
          {user.addresses.map((address, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{address.label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {address.addressLine1}, {address.addressLine2}
                    <br />
                    {address.city}, {address.state} - {address.pincode}
                    <br />
                    Mobile: {address.mobile}
                  </p>
                </div>
                {address.isDefault && (
                  <span className="badge badge-primary">Default</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400 py-8">No saved addresses</p>
      )}
    </Card>
  );
};

const WishlistTab = ({ wishlist }) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlist.map((product) => (
            <div key={product._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="font-semibold">{product.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400 py-8">Your wishlist is empty</p>
      )}
    </Card>
  );
};

const SettingsTab = () => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-4">Change Password</h3>
          <div className="space-y-4 max-w-md">
            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm New Password" type="password" />
            <Button>Update Password</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Profile;
