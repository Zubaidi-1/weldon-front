import { ProductCategory, ProductStatus } from "../types/ProductTypes";

export const categoryOptions: {
  label: string;
  value: ProductCategory;
}[] = [
  { label: "Mela White", value: "MELA_WHITE" },
  { label: "Essential", value: "ESSENTIAL" },
  { label: "Hydrating", value: "HYDRATING" },
  { label: "Regulating", value: "REGULATING" },
  { label: "Sensitive", value: "SENSITIVE" },
  { label: "Green Peel", value: "GREEN_PEEL" },
  { label: "Beauty Elements", value: "BEAUTY_ELEMENTS" },
  { label: "Vitality", value: "VITALITY" },
  { label: "Body Science", value: "BODY_SCIENCE" },
  { label: "Body Care", value: "BODY_CARE" },
  { label: "Hair", value: "HAIR" },
  { label: "Men", value: "MEN" },
  { label: "Night Care", value: "NIGHT_CARE" },
  { label: "Ampoule", value: "AMPOULE" },
  { label: "Dry Skin", value: "DRY_SKIN" },
];

export const statusOptions: {
  label: string;
  value: ProductStatus;
}[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Draft", value: "DRAFT" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" },
];
