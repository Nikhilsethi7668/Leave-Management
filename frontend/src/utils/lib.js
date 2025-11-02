import axiosInstance from "./axiosInstance";
export const getAdminAnalytics = async () => {
  try {
    const response = await axiosInstance.get("/leaves/admin-analytics");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    throw error;
  }
};
