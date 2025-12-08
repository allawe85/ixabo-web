import { useQuery } from "@tanstack/react-query";
import { 
  getDashboardStats, 
  getGovStats, 
  getTopProviders,
  getRevenueStats, 
  getScanStats     
} from "../services/apiDashboard";

export function useDashboard() {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  const { data: govStats, isLoading: isLoadingGov } = useQuery({
    queryKey: ["govStats"],
    queryFn: getGovStats,
  });

  const { data: topProviders, isLoading: isLoadingTop } = useQuery({
    queryKey: ["topProviders"],
    queryFn: getTopProviders,
  });

 const { data: revenueStats } = useQuery({
    queryKey: ["revenueStats"],
    queryFn: getRevenueStats,
  });

  const { data: scanStats } = useQuery({
    queryKey: ["scanStats"],
    queryFn: getScanStats,
  });

  return {
    stats,
    govStats,
    topProviders,
    revenueStats, 
    scanStats,    
    isLoading: isLoadingStats || isLoadingGov || isLoadingTop,
  };
}