# Specification

## Summary
**Goal:** Build a simple provision store app where customers can browse a product catalog, manage a cart, and submit orders with confirmation.

**Planned changes:**
- Backend: Add product and order data models in a single Motoko actor, seed an initial product list, expose a query method to fetch products, and an update method to create orders with stable persistence across upgrades.
- Frontend: Create a responsive catalog UI that loads products, supports search by name and category filtering, and shows loading/empty states.
- Frontend: Implement a cart flow (add/remove items, quantity changes, clear cart) with an order summary and disabled checkout when empty, persisting during the session.
- Frontend + Backend: Implement checkout and order submission collecting at minimum customer name, handling success (confirmation with orderId/details and cart clear) and failure (error message while preserving cart and entered fields).
- Frontend: Apply a consistent warm/neutral (non-blue/purple primary) visual theme using existing Tailwind/Shadcn patterns.
- Frontend: Add generated static brand assets (logo and subtle background) under `frontend/public/assets/generated` and display them in the header and catalog page background.

**User-visible outcome:** Customers can browse and search products, filter by category, add items to a cart, review totals, enter their name at checkout, submit an order, and see an order confirmation with an order ID and details.
