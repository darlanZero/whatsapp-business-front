import Footer from "@/components/footer";
import styles from "./layout.module.css";

interface LayoutInProps {
  children: React.ReactNode;
}

export default function LayoutIn({ children }: LayoutInProps) {
  return (
    <main
      className={`${styles["background-in"]} w-full h-screen flex flex-col overflow-auto`}
    >
      {children}
      <Footer />
    </main>
  );
}
