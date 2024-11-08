import { useState } from 'react';
import { Typography, Button } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

export default function Home() {
  const [testMessage, setTestMessage] = useState('');

  const testFirebase = async () => {
    try {
      const docRef = await addDoc(collection(db, "test"), {
        message: "Hello from Wheat-sol!"
      });
      setTestMessage(`Document written with ID: ${docRef.id}`);
    } catch (e) {
      setTestMessage(`Error adding document: ${e}`);
    }
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Wheat-sol
      </Typography>
      <Button variant="contained" color="primary" onClick={testFirebase}>
        Test Firebase Connection
      </Button>
      {testMessage && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          {testMessage}
        </Typography>
      )}
    </div>
  );
}
