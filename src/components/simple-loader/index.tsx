import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export const SimpleLoader = (props: HTMLAttributes<HTMLDivElement>) => {
  const { className } = props;
  
  const style = twMerge(
    "w-12 h-12 rounded-full border-t-4 border-r-4 border-white border-r-transparent animate-spin",
    className
  );
		
  return <div className={style}></div>;
};
