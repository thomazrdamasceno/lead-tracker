export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export async function hashUserData(userData?: Record<string, any>): Promise<Record<string, string>> {
  if (!userData) return {};

  const hashedData: Record<string, string> = {};
  
  if (userData.email) {
    hashedData.email = await hashData(normalizeEmail(userData.email));
  }
  
  if (userData.phone) {
    hashedData.phone = await hashData(normalizePhone(userData.phone));
  }

  return hashedData;
}