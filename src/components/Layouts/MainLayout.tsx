import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header>
        <h1>Main Layout</h1>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;