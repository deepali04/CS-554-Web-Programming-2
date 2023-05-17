import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function PaginationButtons({ count, handleChange, page }) {
  return (
    <div className="pagination my-3">
       <Stack spacing={2}>
        <Pagination
          count={count}
          page={page}
          color="secondary"
          onChange={handleChange}
          showFirstButton
          showLastButton
        />
      </Stack>
    </div>
  );
}
