import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";


const EditUserInfo = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const API_SERVER = process.env.REACT_APP_API_SERVER || 'http://localhost:5000'

    // fetching current user data
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`${API_SERVER}/get-user-info`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`, 
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username);
                    setEmail(data.email);
                } else {
                    setError("Failed to fetch user data");

                }
            } catch (error) {
                console.error("Error fetching original user data:", error)
                setError("An error occured fetching original user data");
            }
        };
        fetchUserData();
    }, [navigate, API_SERVER])



    // form submission

    const handleChange = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/edit-info`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({username: username || undefined, 
                    email: email || undefined, 
                    password: password || undefined})
            });

            if (response.ok) {
                setSuccess("Your information has been updated!");
            } else {
                setError("Failed in updating your information.");
            } 
        } catch (error) {
            console.error("Error updating your info:", error);
            setError("An error occured while updating your user information.");
        }

    };

    return (
        <form onSubmit={handleChange}>
          <h2>Edit Your Info</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (leave blank to keep current password)"
          />
          <button type="submit">Save Changes</button>
        </form> );
};




export default EditUserInfo;