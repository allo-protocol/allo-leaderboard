import Image from "next/image";
import { Button } from "./components/button";
import Link from "next/link";

export default function Home() {
  const Intro = () => (
    <div className="-mx-2 px-4 bg-allo-bg min-h-screen max-w-screen bg-top xl:bg-center bg-no-repeat flex items-center justify-center bg-cover py-20">
      <div className="rounded-[32px] border border-blue-800 bg-yellow-200 px-4 sm:px-12 md:px-24 py-10 mx-auto max-w-6xl">
        <div className="flex items-center gap-12 xl:flex-row flex-col">
          <div className="flex flex-col gap-8">
            <h1 className="text-blue-600 text-5xl sm:text-6xl font-founders">
              <span className="font-medium">Allo</span>{" "}
              <span className="font-light">Leaderboard</span>
            </h1>
            <h3 className="text-blue-800 text-xl">
              Short intro about what are allo points, how to get them, what they
              are useful for and that’s it. Short intro about what are allo
              points, how to get them, what they are useful for and that’s it.
              Short intro about what are allo points, how to get them, what they
              are useful for and that’s it. Short intro about what are allo
              points, how to get them, what they are useful for and that’s it.
            </h3>
            <div className="w-fit">
              <Link href="/start">
                <Button type="secondary">Launch app</Button>
              </Link>
            </div>
          </div>

          <Image
            src="/graphic.svg"
            alt=""
            width={342}
            height={492}
            priority
          />
        </div>
      </div>
    </div>
  );
  return (
    <main className="min-h-screen mx-2">
      <Intro />
    </main>
  );
}
