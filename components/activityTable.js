import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

/**
 * Takes array of gitlab activity objects and outputs a React component
 * Inspiration found here:
 * ttps://mui.com/components/tables/
 * 
 * @param {object} activityData - An array of gitlab activity objects
 * @returns - A React component
 */
export default function ActivityTable({activityData}) {
  const [rows, setRows] = React.useState(false)

  React.useEffect(() => {
    const tempRows = []
    for (let i = 0; i < activityData.length; i++) {
      tempRows.push({
        id: activityData[i].id,
        actionName: activityData[i].action_name,
        createdAt: activityData[i].created_at,
        targetTitle: activityData[i].target_title,
        targetType: activityData[i].target_type
      })
    }

    setRows(tempRows)
  }, [activityData])

  return (
    <>
      {rows && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Action name</TableCell>
                <TableCell align="right">Created At</TableCell>
                <TableCell align="right">Target Title</TableCell>
                <TableCell align="right">Target Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.actionName}
                  </TableCell>
                  <TableCell align="right">{row.createdAt}</TableCell>
                  <TableCell align="right">{row.targetTitle}</TableCell>
                  <TableCell align="right">{row.targetType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
