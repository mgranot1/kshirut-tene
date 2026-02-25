import { useQuery } from "@tanstack/react-query";
import CategoryService from "./category.service";

const useGetCategories = () => {
  return useQuery({
    queryKey: ["getCategories"],
    queryFn: () => CategoryService.getCategories(),
  });
};

export default useGetCategories;
