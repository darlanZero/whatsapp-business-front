"use client";

import { fontSaira } from "@/utils/fonts";
import { generatePageNumbers } from "@/utils/generate-page-numbers";
import { usePushQuery } from "@/utils/push-query";
import { memo, useState } from "react";

interface FooterPaginationProps {
  page: number;
  total: number;
  limit: number;
}

interface PageButtonProps {
  pageNumber: number;
  isActive: boolean;
  onPageChange: (page: number) => void;
}


const PageButton = memo(function PageButton({
  pageNumber,
  isActive,
  onPageChange,
}: PageButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onPageChange(pageNumber)}
      className={`px-3 py-1 rounded-full ${
        isActive ? "bg-indigo-500 text-white" : "bg-gray-200 text-zinc-800"
      }`}
    >
      {pageNumber}
    </button>
  );
});

export const FooterPagination = ({
  page: initialPage,
  total,
  limit,
}: FooterPaginationProps) => {
  const totalPages = Math.ceil(total / limit);
  const [page, setPage] = useState(initialPage);
  const pushQuery = usePushQuery();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    pushQuery("page", newPage.toString());
  };

  const renderPageNumbers = generatePageNumbers(page, totalPages).map(
    (pageNumber, index) =>
      typeof pageNumber === "number" ? (
        <PageButton
          key={index}
          pageNumber={pageNumber}
          isActive={page === pageNumber}
          onPageChange={handlePageChange}
        />
      ) : (
        <span key={index} className="px-3 py-1 text-zinc-800">
          {pageNumber}
        </span>
      )
  );

  return (
    <div className="flex justify-center items-center gap-2 p-3 border-t border-zinc-100">
      {page > 1 && (
        <button
          type="button"
          onClick={() => handlePageChange(page - 1)}
          className="px-3 py-1 rounded-full bg-white border text-zinc-800"
        >
          <span className={fontSaira}>Anterior</span>
        </button>
      )}
      {renderPageNumbers}
      {page < totalPages && (
        <button
          type="button"
          onClick={() => handlePageChange(page + 1)}
          className="px-3 py-1 rounded-full bg-white border text-zinc-800"
        >
          <span className={fontSaira}>Próximo</span>
        </button>
      )}
    </div>
  );
};
