import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Product } from '../backend';

export function useProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

interface PlaceOrderParams {
  productId: bigint;
  quantity: bigint;
  customerName: string;
  shippingAddress: string;
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: PlaceOrderParams) => {
      if (!actor) throw new Error('Actor not initialized');
      const order = await actor.placeOrder(
        params.productId,
        params.quantity,
        params.customerName,
        params.shippingAddress
      );
      if (!order) throw new Error('Order placement failed');
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
