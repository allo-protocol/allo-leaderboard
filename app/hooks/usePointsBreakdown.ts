import { useState } from "react";
import {
  PointsBreakdownItem,
  PointsBreakdownItemByRoleDTO,
  PointsBreakdownItemByStrategyDTO,
  PointsBreakdownItemByTimeDTO,
  PointsBreakdownItemDTO,
} from "../types";
import { isAddress } from "viem";

export const usePointsBreakdown = (currentPage: number, address?: string) => {
  const [pointsBreakdownCurrentPage, setPointsBreakdownCurrentPage] =
    useState(currentPage);
  const [isLoading, setIsLoading] = useState(false);
  const [pointsBreakdown, setPointsBreakdown] = useState<PointsBreakdownItem[]>(
    []
  );
  const [pointsBreakdownByRole, setPointsBreakdownByRole] = useState<
    PointsBreakdownItemByRoleDTO[]
  >([]);
  const [pointsBreakdownByStrategy, setPointsBreakdownByStrategy] = useState<
    PointsBreakdownItemByStrategyDTO[]
  >([]);
  const [pointsBreakdownByTime, setPointsBreakdownByTime] = useState<
    PointsBreakdownItemByTimeDTO[]
  >([]);
  const [totalResults, setTotalResults] = useState<number>();
  const [totalPoints, setTotalPoints] = useState<number>();

  const getPointBreakdownByAddress = async (address: string) => {
    const lowercaseAddress = address.toLowerCase();

    setIsLoading(true);
    const EVENTS_URL = "/api/events";

    let queryParams = {};
    queryParams = isAddress(lowercaseAddress)
      ? { lookup_address: lowercaseAddress }
      : { lookup_ens: lowercaseAddress, lookup_address: "0x0" };

    try {
      const response = await fetch(
        `${EVENTS_URL}?${new URLSearchParams(queryParams).toString()}`
      );
      if (!response.ok) throw new Error(response.statusText);
      const result = await response.json();
      const rowsByRole = result.dataByRole as PointsBreakdownItemByRoleDTO[];
      const rowsByTime = result.dataByTime as PointsBreakdownItemByTimeDTO[];
      const rowsByStrategy =
        result.dataByStrategy as PointsBreakdownItemByStrategyDTO[];
      const rows = result.data as PointsBreakdownItemDTO[];
      const data = rows?.map((entry: any) => ({
        address: entry.address,
        blockchain: entry.blockchain,
        ens: entry.name,
        numberOfPoints: entry.gmv,
        txHash: entry.tx_hash,
        role: entry.role,
        timestamp: entry.tx_timestamp,
      }));
      const totalEntries = rows.length ?? 0;
      const points = rows?.reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.gmv),
        0
      );
      setTotalPoints(points);
      setPointsBreakdownByRole(rowsByRole);
      setPointsBreakdownByTime(rowsByTime);
      setPointsBreakdownByStrategy(rowsByStrategy);
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
    pointsBreakdownByRole,
    pointsBreakdownByStrategy,
    pointsBreakdownByTime,
    totalResults,
    pointsBreakdownCurrentPage,
    totalPoints,
  };
};
