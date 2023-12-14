import { z } from "zod";
import { formattedCountries } from "../utils";

export const newSocietyValidationSchema = z.object({
  name: z
    .string()
    .max(100, "Max 100 Characters for Society Name")
    .min(1, "Required"),
  streetAddress: z
    .string()
    .max(255, "Max  255 Characters for Street Address")
    .min(1, "Required"),
  addressLine2: z
    .string()
    .max(255, "Max  150 Characters for Street Address")
    .default("")
    .optional(),
  city: z
    .string()
    .max(255, "Max  255 Characters for City Name")
    .min(1, "Required"),
  province: z
    .string()
    .max(255, "Max  255 Characters for State/Province/Region")
    .min(1, "Required")
    .describe("State / Province / Region"),
  zipCode: z
    .string()
    .max(15, "Max  15 Characters for Zip Code")
    .min(1, "Required"),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  country: z.enum(formattedCountries),
  password: z
    .string()
    .min(6, "Mininum 6 characters for password")
    .max(16, "Max 16 characers for password"),
});
