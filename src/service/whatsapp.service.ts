import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private client: any;

 constructor() {

   console.log('SID =', process.env.TWILIO_ACCOUNT_SID);
   console.log('FROM =', process.env.TWILIO_WHATSAPP_FROM);

   try {
     const twilio = require('twilio');
     this.client = twilio(
       process.env.TWILIO_ACCOUNT_SID,
       process.env.TWILIO_AUTH_TOKEN,
     );
   } catch (e) {
     this.logger.warn('Twilio not initialized — WhatsApp messages will be skipped.');
   }
 }

  async sendToStudent(phone: string, name: string, course: string): Promise<void> {
    if (!this.client) return;
    const message =
      `Hi ${name}! 👋\n\n` +
      `Thank you for your interest in *${course}* at *CodeDisha*! 🎓\n\n` +
      `Our team will call you shortly to discuss the course details, batch timings, and fees.\n\n` +
      `In the meantime, feel free to reach out to us anytime.\n\n` +
      `— Team CodeDisha`;
    await this.send(`whatsapp:+91${phone}`, message);
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
      `🔔 *New Lead Alert — CodeDisha Chatbot*\n\n` +
      `👤 Name: ${name}\n` +
      `📞 Phone: ${phone}\n` +
      `📧 Email: ${email || 'Not provided'}\n` +
      `📚 Interested in: ${course}\n` +
      `📋 Request type: ${requestType}\n\n` +
      `Please follow up within 30 minutes for best conversion! ⚡`;
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
      `🤝 *New Referral — CodeDisha Chatbot*\n\n` +
      `📣 Referrer: ${referrerName}\n` +
      `👤 Referred: ${referredName}\n` +
      `📞 Phone: ${referredPhone}\n` +
      `📚 Course: ${course}\n\n` +
      `Both get ₹500 off on enrollment. Call ${referredName} now! 💰`;
    await this.send(salesNumber, message);
  }

  private async send(to: string, body: string): Promise<void> {
    try {
      await this.client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to,
        body,
      });
      this.logger.log(`WhatsApp sent to ${to}`);
    } catch (err: any) {
      // Never throw — WhatsApp failure must NOT break the chat flow
      this.logger.error(`WhatsApp send failed to ${to}: ${err.message}`);
    }
  }
}