import React from "react";

function Main({ children }) {
  return (
    <main className="h-full overflow-y-auto font-sans scrollbar">
      <div className="grid grid-cols-1 mx-auto">{children}</div>
    </main>
  );
}

export default Main;
