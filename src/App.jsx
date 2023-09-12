import StudentList from './components/StudentList/index.jsx';
import { Stack } from '@mui/material';

function App() {
  return (
    <Stack sx={{ position: 'relative' }}>
      <StudentList />
    </Stack>
  );
}

export default App;
