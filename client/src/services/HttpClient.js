import axios from "axios";

const HttpClient = () => {
  const token = localStorage.getItem("token");

  const defaultSettings = {
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  };

  return {
    get: (url, options = {}) =>
      axios.get(url, { ...defaultSettings, ...options }),
    post: (url, data, options = {}) =>
      axios.post(url, data, { ...defaultSettings, ...options }),
    put: (url, data, options = {}) =>
      axios.put(url, data, { ...defaultSettings, ...options }),
    delete: (url, options = {}) =>
      axios.delete(url, { ...defaultSettings, ...options }),
  };
};

export default HttpClient;
