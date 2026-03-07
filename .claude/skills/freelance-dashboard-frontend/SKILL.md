# freelance-dashboard-frontend Development Patterns

> Auto-generated skill from repository analysis

## Overview

This Angular-based freelance dashboard frontend provides a comprehensive project management interface with position tracking, kanban boards, and multilingual support. The codebase follows modern Angular patterns with NgRx state management, TypeScript strict typing, and component-based architecture. The application features a positions management system with detailed drawer interfaces, status boards, and internationalization support for French and English locales.

## Coding Conventions

### File Naming
- Use **camelCase** for all TypeScript files
- Component files: `componentName.component.ts`
- Service files: `serviceName.service.ts`
- Test files: `fileName.spec.ts`

### Import Style
```typescript
// Use relative imports
import { Component } from '@angular/core';
import { PositionDetailService } from './position-detail.service';
import { CommonModule } from '@angular/common';
```

### Export Style
```typescript
// Use named exports
export class PositionDetailComponent {
  // component logic
}

export interface PositionData {
  // interface definition
}
```

### Commit Conventions
- Use prefixes: `feat:` for new features, `fix:` for bug fixes
- Keep messages concise (~64 characters average)
- Example: `feat: add position status filtering`

## Workflows

### Feature Implementation with UI Enhancement
**Trigger:** When adding new functionality to the application
**Command:** `/new-feature`

1. **Update component templates** - Modify `*.component.html` files with new UI elements
2. **Enhance component logic** - Update `*.component.ts` files with TypeScript functionality
3. **Create/update services** - Add business logic to `*.service.ts` files
4. **Add translations** - Update `src/assets/i18n/fr.json` and `src/assets/i18n/en.json`
5. **Update API specification** - Modify `openapi/api.yaml` if backend changes are needed

```typescript
// Example component enhancement
export class FeatureComponent implements OnInit {
  @Input() newProperty: string;
  
  constructor(private featureService: FeatureService) {}
  
  onNewAction(): void {
    this.featureService.performAction(this.newProperty);
  }
}
```

### Position Detail Enhancement
**Trigger:** When modifying position management features
**Command:** `/enhance-position-detail`

1. **Update position detail template** - Modify `src/app/position-detail/position-detail.component.html`
2. **Enhance component logic** - Update `src/app/position-detail/position-detail.component.ts`
3. **Update utility service** - Modify `src/app/position-detail/position-detail-util.service.ts`
4. **Add French translations** - Update `src/assets/i18n/fr.json`
5. **Update API specification** - Add new fields to `openapi/api.yaml`

```html
<!-- Example template enhancement -->
<mat-form-field>
  <mat-label>{{ 'position.newField' | translate }}</mat-label>
  <input matInput [(ngModel)]="position.newField" />
</mat-form-field>
```

### UI Component Styling Update
**Trigger:** When improving the visual appearance of components
**Command:** `/update-ui-styling`

1. **Update component styles** - Modify `*.component.scss` files
2. **Adjust HTML templates** - Update `*.component.html` for structural changes
3. **Update component logic** - Modify `*.component.ts` for styling-related logic
4. **Update translations** - Modify `src/assets/i18n/fr.json` if UI text changes

```scss
// Example SCSS enhancement
.enhanced-component {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  &__header {
    background: var(--primary-color);
    padding: 1rem;
    border-radius: 0.5rem;
  }
}
```

### NgRx State Management Update
**Trigger:** When adding new state management functionality
**Command:** `/add-ngrx-feature`

1. **Create action files** - Add `src/core/store/actions/feature.actions.ts`
2. **Implement effects** - Create `src/core/store/effects/feature.effects.ts`
3. **Update reducers** - Add `src/core/store/reducers/feature.reducers.ts`
4. **Update app state** - Modify `src/core/store/state/app.states.ts`
5. **Register reducers** - Update `src/core/store/reducers/reducers.ts`

```typescript
// Example action definition
export const loadFeatureData = createAction(
  '[Feature] Load Data',
  props<{ payload: FeatureParams }>()
);

// Example reducer
const featureReducer = createReducer(
  initialState,
  on(loadFeatureData, (state, { payload }) => ({
    ...state,
    loading: true,
    error: null
  }))
);
```

### Kanban Board Enhancement
**Trigger:** When enhancing the kanban board features
**Command:** `/enhance-kanban-board`

1. **Update board template** - Modify `src/app/positions-board/status-board.component.html`
2. **Enhance board logic** - Update `src/app/positions-board/status-board.component.ts`
3. **Update board service** - Modify `src/app/positions-board/status-board.service.ts`
4. **Style improvements** - Update `src/app/positions-board/status-board.component.scss`
5. **Add translations** - Update `src/assets/i18n/fr.json`

```typescript
// Example kanban enhancement
export class StatusBoardComponent {
  onCardDrop(event: CdkDragDrop<Position[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
```

## Testing Patterns

### Jest Configuration
- Test files use pattern: `*.spec.ts`
- Tests are co-located with source files
- Use Jest framework for unit testing

```typescript
// Example test structure
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComponentName],
      imports: [CommonModule]
    }).compileComponents();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Commands

| Command | Purpose |
|---------|---------|
| `/new-feature` | Implement new application features with full UI and service integration |
| `/enhance-position-detail` | Modify and improve position management functionality |
| `/update-ui-styling` | Update component styling and visual enhancements |
| `/add-ngrx-feature` | Add new NgRx state management functionality |
| `/enhance-kanban-board` | Improve positions kanban board features and appearance |