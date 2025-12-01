/**
 * VirusTotal API Integration
 * Provides real-time threat intelligence for IOCs
 */

export interface VirusTotalIPReport {
  data: {
    attributes: {
      last_analysis_stats: {
        malicious: number;
        suspicious: number;
        harmless: number;
        undetected: number;
      };
      reputation: number;
      country: string;
      as_owner: string;
      network: string;
    };
  };
}

export interface VirusTotalDomainReport {
  data: {
    attributes: {
      last_analysis_stats: {
        malicious: number;
        suspicious: number;
        harmless: number;
        undetected: number;
      };
      reputation: number;
      categories: Record<string, string>;
    };
  };
}

export interface VirusTotalFileReport {
  data: {
    attributes: {
      last_analysis_stats: {
        malicious: number;
        suspicious: number;
        harmless: number;
        undetected: number;
      };
      meaningful_name?: string;
      type_description?: string;
      magic?: string;
      sha256: string;
      md5: string;
      sha1: string;
    };
  };
}

/**
 * Check if VirusTotal API key is configured
 */
export function hasVirusTotalKey(): boolean {
  return Boolean(process.env['VIRUSTOTAL_API_KEY']);
}

/**
 * Analyze an IP address using VirusTotal
 */
export async function analyzeIP(ip: string): Promise<VirusTotalIPReport | null> {
  if (!hasVirusTotalKey()) {
    return null;
  }

  try {
    const response = await fetch(`https://www.virustotal.com/api/v3/ip_addresses/${ip}`, {
      headers: {
        'x-apikey': process.env['VIRUSTOTAL_API_KEY']!,
      },
    });

    if (!response.ok) {
      console.error('VirusTotal IP lookup failed:', response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('VirusTotal IP analysis error:', error);
    return null;
  }
}

/**
 * Analyze a domain using VirusTotal
 */
export async function analyzeDomain(domain: string): Promise<VirusTotalDomainReport | null> {
  if (!hasVirusTotalKey()) {
    return null;
  }

  try {
    const response = await fetch(`https://www.virustotal.com/api/v3/domains/${domain}`, {
      headers: {
        'x-apikey': process.env['VIRUSTOTAL_API_KEY']!,
      },
    });

    if (!response.ok) {
      console.error('VirusTotal domain lookup failed:', response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('VirusTotal domain analysis error:', error);
    return null;
  }
}

/**
 * Analyze a file hash using VirusTotal
 */
export async function analyzeFileHash(hash: string): Promise<VirusTotalFileReport | null> {
  if (!hasVirusTotalKey()) {
    return null;
  }

  try {
    const response = await fetch(`https://www.virustotal.com/api/v3/files/${hash}`, {
      headers: {
        'x-apikey': process.env['VIRUSTOTAL_API_KEY']!,
      },
    });

    if (!response.ok) {
      console.error('VirusTotal file lookup failed:', response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('VirusTotal file analysis error:', error);
    return null;
  }
}

/**
 * Detect IOC type and analyze with VirusTotal
 */
export async function analyzeIOC(ioc: string): Promise<{
  type: 'ip' | 'domain' | 'hash' | 'unknown';
  vtData: VirusTotalIPReport | VirusTotalDomainReport | VirusTotalFileReport | null;
}> {
  const trimmed = ioc.trim();

  // Check if it's an IP address
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipRegex.test(trimmed)) {
    const vtData = await analyzeIP(trimmed);
    return { type: 'ip', vtData };
  }

  // Check if it's a hash (MD5, SHA1, SHA256)
  const md5Regex = /^[a-fA-F0-9]{32}$/;
  const sha1Regex = /^[a-fA-F0-9]{40}$/;
  const sha256Regex = /^[a-fA-F0-9]{64}$/;

  if (md5Regex.test(trimmed) || sha1Regex.test(trimmed) || sha256Regex.test(trimmed)) {
    const vtData = await analyzeFileHash(trimmed);
    return { type: 'hash', vtData };
  }

  // Check if it's a domain (simple check)
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (domainRegex.test(trimmed)) {
    const vtData = await analyzeDomain(trimmed);
    return { type: 'domain', vtData };
  }

  return { type: 'unknown', vtData: null };
}

/**
 * Generate a summary of VirusTotal results
 */
export function summarizeVTResults(
  type: string,
  vtData: VirusTotalIPReport | VirusTotalDomainReport | VirusTotalFileReport | null
): string {
  if (!vtData) {
    return '';
  }

  const stats = vtData.data.attributes.last_analysis_stats;
  const total = stats.malicious + stats.suspicious + stats.harmless + stats.undetected;
  const maliciousCount = stats.malicious;
  const suspiciousCount = stats.suspicious;

  let summary = `\n\n## VirusTotal Analysis\n\n`;
  summary += `**Detection Rate**: ${maliciousCount}/${total} security vendors flagged this as malicious\n\n`;

  if (maliciousCount > 0) {
    summary += `⚠️ **WARNING**: ${maliciousCount} vendors detected this IOC as **MALICIOUS**\n`;
  } else if (suspiciousCount > 0) {
    summary += `⚡ **SUSPICIOUS**: ${suspiciousCount} vendors flagged this as suspicious\n`;
  } else {
    summary += `✅ **CLEAN**: No security vendors flagged this IOC as malicious\n`;
  }

  summary += `\n**Breakdown**:\n`;
  summary += `- Malicious: ${stats.malicious}\n`;
  summary += `- Suspicious: ${stats.suspicious}\n`;
  summary += `- Harmless: ${stats.harmless}\n`;
  summary += `- Undetected: ${stats.undetected}\n`;

  // Add type-specific information
  if (type === 'ip' && 'country' in vtData.data.attributes) {
    const ipData = vtData as VirusTotalIPReport;
    summary += `\n**Geolocation**: ${ipData.data.attributes.country}\n`;
    if (ipData.data.attributes.as_owner) {
      summary += `**AS Owner**: ${ipData.data.attributes.as_owner}\n`;
    }
    if (ipData.data.attributes.network) {
      summary += `**Network**: ${ipData.data.attributes.network}\n`;
    }
  }

  if (type === 'hash' && 'sha256' in vtData.data.attributes) {
    const fileData = vtData as VirusTotalFileReport;
    if (fileData.data.attributes.meaningful_name) {
      summary += `\n**File Name**: ${fileData.data.attributes.meaningful_name}\n`;
    }
    if (fileData.data.attributes.type_description) {
      summary += `**File Type**: ${fileData.data.attributes.type_description}\n`;
    }
  }

  return summary;
}
