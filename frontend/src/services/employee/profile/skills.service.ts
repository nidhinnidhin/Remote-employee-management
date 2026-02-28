import { clientApi } from "@/lib/axios/axiosClient";

export const updateSkills = async (skills: string[]) => {
  const response = await clientApi.patch("/auth/profile/skills", {
    skills,
  });
  return response.data;
};