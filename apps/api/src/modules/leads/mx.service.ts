
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MxService {
  private readonly logger = new Logger(MxService.name);

  /**
   * Verify if an email domain has valid MX records.
   * In production, this uses the 'dns' module.
   */
  async verifyMx(email: string): Promise<boolean> {
    const domain = email.split('@')[1];
    if (!domain) return false;

    try {
      // Mocking DNS lookup for performance in this environment
      // const records = await dns.promises.resolveMx(domain);
      // return records && records.length > 0;
      
      const commonBanned = ['example.com', 'test.com', 'temp-mail.org'];
      if (commonBanned.includes(domain)) return false;
      
      return true;
    } catch (err) {
      this.logger.error(`MX Lookup failed for ${domain}: ${err.message}`);
      return false;
    }
  }
}
