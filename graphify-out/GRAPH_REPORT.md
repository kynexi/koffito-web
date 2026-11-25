# Graph Report - koffito-web  (2026-11-25)

## Corpus Check
- Corpus is ~28,444 words - fits in a single context window. You may not need a graph.

## Summary
- 621 nodes · 2143 edges · 28 communities (26 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Onboarding Survey
- Events & Coffee Talks
- App Shell & Admin Gate
- Components Showcase
- Person & Events Context
- Create Event Pickers
- Admin Reports
- TS App Config
- Dependencies
- TS Node Config
- shadcn Config
- Chip & Icon
- Dev Dependencies
- Dialog & Empty State
- Theme Provider
- ESLint Config
- Router & Tab Bar
- Badge & Text
- Header & IconButton
- Button & Spinner
- Tailwind Config
- Toast
- Entry & Fonts
- Vite Config
- TS Root Config
- NPM Scripts
- Vite Env Types

## God Nodes (most connected - your core abstractions)
1. `Text()` - 111 edges
2. `cn()` - 67 edges
3. `Button()` - 65 edges
4. `react` - 56 edges
5. `Icon()` - 50 edges
6. `Screen()` - 44 edges
7. `Header()` - 42 edges
8. `Card()` - 36 edges
9. `useToast()` - 35 edges
10. `Input()` - 30 edges

## Surprising Connections (you probably didn't know these)
- `FindCoffeeTalkPage()` --indirect_call--> `goBack()`  [INFERRED]
  src/app/(app)/find-coffee-talk.tsx → src/lib/navigation.ts
- `CafePicker()` --indirect_call--> `cafeFromApi()`  [INFERRED]
  src/components/events/cafe-picker.tsx → src/lib/mappers.ts
- `App()` --calls--> `EventsProvider()`  [EXTRACTED]
  src/app.tsx → src/context/events.tsx
- `App()` --calls--> `SessionProvider()`  [EXTRACTED]
  src/app.tsx → src/context/session.tsx
- `AppRoutes()` --calls--> `ComponentsScreen()`  [EXTRACTED]
  src/app.tsx → src/app/(app)/components.tsx

## Import Cycles
- None detected.

## Communities (28 total, 2 thin omitted)

### Community 0 - "Onboarding Survey"
Cohesion: 0.06
Nodes (60): choiceHint(), interestSteps, onboardingSteps, Step, CafePicker(), CafePickerProps, MapPin, MapPlaceholder() (+52 more)

### Community 1 - "Events & Coffee Talks"
Cohesion: 0.07
Nodes (59): react, EventDetailsPage(), FindCoffeeTalkPage(), EventsPage(), Filter, filters, HomePage(), CafeCarouselCard() (+51 more)

### Community 2 - "App Shell & Admin Gate"
Cohesion: 0.14
Nodes (52): AdminOnly(), App(), ChangePasswordPage(), ReportPage(), SettingsPage(), MyProfilePage(), SurveyPage(), AppRoutes() (+44 more)

### Community 3 - "Components Showcase"
Cohesion: 0.07
Nodes (46): ComponentsScreen(), inTwoDays, match, maya, meetups, sam, Section(), PeopleRow() (+38 more)

### Community 4 - "Person & Events Context"
Cohesion: 0.08
Nodes (42): PersonPage(), CafeVisitedCardProps, EventsContext, EventsContextValue, EventsProvider(), NewEvent, asError(), emptyProfile (+34 more)

### Community 5 - "Create Event Pickers"
Cohesion: 0.11
Nodes (20): CreateEventPage(), combineDateTime(), DayPicker(), DayPickerProps, monthFormatter, TimePicker(), TimePickerProps, timeSlots (+12 more)

### Community 6 - "Admin Reports"
Cohesion: 0.13
Nodes (19): AdminPage(), ApiReport, Filter, filters, reportFromApi(), ReportCard(), ReportCardProps, reportStatusConfig (+11 more)

### Community 7 - "TS App Config"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+14 more)

### Community 8 - "Dependencies"
Cohesion: 0.13
Nodes (20): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, @radix-ui/react-dialog@^1.3.1, @radix-ui/react-switch@^1.4.1, react@^19.1.0, react-icons@^5.7.0, tailwind-merge@^2.6.1 (+12 more)

### Community 9 - "TS Node Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+10 more)

### Community 10 - "shadcn Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 11 - "Chip & Icon"
Cohesion: 0.20
Nodes (10): ChipProps, ChipSize, sizeClasses, glyphBox(), IconProps, tokenNames, IconName, icons (+2 more)

### Community 12 - "Dev Dependencies"
Cohesion: 0.13
Nodes (15): devDependencies, autoprefixer@^10.6.2, eslint@^9.25.0, postcss@^8.5.33, @types/node@^26.6.6, @types/react@^19.1.2, @types/react-dom@^19.1.2, typescript@~5.8.3 (+7 more)

### Community 13 - "Dialog & Empty State"
Cohesion: 0.16
Nodes (8): ButtonProps, EmptyStateProps, ErrorState(), ErrorStateProps, ModalAction, ModalProps, StateView(), StateViewProps

### Community 14 - "Theme Provider"
Cohesion: 0.21
Nodes (11): subscribe(), useKoffitoTheme(), avatarTones, ColorScheme, dark, light, motion, palette (+3 more)

### Community 15 - "ESLint Config"
Cohesion: 0.18
Nodes (10): @eslint/js@^9.25.0, eslint-plugin-react-hooks@^5.2.0, eslint-plugin-react-refresh@^0.4.19, globals@^16.0.0, typescript-eslint@^8.30.1, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+2 more)

### Community 16 - "Router & Tab Bar"
Cohesion: 0.25
Nodes (9): react-router@^7.18.6, react-router, AppTabBar(), tabs, TabBadge(), TabBar(), TabBarButton(), TabBarItem (+1 more)

### Community 17 - "Badge & Text"
Cohesion: 0.25
Nodes (7): BadgeProps, variantStyles, TextProps, TextTone, TextVariant, toneClasses, variantClasses

### Community 18 - "Header & IconButton"
Cohesion: 0.22
Nodes (7): HeaderProps, HeaderSize, IconButtonProps, IconButtonSize, IconButtonVariant, sizeStyles, variantStyles

### Community 19 - "Button & Spinner"
Cohesion: 0.32
Nodes (6): ButtonSize, ButtonVariant, sizeStyles, variantStyles, Spinner(), ColorToken

### Community 20 - "Tailwind Config"
Cohesion: 0.29
Nodes (5): tailwindcss-animate@^1.0.7, tailwindcss@^3.4.19, tailwindcss, tailwindcss-animate, colorTokens

### Community 21 - "Toast"
Cohesion: 0.29
Nodes (6): ToastContext, ToastContextValue, ToastItem, ToastOptions, ToastVariant, variantStyles

### Community 22 - "Entry & Fonts"
Cohesion: 0.33
Nodes (4): @fontsource/nunito@^5.3.0, react-dom@^19.1.0, @fontsource/nunito, react-dom

### Community 23 - "Vite Config"
Cohesion: 0.33
Nodes (4): vite@^6.3.5, @vitejs/plugin-react@^4.4.1, vite, @vitejs/plugin-react

### Community 24 - "TS Root Config"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, files, references

### Community 25 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Events & Coffee Talks` to `Onboarding Survey`, `App Shell & Admin Gate`, `Components Showcase`, `Person & Events Context`, `Create Event Pickers`, `Admin Reports`, `Dependencies`, `Chip & Icon`, `Dialog & Empty State`, `Theme Provider`, `Router & Tab Bar`, `Badge & Text`, `Header & IconButton`, `Button & Spinner`, `Toast`, `Entry & Fonts`?**
  _High betweenness centrality (0.201) - this node is a cross-community bridge._
- **Should `Onboarding Survey` be split into smaller, more focused modules?**
  _Cohesion score 0.05506329113924051 - nodes in this community are weakly interconnected._
- **Why does `Text()` connect `Onboarding Survey` to `Events & Coffee Talks`, `App Shell & Admin Gate`, `Components Showcase`, `Person & Events Context`, `Create Event Pickers`, `Admin Reports`, `Chip & Icon`, `Dialog & Empty State`, `Router & Tab Bar`, `Badge & Text`, `Header & IconButton`, `Button & Spinner`, `Toast`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Should `Events & Coffee Talks` be split into smaller, more focused modules?**
  _Cohesion score 0.07465108730931516 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `Onboarding Survey` to `Events & Coffee Talks`, `App Shell & Admin Gate`, `Components Showcase`, `Create Event Pickers`, `Chip & Icon`, `Dialog & Empty State`, `Router & Tab Bar`, `Badge & Text`, `Header & IconButton`, `Button & Spinner`, `Toast`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `App Shell & Admin Gate` be split into smaller, more focused modules?**
  _Cohesion score 0.13622526636225266 - nodes in this community are weakly interconnected._
- **Should `Components Showcase` be split into smaller, more focused modules?**
  _Cohesion score 0.07393483709273183 - nodes in this community are weakly interconnected._