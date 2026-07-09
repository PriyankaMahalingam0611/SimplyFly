import axiosClient from "./axiosInstance";
import { getErrorMessage } from "./errorUtils";

export async function processPaymentUsingAxios(paymentData) {
  try {
    const response = await axiosClient.post("/Payments/process", paymentData);
    return response.data;
  } 
  catch (error) {
    throw new Error(getErrorMessage(error, "Payment failed."));
  }
}