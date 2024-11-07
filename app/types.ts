export interface LeaderboardItem {
  rank: number;
  address: string;
  ens: string;
  numberOfPoints: number;
  lastUpdated: string;
}

export enum LeaderboardFilter {
  THIS_WEEK = "this week",
  LAST_WEEK = "last week",
  ALL_TIME = "all time",
}

export enum Role {
  COTRACT_DEV = "contract_dev",
  GRANTEE = "grantee",
  DONOR = "donor",
  ROUND_OPERATOR = "round_operator",
  MANAGER = "manager",
  CONTRIBUTOR = "contributor",
}

export interface PointsBreakdownItem {
  address: string;
  ens: string;
  numberOfPoints: number;
  txHash: string;
  role: Role;
  timestamp: string;
}

export type PointsBreakdownItemByRoleDTO = {
  address?: string;
  gmv: number;
  name?: string;
  role: Role;
};

export type Strategy =
  | "allov1.QF"
  | "allov1.Direct"
  | "allov2.DonationVotingMerkleDistributionDirectTransferStrategy"
  | "allov2.DirectAllocationStrategy"
  | "allov2.DirectGrantsLiteStrategy"
  | "EasyRPGFStrategy"
  | "MACIQF"
  | "allov2.DonationVotingMerkleDistributionDirectTransferStrategy";

export type PointsBreakdownItemByStrategyDTO = {
  address?: string;
  gmv: number;
  name?: string;
  strategy_name: Strategy;
  mapped_strategy: string;
};

export type PointsBreakdownItemByTimeDTO = {
  gmv: number;
  week: string;
  cumulative_gmv: number;
};

export type PointsBreakdownItemDTO = {
  address: string;
  blockchain: string;
  ens: string;
  gmv: number;
  tx_hash: string;
  role: Role;
  timestamp: string;
};
