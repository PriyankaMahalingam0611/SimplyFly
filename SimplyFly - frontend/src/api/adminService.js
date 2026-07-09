import axiosClient from "./axiosInstance";
import { getErrorMessage } from "./errorUtils";

export async function getPassengersUsingAxios() {
  try {
    const response = await axiosClient.get("/Admin/get%20passengers");
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load passengers."));
  }
}

export async function getFlightOwnersUsingAxios() {
  try {
    const response = await axiosClient.get("/Admin/get%20flightowners");
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load flight owners."));
  }
}

export async function updateUserUsingAxios(userId, userData) {
  try {
    const response = await axiosClient.put(`/Admin/update%20user/${userId}`, userData);
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update user."));
  }
}

export async function deleteUserUsingAxios(userId) {
  try {
    const response = await axiosClient.delete(`/Admin/delete%20user/${userId}`);
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete user."));
  }
}

export async function getAllBookingsUsingAxios() {
  try {
    const response = await axiosClient.get("/Admin/get%20all%20bookings");
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load bookings."));
  }
}

export async function getAllRoutesUsingAxios() {
  try {
    const response = await axiosClient.get("/Admin/get%20all%20flight/routes");
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load flight routes."));
  }
}