import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, state } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  try {
    const tokenResp = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    console.log('Access token response:', tokenResp.data);
    return res.status(200).json({ access_token: tokenResp.data.access_token });
  } catch (err: any) {
    console.error('Error exchanging code:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Token exchange failed' });
  }
} 