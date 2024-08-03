import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${process.env.REACT_APP_API_SERVER}/login` ||
        `http://localhost:5000/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = response.json();
    if (data.message === "Login success!") {
      localStorage.setItem("userToken", "some_token");
      alert("Logged in successfully!");
    } else {
      alert(data.message);
    }
  };


  return (
    <form onSubmit={handleLogin} >
        <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
        />
        <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
        />

        <button type="submit">Login</button>

    </form>
  )
};

export default Login;