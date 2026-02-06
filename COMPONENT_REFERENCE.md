# Job Portal UI/UX Components - Quick Reference Guide

## Global Providers & Hooks

### ToastContext
Global toast notification system available app-wide.

**Usage:**
```tsx
import { useToast } from './contexts/AuthContext';

const { addToast } = useToast();
addToast('Success!', 'success');
addToast('Error!', 'error');
addToast('Info', 'info');
```

**Toast Variants:**
- `success`: Green/emerald
- `error`: Red/rose
- `info`: Blue (default)

---

## Core UI Components

### Button
Enhanced button with advanced micro-interactions.

**Props:**
```tsx
<Button
  variant="primary" // primary | secondary | danger | ghost
  theme="seeker"    // seeker | employer
  loading={false}   // Shows spinner + "Saving..." text
  disabled={false}
  onClick={() => {}}
>
  Click Me
</Button>
```

**Features:**
- Liquid fill effect (primary/danger)
- Shimmer light sweep
- Inner glow on hover
- Spring-based scale animations

---

### Card & GlassCard
Container components for content with depth and visual layers.

**Card (Light background):**
```tsx
<Card
  theme="seeker"      // seeker | employer
  stackEffect={true}  // Multiple shadow layers
  glow={false}        // Add glow effect
  hoverLift={true}    // Lift on hover
>
  Content
</Card>
```

**GlassCard (Glass morphism):**
```tsx
<GlassCard glow={true}>
  Content
</GlassCard>
```

---

### StackedJobCard
Job listing card with company logo and application status.

**Props:**
```tsx
<StackedJobCard
  job={jobData}
  onViewDetails={(id) => navigate(`/jobs/${id}`)}
  theme="seeker"
  applied={false}  // Shows "Applied" badge if true
  index={0}        // For stagger animation
/>
```

**Features:**
- Company logo or fallback avatar
- Applied status badge
- Hover animations
- Theme-aware colors

---

### EmptyState
Reusable empty state UI component.

**Props:**
```tsx
<EmptyState
  icon={Briefcase}
  title="No jobs found"
  description="Try adjusting your search filters"
  action={() => navigate('/search')}  // Optional
  variant="seeker"  // seeker | employer
/>
```

**Features:**
- Animated bobbing icon
- Smooth entrance
- Optional action button
- Theme-aware colors

---

### ApplicationTimeline
Visual timeline of application status progression.

**Props:**
```tsx
<ApplicationTimeline
  currentStatus="shortlisted"  // pending | viewed | shortlisted | rejected
  appliedDate="2024-01-15"
  viewedDate="2024-01-16"
  shortlistedDate="2024-01-17"
  rejectedDate={null}
/>
```

**Timeline Steps:**
1. Pending (Clock, amber)
2. Viewed (Eye, blue)
3. Shortlisted (CheckCircle, emerald)
4. Rejected (XCircle, rose)

---

### ProfileCompletion
Profile completion percentage indicator.

**Usage:**
```tsx
<ProfileCompletion />
```

**Features:**
- Auto-calculates from user profile
- Gradient bar animation
- Shows percentage
- Motivated users to complete profiles

---

### DashboardStats
Role-aware statistics display.

**Usage:**
```tsx
<DashboardStats />
```

**Features:**
- Seeker: Applications, pending, shortlisted
- Employer: Jobs, pending applications, total apps
- Real-time API data
- Skeleton loaders while loading
- Error handling

---

### Toast
Toast notification component. Usually used via useToast() hook.

**Manual Usage:**
```tsx
<Toast
  message="Success!"
  type="success"  // success | error | info
  onClose={() => {}}
/>
```

---

## Form Components

### FormValidationFeedback
Displays inline validation messages with icons.

**Props:**
```tsx
<FormValidationFeedback
  state={{
    isValid: true,
    touched: true,
    message: 'Email is valid!'
  }}
/>
```

---

### ValidatedInput
Input field with built-in validation styling and feedback.

**Props:**
```tsx
<ValidatedInput
  label="Email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  validation={{
    isValid: emailIsValid,
    touched: true,
    message: 'Valid email'
  }}
  showValidationIcon={true}
  required
/>
```

---

### ValidationRules
Pre-built validation functions.

**Usage:**
```tsx
import { ValidationRules } from './components/FormValidation';

// Email validation
const result = ValidationRules.email('user@example.com');
if (result.isValid) { /* ... */ }

// Password strength
const pwResult = ValidationRules.password('MyPass123');
// Checks: 8+ chars, uppercase, number

// Phone
const phoneResult = ValidationRules.phone('+1 (555) 123-4567');

// Custom rules
ValidationRules.required(value);
ValidationRules.minLength(value, 5);
ValidationRules.maxLength(value, 20);
ValidationRules.match(password, confirmPassword, 'Passwords');
ValidationRules.url(urlString);
ValidationRules.number(value);
```

---

## Animations & Interactions

### AnimatedSearchInput
Search input with suggestions dropdown.

**Props:**
```tsx
<AnimatedSearchInput
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Search jobs..."
  suggestions={["React Developer", "Node.js", "UI Designer"]}
  onSuggestionSelect={(suggestion) => {}}
  isLoading={false}
/>
```

**Features:**
- Expands on focus
- Suggestion dropdown
- Clear button
- Loading spinner
- Smooth animations

---

### AnimatedFilterButton
Dropdown filter button with multi-select.

**Props:**
```tsx
<AnimatedFilterButton
  label="Job Type"
  options={["Full-time", "Part-time", "Contract"]}
  selected={selected}
  onSelect={(option) => {}}
  onClear={() => {}}
  icon={<Filter />}
/>
```

---

### AnimatedFilterDrawer
Full-screen filter drawer for mobile.

**Props:**
```tsx
<AnimatedFilterDrawer
  title="Filters"
  isOpen={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  filters={[
    {
      label: "Job Type",
      options: ["Full-time", "Part-time"],
      selected: selected,
      onSelect: (opt) => {}
    }
  ]}
  onApply={() => {}}
/>
```

---

## Mobile & Accessibility

### TouchTarget
Wrapper ensuring 48px minimum touch targets.

**Props:**
```tsx
<TouchTarget
  size="md"  // sm (40px) | md (48px) | lg (56px)
  onClick={() => {}}
  ariaLabel="Action button"
>
  <Icon />
</TouchTarget>
```

---

### GestureHandler
Detects swipe gestures on mobile.

**Props:**
```tsx
<GestureHandler
  onSwipeLeft={() => nextPage()}
  onSwipeRight={() => prevPage()}
  onSwipeUp={() => scrollUp()}
  onSwipeDown={() => scrollDown()}
  className="gesture-area"
>
  Content
</GestureHandler>
```

---

### useReducedMotion Hook
Respects user's motion preferences.

**Usage:**
```tsx
const prefersReducedMotion = useReducedMotion();

// Use in animations
<motion.div
  animate={{ x: 100 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
>
  Content
</motion.div>
```

---

### useHighContrastMode Hook
Detects high contrast mode preference.

**Usage:**
```tsx
const highContrast = useHighContrastMode();

// Apply stricter contrast colors if needed
```

---

### useHapticFeedback Hook
Triggers device vibration feedback.

**Usage:**
```tsx
const { trigger } = useHapticFeedback();

// On button click
button.onClick = () => {
  trigger('light');    // 10ms
  trigger('medium');   // 20ms
  trigger('heavy');    // 30ms
};
```

---

### useViewportHeight Hook
Gets available viewport height (accounts for mobile address bar).

**Usage:**
```tsx
const viewportHeight = useViewportHeight();

// Set container height
<div style={{ height: `${viewportHeight}px` }}>
  Content
</div>
```

---

## Utilities & Systems

### designTokens
Centralized design system tokens.

**Usage:**
```tsx
import { designTokens } from './lib/designTokens';

// Access colors
const primaryColor = designTokens.seeker.primary;      // #7c3aed
const shadowLarge = designTokens.shadows.lg;
const buttonPadding = designTokens.spacing[6];         // 1.5rem

// Get color by role
const color = getColorByRole('seeker', 'primary');
```

---

### DarkModeAccessible & Accessibility
WCAG AA compliant accessible color system.

**Usage:**
```tsx
import { 
  ContrastChecker, 
  AccessibilityAudit,
  DarkModeAccessible 
} from './components/AccessibilityAudit';

// Check contrast ratio
const ratio = ContrastChecker.getContrastRatio('#fff', '#000');
const meetsAA = ContrastChecker.meetAAStandard('#fff', '#000');

// Run audit
const audit = AccessibilityAudit.runFullAudit();
console.log(audit.keyboardAccessibility);

// Use accessible colors
const colors = DarkModeAccessible.text;  // Pre-verified colors
```

---

## CSS Utility Classes

### Shadow Classes
```css
/* Depth system */
.shadow-depth-xs
.shadow-depth-sm
.shadow-depth-md
.shadow-depth-lg
.shadow-depth-xl
.shadow-depth-2xl

/* Interactive shadows */
.shadow-hover-md
.shadow-hover-lg
.shadow-hover-employer
.shadow-hover-seeker

/* Glass morphism */
.shadow-glass
.shadow-glass-inset
```

### Gradient Overlays
```css
.gradient-overlay-seeker
.gradient-overlay-employer
.gradient-overlay-hero
.gradient-overlay-success
.gradient-overlay-warning
```

### Card Hover States
```css
.card-hover
.card-hover-employer
.card-hover-seeker
```

### Responsive Typography
```css
.text-hero-title    /* 4xl-8xl responsive */
.text-page-title    /* 3xl-5xl responsive */
.text-section-title /* 2xl-4xl responsive */
.text-body          /* sm-lg responsive */
.text-small         /* xs-base responsive */
.text-caption       /* xs-sm text-gray-500 */
```

### Mobile Spacing
```css
.button-padding-mobile  /* Responsive button padding */
.interactive-gap        /* Gap between interactive elements */
.content-padding-mobile /* Content padding */
.form-spacing-mobile    /* Form field spacing */
.list-item-height-mobile /* Touch-friendly list height */
```

---

## Common Patterns

### Loading State
```tsx
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await submitForm();
    addToast('Success!', 'success');
  } catch (err) {
    addToast('Error!', 'error');
  } finally {
    setLoading(false);
  }
};

<Button loading={loading} onClick={handleSubmit}>
  Submit
</Button>
```

### Form Validation
```tsx
const [email, setEmail] = useState('');
const [touched, setTouched] = useState(false);

const validation = email.trim() ? 
  ValidationRules.email(email) : 
  { isInvalid: true };

<ValidatedInput
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  onBlur={() => setTouched(true)}
  validation={{ ...validation, touched }}
/>
```

### Empty State
```tsx
{items.length === 0 ? (
  <EmptyState
    icon={Briefcase}
    title="No items"
    description="Create your first item"
    action={() => navigate('/create')}
  />
) : (
  <ItemList items={items} />
)}
```

### Accessible Touch Target
```tsx
<TouchTarget size="md" ariaLabel="Close dialog">
  <X />
</TouchTarget>
```

---

## Imports Reference

```tsx
// Components
import {
  Button, Card, GlassCard, StackedJobCard,
  ProfileCompletion, DashboardStats, Toast,
  EmptyState, ApplicationTimeline,
  FormValidationFeedback, ValidatedInput, ValidationRules,
  AnimatedSearchInput, AnimatedFilterButton, AnimatedFilterDrawer,
  TouchTarget, GestureHandler
} from './components';

// Utilities
import { 
  useReducedMotion, useHighContrastMode, useHapticFeedback, useViewportHeight,
  ContrastChecker, AccessibilityAudit, DarkModeAccessible
} from './components';

// Design System
import { designTokens } from './lib/designTokens';

// Toast Hook
import { useToast } from './contexts/AuthContext';
```

---

## Best Practices

1. **Always use theme prop** on role-specific components (Button, Card)
2. **Check reduced motion** before heavy animations
3. **Use ValidatedInput** for forms instead of plain input
4. **Wrap main app with ToastProvider** in App.tsx
5. **Use EmptyState** for empty content, not plain text
6. **Use TouchTarget** in mobile-heavy applications
7. **Test contrast** with AccessibilityAudit.runFullAudit()
8. **Use designTokens** for consistent spacing/colors
9. **Leverage skeleton loaders** while fetching data
10. **Add aria-labels** to icon-only buttons

---

**Version:** 2.0  
**Last Updated:** 2024  
**Status:** Production Ready ✅
