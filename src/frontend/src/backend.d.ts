import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Order {
    id: bigint;
    customerName: string;
    productId: bigint;
    quantity: bigint;
    shippingAddress: string;
    totalPrice: bigint;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    stock: bigint;
    category: string;
    price: bigint;
}
export interface backendInterface {
    addProduct(name: string, description: string, price: bigint, category: string, stock: bigint): Promise<bigint>;
    getAllProducts(): Promise<Array<Product>>;
    getOrder(id: bigint): Promise<Order | null>;
    getProduct(id: bigint): Promise<Product | null>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    placeOrder(productId: bigint, quantity: bigint, customerName: string, shippingAddress: string): Promise<Order | null>;
    searchProductsByName(searchTerm: string): Promise<Array<Product>>;
}
