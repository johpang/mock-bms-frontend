# FormControls Component Library

Reusable form components for the BMS (Broker Management System) insurance quoting app.

## Components

All components use CSS custom properties for styling (--color-navy, --color-accent, --color-border, etc.) and are designed to integrate seamlessly with your existing design system.

### TextInput
Labeled text input with optional error message.

```jsx
import { TextInput } from './components/FormControls';

<TextInput
  label="Full Name"
  name="fullName"
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  placeholder="John Doe"
  required
  type="text"
  error={errors.fullName}
/>
```

**Props:**
- `label` (string) - Label text
- `name` (string) - Input name
- `value` (string) - Current value
- `onChange` (function) - Change handler
- `type` (string, default: 'text') - HTML input type
- `placeholder` (string) - Placeholder text
- `required` (boolean) - Required field
- `disabled` (boolean) - Disabled state
- `error` (string) - Error message to display
- `className` (string) - Additional CSS classes

---

### SelectInput
Labeled dropdown select with placeholder option.

```jsx
import { SelectInput } from './components/FormControls';

<SelectInput
  label="State"
  name="state"
  value={state}
  onChange={(e) => setState(e.target.value)}
  options={[
    { value: 'CA', label: 'California' },
    { value: 'TX', label: 'Texas' },
    { value: 'NY', label: 'New York' },
  ]}
  placeholder="Choose a state"
  required
  error={errors.state}
/>
```

**Props:**
- `label` (string) - Label text
- `name` (string) - Select name
- `value` (string) - Selected value
- `onChange` (function) - Change handler
- `options` (array) - Array of {value, label} objects
- `required` (boolean) - Required field
- `disabled` (boolean) - Disabled state
- `placeholder` (string) - Placeholder text
- `error` (string) - Error message to display
- `className` (string) - Additional CSS classes

---

### RadioGroup
Horizontal or vertical radio button group (ideal for Yes/No questions).

```jsx
import { RadioGroup } from './components/FormControls';

<RadioGroup
  label="Do you own the property?"
  name="propertyOwner"
  value={propertyOwner}
  onChange={(e) => setPropertyOwner(e.target.value)}
  options={[
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ]}
  inline={true}
  required
  error={errors.propertyOwner}
/>
```

**Props:**
- `label` (string) - Label text
- `name` (string) - Radio group name
- `value` (string) - Selected value
- `onChange` (function) - Change handler
- `options` (array) - Array of {value, label} objects
- `required` (boolean) - Required field
- `inline` (boolean, default: true) - Display inline or stacked
- `error` (string) - Error message to display
- `className` (string) - Additional CSS classes

---

### CheckboxInput
Single labeled checkbox.

```jsx
import { CheckboxInput } from './components/FormControls';

<CheckboxInput
  label="I agree to the terms and conditions"
  name="agreeTerms"
  checked={agreeTerms}
  onChange={(e) => setAgreeTerms(e.target.checked)}
/>
```

**Props:**
- `label` (string) - Label text
- `name` (string) - Checkbox name
- `checked` (boolean) - Checked state
- `onChange` (function) - Change handler
- `disabled` (boolean) - Disabled state
- `className` (string) - Additional CSS classes

---

### DateInput
Labeled date input with HTML5 date picker.

```jsx
import { DateInput } from './components/FormControls';

<DateInput
  label="Date of Birth"
  name="dateOfBirth"
  value={dateOfBirth}
  onChange={(e) => setDateOfBirth(e.target.value)}
  required
  error={errors.dateOfBirth}
/>
```

**Props:**
- `label` (string) - Label text
- `name` (string) - Input name
- `value` (string) - Current value (YYYY-MM-DD format)
- `onChange` (function) - Change handler
- `required` (boolean) - Required field
- `disabled` (boolean) - Disabled state
- `error` (string) - Error message to display
- `className` (string) - Additional CSS classes

---

### SectionHeader
Visual section divider with dark navy background.

```jsx
import { SectionHeader } from './components/FormControls';

<SectionHeader title="Customer Details" />
<TextInput ... />
<TextInput ... />

<SectionHeader title="Vehicle Details" />
<SelectInput ... />
<TextInput ... />
```

**Props:**
- `title` (string) - Section title
- `className` (string) - Additional CSS classes

---

## CSS Custom Properties Required

The components reference these CSS variables. Ensure they are defined in your global styles:

```css
:root {
  --color-navy: #0a1e3d;
  --color-accent: #1a3b66;
  --color-border: #d0d7de;
  --color-border-focus: #1a3b66;
  --color-text: #24292e;
  --color-text-light: #656d76;
  --color-white: #ffffff;
  --color-bg: #f6f8fa;
  --border-radius: 6px;
  --transition-speed: 150ms;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
```

## Import All Components

```jsx
import {
  TextInput,
  SelectInput,
  RadioGroup,
  CheckboxInput,
  DateInput,
  SectionHeader,
} from './components/FormControls';
```

Or import individual components:

```jsx
import { TextInput } from './components/FormControls';
```
