export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderProduct = {
  cartItemId: number;
  orderItemId?: number;
  productId: number;
  productName: string;
  productImage: string | null;
  productPrice: number;
  quantity: number;
  size: number;
  lineTotal: number;
};

export type UserOrderProduct = {
  id: number;
  orderLineId: number;
  productId: number;
  productName: string;
  productImage: string | null;
  productPrice: number | string;
  productSize: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
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

export type UserOrder = Omit<Order, "products"> & {
  orderLine: {
    id: number;
    orderId: number;
    products: UserOrderProduct[];
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type PaginatedOrders = {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
