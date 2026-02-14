import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat; // Assuming price in cents
    category : Text;
    stock : Nat;
  };

  type Order = {
    id : Nat;
    productId : Nat;
    quantity : Nat;
    totalPrice : Nat;
    customerName : Text;
    shippingAddress : Text;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  var nextProductId = 1;
  var nextOrderId = 1;

  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Nat, category : Text, stock : Nat) : async Nat {
    let productId = nextProductId;
    nextProductId += 1;

    let product : Product = {
      id = productId;
      name;
      description;
      price;
      category;
      stock;
    };

    products.add(productId, product);
    productId;
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().sort().filter(func(p) { p.category == category });
  };

  public query ({ caller }) func searchProductsByName(searchTerm : Text) : async [Product] {
    let lowerSearchTerm = searchTerm.toLower();
    products.values().toArray().filter(
      func(product) {
        product.name.toLower().contains(#text lowerSearchTerm);
      }
    );
  };

  public shared ({ caller }) func placeOrder(productId : Nat, quantity : Nat, customerName : Text, shippingAddress : Text) : async ?Order {
    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?p) { p };
    };

    if (product.stock < quantity) {
      Runtime.trap("Insufficient stock");
    };

    let totalPrice = product.price * quantity;
    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : Order = {
      id = orderId;
      productId;
      quantity;
      totalPrice;
      customerName;
      shippingAddress;
    };

    products.add(
      productId,
      { product with stock = product.stock - quantity }
    );

    orders.add(orderId, order);
    ?order;
  };

  public query ({ caller }) func getOrder(id : Nat) : async ?Order {
    orders.get(id);
  };
};
