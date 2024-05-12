import React from 'react';
import PropTypes from 'prop-types';

function Pagination({
  postsPerPage, totalPosts, paginate,
}) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i += 1) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <nav>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <button
                onClick={() => paginate(number)}
                type="button"
                className="page-link"
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
Pagination.propTypes = {
  postsPerPage: PropTypes.isRequired,
  totalPosts: PropTypes.isRequired,
  paginate: PropTypes.isRequired,
};

export default Pagination;