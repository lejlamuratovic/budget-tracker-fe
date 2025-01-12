import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Paper, 
  Grid 
} from "@mui/material";

import { useDailyExpenses } from "../hooks";
import { DailyExpense, ExpenseDetail } from "../types";

interface DailyExpensesOverviewProps {
  userId: number;
}

const DailyExpensesOverview: React.FC<DailyExpensesOverviewProps> = ({ userId }) => {
  const [tempStartDate, setTempStartDate] = useState<string | null>(null);
  const [tempEndDate, setTempEndDate] = useState<string | null>(null);
  const [finalStartDate, setFinalStartDate] = useState<string | null>(null);
  const [finalEndDate, setFinalEndDate] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);

  const { data: dailyExpenses = [], isLoading, refetch } = useDailyExpenses(userId, finalStartDate, finalEndDate);

  const handleFetchOverview = () => {
    setFinalStartDate(tempStartDate);
    setFinalEndDate(tempEndDate);
    setShowTable(true);
    refetch();
  };

  return (
    <Paper elevation={0} sx={{ padding: "1rem", marginTop: "2rem" }}>
      <Typography variant="h6" gutterBottom sx={{ marginBottom: "2rem" }}>
        Daily Expenses Overview
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} mb={4} justifyContent="flex-start">
        <Grid item>
          <TextField
            label="Start Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={tempStartDate || ""}
            onChange={(e) => setTempStartDate(e.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            label="End Date"
            type="date"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={tempEndDate || ""}
            onChange={(e) => setTempEndDate(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleFetchOverview} 
            fullWidth
            sx={{ maxWidth: "200px" }}
          >
            Show Overview
          </Button>
        </Grid>
      </Grid>

      {/* Table */}
      {showTable && (
        <Box sx={{ overflowX: "auto" }}> {/* Add this wrapper */}
          {isLoading ? (
            <Typography align="center">Loading...</Typography>
          ) : dailyExpenses.length === 0 ? (
            <Typography align="center">No daily expenses found for the selected range.</Typography>
          ) : (
            <Table sx={{ minWidth: "600px" }}> {/* Ensure a minimum width for the table */}
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dailyExpenses.map((day: DailyExpense) => (
                  <TableRow key={day.date}>
                    <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
                    <TableCell>${day.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      {day.expenseDetails.map((detail: ExpenseDetail, index: number) => (
                        <Typography key={index} sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {detail.title}: ${detail.amount.toFixed(2)} ({detail.categoryName})
                        </Typography>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default DailyExpensesOverview;
