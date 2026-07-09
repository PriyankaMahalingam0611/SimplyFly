import axiosClient from "./axiosInstance";
import { getErrorMessage, getFieldErrors } from "./errorUtils";

export async function loginUsingAxios(loginData) {
  try {
    const response = await axiosClient.post("/Auth/login", loginData);
    return response.data.data; 
  } 
  catch (error) {
    const err = new Error(getErrorMessage(error, "Login failed."));
    err.fieldErrors = getFieldErrors(error);
    throw err;
  }
}

export async function registerUsingAxios(registerData) {
  try {
    const response = await axiosClient.post("/Auth/register", registerData);
    return response.data;
  } 
  catch (error) {
    const err = new Error(getErrorMessage(error, "Registration failed."));
    err.fieldErrors = getFieldErrors(error);
    throw err;
  }
}

export async function registerStaffUsingAxios(staffData) {
  try {
    const response = await axiosClient.post("/Auth/register-staff", staffData);
    return response.data;
  } 
  catch (error) {
    const err = new Error(getErrorMessage(error, "Failed to register staff account."));
    err.fieldErrors = getFieldErrors(error);
    throw err;
  }
}