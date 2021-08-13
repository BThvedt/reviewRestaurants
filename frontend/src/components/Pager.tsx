import React, { useState, FC } from "react"
import { ChevronLeft, ChevronRight } from "assets"
import ReactPaginate from "react-paginate"

interface IProps {
  count: number
  itemsPerPage: number
  forcePage: number
  setPage: (pageNum: number) => void
}

const Pager: FC<IProps> = ({ forcePage, setPage, count, itemsPerPage }) => {
  return (
    <ReactPaginate
      previousLabel={
        <img src={ChevronLeft} className="bi bi-chevron-left p-2" />
      }
      nextLabel={<img src={ChevronRight} className="bi bi-chevron-right p-2" />}
      breakLabel={"..."}
      breakClassName="m-2 "
      pageCount={Math.floor(count / itemsPerPage)}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      forcePage={forcePage}
      onPageChange={(data) => {
        setPage(data.selected)
      }}
      containerClassName="flex"
      activeClassName="text-indigo-400 font-bold"
      pageClassName="p-2"
      previousClassName="relative top-1"
      nextClassName="relative top-1"
    />
  )
}

export default Pager
