# Transaction Domain

This domain implements transaction-related features using a vertical slice architecture.

## Architecture

### Vertical Slice Structure

Each feature contains its complete stack across multiple layers:

```
features/{feature-name}/
├── api/           # tRPC procedures (queries/mutations)
├── backend/       # Lambda functions (business logic)
├── infra/         # Step Functions state machines (workflows)
├── stack/         # Infrastructure exports (SST resources)
└── web/           # React components, pages, and routes
    ├── components/    # Feature-specific components
    ├── pages/         # Page components
    ├── {feature}.route.tsx  # Route factory function
    └── index.ts       # Public exports
```

### Domain-Level Organization

#### API Layer (`/api/`)
- **`transactionRouter.ts`**: Aggregates all feature procedures into a single router
- Each feature exports procedures that are imported and registered here
- Procedures can be queries (`.query()`) or mutations (`.mutation()`)

#### Shared Web Resources (`/web/`)
Shared components and styles for consistency across features:

- **`/web/components/`**: Reusable domain components
  - Provides shared UI components used across features
- **`/web/styles/shared.css`**: Common CSS patterns
  - `.transaction-page`: Page layout pattern
  - `.transaction-card`: Card/panel pattern
  - `.transaction-input`: Input field styles
- **`/web/routes/index.ts`**: Exports route factory functions from all features
- **`/web/pages/index.ts`**: Exports page components from all features

### Layer Responsibilities

Each layer in a feature has a specific purpose:

- **`api/`**: tRPC procedures define the API contract
  - Use Zod for input validation
  - Can invoke backend Lambda functions or Step Functions
  - Registered in the domain router

- **`backend/`**: Lambda function handlers
  - Pure business logic functions
  - Can be invoked directly or as part of Step Functions workflows
  - Export AWS Lambda `Handler` type

- **`infra/`**: Step Functions state machine definitions
  - Orchestrate multi-step workflows
  - Define Lambda invocations, choices, and error handling
  - Use SST's Step Functions helpers

- **`stack/`**: Infrastructure exports
  - Re-exports infrastructure resources (state machines, functions)
  - Makes resources available to SST config and API procedures via `Resource.*`

- **`web/`**: Frontend implementation
  - **`components/`**: Feature-specific React components with co-located CSS
  - **`pages/`**: Page-level components that compose feature components
  - **`{feature}.route.tsx`**: Route factory function for TanStack Router
  - **`index.ts`**: Public exports for the feature

## CSS Organization

### Strategy
1. **Shared domain styles** → `/web/styles/shared.css`
   - Common layout patterns (`.transaction-page`)
   - Reusable UI elements (`.transaction-card`, `.transaction-input`)
   
2. **Feature-specific styles** → Co-located with components
   - Component CSS files alongside their TSX files
   - Styles specific to that component only

3. **Composition over duplication**
   - Components use shared class names: `className="feature-name transaction-card"`
   - Shared components instead of repeated implementations

### Benefits
- **Encapsulation**: Feature styles stay with the feature
- **Reusability**: Common patterns defined once, used everywhere
- **Maintainability**: Easy to find and update styles
- **Tree-shaking**: Unused feature styles aren't bundled
- **Vertical slicing**: Complete features can be moved/deleted easily

## Adding New Features

### Step-by-Step Guide

1. **Create feature folder structure:**
   ```bash
   mkdir -p features/new-feature/{api,backend,infra,stack,web/{components,pages}}
   ```

2. **Create API procedure** (`/api/newFeatureProcedures.ts`):
   ```typescript
   import { publicProcedure } from '@purple-stack/trpc-api/trpc'
   import { z } from 'zod'
   
   export const newFeature = publicProcedure
     .input(z.object({ /* schema */ }))
     .query(async ({ input }) => {
       // Implementation
     })
   ```

3. **Register in domain router** (`/api/transactionRouter.ts`):
   ```typescript
   import { newFeature } from '../features/new-feature/api/newFeatureProcedures'
   
   export const transactionRouter = router({
     // ... existing procedures
     newFeature
   })
   ```

4. **Create web components** (`/web/components/`):
   - Component files with co-located CSS
   - Import shared styles: `import '../../../../web/styles/shared.css'`
   - Use shared components: `import { Button } from '../../../../web/components'`

5. **Create page component** (`/web/pages/NewFeaturePage.tsx`):
   ```typescript
   import '../../../../web/styles/shared.css'
   import './NewFeaturePage.css'
   // ... component implementation
   ```

6. **Create route factory** (`/web/new-feature.route.tsx`):
   ```typescript
   import type { AnyRootRoute } from '@tanstack/react-router'
   import { createRoute } from '@tanstack/react-router'
   import { NewFeaturePage } from './pages/NewFeaturePage'
   
   export const createNewFeatureRoute = <TRootRoute extends AnyRootRoute>(
     rootRoute: TRootRoute
   ) =>
     createRoute({
       getParentRoute: () => rootRoute,
       path: 'new-feature',
       component: NewFeaturePage
     })
   ```

7. **Export public API** (`/web/index.ts`):
   ```typescript
   export { NewFeaturePage } from './pages/NewFeaturePage'
   export { createNewFeatureRoute } from './new-feature.route'
   // Export component types and components as needed
   ```

8. **Register route** (`/web/routes/index.ts`):
   ```typescript
   export { createNewFeatureRoute } from '../../features/new-feature/web/index'
   ```

9. **Export page** (`/web/pages/index.ts`):
   ```typescript
   export { NewFeaturePage } from '../../features/new-feature/web'
   ```

10. **Add infrastructure** (if needed):
    - Create Step Functions in `infra/`
    - Create Lambda handlers in `backend/`
    - Export resources in `stack/index.ts`

11. **Register in main app** (outside this domain):
    - Import route factory in main app's router setup
    - Add route to route tree

### Example: Complete Feature

```typescript
// features/new-feature/api/newFeatureProcedures.ts
import { publicProcedure } from '@purple-stack/trpc-api/trpc'
import { z } from 'zod'

export const newFeature = publicProcedure
  .input(z.object({ value: z.string() }))
  .query(async ({ input }) => {
    return { result: `Processed: ${input.value}` }
  })
```

```typescript
// features/new-feature/web/components/NewFeatureForm.tsx
import { Button } from '../../../../web/components'
import '../../../../web/styles/shared.css'
import './NewFeatureForm.css'

export function NewFeatureForm() {
  return (
    <div className="new-feature-form transaction-card">
      <Button variant="primary">Submit</Button>
    </div>
  )
}
```

```typescript
// features/new-feature/web/pages/NewFeaturePage.tsx
import { appClient } from '@purple-stack/trpc-api/trpcClient'
import '../../../../web/styles/shared.css'
import './NewFeaturePage.css'
import { NewFeatureForm } from '../components/NewFeatureForm'

export function NewFeaturePage() {
  return (
    <main className="new-feature-page transaction-page">
      <h1>New Feature</h1>
      <NewFeatureForm />
    </main>
  )
}
```

```typescript
// features/new-feature/web/new-feature.route.tsx
import type { AnyRootRoute } from '@tanstack/react-router'
import { createRoute } from '@tanstack/react-router'
import { NewFeaturePage } from './pages/NewFeaturePage'

export const createNewFeatureRoute = <TRootRoute extends AnyRootRoute>(
  rootRoute: TRootRoute
) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path: 'new-feature',
    component: NewFeaturePage
  })
```

## Integration Points

### Main Application Integration

**Router Registration** (in main app):
```typescript
import { createNewFeatureRoute } from '@purple-stack/transaction/web/routes'

const newFeatureRoute = createNewFeatureRoute(rootRoute)
const routeTree = rootRoute.addChildren([/* ... */, newFeatureRoute])
```

**API Router** (already handled at domain level):
- Domain router is automatically included via `transactionRouter`
- Registered in `infra/src/apiHandler.ts`

**Infra/API Integration** (REQUIRED for domains exporting API):
When adding a new domain that exports API routes (used by `infra/src/apiHandler.ts`), you MUST:

1. **Add domain dependency to root `package.json`:**
   ```json
   {
     "devDependencies": {
       "@purple-stack/transaction": "workspace:*"
     }
   }
   ```

This is required because SST bundles Lambda functions from the root and needs workspace dependencies listed here.

**Web Package Integration** (REQUIRED for domains exporting web routes/components):
When adding a new domain that exports web routes/components, you MUST:

1. **Add domain dependency to `web/package.json`:**
   ```json
   {
     "dependencies": {
       "@purple-stack/transaction": "workspace:*"
     }
   }
   ```

2. **Add TypeScript reference to `web/tsconfig.json`:**
   ```json
   {
     "references": [
       { "path": "../domains/transaction" }
     ]
   }
   ```

3. **Add TypeScript reference to root `tsconfig.json`:**
   ```json
   {
     "references": [
       { "path": "./domains/transaction" }
     ]
   }
   ```

4. **Run `pnpm install`** to install the new dependency

Without these steps:
- SST will fail to resolve imports when bundling Lambda functions
- Vite will fail to resolve imports from the domain package

## Best Practices

1. **Keep features self-contained**: All feature code should live within the feature folder
2. **Use shared resources**: Leverage `/web/components` and `/web/styles` for consistency
3. **Export only public APIs**: Use `index.ts` files to control what's exposed
4. **Follow naming conventions**: Use kebab-case for folders, PascalCase for components
5. **Co-locate styles**: Keep CSS files next to their components
6. **Type exports**: Export TypeScript types for component props when needed
7. **Route factories**: Always use factory pattern for routes to work with root route
