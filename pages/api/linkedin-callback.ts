// pages/api/linkedin-callback.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, state } = req.query;

  // 1. Validamos que haya recibido el parámetro 'code'
  if (!code) {
    return res.status(400).json({ error: "Missing code en callback" });
  }

  try {
    // 2. Intercambiamos el code por access_token
    const tokenResp = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI!,
        client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResp.data.access_token;
    console.log("✅ Access token obtenido:", accessToken);

    // 3. Obtenemos el URN del miembro con /v2/me
    const meResp = await axios.get("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const memberUrn: string = meResp.data.id;
    console.log("✅ Member URN obtenido:", memberUrn);

    // 4. Creamos un cuerpo de certificado de prueba
    const certBody = {
      name: {
        localized: { es_ES: "Certificado POC" },
        preferredLocale: { country: "ES", language: "es" },
      },
      issuer: { name: "Mi Compañía de Prueba" },
      licenseNumber: `POC-${Date.now()}`,
      url: "https://mi-app-poc/verify/POC",
      certUrl: "https://mi-bucket-poc.s3.amazonaws.com/POC.pdf",
      issueDate: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      displayOnProfile: true,
    };

    // 5. Publicamos la certificación en LinkedIn
    const certEndpoint = `https://api.linkedin.com/v2/people/id=${encodeURIComponent(
      memberUrn
    )}/certifications`;

    const certResp = await axios.post(certEndpoint, certBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
    });

    console.log("✅ Certificación creada en LinkedIn:", certResp.data);

    // 6. Respondemos al cliente con un mensaje de éxito
    return res.status(200).json({
      message: "Certificación de prueba publicada exitosamente",
      certificationData: certResp.data,
    });
  } catch (err: any) {
    console.error(
      "❌ Error en OAuth o creación de certificado:",
      err.response?.data || err.message
    );
    return res
      .status(500)
      .json({ error: "Falló intercambio o creación de certificado" });
  }
}
