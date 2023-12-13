import { generateComponents } from "@uploadthing/react";
import type { OurFileRouter } from "~/server/storage";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();
