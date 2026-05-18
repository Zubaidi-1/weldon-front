export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderProduct = {
  cartItemId: number;
  productId: number;
  productName: string;
  productImage: string | null;
  productPrice: number;
  quantity: number;
  size: number;
  lineTotal: number;
};

export type Order = {
  orderId: number;
  userId: number | null;
  orderEmail: string;
  orderPhoneNumber: string;
  orderFirstName: string;
  orderLastName: string;
  orderGovernate: string;
  orderAddress: string;
  canceled: boolean;
  orderStatus: OrderStatus;
  products: OrderProduct[];
  createdAt: string;
  updatedAt: string;
};

export type PaginatedOrders = {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
};
