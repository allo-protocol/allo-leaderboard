"use client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "../components/button";
import InfoModal from "../components/modal";
import Image from "next/image";
import { useAccount } from "wagmi";
import Pagination from "../components/pagination";
import { formatNumber } from "../components/helpers";
import {
  LeaderboardFilter,
  LeaderboardItem,
  PointsBreakdownItem,
  PointsBreakdownItemByRoleDTO,
  PointsBreakdownItemByStrategyDTO,
  PointsBreakdownItemByTimeDTO,
  Role,
} from "../types";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { LEADERBOARD_PAGE_SIZE } from "../constants";
import { Input } from "../components/input";
import { usePointsBreakdown } from "../hooks/usePointsBreakdown";
import { Tooltip } from "react-tooltip";
import {
  LineChart,
  Line,
  Tooltip as ChartTooltip,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  ComposedChart,
  ResponsiveContainer,
} from "recharts";
import { Legend } from "@headlessui/react";

export default function Start() {
  const { isConnected, address: userAddress } = useAccount();
  const [address, setAddress] = useState<string | undefined>("");

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isPointsBreakdownModalOpen, setIsPointsBreakdownModalOpen] =
    useState(false);
  const faqRef = useRef<HTMLElement | null>(null);

  const [leaderboardSelectedPage, setLeaderboardSelectedPage] = useState(1);
  const {
    isLeaderboardLoading,
    leaderboardTotalResults,
    leaderboardData,
    filters,
    selectedFilter,
    setSelectedFilter,
  } = useLeaderboard(leaderboardSelectedPage);

  const [pointsBreakdownSelectedPage, setPointsBreakdownSelectedPage] =
    useState(1);
  const {
    totalPoints,
    getPointBreakdownByAddress,
    isLoading: isPointsBreakdownLoading,
    pointsBreakdown,
    pointsBreakdownByRole,
    pointsBreakdownByStrategy,
    pointsBreakdownByTime,
    totalResults: pointBreakdownTotalEntries,
    pointsBreakdownCurrentPage,
  } = usePointsBreakdown(pointsBreakdownSelectedPage, address);

  const getPointsByAddress = async (address: string) => {
    await getPointBreakdownByAddress(address);
  };

  const checkPoints = async (address: string) => {
    setIsDataLoading(true);
    address && (await getPointsByAddress(address));
    setIsDataLoading(false);
  };

  useEffect(() => {
    async function autoCheckConnectedUser() {
      if (isConnected) {
        setAddress(userAddress as string);
        await checkPoints(userAddress as string);
      }
    }
    autoCheckConnectedUser();
  }, [isConnected, userAddress]);

  const scrollToFaq = () => {
    faqRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pb-20">
      <CheckBalance
        openPointsBreakdownModal={() => setIsPointsBreakdownModalOpen(true)}
        address={address}
        points={totalPoints}
        setAddress={setAddress}
        scrollToFaq={scrollToFaq}
        checkPoints={checkPoints}
        isDataLoading={isDataLoading}
      />

      <div className="flex flex-col gap-16 px-4">
        <Leaderboard
          currentUserAddress={userAddress}
          data={leaderboardData}
          currentPage={leaderboardSelectedPage}
          handlePageChange={(val: number) => {
            setLeaderboardSelectedPage(val);
          }}
          total={leaderboardTotalResults}
          isDataLoading={isLeaderboardLoading}
          filters={filters}
          selectedFilter={selectedFilter}
          setSelectedFilter={(val) => {
            setSelectedFilter(val);
            setLeaderboardSelectedPage(1);
          }}
        />
        <section ref={faqRef}>
          <Faq />
        </section>
      </div>

      {/* modals */}
      <BreakdownModal
        dataByRole={pointsBreakdownByRole}
        dataByStrategy={pointsBreakdownByStrategy}
        dataByTime={pointsBreakdownByTime}
        data={pointsBreakdown}
        totalPointsNumber={totalPoints ?? 0}
        isDataLoading={isPointsBreakdownLoading}
        pointBreakdownTotalEntries={pointBreakdownTotalEntries ?? 0}
        setIsPointsBreakdownModalOpen={setIsPointsBreakdownModalOpen}
        isPointsBreakdownModalOpen={isPointsBreakdownModalOpen}
        currentPage={pointsBreakdownCurrentPage}
        handlePageChange={(val: number) => {
          setPointsBreakdownSelectedPage(val);
        }}
      />
    </div>
  );
}

const CheckBalance = ({
  points,
  address,
  setAddress,
  isDataLoading,
  checkPoints,
  scrollToFaq,
  openPointsBreakdownModal,
}: {
  points?: number;
  address?: string;
  setAddress: Dispatch<SetStateAction<string | undefined>>;
  isDataLoading?: boolean;
  checkPoints: (address: string) => Promise<void>;
  scrollToFaq: () => void;
  openPointsBreakdownModal: () => void;
}) => {
  const Congratulations = () => (
    <div className="relative rounded-[32px] bg-blue-800 py-12 lg:px-28 sm:px-12 px-4 mx-auto max-w-4xl xl:w-[60vw] sm:w-[90vw] w-[96vw] mt-8 flex items-center justify-between md:flex-row flex-col-reverse gap-8">
      <div className="z-10">
        <h1 className="text-4xl text-yellow-500 font-semibold font-founders mb-2">
          Congratulations!
        </h1>
        <p className="text-2xl text-white mb-2">
          You have {formatNumber(points)} GMV
        </p>
        <button
          className="font-medium text-blue-200 underline mr-auto"
          onClick={openPointsBreakdownModal}
        >
          See GMV breakdown
        </button>
      </div>
      <div className="relative">
        <Image
          src="/triangle-shape.svg"
          alt=""
          width={230}
          height={204}
          priority
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <p className="text-6xl 3xl:text-8xl font-bold italic text-yellow-500 font-founders leading-none tracking-wider">
            {formatNumber(points)}
          </p>
        </div>
      </div>
      <div className="absolute top-0 bottom-0 right-10">
        <Image
          src="/confetti.svg"
          alt=""
          width={378}
          height={297}
          className="h-full w-auto -z-0"
        />
      </div>
    </div>
  );

  const NoPoints = () => (
    <div className=" relative rounded-[32px] bg-blue-800 py-12 lg:px-28 sm:px-12 px-4 mx-auto max-w-4xl xl:w-[60vw] sm:w-[90vw] w-[96vw] mt-8 flex items-center justify-between">
      <div>
        <h1 className="text-4xl text-yellow-500 font-semibold font-founders mb-2">
          :(
        </h1>
        <p className="text-2xl text-white mb-2">You have {points} GMV</p>
        <button
          className="font-medium text-blue-200 underline mr-auto"
          onClick={scrollToFaq}
        >
          How to earn GMV
        </button>
      </div>
      <div className="relative">
        <Image
          src="/triangle-shape.svg"
          alt=""
          width={230}
          height={204}
          priority
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <p className="text-9xl font-bold italic text-yellow-500 font-founders leading-none">
            {points}
          </p>
        </div>
      </div>

      <div className="absolute top-0 bottom-0 right-10">
        <Image
          src="/confetti.svg"
          alt=""
          width={378}
          height={297}
          className="h-full w-auto -z-0"
        />
      </div>
    </div>
  );

  return (
    <section className="bg-allo-bg bg-top  pt-24 pb-16 mb-4 bg-auto">
      <div className="rounded-[32px] bg-blue-800 py-12 md:py-20 2xl:py-28 lg:px-28 sm:px-12 px-4 mx-auto max-w-4xl xl:w-[60vw] sm:w-[90vw] w-[96vw]">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl text-blue-200 font-semibold font-founders">
            Check your balance
          </h1>

          <div>
            <form className="flex items-center gap-3 mb-3 w-full sm:flex-row flex-col">
              <Input
                value={address}
                handleChange={(e) => {
                  e.preventDefault();
                  setAddress(e.target.value);
                }}
                placeholder="Address or ENS"
              />

              <Button
                type="primary"
                onClick={() => address && checkPoints(address)}
                isLoading={isDataLoading}
                className="sm:w-auto w-full"
              >
                Check GMV
              </Button>
            </form>
            <p className="text-sm text-grey-100">
              Manually add an address or connect your wallet
            </p>
          </div>
        </div>
      </div>

      <div className={`${isDataLoading ? "opacity-80" : ""}`}>
        {points !== undefined && points == 0 && <NoPoints />}
        {!!points && <Congratulations />}
      </div>
    </section>
  );
};

const BreakdownModal = ({
  data,
  totalPointsNumber,
  dataByRole,
  dataByStrategy,
  dataByTime,
  isPointsBreakdownModalOpen,
  setIsPointsBreakdownModalOpen,
  isDataLoading,
  pointBreakdownTotalEntries,
  currentPage,
  handlePageChange,
}: {
  data: PointsBreakdownItem[];
  dataByRole: PointsBreakdownItemByRoleDTO[];
  dataByStrategy: PointsBreakdownItemByStrategyDTO[];
  dataByTime: PointsBreakdownItemByTimeDTO[];
  totalPointsNumber: number;
  isPointsBreakdownModalOpen: boolean;
  setIsPointsBreakdownModalOpen: Dispatch<SetStateAction<boolean>>;
  isDataLoading: boolean;
  pointBreakdownTotalEntries: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
}) => {
  const getActionFromRole = (role: Role) => {
    switch (role) {
      case Role.CONTRIBUTOR:
        return "Contributor";
      case Role.COTRACT_DEV:
        return "Contract dev";
      case Role.GRANTEE:
        return "Grantee";
      case Role.ROUND_OPERATOR:
        return "Round operator";
      case Role.DONOR:
        return "Donor";
      case Role.MANAGER:
        return "Manager";
    }
  };

  const barDataByRole = dataByRole.map((entry) => ({
    role: getActionFromRole(entry.role),
    gmv: Math.round(Number(entry.gmv)),
  }));

  const barDataByStrategyMapByStrategy: Map<
    string,
    { strategy: string; gmv: number }
  > = new Map();
  dataByStrategy.forEach((entry) => {
    if (barDataByStrategyMapByStrategy.has(entry.mapped_strategy)) {
      const prevGmv =
        barDataByStrategyMapByStrategy.get(entry.mapped_strategy)?.gmv ?? 0;
      barDataByStrategyMapByStrategy.set(entry.mapped_strategy, {
        strategy: entry.mapped_strategy,
        gmv: Math.round(Number(prevGmv + entry.gmv)),
      });
    } else {
      barDataByStrategyMapByStrategy.set(entry.mapped_strategy, {
        strategy: entry.mapped_strategy,
        gmv: Math.round(Number(entry.gmv)),
      });
    }
  });
  console.log(dataByStrategy);
  const barDataByStrategy = Array.from(barDataByStrategyMapByStrategy.values());

  const monthNames = [
    "Jan",
    "Febr",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const weekTickFormatter = (tick: any) => {
    return "";
  };

  const barDataByTime = dataByTime.map((entry, index) => {
    return {
      week: entry.week,
      gmv: Math.round(entry.gmv),
      "cumulative gmv": Math.round(entry.cumulative_gmv),
    };
  });

  const renderQuarterTick = (tickProps: any) => {
    const { x, y, payload } = tickProps;
    const { value, index } = payload;
    const date = new Date(value);
    const month = date.getMonth();
    const year = date.getFullYear();
    const showLabels = barDataByTime.length >= 4;
    const section = Math.round(barDataByTime.length / 5);
    const label1Index = section;
    const label2Index = section * 2;
    const label3Index = section * 3;
    const label4Index = section * 4;

    if (
      [label1Index, label2Index, label3Index, label4Index].includes(index) &&
      showLabels
    ) {
      return (
        <text x={x} y={y - 4} textAnchor="middle">
          {monthNames[month]} {year}
        </text>
      );
    }

    return <></>;
  };

  const formatWeekInterval = (date: string, nextDate?: string) => {
    const endYear = nextDate ? nextDate.slice(0, 4) : date.slice(0, 4);
    const startMonth = monthNames[new Date(date).getMonth()];
    const startDay = date.slice(8, 10);
    const endMonth = nextDate
      ? monthNames[new Date(nextDate).getMonth()]
      : undefined;
    const endDay = nextDate ? nextDate.slice(8, 10) : undefined;

    return nextDate
      ? `${startMonth} ${startDay} - ${
          endMonth !== startMonth ? `${endMonth} ` : ""
        }${endDay}, ${endYear}`
      : `${startMonth} ${startDay}, ${endYear} - present`;
  };

  const formatLabel = (data: any) => {
    const index = barDataByTime.findIndex((entry) => entry.week == data);
    const nextEntry =
      dataByTime.length - 1 >= index ? dataByTime[index + 1]?.week : undefined;

    return formatWeekInterval(data, nextEntry);
  };

  return (
    <InfoModal
      isOpen={isPointsBreakdownModalOpen}
      setIsOpen={setIsPointsBreakdownModalOpen}
    >
      <div className="w-full">
        <div className="mb-12 flex items-center justify-between">
          <h1 className="text-2xl sm:text-4xl text-blue-800 font-semibold font-founders leading-relaxed">
            GMV <br />
            breakdown
          </h1>
          <div className="relative">
            <Image
              src="/triangle-shape.svg"
              alt=""
              width={111}
              height={98}
              priority
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <p className="text-4xl sm:text-5xl font-bold italic text-blue-800 font-founders leading-none">
                {formatNumber(totalPointsNumber)}
              </p>
            </div>
          </div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {!data?.length ? (
            <>
              <p>No data</p>
            </>
          ) : (
            <div>
              <div className="mb-8 min-w-[600px]">
                <ResponsiveContainer height={250} width="100%">
                  <ComposedChart width={730} height={250} data={barDataByTime}>
                    <XAxis dataKey="week" tickFormatter={weekTickFormatter} />
                    <XAxis
                      dataKey="week"
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      tick={renderQuarterTick}
                      height={1}
                      scale="band"
                      xAxisId="month"
                    />
                    <YAxis />
                    <ChartTooltip labelFormatter={formatLabel} />
                    <Legend />
                   
                    <Bar dataKey="gmv" barSize={50} fill="#082553" />
                    <Line
                      type="monotone"
                      dataKey="cumulative gmv"
                      stroke="#ff7300"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
                <ResponsiveContainer height={250} width="100%">
                  <BarChart width={730} height={250} data={barDataByRole}>
                    <XAxis dataKey="role" label={{ fontSize: 14 }} />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="gmv" fill="#082553" />
                  </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer height={250} width="100%">
                  <BarChart width={730} height={250} data={barDataByStrategy}>
                    <XAxis dataKey="strategy" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="gmv" fill="#00433B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {data.map((entry, index) => (
                <div className="" key={`${index}-${entry.txHash}`}>
                  <span className="text-grey-400 mr-2">
                    {index + 1}. {new Date(entry.timestamp).toDateString()}
                  </span>
                  <span className="text-blue-800 font-medium">
                    {formatNumber(entry.numberOfPoints)} GMV -{" "}
                    {getActionFromRole(entry.role)}
                  </span>
                </div>
              ))}
              <div
                className={`mt-4 ${
                  isDataLoading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                {/* <Pagination
                  currentPage={currentPage}
                  handlePageChange={(val: number) => {
                    handlePageChange(val);
                  }}
                  totalResults={pointBreakdownTotalEntries}
                  pageSize={POINTS_BREAKDOWN_PAGE_SIZE}
                /> */}
              </div>
            </div>
          )}
          <div></div>
        </div>
      </div>
    </InfoModal>
  );
};

const Leaderboard = ({
  data,
  total,
  currentPage,
  handlePageChange,
  isDataLoading,
  filters,
  selectedFilter,
  setSelectedFilter,
  currentUserAddress,
}: {
  data: LeaderboardItem[];
  total: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
  isDataLoading: boolean;
  filters: { value: LeaderboardFilter; label: string }[];
  selectedFilter: LeaderboardFilter;
  setSelectedFilter: (val: LeaderboardFilter) => void;
  currentUserAddress?: string;
}) => {
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 6,
      address.length
    )}`;
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
  };
  const [visible, setVisible] = useState(true);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <section className="max-w-xl mx-auto w-full">
      <div className="flex items-center justify-between gap-4 mb-8 sm:flex-row flex-col">
        <h2 className="sm:text-4xl text-2xl text-blue-600 font-semibold font-founders">
          Leaderboard
        </h2>
        <div
          className={`${isDataLoading ? "pointer-events-none opacity-50" : ""}`}
        >
          <div className="flex items-center gap-1">
            {filters.map((entry, index) => (
              <div key={entry.value} className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedFilter(entry.value)}
                  className={selectedFilter == entry.value ? "font-bold" : ""}
                >
                  {entry.label}
                </button>
                {index !== filters.length - 1 && <span>|</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`${isDataLoading ? "pointer-events-none opacity-50" : ""}`}
      >
        {!data?.length && isDataLoading ? (
          <div className="text-center font-mono">Loading...</div>
        ) : !data?.length ? (
          <div className="text-center font-mono">No results</div>
        ) : (
          data.map((entry) => (
            <div
              key={entry.address}
              className={`${
                entry.address == currentUserAddress ? "[&_p]:text-blue-600" : ""
              } sm:px-7 px-4 py-4 flex items-center justify-between odd:bg-grey-100 overflow-hidden gap-2`}
            >
              <div className="flex items-center gap-2">
                <p className="sm:text-lg text-grey-400">#{entry.rank}</p>

                <button
                  data-tooltip-id={entry.address}
                  data-tooltip-content="Address copied!"
                  className="sm:text-xl truncate line-clamp-1 font-mono"
                  onClick={() => {
                    visible ? hide : show;
                    copyToClipboard(entry.address);
                  }}
                >
                  {entry.ens ? entry.ens : truncateAddress(entry.address)}
                </button>
                <Tooltip
                  openOnClick
                  id={entry.address}
                  content="Address copied!"
                />
              </div>
              <p className="sm:text-xl flex-shrink-0 font-founders">
                {formatNumber(entry.numberOfPoints)} GMV
              </p>
            </div>
          ))
        )}
      </div>
      {!!total ? (
        <div
          className={`${isDataLoading ? "pointer-events-none opacity-50" : ""}`}
        >
          <Pagination
            currentPage={currentPage}
            handlePageChange={(val: number) => {
              handlePageChange(val);
            }}
            totalResults={total}
            pageSize={LEADERBOARD_PAGE_SIZE}
          />
        </div>
      ) : (
        ""
      )}
    </section>
  );
};

const Faq = () => {
  const faqs = [
    {
      question: "What is GMV?",
      response: "GMV stands for Gross Marketplace Value - its basically a measure of how much $$$ has gone through Allo.",
    },
    {
      question: "What does Allo Leaderboard track?",
      response: "Anyone who has created GMV on Allo as a software developer, L2 network, round operator, grant creator, or grant contributor, will be tracked through this resource.",
    },
    {
      question: "What apps can I use on Allo?",
      response: "Go to https://github.com/allo-protocol/awesome-allo-protocol and view the allo app directory.",
    },
    {
      question: "How can I build on Allo?",
      response: "Go to docs.allo.gitcoin.co and start building",
    },
    {
      question: "Why do I care about creating GMV on Allo?",
      response: "If you believe in Gitcoins mission of Funding What Matters, then Allo Leaderboard is a measure of how much youve contributed to that.   If you believe there might be future retroactive airdrops to creators of Allo Gmv, then you might care. . ",
    },
    {
      question: "How do you earn a spot on the leaderboard?",
      response:
        "Every $1 spent on Allo equals approximately 5 $$$ allocated to the leaderboard. 1 point for the round operator, 1 for the grant owner, 1 for the contributor, allo contract dev and 1 for the network it was run on",
    },
  ];
  return (
    <section className="max-w-xl mx-auto w-full">
      <h2 className="sm:text-4xl text-2xl text-blue-600 font-semibold text-center font-founders mb-8">
        FAQ
      </h2>
      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg border border-blue-600 py-4 px-8"
          >
            <h3 className="font-bold text-xl text-blue-600 font-founders mb-2">
              {faq.question}
            </h3>
            <p>{faq.response}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
