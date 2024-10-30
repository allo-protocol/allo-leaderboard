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
  CONTRIBUTOR = "contributor",
  ROUND_OPERATOR = "round_operator",
  DONOR = "donor",
  MANAGER = "manager"
}

export interface PointsBreakdownItem {
  address: string;
  ens: string;
  numberOfPoints: number;
  txHash: string;
  role: Role;
  timestamp: string;
}

 export type PointsBreakdownItemDTO = {
   address: string;
   blockchain: string;
   ens: string;
   gmv: number;
   tx_hash: string;
   role: Role;
   timestamp: string;
 };