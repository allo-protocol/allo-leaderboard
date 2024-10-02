import { useState } from "react";
import { PointsBreakdownItem } from "../types";

export const usePointsBreakdown = (currentPage: number, address?: string) => {
  const [pointsBreakdownCurrentPage, setPointsBreakdownCurrentPage] =
    useState(currentPage);
  const [isLoading, setIsLoading] = useState(false);
  const [pointsBreakdown, setPointsBreakdown] = useState<PointsBreakdownItem[]>(
    []
  );
  const [totalResults, setTotalResults] = useState<number>();

  const getPointBreakdownByAddress = async (address: string) => {
    setIsLoading(true);

    try {
      const options = {
        method: "GET",
        headers: {
          "X-DUNE-API-KEY": process.env.NEXT_PUBLIC_DUNE_API_KEY ?? "",
        },
      };

      const queryParams = new URLSearchParams({
        lookup_address: address,
      });
      const queryId = process.env.NEXT_PUBLIC_POINTS_EVENTS_API;
      const url = `https://api.dune.com/api/v1/query/${queryId}/results?${queryParams}`;

      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      const results = await resp.json();

      const data = results.result?.rows?.map((entry: any) => ({
        address: entry.address,
        blockchain: entry.blockchain,
        ens: entry.ens,
        numberOfPoints: entry.number_of_points,
        txHash: entry.tx_hash,
        role: entry.role,
        timestamp: entry.tx_timestamp,
      }));
      const totalEntries = results?.result?.metadata?.total_row_count ?? 0;
      setTotalResults(totalEntries);
      setPointsBreakdown(data ?? []);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getPointBreakdownByAddress,
    isLoading,
    pointsBreakdown,
    totalResults,
    pointsBreakdownCurrentPage,
  };
};
