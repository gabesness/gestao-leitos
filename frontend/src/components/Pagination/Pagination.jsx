import React from 'react';
import PropTypes from 'prop-types';

function Pagination({
  postsPerPage, totalPosts, paginate, currentPage,
}) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i += 1) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <nav>
        <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
          {pageNumbers.map((number) => (
            <li key={number} style={{ margin: '0 5px' }}>
              <button
                onClick={() => paginate(number)}
                type="button"
                style={{
                  width: '40px', // Largura fixa para os botões quadrados
                  height: '40px', // Altura fixa para os botões quadrados
                  backgroundColor: number === currentPage ? '#3B71CA' : '#f8f9fa',
                  color: number === currentPage ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
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
  postsPerPage: PropTypes.number.isRequired,
  totalPosts: PropTypes.number.isRequired,
  paginate: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};

export default Pagination;
