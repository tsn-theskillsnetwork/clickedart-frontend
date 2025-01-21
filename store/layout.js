import axios from "axios";
import { create } from "zustand";

const useLayoutStore = create((set) => ({
  layout: null,
  loading: false,
  error: null,

  fetchLayout: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/layout/get-layout-content`
      );
      set({ layout: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.message || "Failed to fetch layout", loading: false });
    }
  },
}));

(async () => {
  const { fetchLayout } = useLayoutStore.getState();
  await fetchLayout();
})();

export default useLayoutStore;
