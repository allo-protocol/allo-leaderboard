"use client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "../components/button";
import InfoModal from "../components/modal";
import Image from "next/image";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import { CustomAPIParams, DuneClient } from "@duneanalytics/client-sdk";
import Pagination from "../components/pagination";
import { Footer } from "../components/footer";
import { formatNumber } from "../components/helpers";
import {
  LeaderboardFilter,
  LeaderboardItem,
  PointsBreakdownItem,
  Role,
} from "../types";
import { useLeaderboard } from "../hooks/useLeaderboard";
import {
  LEADERBOARD_PAGE_SIZE,
  POINTS_BREAKDOWN_PAGE_SIZE,
} from "../constants";
import { Input } from "../components/input";
import { usePointsBreakdown } from "../hooks/usePointsBreakdown";
import { Tooltip } from "react-tooltip";

export default function Start() {
  const { isConnected, address: userAddress } = useAccount();
  const [address, setAddress] = useState<string>();

  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isPointsBreakdownModalOpen, setIsPointsBreakdownModalOpen] =
    useState(false);
  const [points, setPoints] = useState<number>();
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
    getPointBreakdownByAddress,
    isLoading: isPointsBreakdownLoading,
    pointsBreakdown,
    totalResults: pointBreakdownTotalEntries,
    pointsBreakdownCurrentPage,
  } = usePointsBreakdown(pointsBreakdownSelectedPage, address);

  const getPointsByAddress = async (address: string) => {
    const options = {
      method: "GET",
      headers: {
        "X-DUNE-API-KEY": process.env.NEXT_PUBLIC_DUNE_API_KEY ?? "",
      },
    };

    let queryParams: any;
    if (isAddress(address))
      queryParams = { ...queryParams, filters: `address =  '${address}'` };
    else queryParams = { ...queryParams, filters: `ens = '${address}'` };

    const queryId = process.env.NEXT_PUBLIC_LEADERBOARD_API;
    const url = `https://api.dune.com/api/v1/query/${queryId}/results?${new URLSearchParams(
      queryParams
    ).toString()}`;

    const resp = await fetch(url, options);
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    const results = await resp.json();

    const points = (results?.result?.rows[0]?.total_points as number) ?? 0;
    setPoints(points);
    !!points && (await getPointBreakdownByAddress(address));
  };

  const checkPoints = async (address: string) => {
    setIsDataLoading(true);
    address && (await getPointsByAddress(address));
    setIsDataLoading(false);
  };

  useEffect(() => {
    async function autoCheckConnectedUser() {
      if (isConnected) {
        setAddress(userAddress);
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
        points={points}
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
        data={pointsBreakdown}
        totalPointsNumber={points ?? 0}
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
  isPointsBreakdownModalOpen,
  setIsPointsBreakdownModalOpen,
  isDataLoading,
  pointBreakdownTotalEntries,
  currentPage,
  handlePageChange,
}: {
  data: PointsBreakdownItem[];
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
        return "contributor";
      case Role.COTRACT_DEV:
        return "contract dev";
      case Role.GRANTEE:
        return "grantee";
      case Role.ROUND_OPERATOR:
        return "round operator";
    }
  };

  return (
    <InfoModal
      isOpen={isPointsBreakdownModalOpen}
      setIsOpen={setIsPointsBreakdownModalOpen}
    >
      <div>
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
              {data.map((entry) => (
                <div className="" key={entry.txHash}>
                  <span className="text-grey-400 mr-2">
                    {new Date(entry.timestamp).toDateString()}
                  </span>
                  <span className="text-blue-800 font-medium">
                    {formatNumber(entry.numberOfPoints)} pts -{" "}
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
      question: "What can you do with Allo GMV?",
      response: "Nothing Yet, But Stay Tooned!",
    },
    {
      question: "What apps can I use on Allo?",
      response: "Go to xyz.xyz and view the allo app directory.",
    },
    {
      question: "How can I build on Allo?",
      response: "Go to docs.allo.gitcoin.co and  start building",
    },
    {
      question: "How can I join the Gitcoin ciztiens/ Allo Accelerator",
      response: "Go to xyz.xyz and apply today. . ",
    },
    {
      question: "How do you Earn GMV?",
      response:
        "Every $1 spent on Allo equals approximately 5 GMV. 1 point for the round operator, 1 for the grant owner, 1 for the contributor, allo contract dev and 1 for the network it was run on",
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
