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

interface ModalDivProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

const ModalContainer = (props: HTMLMotionProps<"div">) => {
  const { className, ...rest } = props;

  const style = twMerge(
    "flex fixed top-0 w-full left-0 h-screen z-40 bg-blue-900/10 text-zinc-500 overflow-auto p-3",
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
      style={{ perspective: "1000px" }}
      exit="exit"
    >
      {props.children}
    </motion.div>
  );
};

export const ModalForm = (props: ModalFormProps) => {
  const { className, children, ...rest } = props;
  const classStyle = twMerge(
    "flex flex-col m-auto bg-white border border-indigo-50 rounded-md w-full max-w-[30rem] will-change-transform",
    className
  );

  return (
    <motion.form
      initial={{ scale: 0.8, rotateY: 10, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      exit={{ scale: 0.8, rotateY: 10, opacity: 0.6 }}
      transition={{
        duration: 0.1,
        type: "tween",
        filter: { duration: 0.1 },
      }}
      {...rest}
      className={classStyle}
    >
      {children}
    </motion.form>
  );
};

export const ModalDiv = (props: ModalDivProps) => {
  const { className, children, ...rest } = props;
  const classStyle = twMerge(
    "flex flex-col m-auto bg-white border border-indigo-50 rounded-md w-full max-w-[30rem] will-change-transform",
    className
  );

  return (
    <motion.div
      initial={{ scale: 0.8, rotateY: 10, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      exit={{ scale: 0.8, rotateY: 10, opacity: 0.6 }}
      transition={{
        duration: 0.1,
        type: "tween",
        filter: { duration: 0.1 },
      }}
      {...rest}
      className={classStyle}
    >
      {children}
    </motion.div>
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
      <Link
        href="?"
        className="w-8 h-8 hover:bg-zinc-100 grid place-items-center rounded-lg"
      >
        <IoClose size={20} />
      </Link>
    </header>
  );
};

const Modal = {
  container: ModalContainer,
  box: ModalDiv,
  form: ModalForm,
  header: ModalHeader,
};

export { Modal };
