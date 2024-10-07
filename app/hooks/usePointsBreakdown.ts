import { useState } from "react";
import { PointsBreakdownItem, PointsBreakdownItemDTO } from "../types";
import { DuneClient, QueryParameter } from "@duneanalytics/client-sdk";

export const usePointsBreakdown = (currentPage: number, address?: string) => {
  const [pointsBreakdownCurrentPage, setPointsBreakdownCurrentPage] =
    useState(currentPage);
  const [isLoading, setIsLoading] = useState(false);
  const [pointsBreakdown, setPointsBreakdown] = useState<PointsBreakdownItem[]>(
    []
  );
  const [totalResults, setTotalResults] = useState<number>();
  const [totalPoints, setTotalPoints] = useState<number>();

  const getPointBreakdownByAddress = async (address: string) => {
    setIsLoading(true);

    try {
      const client = new DuneClient(process.env.NEXT_PUBLIC_DUNE_API_KEY ?? "");
      const queryId = Number(process.env.NEXT_PUBLIC_POINTS_EVENTS_API ?? "");

      const results = await client.runQuery({
        queryId,
        query_parameters: [QueryParameter.text("lookup_address", `${address}`)],
      });
      const rows = results.result?.rows as PointsBreakdownItemDTO[];
      const data = rows?.map((entry: any) => ({
        address: entry.address,
        blockchain: entry.blockchain,
        ens: entry.ens,
        numberOfPoints: entry.number_of_points,
        txHash: entry.tx_hash,
        role: entry.role,
        timestamp: entry.tx_timestamp,
      }));
      const totalEntries = results?.result?.metadata?.total_row_count ?? 0;
      const points = rows?.reduce(
        (accumulator, currentValue) =>
          accumulator + Number(currentValue.number_of_points),
        0
      );
      setTotalPoints(points);
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
    totalPoints,
  };
};
