import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockApi } from "../utils/mockApi";

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Updated to use mockApi
            const data = await mockApi.loginUser({ email, password });
            onLogin(data.name, data.token);
            navigate("/"); // redirect to Dashboard
        } catch (error) {
            alert(error.message || "Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-6 bg-white shadow">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mb-4 border rounded" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-4 border rounded" />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
        </form>
    );
}
