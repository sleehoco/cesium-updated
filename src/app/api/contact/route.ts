/**
 * Contact Form API
 * POST /api/contact
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

const resend = process.env['RESEND_API_KEY'] ? new Resend(process.env['RESEND_API_KEY']) : null;

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional().or(z.literal('')),
  service: z.string().optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export async function POST(req: NextRequest) {
  try {
    // Apply strict rate limiting for contact forms (prevent spam)
    const rateLimitResult = rateLimit(req, RATE_LIMITS.CONTACT_FORM);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many contact attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': Math.ceil((rateLimitResult.reset * 1000 - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Check if Resend is configured
    if (!resend) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email service is not configured. Please contact us directly at information@cesiumcyber.com',
        },
        { status: 503 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'CesiumCyber Contact Form <contact@cesiumcyber.com>',
      to: 'information@cesiumcyber.com',
      replyTo: validatedData.email,
      subject: `New Contact Form Submission from ${validatedData.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); color: #D4AF37; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #D4AF37; }
              .value { margin-top: 5px; }
              .footer { background: #0a0a0a; color: #888; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">🔒 New Contact Form Submission</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">From:</div>
                  <div class="value">${validatedData.name}</div>
                </div>

                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${validatedData.email}">${validatedData.email}</a></div>
                </div>

                ${
                  validatedData.company
                    ? `
                <div class="field">
                  <div class="label">Company:</div>
                  <div class="value">${validatedData.company}</div>
                </div>
                `
                    : ''
                }

                ${
                  validatedData.service
                    ? `
                <div class="field">
                  <div class="label">Service Interested In:</div>
                  <div class="value">${validatedData.service}</div>
                </div>
                `
                    : ''
                }

                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value" style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px; border: 1px solid #ddd;">
${validatedData.message}
                  </div>
                </div>
              </div>
              <div class="footer">
                <p style="margin: 0;">Sent from CesiumCyber Contact Form</p>
                <p style="margin: 5px 0 0 0;">3500 Cedar Ave, Columbia, MD 21044 | +1 (717) 543-4981</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend email error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Email service is temporarily unavailable. Please contact us directly at information@cesiumcyber.com or call +1 (717) 543-4981.',
          details: error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you within 24 hours.',
      emailId: data?.id,
    });
  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid form data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred. Please try again or email us directly at information@cesiumcyber.com',
      },
      { status: 500 }
    );
  }
}
