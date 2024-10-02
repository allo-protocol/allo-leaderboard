import Image from "next/image";
import Link from "next/link";

export const Footer = () => (
  <div className="mt-20 relative bg-footer-gradient-bg sm:px-6 px-2 bg-top bg-cover ">
    <footer className="py-10">
      <div className="flex sm:flex-row flex-col items-center gap-10">
        <Image
          className="max-h-[20px] w-auto"
          src="/allo-logo-black.svg"
          alt="Allo Protocol Logo"
          width={111}
          height={30}
        />

        <nav>
          <ul className="font-semibold flex items-center gap-8">
            <li>
              <Link
                href="https://alloexperts.gitcoin.co"
                target="_blank"
                className="link"
              >
                Experts
              </Link>
            </li>
            <li>
              <Link href="/" className="link selected">
                Leaderboard
              </Link>
            </li>
            <li>
              <Link
                href="https://allobook.gitcoin.co/"
                target="_blank"
                className="link"
              >
                Book
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  </div>
);
