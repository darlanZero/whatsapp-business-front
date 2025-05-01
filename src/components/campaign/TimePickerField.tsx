"use client"

import { cn } from "@/lib/utils";
import { fontInter } from "@/utils/fonts";
import React from "react";
const TimePickerField: React.FC<{ name: string; label: string; ariaLabel?: string; className?: string }> = ({ name, label, ariaLabel, className }) => {
    const [time, setTime] = React.useState<string>("");
  
    return (
      <div className={cn("flex flex-col", className)}>
        <label htmlFor={name} className={`${fontInter} mb-1 text-sm font-medium text-gray-800`}>
          {label}
        </label>
        <input
          type="time"
          id={name}
          aria-label={ariaLabel || label}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={`${fontInter} w-full sm:w-40 p-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
      </div>
    );
  };


export { TimePickerField }
  