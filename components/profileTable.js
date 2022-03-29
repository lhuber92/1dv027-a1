import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

/**
 * A table listing user-data
 * 
 * @param {object} userdata - An object containing the logged in users profile data. Includes id, email, username and last_activity_on
 * @returns - A react component
 */
export default function ProfileTable({userdata}) {
  return (
    <>
      {userdata && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">GitLab ID</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Username</TableCell>
                <TableCell align="right">Last activity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="right">{userdata.id}</TableCell>
                  <TableCell align="right">{userdata.email}</TableCell>
                  <TableCell align="right">{userdata.username}</TableCell>
                  <TableCell align="right">{userdata.last_activity_on}</TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
