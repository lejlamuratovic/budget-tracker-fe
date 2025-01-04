import React from "react";
import { CircularProgress, Box } from "@mui/material";

const Loading: React.FC = () => (
  <Box
    data-testid="loading-container"
    display="flex"
    alignItems="center"
    justifyContent="center"
    height="100%"
    width="100%"
  >
    <CircularProgress color="primary"/>
  </Box>
);

export default Loading;
