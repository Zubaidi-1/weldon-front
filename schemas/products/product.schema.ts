import z from "zod";
export const AddProductSchema = z.object({
  productName: z
    .string()
    .min(3, "Product Name must be at least 3 charachters")
    .max(70, "Product Name must be 70 charachters at max"),

  stockQuantity: z
    .number("Please provide Product Stock")
    .min(0, "Product Stock can not be less than 0")
    .max(999999, "Product max quantity is 999999"),

  productCategory: z.enum(
    [
      "MELA_WHITE",
      "ESSENTIAL",
      "HYDRATING",
      "REGULATING",
      "SENSITIVE",
      "BEAUTY_ELEMENTS",
      "VITALITY",
      "BODY_SCIENCE",
      "HAIR",
      "MEN",
    ],
    { message: "Please select a category" },
  ),

  productStatus: z.enum(["ACTIVE", "OUT_OF_STOCK", "DRAFT"], {
    message: "Please select a status",
  }),
  productPrice: z
    .number("Please insert a price")
    .min(0, "Product price can not be less than 0")
    .max(999999, "Product max price is 999999"),

  productSize: z
    .number("Please provide Product Size")
    .int("Product size should not have decimals")
    .min(0, "Product size can not be less than 0")
    .max(999999, "Product max size is 999999"),

  // SKU is the id number of the manufacturer
  productSku: z
    .string()
    .min(3, "Product Sku must be at least 3 charachters")
    .max(20, "Product Name must be 20 charachters at max"),

  productDescription: z
    .string("Please enter Product description")
    .min(20, "Product description must be at least 20 charachters")
    .max(2000, "Product description must be 2000 charachters at max"),

  productImage: z
    .file("Please upload an image")
    .max(20_000_000)
    .mime(["image/png", "image/jpeg", "image/webp"]), // only accept png, jpeg and webp, max file size is 20MB
});

export const EditProductSchema = AddProductSchema.extend({
  productImage: z
    .file()
    .max(20_000_000)
    .mime(["image/png", "image/jpeg", "image/webp"])
    .optional(),
});

export type AddProductType = z.infer<typeof AddProductSchema>;
export type EditProductType = z.infer<typeof EditProductSchema>;
