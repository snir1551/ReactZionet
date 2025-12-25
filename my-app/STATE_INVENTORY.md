# State Inventory

## All Pieces of State in the Application

### 1. **Products Data**
- **Type**: Server State
- **Description**: List of products fetched from DummyJSON API
- **Location**: TanStack Query cache

### 2. **Product Details**
- **Type**: Server State  
- **Description**: Detailed information about a single product
- **Location**: TanStack Query cache

### 3. **Categories List**
- **Type**: Server State
- **Description**: Available product categories
- **Location**: TanStack Query cache

### 4. **Search Query**
- **Type**: Client/UI State (Local)
- **Description**: Current search text input
- **Location**: Local `useState` in ProductsPage

### 5. **Selected Category**
- **Type**: Client/UI State (Local)
- **Description**: Currently selected category filter
- **Location**: Local `useState` in ProductsPage

### 6. **Pagination (Page Number)**
- **Type**: Client/UI State (Local)
- **Description**: Current page number for product listing
- **Location**: Local `useState` in ProductsPage

### 7. **Cart Sidebar Open/Closed**
- **Type**: Client/UI State (Global)
- **Description**: Whether the cart sidebar is visible
- **Location**: Cart Context (with localStorage persistence)

### 8. **Cart Contents**
- **Type**: Client/UI State (Global)
- **Description**: Items added to shopping cart with quantities
- **Location**: Cart Context (with localStorage persistence)

### 9. **Toast Notifications**
- **Type**: Client/UI State (Global)
- **Description**: Queue of notification messages to display
- **Location**: Zustand store

### 10. **Theme (Light/Dark)**
- **Type**: Client/UI State (Global)
- **Description**: Current color theme preference
- **Location**: Zustand store (with localStorage persistence)

---

## State Architecture Conclusions

### TanStack Query (Server State Only)
All **server state** clearly belongs to TanStack Query:
- Products list (with search/filter/pagination)
- Individual product details
- Categories list

These are cached, automatically revalidated, and provide loading/error states out of the box.

### Global Client State (Context + Zustand)
**Cart state** makes perfect sense as global client state using React Context:
- Cart items and quantities need to be accessible across multiple components
- Cart sidebar visibility needs to persist and be controlled from anywhere
- Using Context because it's tightly coupled with React component tree

**Toast notifications and theme** are ideal for Zustand:
- Notifications are fire-and-forget global events
- Theme affects entire application but doesn't need React's rendering optimization
- Zustand provides simpler API for these simple global states

### Local UI State (useState in Components)
**Search, category filter, and pagination** intentionally stay local to ProductsPage:
- These are ephemeral UI controls specific to one page
- Making them global would add unnecessary complexity
- They're passed to TanStack Query as query keys, which handles caching
- No other component needs direct access to these values

This separation ensures each state lives at the appropriate scope: server data in Query, shared UI state globally, and page-specific UI state locally.
