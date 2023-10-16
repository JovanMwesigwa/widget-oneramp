import React from "react";

const Tabs = () => {
  return (
    <>
      <div className="flex flex-col flex-1 items-center justify-center cursor-pointer">
        <h1 className="md:text-xl font-medium">Sell</h1>

        <div className="w-full  rounded-full h-2 mt-4 bg-black"></div>
      </div>

      <div className="flex flex-col flex-1 items-center justify-center cursor-pointer">
        <h1 className="md:text-xl font-thin">Buy</h1>

        <div className="w-full rounded-full h-2 mt-4 bg-neutral-300"></div>
      </div>
    </>
  );
};

export default Tabs;
