import { twMerge } from "tailwind-merge";
import styles from "./loader.module.css";

export const Loader = (props: { className?: string }) => {
  const style = twMerge("text-zinc-500", props.className);
  return <div className={`${styles["loader"]} ${style}`} />;
};
