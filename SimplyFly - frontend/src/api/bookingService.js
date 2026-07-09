import axiosClient from "./axiosInstance";
import { getErrorMessage } from "./errorUtils";

export async function createBookingUsingAxios(bookingData) {
  try {
    const response = await axiosClient.post("/Bookings/create%20booking", bookingData);
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create booking."));
  }
}

export async function getMyBookingHistoryUsingAxios() {
  try {
    const response = await axiosClient.get("/Bookings/Passenger%20%3A%20my-history");
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load your bookings."));
  }
}

export async function cancelBookingUsingAxios(bookingId) {
  try {
    const response = await axiosClient.post(`/Bookings/${bookingId}/cancel%20booking`);
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to cancel booking."));
  }
}

export async function getMyPassengersUsingAxios() {
  try {
    const response = await axiosClient.get("/Bookings/flightOwner%20%3A%20my-passengers");
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load passenger list."));
  }
}

export async function approveRefundUsingAxios(bookingId) {
  try {
    const response = await axiosClient.post(`/Bookings/${bookingId}/approve%20refund`);
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to approve refund."));
  }
}