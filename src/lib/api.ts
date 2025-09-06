import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Platform {
  ok: boolean;
  platformPda: string;
  tx: string;
  error?: string;
}

export interface Institution {
  ok: boolean;
  institution: string;
  tx: string;
  error?: string;
}

export interface Certificate {
  ok: boolean;
  certificate: string;
  tx: string;
  error?: string;
}

export interface CertificateData {
  pda: string;
  student_wallet: string;
  institution: string;
  student_name: string;
  course_name: string;
  course_duration: number;
  skills_acquired: string[];
  grade: string;
  issued_at: number;
  certificate_hash?: string;
  is_revoked: boolean;
  index: number;
}

export interface VerifyCertificateResponse {
  ok: boolean;
  certificate: CertificateData;
  error?: string;
}

// Platform API
export const initializePlatform = async (): Promise<Platform> => {
  const response = await api.post('/platform/initialize');
  return response.data;
};

// Institution APIs
export const registerInstitution = async (data: {
  name: string;
  verification_hash: string;
}): Promise<Institution> => {
  const response = await api.post('/institution/register', data);
  return response.data;
};

export const verifyInstitution = async (data: {
  institution_pubkey: string;
}): Promise<{ ok: boolean; tx: string; error?: string }> => {
  const response = await api.post('/institution/verify', data);
  return response.data;
};

// Certificate APIs
export const issueCertificate = async (data: {
  institution_pubkey: string;
  student_pubkey: string;
  student_name: string;
  course_name: string;
  course_duration: number;
  skills_acquired: string[];
  grade: string;
  metadata_uri: string;
}): Promise<Certificate> => {
  const response = await api.post('/certificate/issue', data);
  return response.data;
};

export const verifyCertificate = async (data: {
  institution_pubkey: string;
  student_pubkey: string;
  index?: number;
}): Promise<VerifyCertificateResponse> => {
  const response = await api.post('/certificate/verify', data);
  return response.data;
};

export const revokeCertificate = async (data: {
  institution_pubkey: string;
  student_pubkey: string;
  index: number;
}): Promise<{ ok: boolean; tx: string; error?: string }> => {
  const response = await api.post('/certificate/revoke', data);
  return response.data;
};

export default api;