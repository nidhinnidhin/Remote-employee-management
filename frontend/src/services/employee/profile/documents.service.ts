import { clientApi } from "@/lib/axios/axiosClient";

export const fetchProfile = async () => {
  const response = await clientApi.get("/auth/me");
  return response.data;
};

export const uploadDocument = async (
  file: File,
  name: string,
  category: string,
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  formData.append("category", category);

  const response = await clientApi.post("/auth/profile/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteDocument = async (
  documentId: string,
  publicId: string,
  resourceType: string,
) => {
  const response = await clientApi.delete(
    `/auth/profile/documents/${documentId}`,
    {
      data: { publicId, resourceType }, // ← add resourceType
    },
  );
  return response.data;
};

export const editDocument = async (
  documentId: string,
  name: string,
  category: string,
  file?: File,
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("category", category);
  if (file) formData.append("file", file);

  const response = await clientApi.patch(
    `/auth/profile/documents/${documentId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};
