"use client";

import { fontSaira } from "@/utils/fonts";
import { generatePageNumbers } from "@/utils/generate-page-numbers";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FooterPaginationProps {
  page: number;
  total: number;
  limit: number;
}

export const FooterPagination = ({
  page: initialPage,
  total,
  limit,
}: FooterPaginationProps) => {
  const router = useRouter();
  const totalPages = Math.ceil(total / limit);
  const [page, setPage] = useState(initialPage);

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}`);
    setPage(newPage);
  };

  const PageButton = ({
    pageNumber,
    isActive,
  }: {
    pageNumber: number;
    isActive: boolean;
  }) => (
    <button
      onClick={() => handlePageChange(pageNumber)}
      className={`px-3 py-1 rounded-full ${
        isActive ? "bg-indigo-500 text-white" : "bg-gray-200 text-zinc-800"
      }`}
    >
      {pageNumber}
    </button>
  );

  const renderPageNumbers = generatePageNumbers(page, totalPages).map(
    (pageNumber, index) =>
      typeof pageNumber === "number" ? (
        <PageButton
          key={index}
          pageNumber={pageNumber}
          isActive={page === pageNumber}
        />
      ) : (
        <span key={index}>{pageNumber}</span>
      )
  );

  return (
    <div className="flex justify-center items-center gap-2 p-3 border-t border-zinc-100">
      {page > 1 && (
        <button
          onClick={() => handlePageChange(page - 1)}
          className="px-3 py-1 rounded-full bg-white border text-zinc-800"
        >
          <span className={fontSaira}>Anterior</span>
        </button>
      )}
      {renderPageNumbers}
      {page < totalPages && (
        <button
          onClick={() => handlePageChange(page + 1)}
          className="px-3 py-1 rounded-full bg-white border text-zinc-800"
        >
          <span className={fontSaira}>Próximo</span>
        </button>
      )}
    </div>
  );
};
