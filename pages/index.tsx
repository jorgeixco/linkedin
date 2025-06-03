// pages/index.tsx
import React from "react";

export default function Home() {
  const authorizeUrl =
    "https://www.linkedin.com/oauth/v2/authorization" +
    `?response_type=code` +
    `&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(
      process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI!
    )}` +
    `&scope=r_liteprofile%20r_emailaddress` +
    `&state=1234`;

  console.log("authorizeUrl:", authorizeUrl);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Prueba OAuth Local (LinkedIn)</h1>
      <a
        href={authorizeUrl}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#0077B5",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "4px",
        }}
      >
        Iniciar sesión con LinkedIn
      </a>
    </main>
  );
}
