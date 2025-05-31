export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    
    const allowedDomains = ['wallhaven.cc', 'w.wallhaven.cc', 'th.wallhaven.cc'];
    
    if (!allowedDomains.includes(parsed.hostname)) {
      throw new Error('Domínio não permitido');
    }
    
    return parsed.toString();
  } catch {
    throw new Error('URL inválida');
  }
}