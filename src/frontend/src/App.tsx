import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { CartProvider } from './context/CartContext';
import AppLayout from './components/layout/AppLayout';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CatalogPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirmation',
  component: OrderConfirmationPage,
});

const routeTree = rootRoute.addChildren([catalogRoute, cartRoute, checkoutRoute, confirmationRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
