import axiosClient from "./axiosInstance";
import { getErrorMessage, getFieldErrors } from "./errorUtils";

export async function createFlightUsingAxios(flightData) {
  try {
    const response = await axiosClient.post("/Flights/create%20flight", flightData);
    return response.data;
  } 
  catch (error) {
    const err = new Error(getErrorMessage(error, "Failed to create flight."));
    err.fieldErrors = getFieldErrors(error);
    throw err;
  }
}

export async function createScheduleUsingAxios(scheduleData) {
  try {
    const response = await axiosClient.post("/Flights/create%20schedules", scheduleData);
    return response.data;
  } 
  catch (error) {
    const err = new Error(getErrorMessage(error, "Failed to create schedule."));
    err.fieldErrors = getFieldErrors(error);
    throw err;
  }
}

export async function searchFlightsUsingAxios(params) {
  try {
    const response = await axiosClient.get("/Flights/search%20for%20a%20flight", { params });
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to search flights."));
  }
}

export async function deleteScheduleUsingAxios(scheduleId) {
  try {
    const response = await axiosClient.delete(`/Flights/delete%20schedules/${scheduleId}`);
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete schedule."));
  }
}

export async function getMyFlightsUsingAxios() {
  try {
    const response = await axiosClient.get("/Flights/my%20flights");
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load your flights."));
  }
}

export async function getFlightSchedulesUsingAxios(flightId) {
  try {
    const response = await axiosClient.get(`/Flights/my%20flights/${flightId}/schedules`);
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load schedules for this flight."));
  }
}