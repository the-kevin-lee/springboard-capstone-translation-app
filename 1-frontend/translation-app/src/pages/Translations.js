import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Translations = () => {
    const [translations, setTranslations] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTranslations = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/user/translations', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setTranslations(data);
                } else {
                    setError("Failed to fetch translations");
                }
            } catch (error) {
                setError("An error occurred while fetching translations.");
            }
        };
        fetchTranslations();
    }, [navigate]);

    return (
        <div>
            <h1>Your Translations</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {translations.map((translation) => (
                    <li key={translation.id}>
                        <p><strong>Input:</strong> {translation.input_text}</p>
                        <p><strong>Translated:</strong> {translation.translated_text}</p>
                        <p><strong>From:</strong> {translation.input_language}</p>
                        <p><strong>To:</strong> {translation.target_language}</p>
                        <p><strong>Date:</strong> {new Date(translation.timestamp).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Translations;