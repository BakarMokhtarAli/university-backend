import axios from "axios";
import { IMGBB_API_KEY } from "../config";
import FormData from "form-data";

export const uploadImage = async (
  buffer: Buffer,
  name = "student"
): Promise<string> => {
  // Force uniqueness by adding timestamp to buffer
  const forceUniqueBuffer = Buffer.concat([
    Buffer.from(Date.now().toString()),
    buffer,
  ]);
  const base64 = forceUniqueBuffer.toString("base64");

  const uniqueName = `${name}-${Date.now()}`;

  const form = new FormData();
  form.append("key", IMGBB_API_KEY);
  form.append("name", uniqueName);
  form.append("image", base64);

  try {
    const response = await axios.post("https://api.imgbb.com/1/upload", form, {
      headers: form.getHeaders(),
    });

    // Add ?t=timestamp for frontend uniqueness if needed
    const url = response.data.data.url;
    return `${url}?t=${Date.now()}`;
  } catch (error: any) {
    console.log("error image upload", error?.response?.data);
    throw new Error(error?.response?.data?.message || "Image upload failed");
  }
};
