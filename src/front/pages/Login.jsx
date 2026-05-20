import { useState } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login intentado con:", email, password);
        // Aquí conectaremos con el backend luego
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="w-50 mx-auto mt-4">
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Entrar</button>
            </form>
            <div className="text-center mt-3">
                <Link to="/register">¿No tienes cuenta? Regístrate aquí</Link>
                <br />
                <Link to="/recover-password">¿Olvidaste tu contraseña?</Link>
            </div>
        </div>
    );
};