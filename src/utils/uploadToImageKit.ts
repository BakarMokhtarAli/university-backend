// import { imagekit } from "./imagekit";

import { imagekit } from "./imagekit";

export const uploadToImageKit = async (
  fileBuffer: Buffer,
  fileName: string
): Promise<string> => {
  const result = await imagekit.upload({
    file: fileBuffer.toString("base64"), // must be base64 string
    fileName: `${Date.now()}-${fileName}`,
  });

  return result.url; // 🌍 CDN image URL
};

// export const uploadToImageKit = async (
//   fileBuffer: Buffer,
//   fileName: string
// ) => {
//   const result = await imagekit.upload({
//     file: fileBuffer.toString("base64"),
//     fileName: `${fileName}-${Date.now()}`,
//   });

//   console.log("result:", result);

//   return {
//     url: result.url,
//     fileId: result.fileId, // used for deletion
//   };
// };
