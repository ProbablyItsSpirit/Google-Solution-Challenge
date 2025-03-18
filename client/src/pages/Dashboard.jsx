//just for example change ui and everything

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

const Dashboard = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "classrooms"));
        const classroomsData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include document ID for future use
          ...doc.data(),
        }));
        setClassrooms(classroomsData);
      } catch (err) {
        setError("Failed to fetch classrooms. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            // Add functionality to create a new classroom
            console.log("Create new classroom");
          }}
        >
          Create Classroom
        </Button>
      </div>

      {classrooms.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No classrooms found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{classroom.name}</h2>
              <p className="text-gray-600 mb-2">Teacher: {classroom.teacher}</p>
              <Button
                variant="outlined"
                onClick={() => {
                  // Add functionality to view classroom details
                  console.log("View classroom:", classroom.id);
                }}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;