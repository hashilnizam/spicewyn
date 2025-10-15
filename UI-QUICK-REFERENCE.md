# 🎨 UI Quick Reference - SpiceWyn iOS Style

## 🎯 Color Classes

### Primary (Nature Green)
```css
bg-primary-500     /* Vibrant green #22c55e */
bg-primary-600     /* Forest green #16a34a */
text-primary-600   /* Text in forest green */
border-primary-500 /* Border in vibrant green */
```

### Gradients
```css
bg-gradient-to-r from-primary-500 to-primary-600
bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-50
```

---

## 📦 Component Classes

### Buttons
```css
.btn                  /* Base button */
.btn-primary          /* Green gradient button */
.btn-secondary        /* Amber gradient button */
.btn-outline          /* Outlined with glass effect */
.btn-ghost            /* Minimal glass button */
.btn-nature           /* Special nature theme */
```

### Cards
```css
.card                 /* Glass card with blur */
.card-nature          /* Card with green accent */
```

### Inputs
```css
.input                /* iOS-style input field */
```

### Badges
```css
.badge                /* Base badge */
.badge-primary        /* Green badge */
.badge-success        /* Success badge */
```

---

## 🎬 Animation Classes

```css
animate-fade-in       /* Fade in effect */
animate-slide-up      /* Slide from bottom */
animate-scale-in      /* Scale up effect */
animate-float         /* Floating animation */
animate-glow          /* Glow effect */
animate-shimmer       /* Shimmer loading */
animate-pulse-subtle  /* Subtle pulse */
```

---

## 🎨 Border Radius

```css
rounded-ios           /* 12px */
rounded-ios-lg        /* 16px */
rounded-ios-xl        /* 20px */
rounded-ios-2xl       /* 28px */
```

---

## ✨ Shadows

```css
shadow-ios            /* Soft iOS shadow */
shadow-ios-lg         /* Medium iOS shadow */
shadow-ios-xl         /* Large iOS shadow */
shadow-nature         /* Green-tinted shadow */
shadow-nature-lg      /* Strong green shadow */
```

---

## 🌫️ Backdrop Blur

```css
backdrop-blur-ios     /* 12px blur */
backdrop-blur-ios-lg  /* 20px blur */
```

---

## 🎭 Framer Motion Examples

### Button with Hover
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="btn btn-primary"
>
  Click Me
</motion.button>
```

### Fade In Card
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
  className="card p-6"
>
  Content
</motion.div>
```

### Stagger List
```jsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div variants={container} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={item}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Rotating Icon
```jsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
>
  <Icon />
</motion.div>
```

---

## 🎨 Theme Usage

### Check Current Theme
```jsx
import { useThemeStore } from '@/store/themeStore';

const { theme, colorTheme } = useThemeStore();
// theme: 'light' | 'dark'
// colorTheme: 'nature' | 'ocean' | 'sunset' | 'forest' | 'mint'
```

### Toggle Theme
```jsx
const { toggleTheme, setTheme, setColorTheme } = useThemeStore();

toggleTheme();              // Switch light/dark
setTheme('dark');           // Set specific mode
setColorTheme('ocean');     // Set color theme
```

---

## 🎯 Common Patterns

### Page Container
```jsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={containerVariants}
  className="space-y-6"
>
  {/* Content */}
</motion.div>
```

### Animated Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map((item, index) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card p-6"
    >
      {item.content}
    </motion.div>
  ))}
</div>
```

### Form with Glass Effect
```jsx
<div className="card p-8">
  <input className="input mb-4" placeholder="Email" />
  <input className="input mb-4" placeholder="Password" />
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="btn btn-primary w-full"
  >
    Submit
  </motion.button>
</div>
```

### Badge with Animation
```jsx
<motion.span
  animate={{ scale: [1, 1.2, 1] }}
  transition={{ duration: 2, repeat: Infinity }}
  className="badge badge-primary"
>
  NEW
</motion.span>
```

---

## 🎨 Color Theme Values

```javascript
{
  nature: { name: 'Nature Green', icon: '🌿' },
  ocean: { name: 'Ocean Blue', icon: '🌊' },
  sunset: { name: 'Sunset Orange', icon: '🌅' },
  forest: { name: 'Forest Dark', icon: '🌲' },
  mint: { name: 'Fresh Mint', icon: '🍃' }
}
```

---

## 🎯 Emoji Icons for Sections

```
⚙️  General/Settings
🏪  Store/Shop
🔍  SEO/Search
📱  Social Media
🎨  Design/Appearance
📊  Analytics/Stats
👥  Users/Customers
📦  Products/Inventory
🎫  Tickets/Support
💳  Payments
🚚  Shipping/Delivery
```

---

**Copy & paste these patterns into your components!** 🚀
