import { useEffect, useState } from "react";
import axiosInstance from "../config/axiosInstance";

const useAxios = (configObject) => {
  const { method, url, config } = configObject;
  const [response, setResponse] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  const refetch = () => setReload((prev) => prev + 1);
  useEffect(() => {
    const controller = new AbortController();
    const requestHandle = async () => {
      try {
        const res = await axiosInstance[method.toLowerCase()](url, {
          ...config,
          signal: controller.signal,
        });
        setResponse(res.data);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    requestHandle();
    return () => controller.abort();
  }, [reload]);

  return [response, error, loading, refetch];
};

export default useAxios;
