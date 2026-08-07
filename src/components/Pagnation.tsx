export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const visiblePages = 5;

  // Which "window" of pages we're in, and whether the last window is partial
  const isChange = totalPages % visiblePages > 0;

  const startPage = Math.floor((currentPage - 1) / visiblePages) * visiblePages + 1;

  // Recalculate endPage whenever we've hit the final (partial) window
  const isLastWindow = startPage + visiblePages - 1 >= totalPages;
  const endPage =
    isChange && isLastWindow
      ? totalPages
      : Math.min(startPage + visiblePages - 1, totalPages);

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => index + startPage
  );

  const baseButton =
    'px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseButton} border border-[#135C3D] text-[#135C3D] hover:bg-[#135C3D]/10 disabled:hover:bg-transparent`}
      >
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`${baseButton} text-[#135C3D] hover:bg-[#135C3D]/10`}
          >
            1
          </button>
          <span className="px-1 text-[#135C3D]/50">…</span>
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          className={`${baseButton} ${
            page === currentPage
              ? 'bg-[#135C3D] text-[#FBF7EC] shadow-sm'
              : 'text-[#135C3D] hover:bg-[#135C3D]/10'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          <span className="px-1 text-[#135C3D]/50">…</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className={`${baseButton} text-[#135C3D] hover:bg-[#135C3D]/10`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseButton} border border-[#135C3D] text-[#135C3D] hover:bg-[#135C3D]/10 disabled:hover:bg-transparent`}
      >
        Next
      </button>

      <span className="ml-3 text-xs text-[#135C3D]/70">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}