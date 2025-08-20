import Link from "next/link";
import React, { useState, useEffect } from "react";

const HeaderNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10); // triggers when user scrolls down 10px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full left-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md shadow-md" : ""
      }`}
    >
      <div className="flex justify-between items-center px-6 md:px-10 py-4">
        <img className="w-10" src="/images/new-logo.png" alt="Logo" />

        {/* Hamburger menu for small screens */}
        <button
          className="md:hidden text-[#8E0EB9]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Navigation links */}
        <nav
          className={`${
            isOpen ? "block" : "hidden"
          } absolute md:static top-[80px] left-0 w-full md:w-auto md:flex bg-[#8E0EB9] md:bg-transparent px-6 md:px-0 py-4 md:py-0 flex-col md:flex-row gap-6 md:gap-8 text-black items-start md:items-center`}
        >
          <p className="my-3">
            <Link href="/" className="hover:text-[#8E0EB9]">
              Home
            </Link>
          </p>
          <p className="my-3">
            <Link href="/#about" className="hover:text-[#8E0EB9]">
              About
            </Link>
          </p>
          <p className="my-3">
            <Link href="/#projects" className="hover:text-[#8E0EB9]">
              Projects
            </Link>
          </p>
          <p className="my-3">
            <Link href="/#team" className="hover:text-[#8E0EB9]">
              Team
            </Link>
          </p>

          <Link href={"/#contact"}>
            <button className="rounded-full text-[#FBFBFB] my-3 py-2 px-6 border border-[#E5DEFF] bg-[#8E0EB9]">
              Contact Us
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default HeaderNav;
