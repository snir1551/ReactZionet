# Homework 3: Global Client State + Persistence + Notifications

## Reflection & Learning Summary

### State Architecture Overview

This application demonstrates a clear separation of state management across different layers:

#### 1. **TanStack Query (Server State)**
- **Products List** - Fetched from DummyJSON API with search/filter/pagination
- **Product Details** - Individual product data by ID
- **Categories List** - Available product categories

**Why TanStack Query?**
- These are server-driven data that must stay in sync with the backend
- Built-in caching, background refetching, and loading states
- Query invalidation handles data freshness automatically
- Perfect for paginated, searchable, filterable data

#### 2. **React Context (Global UI State)**
- **Cart Items** - Shopping cart contents with quantities
- **Cart Sidebar Visibility** - Open/closed state

**Why Context?**
- Cart state needs to be accessible across many components (Navigation, ProductsPage, ProductDetailPage, CartSidebar)
- Tightly integrated with React component tree
- Combined with `useLocalStorage` hook for persistence across page refreshes
- Natural fit for React-specific global state that affects rendering

#### 3. **Zustand (Global Event-Driven State)**
- **Toast Notifications** - Queue of notification messages
- **Theme** - Light/dark mode preference

**Why Zustand?**
- Simple, lightweight global state without Provider boilerplate
- Perfect for fire-and-forget notifications (toasts)
- Theme is a simple boolean toggle that affects entire app
- Built-in `persist` middleware for localStorage integration (theme)
- Doesn't cause unnecessary re-renders like Context might

#### 4. **Local useState (Component-Specific UI State)**
- **Search Query** - Search text input (ProductsPage only)
- **Selected Category** - Category filter (ProductsPage only)
- **Pagination Page** - Current page number (ProductsPage only)

**Why Local State?**
- These values are only needed within ProductsPage
- They're ephemeral and don't persist across navigation
- Making them global would add unnecessary complexity
- They're passed as dependencies to TanStack Query, which handles the actual data fetching

---

### Implementation Highlights

#### ✅ **Step 1: State Inventory**
Created comprehensive state inventory categorizing all application state into:
- Server state (TanStack Query)
- Global client state (Context + Zustand)
- Local UI state (useState)

#### ✅ **Step 2: Cart Sidebar (Context-Based)**
- Implemented `CartContext` with `CartProvider`
- Provides: `items`, `isOpen`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `toggleSidebar`
- Integrated throughout app via `useCart` hook
- Sidebar slides in from right with backdrop overlay

#### ✅ **Step 3: Persistence with useLocalStorage Hook**
Custom hook that mirrors `useState` API but syncs with localStorage:
```typescript
useLocalStorage<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>]
```
- Reads from localStorage on mount
- Writes to localStorage on every change
- Handles SSR safety and JSON parse errors
- Used for cart items AND sidebar open/closed state

**Test Results:**
- ✅ Cart items persist across page refresh
- ✅ Sidebar state persists (if open, stays open after refresh)
- ✅ Works with functional updates: `setState(prev => ...)`

#### ✅ **Step 4: Toast Notifications (Zustand)**
Created `toastStore` with Zustand:
- Toast shape: `{ id, type, message, timestamp }`
- Actions: `addToast`, `removeToast`, `clearAll`
- Auto-dismisses after 5 seconds
- Supports 4 types: success, error, info, warning

**ToastHost Component:**
- Renders toasts in fixed position (top-right)
- Different colors per type
- Close button on each toast
- Smooth slide-in animation

#### ✅ **Step 5: Connected Toasts to Real Events**
Integrated toasts with cart operations:
- **Success**: "Product added to cart!" (on addItem)
- **Info**: "Product removed from cart" (on removeItem)  
- **Warning**: "Cart cleared" (on clearCart)
- **Success**: "Added another [product] to cart" (when increasing quantity of existing item)

All toasts are triggered from within `CartContext` using `useToastStore()`.

#### ✅ **Bonus A: Theme Toggle (Zustand + Persist)**
- Global theme store with light/dark modes
- Toggle button in navigation (🌙/☀️)
- Persists to localStorage using Zustand's `persist` middleware
- CSS variables system (`--bg-color`, `--text-color`, etc.)
- Smooth transitions between themes

---

### Examples of Correct State Architecture

#### 🎯 **Global State Was Clearly Correct:**
**Cart State (Context)**
- Cart items need to be read by: Navigation (badge count), ProductsPage (add button), ProductDetailPage (add button), CartSidebar (display)
- Cart actions need to trigger from multiple places
- Making this local to any single component would require prop drilling through many levels
- Context provides clean, type-safe access anywhere in the tree

#### 🎯 **Local State Was Intentionally NOT Global:**
**Search/Filter State (Local useState)**
- Search query only matters to ProductsPage
- Passed directly to TanStack Query as a dependency
- Making it global would mean:
  - Other pages could accidentally access/modify it
  - Unnecessary re-renders across unrelated components
  - More complex debugging
- Local state keeps it scoped and predictable

---

### What I Learned About State Architecture

1. **TanStack Query is NOT just for fetching** - It's a complete server state management solution. Treating it as such (with proper cache keys, stale times, placeholderData) eliminates the need for separate global state for server data.

2. **Context vs Zustand trade-offs**:
   - **Context**: Better for state that's tightly coupled to React's rendering (like cart items that drive UI updates)
   - **Zustand**: Better for event-driven state (toasts) or simple global toggles (theme)

3. **Persistence isn't "all or nothing"**:
   - Cart items: ✅ Persist (user expects cart to survive refresh)
   - Sidebar open state: ✅ Persist (UX convenience)
   - Theme: ✅ Persist (user preference)
   - Search query: ❌ Don't persist (ephemeral, page-specific)
   - Toasts: ❌ Don't persist (temporary notifications)

4. **The "useLocalStorage" pattern is powerful**:
   - Drop-in replacement for `useState`
   - Automatic sync with localStorage
   - Works with functional updates
   - Reusable across different data types

5. **State should live at the right "altitude"**:
   - Too global = unnecessary complexity and coupling
   - Too local = prop drilling and lost opportunities for reuse
   - The key is asking: "Who needs to read/write this state?"

6. **Combining state management libraries is GOOD**:
   - This app uses: TanStack Query + Context + Zustand + useState
   - Each handles what it's best at
   - No single tool is the "right" choice for everything
   - The architecture is more maintainable because each piece has a clear purpose

---

### Technical Implementation Summary

**Technologies Used:**
- React 19 with TypeScript
- TanStack Query v5 for server state
- React Context API for cart state
- Zustand v5 for toasts and theme
- Custom `useLocalStorage` hook for persistence
- CSS Variables for theming

**File Structure:**
```
src/
├── api/              # API calls (products.ts, types.ts)
├── components/       # UI components (Navigation, CartSidebar, ToastHost, ProductCard)
├── context/          # React Context (cart.ts, CartContext.tsx)
├── hooks/            # Custom hooks (useCart.ts, useLocalStorage.ts)
├── pages/            # Route pages (Home, ProductsPage, ProductDetailPage, About, etc.)
├── stores/           # Zustand stores (toastStore.ts, themeStore.ts)
└── styles.css        # Global styles for cart, toasts, navigation
```

**Key Features:**
- ✅ Full shopping cart with add/remove/quantity control
- ✅ Cart persists across page refreshes
- ✅ Slide-in sidebar with backdrop
- ✅ Toast notifications for all cart events
- ✅ Light/dark theme toggle
- ✅ Product search and category filtering
- ✅ Product detail pages with "Add to Cart"
- ✅ Real-time cart badge in navigation

---

### Conclusion

This homework demonstrated that **state architecture is about choosing the right tool for each job**. By combining TanStack Query (server state), React Context (shared UI state), Zustand (event-driven state), and local useState (component state), we created an application where:

- Server data is always in sync
- Cart state is accessible where needed
- Notifications are fire-and-forget
- Page-specific UI stays local
- Everything persists appropriately

The result is clean, maintainable code where each piece of state has a clear owner and purpose.
