import fs from "fs";
import path from "path";

export const deleteImageFile = (imageUrl: string) => {
  const filename = imageUrl.split("/").pop(); // Extract 'xasan-123.jpg'
  const filePath = path.join(__dirname, "../../uploads", filename!);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("🧹 Failed to delete image:", filePath, err.message);
    } else {
      console.log("🧹 Deleted old image:", filename);
    }
  });
};
