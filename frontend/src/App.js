import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
  fetch("http://localhost:5000/")
    .then(res => res.json())
    .then(data => setMessage(data.message))
    .catch(err => console.error(err));
}, []);

  return (
    <div>
      <h1>CampusZen</h1>
      <h2>{message}</h2>
    </div>
  );
}

export default App;
