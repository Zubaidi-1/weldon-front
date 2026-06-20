import DeleteIcon from "@/components/svg/Delete";
import EditIcon from "@/components/svg/Edit";
import { useDeleteProduct } from "@/Hooks/products/useDeleteProduct";
import { Product, ProductStatus } from "@/lib/types/ProductTypes";
import { formatProductSize } from "@/lib/utils/productSize";
import { formatCategoryLabels } from "@/lib/utils/productCategories";
import Link from "next/link";

type ProductsTableProps = {
  products: Product[];
  getProductStatus: (product: Product) => ProductStatus;
  onEdit?: (product: Product) => void;
  showActions?: boolean;
  totalProducts?: number;
};

export default function ProductsTable({
  products,
  getProductStatus,
  onEdit,
  showActions = true,
  totalProducts = products.length,
}: ProductsTableProps) {
  const { mutate, isPending } = useDeleteProduct();

  return (
    <section className="w-full overflow-hidden rounded-3xl border border-[#0089D3]/20 bg-white shadow-[0_8px_30px_rgba(0,137,211,0.10)]">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-5">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">All Products</h2>

          <p className="mt-1 text-sm text-[#64748B]">
            {totalProducts} products found
          </p>
        </div>

        <Link
          href={"/admin/products/addproduct"}
          className="rounded-xl bg-[#0089D3] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0077B8]"
        >
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead className="bg-[#F0F9FF]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Product ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Product Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Size
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                Status
              </th>
              {showActions && (
                <th className="px-6 py-4 text-left text-sm font-bold text-[#0089D3]">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E8F0] bg-white">
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={showActions ? 8 : 7}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F6FD] text-sm font-black text-[#0089D3]">
                      0
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-[#0F172A]">
                      No data found
                    </h3>

                    <p className="mt-2 text-sm text-[#64748B]">
                      Try changing the search, category, or status filter.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {products.map((product) => {
              const status = getProductStatus(product);

              return (
                <tr
                  key={product.productSku}
                  className="transition hover:bg-[#F8FBFD]"
                >
                  <td className="px-6 py-4 text-sm font-medium text-[#334155]">
                    #{product.productSku}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-[#0F172A]">
                    <div>
                      <p>{product.productName}</p>
                      {product.productSubTitle && (
                        <p className="mt-1 text-xs font-medium text-[#64748B]">
                          {product.productSubTitle}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-[#334155]">
                    ${product.productPrice}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-[#334155]">
                    {formatCategoryLabels(product.productCategory)}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-[#334155]">
                    {product.stockQuantity}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-[#334155]">
                    {formatProductSize(product.productSize)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        status === "ACTIVE"
                          ? "bg-[#DCFCE7] text-[#16A34A]"
                          : status === "DRAFT"
                            ? "bg-[#FEF3C7] text-[#D97706]"
                            : "bg-[#FEE2E2] text-[#DC2626]"
                      }`}
                    >
                      {status.replaceAll("_", " ")}
                    </span>
                  </td>

                  {showActions && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Edit product"
                          onClick={() => onEdit?.(product)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#0089D3]/20 text-[#0089D3] transition hover:bg-[#E6F6FD]"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => mutate(product.productId)}
                          disabled={isPending}
                          type="button"
                          aria-label="Delete product"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DC2626]/20 text-[#DC2626] transition hover:bg-[#FEE2E2]"
                        >
                          <DeleteIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
