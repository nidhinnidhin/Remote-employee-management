import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";

export const fetchProfile = async () => {
  const response = await clientApi.get(API_ROUTES.AUTH.PROFILE.ME);
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

  const response = await clientApi.post(API_ROUTES.AUTH.DOCUMENTS.BASE, formData, {
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
    API_ROUTES.AUTH.DOCUMENTS.BY_ID(documentId),
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
    API_ROUTES.AUTH.DOCUMENTS.BY_ID(documentId),
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};
