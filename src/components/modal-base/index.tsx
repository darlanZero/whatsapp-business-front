import { fontOpenSans } from "@/utils/fonts";
import { HTMLMotionProps, motion, MotionProps } from "framer-motion";
import Link from "next/link";
import React, { HTMLAttributes } from "react";
import { IoClose } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

const animations = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} satisfies MotionProps;

interface ModalFormProps extends HTMLMotionProps<"form"> {
  children: React.ReactNode;
}

const ModalContainer = (props: HTMLMotionProps<"div">) => {
  const { className, ...rest } = props;

  const style = twMerge(
    "flex fixed top-0 w-full left-0 h-screen z-40 bg-blue-900/5 backdrop-blur-[1px] text-zinc-500 overflow-auto p-3",
    className
  );

  return (
    <motion.div
      className={style}
      {...rest}
      variants={animations}
      initial="initial"
      transition={{ duration: 0.1 }}
      animate="animate"
      exit="exit"
    >
      {props.children}
    </motion.div>
  );
};

export const ModalForm = (props: ModalFormProps) => {
  const { className, children, ...rest } = props;
  const classStyle = twMerge(
    "flex flex-col m-auto bg-white border rounded-md w-full max-w-[30rem]",
    className
  );

  return (
    <motion.form
      initial={{ scaleY: 0.4, opacity: 0, filter: "blur(20px)" }}
      animate={{ scaleY: 1, opacity: 1, filter: "blur(0px)" }}
      exit={{ scaleY: 0.4, opacity: 0, filter: "blur(20px)" }}
      transition={{
        duration: 0.2,
        type: "spring",
        filter: { duration: 0.1 },
      }}
      {...rest}
      className={classStyle}
    >
      {children}
    </motion.form>
  );
};

const ModalHeader = (
  props: HTMLAttributes<HTMLDivElement> & { title: string }
) => {
  const { title, className, ...rest } = props;
  const classStyle = twMerge("flex justify-between w-full", className);

  return (
    <header className={classStyle} {...rest}>
      <h1 className={`${fontOpenSans}`}>{title}</h1>
      <Link href="?" className="w-8 h-8 hover:bg-zinc-100 grid place-items-center rounded-lg">
        <IoClose size={20}/>
      </Link>
    </header>
  );
};

const Modal = {
  container: ModalContainer,
  form: ModalForm,
  header: ModalHeader,
};

export { Modal };
