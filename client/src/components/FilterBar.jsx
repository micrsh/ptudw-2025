const sorting = [
  { value: "", label: "Default sorting" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price ASC" },
  { value: "price_desc", label: "Price DESC" },
  { value: "name_asc", label: "Name ASC" },
  { value: "name_desc", label: "Name DESC" },
];

const showing = [
  { value: "6", label: "Show 6" },
  { value: "9", label: "Show 9" },
  { value: "12", label: "Show 12" },
];

export default function FilterBar({
  sort,
  onSortChange,
  limit,
  onLimitChange,
  page = 1,
  totalPages,
  onPageChange,
}) {
  const numTotalPages = Number(totalPages) || 1;
  const numPage = Number(page) || 1;

  const prevDisabled = numPage <= 1;
  const prevPage = prevDisabled ? 1 : numPage - 1;
  const nextDisabled = numPage >= numTotalPages;
  const nextPage = nextDisabled ? numTotalPages : numPage + 1;

  const start = Math.max(1, numPage - 2);
  const end = Math.min(numTotalPages, numPage + 4);
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="filter-bar d-flex flex-wrap align-items-center">
      <div className="sorting">
        <select
          className="nice-select"
          onChange={(e) => onSortChange(e.target.value)}
          value={sort}
        >
          {sorting.map((s) => (
            <option value={s.value} key={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="sorting mr-auto">
        <select
          className="nice-select"
          onChange={(e) => onLimitChange(e.target.value)}
          value={limit}
        >
          {showing.map((s) => (
            <option value={s.value} key={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="pagination">
        <a className="prev-arrow" onClick={() => onPageChange(prevPage)}>
          <i className="fa fa-long-arrow-left" aria-hidden="true" />
        </a>
        {start > 1 && (
          <a className="dot-dot">
            <i className="fa fa-ellipsis-h" aria-hidden="true" />
          </a>
        )}

        {pages.map((p) => (
          <a
            onClick={() => onPageChange(p)}
            className={`${p === numPage ? "active" : ""}`}
            key={p}
          >
            {p}
          </a>
        ))}

        {end < numTotalPages && (
          <a className="dot-dot">
            <i className="fa fa-ellipsis-h" aria-hidden="true" />
          </a>
        )}

        <a className="next-arrow" onClick={() => onPageChange(nextPage)}>
          <i className="fa fa-long-arrow-right" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
