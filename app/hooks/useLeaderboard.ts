import { useEffect, useState } from "react";
import { LeaderboardFilter, LeaderboardItem } from "../types";
import { LEADERBOARD_PAGE_SIZE } from "../constants";
import { DuneClient, QueryParameter } from "@duneanalytics/client-sdk";

export const useLeaderboard = (leaderboardSelectedPage: number) => {
  const [leaderboardTotalResults, setLeaderboardTotalResults] =
    useState<number>(0);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);

  const filters = [
    {
      value: LeaderboardFilter.THIS_WEEK,
      label: "This week",
    },
    {
      value: LeaderboardFilter.LAST_WEEK,
      label: "Last week",
    },
    {
      value: LeaderboardFilter.ALL_TIME,
      label: "All time",
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState<LeaderboardFilter>(
    LeaderboardFilter.LAST_WEEK
  );

  async function getLeaderboardData(offset: number) {
    setIsLeaderboardLoading(true);
    try {
      const client = new DuneClient(process.env.NEXT_PUBLIC_DUNE_API_KEY ?? "");
      const queryId = Number(process.env.NEXT_PUBLIC_LEADERBOARD_API ?? "");

      const results = await client.runQuery({
        queryId,
        limit: LEADERBOARD_PAGE_SIZE,
        offset,
        query_parameters: [
          QueryParameter.enum("time_range", `${selectedFilter}`),
        ],
      });

      const totalEntries = results?.result?.metadata?.total_row_count ?? 0;
      setLeaderboardTotalResults(totalEntries);

      setLeaderboardData(
        results?.result?.rows?.map((row: any) => ({
          rank: row.rank,
          address: row.address,
          ens: row.ens,
          numberOfPoints: row.total_points,
          lastUpdated: row.last_timestamp,
        })) ?? []
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsLeaderboardLoading(false);
    }
  }

  useEffect(() => {
    getLeaderboardData((leaderboardSelectedPage - 1) * LEADERBOARD_PAGE_SIZE);
  }, [leaderboardSelectedPage, selectedFilter]);

  return {
    isLeaderboardLoading,
    leaderboardTotalResults,
    leaderboardData,
    filters,
    selectedFilter,
    setSelectedFilter,
  };
};
