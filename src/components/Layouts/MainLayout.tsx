import React from "react";
import HeaderNav from "../HeaderNav";
import Footer from "../Footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <HeaderNav />

      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
