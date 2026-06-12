import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private client: any;

  constructor() {
    console.log('TWILIO SID =', process.env.TWILIO_ACCOUNT_SID);
    console.log('TWILIO FROM =', process.env.TWILIO_WHATSAPP_FROM);

    try {
      const twilio = require('twilio');

      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );
    } catch (e) {
      this.logger.warn(
        'Twilio not initialized — WhatsApp messages will be skipped.',
      );
    }
  }


  async sendToStudent(
    phone: string,
    name: string,
    course: string,
  ): Promise<void> {
    if (!this.client) return;

    const message =
      `Hi ${name}! 👋\n\n` +
      `Thank you for your interest in *${course}* at *CodeDisha*! 🎓\n\n` +
      `Our team will call you shortly to discuss course details.\n\n` +
      `— Team CodeDisha`;

    const to = this.formatPhone(phone);

    await this.send(to, message);
  }

  async notifySalesTeam(
    phone: string,
    name: string,
    email: string,
    course: string,
    requestType: string,
  ): Promise<void> {
    if (!this.client) return;

    const salesNumber = process.env.SALES_TEAM_WHATSAPP;
    if (!salesNumber) return;

    const message =
      `🔔 *New Lead Alert*\n\n` +
      `👤 Name: ${name}\n` +
      `📞 Phone: ${phone}\n` +
      `📧 Email: ${email || 'Not provided'}\n` +
      `📚 Course: ${course}\n` +
      `📋 Request: ${requestType}`;

    await this.send(salesNumber, message);
  }

  async notifyReferral(
    referrerName: string,
    referredName: string,
    referredPhone: string,
    course: string,
  ): Promise<void> {
    if (!this.client) return;

    const salesNumber = process.env.SALES_TEAM_WHATSAPP;
    if (!salesNumber) return;

    const message =
      `🤝 *New Referral*\n\n` +
      `📣 Referrer: ${referrerName}\n` +
      `👤 Referred: ${referredName}\n` +
      `📞 Phone: ${referredPhone}\n` +
      `📚 Course: ${course}`;

    await this.send(salesNumber, message);
  }

  private async send(to: string, body: string): Promise<void> {
    try {
      const response = await this.client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to,
        body,
      });

      this.logger.log(`WhatsApp SID: ${response.sid}`);
      this.logger.log(`WhatsApp STATUS: ${response.status}`);
      this.logger.log(`WhatsApp TO: ${response.to}`);

      console.log('FULL TWILIO RESPONSE:', response);

      if (
        response.status === 'failed' ||
        response.status === 'undelivered'
      ) {
        this.logger.error(`Message failed for ${to}`);
      }

    } catch (err: any) {
      this.logger.error(`WhatsApp send failed to ${to}: ${err.message}`);
    }
  }

  private formatPhone(phone: string): string {
    if (!phone) return '';

    phone = phone.replace(/\s|-/g, '');

    if (phone.startsWith('+')) {
      return `whatsapp:${phone}`;
    }

    return `whatsapp:+91${phone}`;
  }
}