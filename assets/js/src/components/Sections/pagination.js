import React, { useState, useEffect } from "react";

function pageAlgo(currentPage, pageCount) {
    let delta = 2,
    left = currentPage - delta,
    right = currentPage + delta + 1,
    result = [];

    result = Array.from({ length: pageCount }, (v, k) => k + 1).filter(
        i => i && i >= left && i < right
    );

    if (result.length > 1) {
        // Add first page and dots
        if (result[0] > 1) {
            if (result[0] > 2) {
                result.unshift("...");
            }
            result.unshift(1);
        }

        // Add dots and last page
        if (result[result.length - 1] < pageCount) {
            if (result[result.length - 1] !== pageCount - 1) {
                result.push("...");
            }
            result.push(pageCount);
        }
    }

    return result;
}

const Pagination = ({ nrOfPages, currentpage, onSelectPage }) => {
    const [pagination, setPagination] = useState([]);
    useEffect(() => {
        const paginationArray = pageAlgo(
            parseInt(currentpage, 0),
            parseInt(nrOfPages, 0)
        );
        setPagination(paginationArray);
    }, [currentpage, nrOfPages]);

    if(pagination && pagination.length > 1){
        return (
            <div className="posts-app__pagination">

                {pagination && pagination.length > 1 && pagination.map((n, i) => {
                    return n != "..." ? (
                        <button
                        key={i}
                        onClick={() => {
                        onSelectPage(n);
                        window.scrollTo(0, 0); // This line will scroll to the top of the page
                        }}>
                            {n}
                        </button>
                    ) : (
                        <button key={i}>...</button>
                    );
                })}
            </div>
        );
    }
};

export default Pagination;