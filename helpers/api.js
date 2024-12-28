import axios from "axios";

export const fetchData = async (url, data, setter, setError) => {
  try {
    const response = await axios.get(url);
    setter(response.data[data]);
  } catch (error) {
    console.error("Error fetching data", error);
    setError?.(error.message);
  }
};

export const postData = async (url, data, setError) => {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data", error);
    setError?.(error.message);
  }
};

export const putData = async (url, data, setError) => {
  try {
    const response = await axios.put(url, data);
    return response.data;
  } catch (error) {
    console.error("Error updating data", error);
    setError?.(error.message);
  }
};

export const deleteData = async (url, setError) => {
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error deleting data", error);
    setError?.(error.message);
  }
};