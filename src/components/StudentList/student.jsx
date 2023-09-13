import PropTypes from 'prop-types';
import { Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

Student.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  birth: PropTypes.string,
  phone: PropTypes.string,
  handleClickDeleteIcon: PropTypes.func,
  handleClickUpdateIcon: PropTypes.func,
};

function Student({ id, name, birth, phone, handleClickDeleteIcon, handleClickUpdateIcon }) {
  return (
    <TableRow
      sx={{
        '&:hover': {
          backgroundColor: '#ccc',
        },
      }}
    >
      <StyledTableCell>{id}</StyledTableCell>
      <StyledTableCell>{name}</StyledTableCell>
      <StyledTableCell>{birth}</StyledTableCell>
      <StyledTableCell>{phone}</StyledTableCell>
      <StyledTableCell sx={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
        <Button
          variant="contained"
          onClick={() => {
            handleClickDeleteIcon(id);
          }}
        >
          <DeleteOutlineOutlinedIcon></DeleteOutlineOutlinedIcon>
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleClickUpdateIcon(id);
          }}
        >
          <EditIcon></EditIcon>
        </Button>
      </StyledTableCell>
    </TableRow>
  );
}

export default Student;
