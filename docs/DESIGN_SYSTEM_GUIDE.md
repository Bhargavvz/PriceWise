# 🎨 PriceWise Design System - Quick Reference Guide

## 🎯 How to Use This Design System

This guide shows you how to use the new design tokens and utility classes in your components.

---

## 🎨 Colors

### **Using Color Variables:**

```jsx
// In inline styles
<div style={{ color: 'var(--primary)', backgroundColor: 'var(--bg-secondary)' }}>
  Styled content
</div>

// Using utility classes
<div className="text-primary bg-secondary">
  Styled content
</div>
```

### **Available Colors:**
- **Brand**: `--primary`, `--secondary`, `--accent`
- **Semantic**: `--success`, `--danger`, `--warning`, `--info`
- **Text**: `--text-primary`, `--text-secondary`, `--text-tertiary`
- **Backgrounds**: `--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--bg-hover`
- **Borders**: `--border`, `--border-light`

### **Gradients:**
```jsx
// Using gradient variables
<div style={{ background: 'var(--gradient-primary)' }}>
  Gradient background
</div>

// Using utility classes
<div className="gradient-hero">Hero gradient</div>
<div className="gradient-primary">Primary gradient</div>
<div className="gradient-sunset">Sunset gradient</div>
<div className="gradient-ocean">Ocean gradient</div>
```

---

## 🔘 Buttons

### **Button Variants:**

```jsx
// Primary button (gradient with shadow)
<button className="btn btn-primary">
  Primary Action
</button>

// Secondary button
<button className="btn btn-secondary">
  Secondary Action
</button>

// Outline button
<button className="btn btn-outline">
  Outline Action
</button>

// Ghost button (transparent)
<button className="btn btn-ghost">
  Ghost Action
</button>

// Danger button
<button className="btn btn-danger">
  Delete
</button>
```

### **Button Sizes:**

```jsx
// Small button
<button className="btn btn-primary btn-sm">Small</button>

// Default button
<button className="btn btn-primary">Default</button>

// Large button
<button className="btn btn-primary btn-lg">Large</button>
```

### **Button with Icons:**

```jsx
import { Search, Plus } from 'lucide-react';

<button className="btn btn-primary">
  <Search size={20} />
  Search Products
</button>

<button className="btn btn-secondary">
  <Plus size={20} />
  Add Item
</button>
```

### **Button States:**

```jsx
// Disabled button
<button className="btn btn-primary" disabled>
  Disabled
</button>

// Loading button
<button className="btn btn-primary btn-loading">
  Loading...
</button>
```

---

## 📝 Form Inputs

### **Text Input:**

```jsx
<div className="form-group">
  <label className="form-label">Email Address</label>
  <input 
    type="email" 
    className="input" 
    placeholder="Enter your email"
  />
  <span className="form-helper">We'll never share your email</span>
</div>
```

### **Input with Error:**

```jsx
<div className="form-group">
  <label className="form-label">Password</label>
  <input 
    type="password" 
    className="input input-error" 
    placeholder="Enter password"
  />
  <span className="form-error">
    Password must be at least 8 characters
  </span>
</div>
```

### **Textarea:**

```jsx
<textarea 
  className="input" 
  placeholder="Enter notes..."
  rows={4}
/>
```

### **Select Dropdown:**

```jsx
<select className="input">
  <option>Select category...</option>
  <option>Dairy & Eggs</option>
  <option>Produce</option>
  <option>Meat & Seafood</option>
</select>
```

---

## 🎴 Cards

### **Basic Card:**

```jsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</div>
```

### **Card with Header and Footer:**

```jsx
<div className="card">
  <div className="card-header">
    <h3>Product Details</h3>
  </div>
  
  <div>
    <p>Main content...</p>
  </div>
  
  <div className="card-footer">
    <button className="btn btn-primary">Save</button>
    <button className="btn btn-secondary">Cancel</button>
  </div>
</div>
```

### **Card Variants:**

```jsx
// Flat card (no shadow)
<div className="card card-flat">Flat card</div>

// Elevated card (large shadow)
<div className="card card-elevated">Elevated card</div>

// Outlined card (border only)
<div className="card card-outlined">Outlined card</div>

// Gradient border card
<div className="card card-gradient">Gradient border card</div>
```

---

## 🎭 Animations

### **Entrance Animations:**

```jsx
// Fade in
<div className="animate-fadeIn">
  Fades in
</div>

// Fade in from bottom
<div className="animate-fadeInUp">
  Slides up while fading in
</div>

// Fade in from top
<div className="animate-fadeInDown">
  Slides down while fading in
</div>

// Slide in from left
<div className="animate-slideInLeft">
  Slides in from left
</div>

// Slide in from right
<div className="animate-slideInRight">
  Slides in from right
</div>

// Scale in
<div className="animate-scaleIn">
  Scales in from 90%
</div>
```

### **Loading Animations:**

```jsx
// Pulse animation
<div className="animate-pulse">
  Pulsing element
</div>

// Spinning animation
<div className="animate-spin">
  Spinning loader
</div>

// Bounce animation
<div className="animate-bounce">
  Bouncing element
</div>
```

---

## 💀 Skeleton Loading

### **Skeleton Components:**

```jsx
// Text skeleton
<div className="skeleton skeleton-text" />

// Title skeleton
<div className="skeleton skeleton-title" />

// Avatar skeleton
<div className="skeleton skeleton-avatar" />

// Button skeleton
<div className="skeleton skeleton-button" />

// Custom skeleton
<div className="skeleton" style={{ height: '200px', width: '100%' }} />
```

### **Loading State Example:**

```jsx
const ProductCard = ({ loading, product }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="skeleton" style={{ height: '200px', marginBottom: '1rem' }} />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text" style={{ width: '60%' }} />
        <div className="skeleton skeleton-button" style={{ marginTop: '1rem' }} />
      </div>
    );
  }
  
  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <button className="btn btn-primary">View Details</button>
    </div>
  );
};
```

---

## 📐 Layout Utilities

### **Flexbox:**

```jsx
// Horizontal flex with gap
<div className="flex items-center gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Vertical flex
<div className="flex flex-col gap-2">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Space between
<div className="flex items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>

// Centered
<div className="flex items-center justify-center" style={{ height: '200px' }}>
  <div>Centered content</div>
</div>
```

### **Grid:**

```jsx
// Auto-fill grid
<div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
  <div className="card">Item 1</div>
  <div className="card">Item 2</div>
  <div className="card">Item 3</div>
</div>

// Responsive grid (2 columns on tablet, 3 on desktop)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="card">Item 1</div>
  <div className="card">Item 2</div>
  <div className="card">Item 3</div>
</div>
```

---

## 🎯 Spacing

### **Using Spacing Variables:**

```jsx
// Padding
<div style={{ padding: 'var(--space-4)' }}>
  Content with padding
</div>

// Margin
<div style={{ marginBottom: 'var(--space-6)' }}>
  Content with margin
</div>

// Gap in flex
<div className="flex" style={{ gap: 'var(--space-3)' }}>
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### **Available Spacing:**
- `--space-0`: 0
- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-5`: 20px
- `--space-6`: 24px
- `--space-8`: 32px
- `--space-10`: 40px
- `--space-12`: 48px
- `--space-16`: 64px
- `--space-20`: 80px
- `--space-24`: 96px

---

## 🔄 Shadows

### **Using Shadow Variables:**

```jsx
// Small shadow
<div style={{ boxShadow: 'var(--shadow-sm)' }}>
  Subtle shadow
</div>

// Medium shadow
<div style={{ boxShadow: 'var(--shadow-md)' }}>
  Medium shadow
</div>

// Large shadow
<div style={{ boxShadow: 'var(--shadow-lg)' }}>
  Large shadow
</div>

// Colored shadow (for emphasis)
<div style={{ boxShadow: 'var(--shadow-primary)' }}>
  Primary colored shadow
</div>
```

### **Using Shadow Utility Classes:**

```jsx
<div className="shadow-sm">Small shadow</div>
<div className="shadow-md">Medium shadow</div>
<div className="shadow-lg">Large shadow</div>
<div className="shadow-xl">Extra large shadow</div>
<div className="shadow-2xl">2X large shadow</div>
```

---

## 📝 Typography

### **Text Sizes:**

```jsx
<p className="text-xs">Extra small text</p>
<p className="text-sm">Small text</p>
<p className="text-base">Base text</p>
<p className="text-lg">Large text</p>
<p className="text-xl">Extra large text</p>
<p className="text-2xl">2X large text</p>
<p className="text-3xl">3X large text</p>
```

### **Font Weights:**

```jsx
<p className="font-light">Light text</p>
<p className="font-normal">Normal text</p>
<p className="font-medium">Medium text</p>
<p className="font-semibold">Semibold text</p>
<p className="font-bold">Bold text</p>
```

### **Text Colors:**

```jsx
<p className="text-primary">Primary color text</p>
<p className="text-secondary">Secondary color text</p>
<p className="text-tertiary">Tertiary color text</p>
<p className="text-success">Success color text</p>
<p className="text-danger">Danger color text</p>
<p className="text-warning">Warning color text</p>
```

### **Text Alignment:**

```jsx
<p className="text-left">Left aligned</p>
<p className="text-center">Center aligned</p>
<p className="text-right">Right aligned</p>
```

---

## 🎨 Border Radius

### **Using Radius Variables:**

```jsx
<div style={{ borderRadius: 'var(--radius-sm)' }}>Small radius</div>
<div style={{ borderRadius: 'var(--radius-md)' }}>Medium radius</div>
<div style={{ borderRadius: 'var(--radius-lg)' }}>Large radius</div>
<div style={{ borderRadius: 'var(--radius-xl)' }}>Extra large radius</div>
<div style={{ borderRadius: 'var(--radius-2xl)' }}>2X large radius</div>
<div style={{ borderRadius: 'var(--radius-full)' }}>Full radius (circle)</div>
```

### **Using Utility Classes:**

```jsx
<div className="rounded-sm">Small radius</div>
<div className="rounded-md">Medium radius</div>
<div className="rounded-lg">Large radius</div>
<div className="rounded-xl">Extra large radius</div>
<div className="rounded-2xl">2X large radius</div>
<div className="rounded-full">Full radius</div>
```

---

## 🌓 Dark Mode

### **Automatic Dark Mode Support:**

All components automatically support dark mode when theme is toggled:

```jsx
// Colors automatically adjust
<div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
  This changes color in dark mode
</div>

// Shadows automatically adjust
<div className="card">
  Card with appropriate shadows for light/dark mode
</div>
```

---

## 📱 Responsive Design

### **Responsive Utilities:**

```jsx
// Hide on mobile
<div className="hidden md:flex">
  Only visible on desktop
</div>

// Show on mobile
<div className="md:hidden">
  Only visible on mobile
</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### **Breakpoints:**
- **Mobile**: < 640px (default)
- **sm**: ≥ 640px
- **md**: ≥ 768px (tablet)
- **lg**: ≥ 1024px (desktop)
- **xl**: ≥ 1280px (large desktop)

---

## 🎯 Complete Component Examples

### **Product Card Example:**

```jsx
import { ShoppingCart, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="card animate-fadeInUp">
      {/* Product Image */}
      <div style={{ position: 'relative', marginBottom: 'var(--space-4)' }}>
        <img 
          src={product.image} 
          alt={product.name}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: 'var(--radius-lg)'
          }}
        />
        <button 
          className="btn btn-secondary"
          style={{
            position: 'absolute',
            top: 'var(--space-2)',
            right: 'var(--space-2)',
            padding: 'var(--space-2)',
            borderRadius: 'var(--radius-full)'
          }}
        >
          <Heart size={18} />
        </button>
      </div>
      
      {/* Product Info */}
      <h3 className="font-semibold" style={{ marginBottom: 'var(--space-2)' }}>
        {product.name}
      </h3>
      <p className="text-secondary text-sm" style={{ marginBottom: 'var(--space-4)' }}>
        {product.brand}
      </p>
      
      {/* Price & Action */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-primary">
            ${product.price}
          </div>
          <div className="text-sm text-tertiary">
            {product.unit}
          </div>
        </div>
        <button className="btn btn-primary">
          <ShoppingCart size={18} />
          Add
        </button>
      </div>
    </div>
  );
};
```

### **Form Example:**

```jsx
const LoginForm = () => {
  return (
    <div className="card card-elevated" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2 className="text-center" style={{ marginBottom: 'var(--space-6)' }}>
        Welcome Back
      </h2>
      
      <form>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            className="input" 
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="input" 
            placeholder="Enter your password"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: 'var(--space-4)' }}
        >
          Sign In
        </button>
      </form>
      
      <div className="text-center" style={{ marginTop: 'var(--space-4)' }}>
        <a href="/register" className="text-primary">
          Don't have an account? Sign up
        </a>
      </div>
    </div>
  );
};
```

---

## 🚀 Best Practices

1. **Use Variables**: Always use CSS variables instead of hardcoded values
2. **Utility Classes**: Prefer utility classes for common patterns
3. **Consistent Spacing**: Use the spacing scale (4, 8, 12, 16, 24, 32, 48, 64px)
4. **Semantic Colors**: Use semantic colors (success, danger, warning) for appropriate contexts
5. **Accessibility**: Ensure 44px minimum touch targets on mobile
6. **Dark Mode**: Test both light and dark themes
7. **Responsive**: Test on mobile, tablet, and desktop
8. **Animations**: Use sparingly for delightful micro-interactions

---

**Happy Building! 🎨✨**
