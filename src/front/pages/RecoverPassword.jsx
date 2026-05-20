import { useState } from "react";
import { Link } from "react-router-dom";

export const RecoverPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Recuperación solicitada para:", email);
        // Aquí conectaremos con el backend luego
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Recuperar Contraseña</h2>
            <p className="text-center">Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>
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
                <button type="submit" className="btn btn-warning w-100">Enviar correo de recuperación</button>
            </form>
            <div className="text-center mt-3">
                <Link to="/login">Volver al inicio de sesión</Link>
            </div>
        </div>
    );
};