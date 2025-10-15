import { motion } from 'framer-motion';
import { Sun, Moon, Check, Palette } from 'lucide-react';
import { useThemeStore, COLOR_THEMES } from '@/store/themeStore';

const ThemeSelector = () => {
  const { theme, colorTheme, toggleTheme, setColorTheme } = useThemeStore();

  return (
    <div className="space-y-6">
      {/* Light/Dark Mode Toggle */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary-600" />
          Appearance Mode
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => theme !== 'light' && toggleTheme()}
            className={`
              relative p-4 rounded-ios-lg border-2 transition-all duration-300
              ${theme === 'light' 
                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`
                p-3 rounded-full transition-colors duration-300
                ${theme === 'light' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }
              `}>
                <Sun className="w-6 h-6" />
              </div>
              <span className="font-medium">Light</span>
            </div>
            
            {theme === 'light' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => theme !== 'dark' && toggleTheme()}
            className={`
              relative p-4 rounded-ios-lg border-2 transition-all duration-300
              ${theme === 'dark' 
                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`
                p-3 rounded-full transition-colors duration-300
                ${theme === 'dark' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }
              `}>
                <Moon className="w-6 h-6" />
              </div>
              <span className="font-medium">Dark</span>
            </div>
            
            {theme === 'dark' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>
        </div>
      </div>

      {/* Color Theme Selector */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Color Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(COLOR_THEMES).map(([key, themeData]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setColorTheme(key)}
              className={`
                relative p-4 rounded-ios-lg border-2 transition-all duration-300 text-left
                ${colorTheme === key 
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/30 shadow-nature' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-ios'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: colorTheme === key ? [0, 10, -10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl"
                >
                  {themeData.icon}
                </motion.div>
                <div className="flex-1">
                  <h4 className="font-semibold">{themeData.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {themeData.description}
                  </p>
                </div>
              </div>
              
              {colorTheme === key && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-ios-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-nature-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold">Theme Preview</h4>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Palette className="w-5 h-5" />
          </motion.div>
        </div>
        <p className="text-primary-100 mb-4">
          Your selected theme: <strong>{COLOR_THEMES[colorTheme].name}</strong>
        </p>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-ios hover:bg-white/30 transition-colors"
          >
            Primary Button
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white text-primary-600 rounded-ios hover:bg-white/90 transition-colors font-medium"
          >
            Secondary Button
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ThemeSelector;
