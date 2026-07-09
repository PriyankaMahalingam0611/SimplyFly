export function getErrorMessage(error, fallbackMessage) {
  if (error.response?.data?.message) {
    return error.response.data.message; 
  }
  if (error.response?.data?.title) {
    return error.response.data.title; 
  }
  if (error.message) {
    return error.message; 
  }
  return fallbackMessage;
}

export function getFieldErrors(error) {
  const errors = error.response?.data?.errors;
  if (!errors) 
    return null;

  const fieldErrors = {};
  Object.entries(errors).forEach(([field, messages]) => {
    fieldErrors[field] = Array.isArray(messages) ? messages[0] : messages;
  });
  return fieldErrors;
}