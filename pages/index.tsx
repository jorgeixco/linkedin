// pages/index.tsx
import React from "react";

export default function Home() {
  // Construimos la URL de autorización de LinkedIn usando las vars expuestas
  const authorizeUrl =
    "https://www.linkedin.com/oauth/v2/authorization" +
    `?response_type=code` +
    `&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(
      process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI!
    )}` +
    `&scope=r_liteprofile%20w_compliance%20w_member_social` +
    `&state=1234`; // en POC usamos un state fijo; en producción hazlo dinámico

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Prueba de OAuth LinkedIn (Local)</h1>
      <p>Haz clic en el botón para conectar tu cuenta de LinkedIn:</p>
      <a
        href={authorizeUrl}
        style={{
          display: "inline-block",
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#0077B5",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
        }}
      >
        Iniciar sesión con LinkedIn
      </a>
    </main>
  );
}
