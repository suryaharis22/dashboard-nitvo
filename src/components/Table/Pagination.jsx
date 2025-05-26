import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
    const maxPagesToShow = 5; // Number of page buttons to show at once
    const pages = [];

    // Calculate the range of pages to show
    const getPageRange = () => {
        let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let end = Math.min(totalPages, start + maxPagesToShow - 1);

        if (end - start + 1 < maxPagesToShow) {
            start = Math.max(1, end - maxPagesToShow + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
    };

    getPageRange();

    return (
        <div className="flex justify-center items-center">
            <nav>
                <ul className="flex items-center -space-x-px h-8 text-sm">
                    <li>
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight  border border-e-0 border-gray-300 rounded-s-lg hover:bg-primary-light hover:text-white ${currentPage === 1 ? 'bg-primary text-white' : 'text-gray-500 bg-white '}`}
                        >
                            First
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-primary-light hover:text-white"
                        >
                            <FaChevronLeft />
                        </button>
                    </li>
                    {pages.map((page) => (
                        <li key={page}>
                            <button
                                onClick={() => handlePageChange(page)}
                                className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 hover:bg-primary-light hover:text-white ${currentPage === page ? 'bg-primary text-white' : 'text-gray-500 bg-white'
                                    }`}
                            >
                                {page}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-primary-light hover:text-white"
                        >
                            <FaChevronRight />
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight  border border-e-0 border-gray-300 rounded-e-lg hover:bg-primary-light hover:text-white ${currentPage === totalPages ? 'bg-primary text-white' : 'text-gray-500 bg-white '}`}
                        >
                            Last
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;
