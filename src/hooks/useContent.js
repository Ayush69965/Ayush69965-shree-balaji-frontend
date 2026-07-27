import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useContent = () =>
    useQuery({
        queryKey: ["content"],
        queryFn: async () => (await api.get("/content")).data,
    });

export const useCollection = (name, params = "") =>
    useQuery({
        queryKey: [name, params],
        queryFn: async () => (await api.get(`/${name}${params}`)).data,
    });
