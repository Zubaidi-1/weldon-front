export const parseProductShades = (value?: string | string[]) => {
  const values = Array.isArray(value) ? value : [value ?? ""];

  return values
    .flatMap((item) => {
      try {
        const parsed = JSON.parse(item) as unknown;

        if (Array.isArray(parsed)) {
          return parsed.filter((shade): shade is string => {
            return typeof shade === "string" && shade.trim().length > 0;
          });
        }
      } catch {
        return item.split(",");
      }

      return [item];
    })
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 20);
};
