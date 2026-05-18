export const jordanGovernates = [
  "Ajloun",
  "Amman",
  "Aqaba",
  "Balqa",
  "Irbid",
  "Jerash",
  "Karak",
  "Ma'an",
  "Madaba",
  "Mafraq",
  "Tafilah",
  "Zarqa",
] as const;

export type JordanGovernate = (typeof jordanGovernates)[number];
