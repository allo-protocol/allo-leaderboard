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

export type RoundStrategyType = "Quadratic Funding" | "Direct Grants";

export function getRoundStrategyType(name: string): RoundStrategyType {
  if (
    [
      "allov2.DirectAllocationStrategy",
      "allov1.Direct",
      "DIRECT",
      "allov2.DirectGrantsSimpleStrategy",
      "allov2.DirectGrantsLiteStrategy",
    ].includes(name)
  )
    return "Direct Grants";

  return "Quadratic Funding";
}

// export type RoundPayoutTypeNew =
//   | "allov1.Direct"
//   | "allov1.QF"
//   | "allov2.DonationVotingMerkleDistributionDirectTransferStrategy"
//   | "allov2.MicroGrantsStrategy"
//   | "allov2.MicroGrantsHatsStrategy"
//   | "allov2.SQFSuperFluidStrategy"
//   | "allov2.MicroGrantsGovStrategy"
//   | "allov2.DirectGrantsSimpleStrategy"
//   | "allov2.DirectGrantsLiteStrategy"
//   | "allov2.DirectAllocationStrategy"
//   | ""; // This is to handle the cases where the strategyName is not set in a round, mostly spam rounds

export type Strategy =
  | "allov1.QF"
  | "allov2.DonationVotingMerkleDistributionDirectTransferStrategy"
  | "allov2.DirectAllocationStrategy";

export type PointsBreakdownItemByStrategyDTO = {
  address?: string;
  gmv: number;
  name?: string;
  strategy_name: Strategy;
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
