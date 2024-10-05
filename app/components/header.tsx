import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./button";

export const Header = () => (
  <header className="sm:px-6 px-2 bg-black flex items-center justify-between sm:gap-16 gap-6 py-2">
    <div className="flex items-center sm:gap-16 gap-6">
      <Link href="https://allo.gitcoin.co/" target="_blank">
        <Image
          src="/allo-logo.svg"
          alt="Allo logo"
          width={74}
          height={20}
          className="sm:max-h-none max-h-[15px] w-auto"
        />
      </Link>
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-white font-semibold">
            <div className="flex items-center gap-2">
              Leaderboard
              <Image alt="" width="12" height="11" src="/down-icon.svg" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black">
            <DropdownMenuItem>
              <Link
                href="https://allo.expert"
                target="_blank"
                className="w-full"
              >
                Experts
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="https://allobook.gitcoin.co/"
                target="_blank"
                className="w-full"
              >
                Book
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <nav className="sm:block hidden">
        <ul className="font-semibold flex items-center sm:gap-8 gap-4 text-white">
          <li>
            <Link
              href="https://allo.expert"
              target="_blank"
              className="link white"
            >
              Experts
            </Link>
          </li>
          <li>
            <Link href="/" className="link white selected">
              Leaderboard
            </Link>
          </li>
          <li>
            <Link
              href="https://allobook.gitcoin.co/"
              target="_blank"
              className="link white"
            >
              Book
            </Link>
          </li>
        </ul>
      </nav>
    </div>
    <div className="flex items-center gap-2">
      <Link href="https://t.me/+eY1-8OcToHI3ZWJh" target="_blank"><Button type="secondary">Join Telegram</Button></Link>
      <ConnectButton />
    </div>
  </header>
);
