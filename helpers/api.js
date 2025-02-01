import axios from "axios";

export const fetchData = async (url, data, setter, setLoading) => {
  try {
    setLoading?.(true);
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER}/api/${url}`
    );
    setter(response.data[data]);
  } catch (error) {
    console.log("Error fetching data", error);
  } finally {
    setLoading?.(false);
  }
};

export const postData = async (url, data, setLoading) => {
  try {
    setLoading?.(true);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER}/api/${url}`,
      data
    );
    return response.data;
  } catch (error) {
    console.log("Error posting data", error);
  } finally {
    setLoading?.(false);
  }
};

export const putData = async (url, data, setLoading) => {
  try {
    setLoading?.(true);
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER}/api/${url}`,
      data
    );
    return response.data;
  } catch (error) {
    console.log("Error updating data", error);
  } finally {
    setLoading?.(false);
  }
};

export const deleteData = async (url, setLoading) => {
  try {
    setLoading?.(true);
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_SERVER}/api/${url}`
    );
    return response.data;
  } catch (error) {
    console.log("Error deleting data", error);
  } finally {
    setLoading?.(false);
  }
};
