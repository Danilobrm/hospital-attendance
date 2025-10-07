// src/notifications/notification.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Appointment } from '../appointments/entities/appointment.entity';
import moment from 'moment';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  private async mockExternalProvider(payload: {
    [key: string]: any;
  }): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    // if (Math.random() < 0.1) {
    //   this.logger.error(
    //     `MOCK ERROR: Failed to send notification for appointment ${payload.appointmentId}`,
    //   );
    //   throw new HttpException(
    //     'External notification service failed',
    //     HttpStatus.SERVICE_UNAVAILABLE,
    //   );
    // }

    this.logger.log(
      `MOCK SENT: Notification successfully logged for: ${payload.toEmail}`,
    );
  }

  async sendAppointmentNotification(
    appointment: Appointment,
    type: 'CONFIRMATION' | 'CANCELLATION',
  ): Promise<void> {
    // Prepare Content
    const formattedDate = moment(appointment.scheduledAt).format(
      'YYYY-MM-DD HH:mm',
    );

    const subject = `${type} ALERT: Appointment ${appointment.status} with Dr. ${appointment.doctorName}`;
    const body = `Your appointment on ${formattedDate} has been ${appointment.status}. Notes: ${appointment.notes}`;

    const payload = {
      appointmentId: appointment.id,
      toEmail: appointment.patientEmail,
      subject: subject,
      body: body,
      type: type,
    };

    const logHeader =
      type === 'CONFIRMATION'
        ? '✨ APPT CONFIRMED NOTIF'
        : '🚨 APPT CANCELLED NOTIF';

    this.logger.log(`\n======================================================`);
    this.logger.log(`${logHeader}`);
    this.logger.log(`======================================================`);
    this.logger.verbose(`| Appt ID: ${appointment.id}`);
    this.logger.verbose(
      `| To Patient: ${appointment.patientName} (${appointment.patientEmail})`,
    );
    this.logger.verbose(`| Doctor: Dr. ${appointment.doctorName}`);
    this.logger.verbose(
      `| Scheduled: ${formattedDate} (Status: ${appointment.status})`,
    );
    this.logger.verbose(`| Subject: ${subject}`);
    this.logger.log(`| Triggering external provider...`);

    // 2. --- MOCK EXTERNAL CALL & ERROR HANDLING ---
    try {
      await this.mockExternalProvider(payload);
    } catch (error) {
      this.logger.error(
        `| ❌ FAILED to send notification for Appt ID ${appointment.id}. Reason: ${error.message}`,
      );
    }

    this.logger.log(`======================================================\n`);

    // Trigger Automated Reminder (Non-blocking) ---
    // this.triggerReminderWebhook(appointment, doctor.name).catch((err) => {
    //   // Log the error but do NOT throw it, as the appointment itself succeeded.
    //   console.error('Failed to trigger n8n reminder webhook:', err);
    // });
  }
}
