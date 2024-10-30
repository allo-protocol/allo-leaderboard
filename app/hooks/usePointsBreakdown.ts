import { useState } from "react";
import { PointsBreakdownItem, PointsBreakdownItemDTO } from "../types";
import { isAddress } from "viem";

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
    const EVENTS_URL = "/api/events";

    let queryParams = {};
    queryParams = isAddress(address)
      ? { lookup_address: address.toLowerCase() }
      : { lookup_ens: address.toLowerCase(), lookup_address: "0x0" };

    try {
      const response = await fetch(
        `${EVENTS_URL}?${new URLSearchParams(queryParams).toString()}`
      );
      if (!response.ok) throw new Error(response.statusText);
      const result = await response.json();
      console.log(result);
      const rows = result as PointsBreakdownItemDTO[];
      const data = rows?.map((entry: any) => ({
        address: entry.address,
        blockchain: entry.blockchain,
        ens: entry.name,
        numberOfPoints: entry.gmv,
        txHash: entry.tx_hash,
        role: entry.role,
        timestamp: entry.tx_timestamp,
      }));
      console.log(data);
      const totalEntries = rows.length ?? 0;
      const points = rows?.reduce(
        (accumulator, currentValue) =>
          accumulator + Number(currentValue.gmv),
        0
      );
      setTotalPoints(points);
      console.log(points);
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
