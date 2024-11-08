import { Typography, Button } from '@mui/material';

export default function Home() {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Wheat-sol
      </Typography>
      <Button variant="contained" color="primary">
        Start Mining
      </Button>
    </div>
  );
}
