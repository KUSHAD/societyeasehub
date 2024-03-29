import { generateUploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "~/server/storage";

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
