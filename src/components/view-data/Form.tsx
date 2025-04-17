import React from "react";
import { Button } from "@/components/ui/button";
import { fontInter } from "@/utils/fonts";

interface SectionProps {
  children: React.ReactNode;
  onEdit?: () => void;
  editLabel?: string;
}

export default function Section({
  children,
  onEdit,
  editLabel
}: SectionProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div>{children}</div>

      <div className="flex justify-end mt-10">
        <Button
          onClick={onEdit}
          className={`${fontInter} bg-indigo-600 hover:bg-indigo-800 hover:cursor-pointer text-white`}
        >
          {editLabel}
        </Button>
      </div>
    </div>
  );
}

