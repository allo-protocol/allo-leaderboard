import { useEffect, useState } from "react";
import { LeaderboardFilter, LeaderboardItem } from "../types";
import { LEADERBOARD_PAGE_SIZE } from "../constants";

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

  async function getLeaderboardData(page: number) {
    const queryParams = {
      page: page.toString(),
      limit: LEADERBOARD_PAGE_SIZE.toString(),
      time_range: selectedFilter,
    };

    const BASE_URL = "/api/leaderboard";
    setIsLeaderboardLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}?${new URLSearchParams(queryParams).toString()}`
      );
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      console.log(data);
      const totalEntries = data?.length ? data[0].total_records ?? 0 : 0;
      setLeaderboardTotalResults(totalEntries);

      setLeaderboardData(
        data?.map((row: any) => ({
          rank: row.rank,
          address: row.address,
          ens: row.name,
          numberOfPoints: row.total_gmv,
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
    getLeaderboardData(leaderboardSelectedPage);
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
