/** @format */

import React from "react";
import { RotateCircleLoading } from "react-loadingg";

function ThemedSuspense() {
  return (
    <div className="w-full justify-end bg-green-500 items-center h-screen p-6 text-lg font-medium text-gray-600 dark:text-gray-400 dark:bg-gray-900 ">
      <RotateCircleLoading color="#fff" />
    </div>
  );
}

export default ThemedSuspense;
