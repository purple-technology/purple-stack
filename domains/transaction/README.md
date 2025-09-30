# Transaction Domain

This domain implements transaction-related features using a vertical slice architecture.

## Architecture

### Vertical Slice Structure

Each feature contains its complete stack:
- **API**: tRPC procedures
- **Backend**: Business logic (future)
- **Web**: React components and styles
- **Stack**: Infrastructure (SST)

### Shared Resources

The domain provides shared components and styles in the `/web` folder for consistency across features:

#### Shared Components (`/web/components/`)
- `Button`: Reusable button component with primary/secondary variants
  - Usage: `<Button variant="primary">Click me</Button>`
  - Supports all standard button props

#### Shared Styles (`/web/styles/`)
- `shared.css`: Common patterns used across transaction features
  - `.transaction-page`: Page layout pattern
  - `.transaction-card`: Card/panel pattern with dark variant
  - `.transaction-input`: Input field styles

### Features

#### Deposit Feature (`/features/deposit/`)
```
deposit/
├── api/
│   └── depositProcedures.ts        # tRPC mutation
├── web/
│   ├── components/
│   │   ├── DepositForm.tsx         # Form component
│   │   ├── DepositForm.css         # Form-specific styles
│   │   ├── DepositSummary.tsx      # Summary component
│   │   └── DepositSummary.css      # Summary-specific styles
│   ├── pages/
│   │   ├── DepositPage.tsx         # Page component
│   │   └── DepositPage.css         # Page-specific styles
│   └── index.ts                     # Public exports
├── backend/
└── stack/
```

**Usage:**
```tsx
import { DepositPage } from '@purple-stack/transaction/web/pages'
```

#### Withdrawal Feature (`/features/withdrawal/`)
```
withdrawal/
├── api/
│   └── withdrawalProcedures.ts     # tRPC query
├── web/
│   ├── components/
│   │   ├── WithdrawalLimits.tsx    # Limits display component
│   │   └── WithdrawalLimits.css    # Component-specific styles
│   ├── pages/
│   │   ├── WithdrawalPage.tsx      # Page component
│   │   └── WithdrawalPage.css      # Page-specific styles
│   └── index.ts                     # Public exports
├── backend/
└── stack/
```

**Usage:**
```tsx
import { WithdrawalPage } from '@purple-stack/transaction/web/pages'
```

## CSS Organization

### Strategy
1. **Shared domain styles** → `/web/styles/shared.css`
   - Common layout patterns (`.transaction-page`)
   - Reusable UI elements (`.transaction-card`, `.transaction-input`)
   
2. **Feature-specific styles** → Co-located with components
   - `DepositForm.css` alongside `DepositForm.tsx`
   - Styles specific to that component only

3. **Composition over duplication**
   - Components use shared class names: `className="deposit-form transaction-card"`
   - Shared Button component instead of repeated button styles

### Benefits
- **Encapsulation**: Feature styles stay with the feature
- **Reusability**: Common patterns defined once, used everywhere
- **Maintainability**: Easy to find and update styles
- **Tree-shaking**: Unused feature styles aren't bundled
- **Vertical slicing**: Complete features can be moved/deleted easily
- **Clean structure**: All web-related shared code lives in `/web` folder

## Adding New Features

1. Create feature folder: `/features/new-feature/`
2. Add API procedures in `/api/`
3. Create web components in `/web/components/` with their CSS
4. Create page in `/web/pages/` with its CSS
5. Use shared components from `/web/components/`
6. Import shared styles: `import '../../../../web/styles/shared.css'`
7. Export public API via `/web/index.ts`

Example:
```tsx
// features/new-feature/web/components/MyComponent.tsx
import { Button } from '../../../../web/components'
import '../../../../web/styles/shared.css'
import './MyComponent.css'

export function MyComponent() {
  return (
    <div className="my-component transaction-card">
      <Button>Click me</Button>
    </div>
  )
}
```
