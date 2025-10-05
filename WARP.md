# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Install dependencies
npm install

# Start development server with proxy
npm start
# Equivalent to: ng serve --proxy-config proxy.conf.json

# Start without proxy (for direct API calls)
npm run start-no-proxy

# Build for production
npm run build

# Build and watch for changes (development mode)
npm run watch
```

### API and Code Generation
```bash
# Generate API services from OpenAPI specification
npm run openapi-gen
# This generates TypeScript Angular services in ./generated/ from ./openapi/api.yaml
# Use this after updating API specifications
```

### Testing
```bash
# Run unit tests with Karma
npm test
# Tests are located in src/**/*.spec.ts files
```

### Linting and Code Quality
```bash
# Run Angular CLI commands
npx ng <command>

# Generate new components, services, etc.
npx ng generate component <name>
npx ng generate service <name>
```

## Architecture Overview

### Framework and Stack
- **Angular 18.2** with TypeScript 5.4+
- **NgRx 18** for centralized state management (store, effects, entity)
- **Auth0** for authentication and authorization
- **PrimeNG 18** with custom Material Design theme for UI components
- **Tailwind CSS 3** with PrimeFlex for styling and layout
- **RxJS 7** for reactive programming

### Modular Architecture
The application uses Angular's lazy-loaded routing with the following main modules:

- `log-in-sign-up.module` - Authentication flows
- `positions.module` - Job position management
- `main.module` - Dashboard/home functionality  
- `profile.module` - User profile management

### Key Directories
- `/src/app` - Main application components and routing
- `/src/core` - Services, guards, interceptors, and NgRx store
- `/src/shared` - Reusable components and utilities
- `/generated` - Auto-generated API services from OpenAPI spec
- `/openapi` - API specification files
- `/src/environments` - Environment configuration

### State Management with NgRx
The application implements a comprehensive NgRx pattern:

**Store Structure:**
- `positionState` - Job positions data
- `authState` - Authentication status and user info
- `loaderState` - Global loading indicators
- `filterState` - Position filtering/search
- `eventState` - Application-wide events/notifications
- `positionDetailsDrawerState` - UI state for position editing
- `passwordResetTokenState` - Password reset functionality
- `skillsState` - Skills management

**Key Effects:**
- `PositionEffects` - Position CRUD operations
- `AuthEffects` - Authentication flows
- `FilterEffects` - Search and filtering
- `FreelancerEffects` - User profile operations

### Routing and Guards
- **Lazy Loading**: All major modules are lazy-loaded for performance
- **Route Guards**: `LoggedInGuard` protects authenticated routes
- **Route Structure**:
  - `/` - Login/signup (public)
  - `/positions` - Position management (protected)
  - `/main` - Dashboard (protected)
  - `/profile` - User profile (protected)

### API Integration
- **OpenAPI Code Generation**: API services are auto-generated from `./openapi/api.yaml`
- **HTTP Interceptors**: 
  - `LoaderInterceptor` - Shows/hides loading indicators
  - Authentication token injection
- **Proxy Configuration**: `proxy.conf.json` for local development API calls

### UI Components and Styling
- **Smart & Dumb Components**: Clear separation of container vs presentational components
- **PrimeNG**: Primary UI component library with custom theming
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Theme**: Material Design preset with custom styling for buttons, inputs, dialogs
- **Responsive Design**: Mobile-first approach with PrimeFlex grid system

## Common Development Patterns

### Component Generation
When creating new components, follow the established patterns:
```bash
# Generate a new component with SCSS styling
npx ng generate component components/my-component --style=scss

# Generate a service
npx ng generate service services/my-service
```

### NgRx Development Flow
1. Define actions in `/src/core/store/actions/`
2. Create/update reducers in `/src/core/store/reducers/`
3. Implement effects in `/src/core/store/effects/`
4. Add selectors using `createSelector`
5. Register new state in `reducers.ts`

### API Service Usage
After updating OpenAPI specifications:
1. Run `npm run openapi-gen`
2. Import generated services from `../../../../generated`
3. Use with dependency injection in components/services

### Authentication Flow
- Uses Auth0 Angular SDK
- Guards protect routes with `canLoad: [LoggedInGuard]`
- User info stored in NgRx auth state
- Tokens automatically handled by Auth0 service

### Translation and i18n
- Uses `@ngx-translate` for internationalization
- Translation files in `/src/assets/i18n/`
- Default language: French (`'fr'`)

## Build Configurations

### Development vs Production
- **Development**: Optimized for debugging with source maps
- **Production**: Minified, tree-shaken, optimized builds
- **Environment Files**: `/src/environments/environment.ts` and `.prod.ts`

### Proxy Configuration
Development server uses `proxy.conf.json` to proxy API calls, avoiding CORS issues during development.

## Testing Strategy
- **Unit Tests**: Jasmine + Karma for component and service testing
- **Test Files**: Located alongside source files with `.spec.ts` extension
- **Coverage**: Karma generates coverage reports

## Performance Considerations
- **Lazy Loading**: Routes are split into chunks for optimal loading
- **OnPush Change Detection**: Used where applicable for performance
- **Tree Shaking**: Unused code eliminated in production builds
- **Bundle Analysis**: Use Angular CLI's bundle analyzer for optimization

## Common Troubleshooting

### API Generation Issues
If OpenAPI generation fails, check:
- YAML syntax in `./openapi/api.yaml`
- OpenAPI generator CLI version compatibility
- Generated files permissions

### Build Issues
- Clear `node_modules` and reinstall if dependency conflicts
- Check TypeScript version compatibility (5.4 < 5.6)
- Verify Angular CLI version matches project requirements

### Authentication Issues
- Verify Auth0 configuration in environment files
- Check redirect URIs match Auth0 dashboard settings
- Ensure proper guard implementation on protected routes