import React, { useEffect } from "react";
import HeaderNav from "../HeaderNav";
import Footer from "../Footer";
import { usePathname } from "next/navigation";
import { logPageEvent } from "../../utils/firebase"; // Adjust the import path as necessary

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    logPageEvent("page_view", { page: pathname });
  }, [pathname]);

  return (
    <div>
      <HeaderNav />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
