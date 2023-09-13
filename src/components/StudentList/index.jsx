import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Stack, TextField, Button, Typography, FormControl, FormHelperText } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Student from './student';
import './styles.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function StudentList() {
  let [newStudentBox, setNewStudentBox] = useState('model-create hidden');
  let [valueName, setValueName] = useState('');
  let [errName, setErrName] = useState('');
  let [valuePhone, setValuePhone] = useState('');
  let [errPhone, setErrPhone] = useState('');
  let [valueBirthday, setValueBirthDay] = useState(null);
  let [errBirthday, setErrBirthday] = useState('');
  let [students, setStudents] = useState([]);
  let [idStudent, setIdStudent] = useState(9500);
  let [deleteModel, setDeleteModel] = useState('deletemodel hidden');
  let [overlay, setOverlay] = useState('overlay hidden');
  let [updateStudent, setUpdateStudent] = useState('update hidden');
  let [dataFound, setDataFound] = useState([]);

  (function setDataStudentsInLocalStorage() {
    let data = JSON.parse(localStorage.getItem('students'));
    if (data && data.length > 0 && students.length == 0) {
      setStudents(data);
      setDataFound(data);
    }
  })();

  function resetAllValue() {
    setValueName('');
    setValuePhone('');
    setValueBirthDay(null);
    setErrName('');
    setErrPhone('');
    setErrBirthday('');
  }

  function closeModelStudentBox() {
    setNewStudentBox('model-create hidden');
    setUpdateStudent('update hidden');
    setOverlay('overlay hidden');
    resetAllValue();
  }

  function handleClickCreateBtn() {
    setNewStudentBox('model-create show');
    setOverlay('overlay show');
  }

  function checkNumberPhone() {
    if (valuePhone.length <= 9 || isNaN(valuePhone)) {
      return false;
    }
    return true;
  }
  function checkName() {
    if (valueName.length <= 0) {
      return false;
    }
    return true;
  }

  function isValidDateOfBirthday(date) {
    let today = new Date();
    let birthDate = new Date(date);
    let minYear = 1900;
    if (birthDate <= today && birthDate.getFullYear() >= minYear) {
      return true;
    }
    return false;
  }

  function valueNewId() {
    if (students.length == 0) {
      setIdStudent(9500);
      return idStudent;
    } else {
      let maxIdCurrent = Math.max(...students.map((student) => student.idStudent));
      return maxIdCurrent + 1;
    }
  }

  function validateStudentInputs() {
    if (!valueName) {
      setErrName('Please enter name');
    }
    if (!valuePhone) {
      setErrPhone('Please enter phone');
    }
    if (!valueBirthday) {
      setErrBirthday('Please enter birthday');
    }
    return checkName() && checkNumberPhone() && isValidDateOfBirthday(valueBirthday.format('MM/DD/YYYY'));
  }

  function formatDate(dateM2) {
    let date = new Date(dateM2);
    let formatedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    return formatedDate;
  }

  function handleCreateStudent() {
    if (validateStudentInputs()) {
      let formatedDate = formatDate(valueBirthday);
      let newId = valueNewId();
      students.push({ idStudent: newId, name: valueName, birth: formatedDate, phone: valuePhone });
      setStudents(students);
      setDataFound(students);
      localStorage.setItem('students', JSON.stringify(students));
      closeModelStudentBox();
    } else {
      alert('Errs please enter valid');
    }
  }

  function handleClickDeleteIcon(id) {
    setDeleteModel('deletemodel show');
    setOverlay('overlay show');
    setIdStudent(id);
  }
  function handleDeleteStudent() {
    let newStudentList = students.filter((student) => student.idStudent !== idStudent);
    setStudents(newStudentList);
    setDataFound(newStudentList);
    localStorage.setItem('students', JSON.stringify(newStudentList));
    setDeleteModel('deletemodel hidden');
  }

  function handleChangeNameSearch(value) {
    let data = students.filter((student) =>
      student.name.toLowerCase().replaceAll(' ', '').includes(value.toLowerCase().replaceAll(' ', '')),
    );
    setDataFound(data);
  }

  function handleClickUpdateIcon(id) {
    let student = students.filter((student) => student.idStudent === id)[0];
    let birthDateParts = student.birth.split('-');
    let formattedBirthDate = `${birthDateParts[1]}/${birthDateParts[0]}/${birthDateParts[2]}`;
    let birthDateDayjs = dayjs(formattedBirthDate);
    setValueName(student.name);
    setValuePhone(student.phone);
    setValueBirthDay(birthDateDayjs);
    setIdStudent(id);
    setUpdateStudent('update show');
    setOverlay('overlay show');
  }

  function handleUpdateStudent() {
    let newStudetList = students.map((student) =>
      student.idStudent === idStudent
        ? { idStudent: student.idStudent, name: valueName, birth: formatDate(valueBirthday), phone: valuePhone }
        : student,
    );
    setStudents(newStudetList);
    setDataFound(newStudetList);
    localStorage.setItem('students', JSON.stringify(newStudetList));
  }

  return (
    <Stack sx={{ p: 10, boxSizing: 'border-box', width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Stack display="flex" direction="row" sx={{ width: '60%', gap: '5px' }}>
        <TextField
          id="outlined-basic"
          label="Please enter name student!!"
          variant="outlined"
          onChange={(e) => {
            handleChangeNameSearch(e.target.value);
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            handleClickCreateBtn();
          }}
        >
          Create
        </Button>
      </Stack>
      <Stack sx={{ mt: 2, width: '100%', height: '300px' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>id</StyledTableCell>
                <StyledTableCell>name</StyledTableCell>
                <StyledTableCell>birthday</StyledTableCell>
                <StyledTableCell>numberPhone</StyledTableCell>
                <StyledTableCell>active</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataFound.length > 0 &&
                dataFound.map((student) => (
                  <Student
                    key={student.idStudent}
                    id={student.idStudent}
                    name={student.name}
                    birth={student.birth}
                    phone={student.phone}
                    handleClickDeleteIcon={handleClickDeleteIcon}
                    handleClickUpdateIcon={handleClickUpdateIcon}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      {/* model create student */}
      <Stack
        className={newStudentBox}
        sx={{
          zIndex: 200,
          boxShadow: '1px 1px 7px 6px #2925254f',
          p: 2,
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          height: 'auto',
          width: '600px',
          backgroundColor: '#fff',
          borderRadius: '10px',
        }}
      >
        <Typography textAlign="center" fontSize="20px" fontWeight="bold">
          Create new student
        </Typography>
        <Stack>
          <FormControl sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>Name</Typography>
            <TextField
              value={valueName}
              className="name-student"
              label="Please enter name"
              onChange={(e) => {
                let valueName = e.target.value;
                setValueName(valueName);
                if (valueName.length <= 0) {
                  setErrName('Please enter name');
                } else {
                  setErrName('');
                }
              }}
            ></TextField>
            <FormHelperText sx={{ color: 'red' }}>{errName}</FormHelperText>
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>Number phone</Typography>
            <TextField
              value={valuePhone}
              className="phone-student"
              label="Please enter number phone"
              onChange={(e) => {
                let valuePhone = e.target.value;
                setValuePhone(valuePhone);
                if (valuePhone.length === 0) {
                  setErrPhone('Please enter a phone number');
                } else if (isNaN(valuePhone) || valuePhone.length < 10) {
                  setErrPhone('Please enter a valid phone number');
                } else {
                  setErrPhone('');
                }
              }}
            ></TextField>
            <FormHelperText sx={{ color: 'red' }}>{errPhone}</FormHelperText>
          </FormControl>
          <FormControl sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>Date of birth</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateField']}>
                <DateField
                  value={valueBirthday}
                  className="birthday-student"
                  label="Date of birth"
                  onChange={(date) => {
                    console.log(typeof date, 'dfsafsd');
                    setValueBirthDay(date);
                    let checkBirthday = isValidDateOfBirthday(date.format('MM/DD/YYYY'));
                    if (checkBirthday) {
                      setErrBirthday('');
                    } else {
                      setErrBirthday('Please enter a valid date of birth');
                    }
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <FormHelperText sx={{ color: 'red' }}>{errBirthday}</FormHelperText>
          </FormControl>
        </Stack>
        <Stack>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => {
              console.log('toi là chau');
              handleCreateStudent();
            }}
          >
            Create
          </Button>
        </Stack>
        <Button
          variant="contained"
          sx={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            bgcolor: 'red',
            '&:hover': {
              backgroundColor: 'red',
            },
          }}
          onClick={() => {
            closeModelStudentBox();
          }}
        >
          <CloseOutlinedIcon></CloseOutlinedIcon>
        </Button>
      </Stack>
      {/* model delete student */}
      <Stack
        className={deleteModel}
        sx={{
          zIndex: 200,
          position: 'absolute',
          height: 'auto',
          maxWidth: '300px',
          width: '100%',
          bgcolor: '#fff',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '10px',
          boxShadow: '0px 2px 17px 0px #9c9c9c',
          p: 2,
        }}
      >
        <Typography fontSize="20px" fontWeight="bold" textAlign="center" mb="10px">
          Delete student
        </Typography>
        <Typography>Do you sure want to delete this student?</Typography>
        <Stack sx={{ mt: 3, display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: 'red',
              '&:hover': {
                backgroundColor: 'red',
              },
            }}
            onClick={() => {
              handleDeleteStudent();
            }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setDeleteModel('deletemodel hidden');
              setOverlay('overlay hidden');
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
      {/* model update student */}
      <Stack
        className={updateStudent}
        sx={{
          zIndex: 200,
          boxShadow: '1px 1px 7px 6px #2925254f',
          p: 2,
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translate(-50%, 0)',
          height: 'auto',
          width: '600px',
          backgroundColor: '#fff',
          borderRadius: '10px',
        }}
      >
        <Typography textAlign="center" fontSize="20px" fontWeight="bold">
          Update student
        </Typography>
        <Stack>
          <FormControl sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>Name</Typography>
            <TextField
              value={valueName}
              className="name-student"
              label="Please enter name"
              onChange={(e) => {
                let valueName = e.target.value;
                setValueName(valueName);
                if (valueName.length <= 0) {
                  setErrName('Please enter name');
                } else {
                  setErrName('');
                }
              }}
            ></TextField>
            <FormHelperText sx={{ color: 'red' }}>{errName}</FormHelperText>
          </FormControl>

          <FormControl sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>Number phone</Typography>
            <TextField
              value={valuePhone}
              className="phone-student"
              label="Please enter number phone"
              onChange={(e) => {
                let valuePhone = e.target.value;
                setValuePhone(valuePhone);
                if (valuePhone.length === 0) {
                  setErrPhone('Please enter a phone number');
                } else if (isNaN(valuePhone) || valuePhone.length < 10) {
                  setErrPhone('Please enter a valid phone number');
                } else {
                  setErrPhone('');
                }
              }}
            ></TextField>
            <FormHelperText sx={{ color: 'red' }}>{errPhone}</FormHelperText>
          </FormControl>
          <FormControl sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>Date of birth</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateField']}>
                <DateField
                  value={valueBirthday}
                  className="birthday-student"
                  label="Date of birth"
                  onChange={(date) => {
                    setValueBirthDay(date);
                    let checkBirthday = isValidDateOfBirthday(date.format('MM/DD/YYYY'));
                    if (checkBirthday) {
                      setErrBirthday('');
                    } else {
                      setErrBirthday('Please enter a valid date of birth');
                    }
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <FormHelperText sx={{ color: 'red' }}>{errBirthday}</FormHelperText>
          </FormControl>
        </Stack>
        <Stack>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => {
              if (validateStudentInputs()) {
                handleUpdateStudent();
              } else {
                alert('Please enter valid inputs');
              }
            }}
          >
            Update
          </Button>
        </Stack>
        <Button
          variant="contained"
          sx={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            bgcolor: 'red',
            '&:hover': {
              backgroundColor: 'red',
            },
          }}
          onClick={() => {
            closeModelStudentBox();
            resetAllValue();
          }}
        >
          <CloseOutlinedIcon></CloseOutlinedIcon>
        </Button>
      </Stack>
      <Stack
        className={overlay}
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: '#0000004f',
          zIndex: 100,
        }}
      ></Stack>
    </Stack>
  );
}

StudentList.propTypes = {};

export default StudentList;
