import { httpClient } from "./axios.ts";
import type { DeleteUploadParams, UploadResponse } from "../type/upload.ts";

export const uploadFile = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await httpClient.post<UploadResponse>("/uploads", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.url;
};

export const deleteFile = async (url: string): Promise<void> => {
    await httpClient.delete("/uploads", {
        data: { url } as DeleteUploadParams,
    });
};
