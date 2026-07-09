import axiosClient from "./axiosInstance";
import { getErrorMessage, getFieldErrors } from "./errorUtils";

export async function updateProfileUsingAxios(profileData) {
  try {
    const response = await axiosClient.put("/User/update-profile", profileData);
    return response.data;
  } 
  catch (error) {
    const err = new Error(getErrorMessage(error, "Failed to update profile."));
    err.fieldErrors = getFieldErrors(error);
    throw err;
  }
}

export async function deleteAccountUsingAxios() {
  try {
    const response = await axiosClient.delete("/User/delete-account");
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete account."));
  }
}