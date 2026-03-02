import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";

export const updateSkills = async (skills: string[]) => {
  const response = await clientApi.patch(API_ROUTES.AUTH.PROFILE.SKILLS, {
    skills,
  });
  return response.data;
};