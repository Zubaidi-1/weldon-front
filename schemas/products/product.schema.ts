import z from "zod";

const productImageSchema = z
  .file()
  .max(20_000_000)
  .mime(["image/png", "image/jpeg", "image/webp"]);

const productCategorySchema = z.enum([
  "MELA_WHITE",
  "ESSENTIAL",
  "HYDRATING",
  "REGULATING",
  "SENSITIVE",
  "GREEN_PEEL",
  "BEAUTY_ELEMENTS",
  "VITALITY",
  "BODY_SCIENCE",
  "BODY_CARE",
  "HAIR",
  "MEN",
  "NIGHT_CARE",
  "AMPOULE",
  "DRY_SKIN",
]);

export const AddProductSchema = z.object({
  productName: z
    .string()
    .min(3, "Product Name must be at least 3 charachters")
    .max(70, "Product Name must be 70 charachters at max"),

  productSubTitle: z
    .string()
    .max(160, "Product subtitle must be 160 characters at max")
    .optional()
    .or(z.literal("")),

  stockQuantity: z
    .number("Please provide Product Stock")
    .min(0, "Product Stock can not be less than 0")
    .max(999999, "Product max quantity is 999999"),

  productCategory: z
    .array(productCategorySchema, "Please select a category")
    .min(1, "Please select at least one category"),

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

  productImages: z
    .array(productImageSchema, "Please upload at least one image")
    .min(1, "Please upload at least one image")
    .max(10, "You can upload up to 10 images"),

  productShades: z
    .string()
    .max(400, "Product shades must be 400 characters at max")
    .optional()
    .or(z.literal("")),
});

export const EditProductSchema = AddProductSchema.omit({
  productImages: true,
}).extend({
  productImages: z
    .array(productImageSchema)
    .max(10, "You can upload up to 10 images")
    .optional(),
  imagesToDelete: z.array(z.string()).optional(),
});

export type AddProductType = z.infer<typeof AddProductSchema>;
export type EditProductType = z.infer<typeof EditProductSchema>;
