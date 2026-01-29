import React from 'react';
import { Pagination } from 'react-bootstrap';

type PagingProps = {
  total_filtered: number;
  limit: number;
  page: number;
  list: Array<unknown>;
  onPageChange: (page: number) => void;
};

export const PagingComponent: React.FC<PagingProps> = ({
  total_filtered,
  limit,
  page,
  onPageChange
}) => {
  const totalPages = Math.ceil(total_filtered / limit);
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageItems = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => goToPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return pageItems;
  };

  return (
    <Pagination>
      <Pagination.Item disabled={page === 1} onClick={() => goToPage(1)}>
        First
      </Pagination.Item>
      <Pagination.Item disabled={page === 1} onClick={() => goToPage(page - 1)}>
        Previous
      </Pagination.Item>

      {renderPageNumbers()}

      <Pagination.Item disabled={page === totalPages} onClick={() => goToPage(page + 1)}>
        Next
      </Pagination.Item>
      <Pagination.Item disabled={page === totalPages} onClick={() => goToPage(totalPages)}>
        Last
      </Pagination.Item>
    </Pagination>
  );
};
