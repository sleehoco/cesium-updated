import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { db } from '@/db';
import { emailCaptures } from '@/db/schema';

/**
 * Email Capture API
 * Stores lead information for marketing follow-up
 */

const resend = process.env['RESEND_API_KEY'] ? new Resend(process.env['RESEND_API_KEY']) : null;

const emailCaptureSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().max(100).optional(),
  toolId: z.string().max(50),
  source: z.enum(['tool-gate', 'newsletter', 'assessment', 'footer']).default('tool-gate'),
});

export async function POST(req: NextRequest) {
  // Rate limiting (3 signups per 5 minutes to prevent spam)
  const rateLimitResult = rateLimit(req, RATE_LIMITS.CONTACT_FORM);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { email, name, toolId, source } = emailCaptureSchema.parse(body);

    // Capture metadata
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Store in database
    let isNewCapture = true;
    try {
      await db.insert(emailCaptures).values({
        email,
        name: name || null,
        toolId,
        source,
        ipAddress,
        userAgent,
      });

      console.log('✅ Email capture saved to database:', email);
    } catch (dbError) {
      // Handle duplicate email (unique constraint violation)
      if (dbError && typeof dbError === 'object' && 'code' in dbError && dbError.code === '23505') {
        console.log('ℹ️ Email already exists:', email);
        isNewCapture = false;
        // Still send success response - don't expose that email exists
      } else {
        console.error('❌ Database error:', dbError);
        throw dbError;
      }
    }

    // Send welcome email for new captures
    if (isNewCapture && resend) {
      try {
        await resend.emails.send({
          from: 'Cesium Cyber Security <security@cesiumcyber.com>',
          to: email,
          subject: 'Welcome to Cesium Cyber - 10 Free Analyses Unlocked!',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #0a0a0a; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 40px auto; background: #1a1a1a; }
                  .header { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); color: #D4AF37; padding: 40px 20px; text-align: center; }
                  .logo { font-size: 32px; font-weight: bold; margin: 0; }
                  .content { padding: 30px; background: #1a1a1a; color: #e0e0e0; }
                  .benefit { background: #0a0a0a; border-left: 4px solid #D4AF37; padding: 15px; margin: 15px 0; }
                  .benefit-title { color: #D4AF37; font-weight: bold; margin-bottom: 5px; }
                  .cta-button { display: inline-block; background: #D4AF37; color: #0a0a0a; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 20px 0; }
                  .footer { background: #0a0a0a; color: #888; padding: 20px; text-align: center; font-size: 12px; }
                  .tools-list { list-style: none; padding: 0; }
                  .tools-list li { padding: 8px 0; border-bottom: 1px solid #333; }
                  .tools-list li:last-child { border-bottom: none; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 class="logo">🔒 CESIUM CYBER</h1>
                    <p style="margin: 10px 0 0 0; font-size: 18px;">Welcome to Next-Gen Security Tools</p>
                  </div>

                  <div class="content">
                    <h2 style="color: #D4AF37;">Welcome${name ? `, ${name}` : ''}! 🎉</h2>

                    <p>Thank you for signing up! You now have <strong style="color: #D4AF37;">10 free analyses per day</strong> across all our AI-powered security tools.</p>

                    <div class="benefit">
                      <div class="benefit-title">✅ What You Get:</div>
                      <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                        <li>10 free tool analyses per day</li>
                        <li>Save your analysis history</li>
                        <li>Export results to PDF</li>
                        <li>Weekly security insights newsletter</li>
                      </ul>
                    </div>

                    <h3 style="color: #D4AF37;">🛡️ Available Tools:</h3>
                    <ul class="tools-list">
                      <li><strong>Threat Intelligence Analyzer</strong> - Analyze IPs, domains, URLs & hashes</li>
                      <li><strong>AI Phishing Detector</strong> - Identify phishing emails & malicious links</li>
                      <li><strong>Security Log Analyzer</strong> - Parse and analyze security logs with AI</li>
                      <li><strong>Vulnerability Scanner</strong> - Scan for CVEs and security weaknesses</li>
                      <li><strong>Incident Response Assistant</strong> - Get AI-powered IR playbooks</li>
                      <li><strong>AI Writing Assistant</strong> - Generate security documentation</li>
                    </ul>

                    <div style="text-align: center;">
                      <a href="https://cesiumcyber.com/tools" class="cta-button">Start Using Tools →</a>
                    </div>

                    <p style="margin-top: 30px; font-size: 14px; color: #888;">
                      Need more analyses? Upgrade to Pro for unlimited access, priority support, and advanced features.
                    </p>
                  </div>

                  <div class="footer">
                    <p style="margin: 0;">Cesium Cyber - AI-Powered Cybersecurity</p>
                    <p style="margin: 10px 0;">3500 Cedar Ave, Columbia, MD 21044 | +1 (717) 543-4981</p>
                    <p style="margin: 10px 0;">
                      <a href="https://cesiumcyber.com" style="color: #D4AF37; text-decoration: none;">Website</a> |
                      <a href="https://cesiumcyber.com/tools" style="color: #D4AF37; text-decoration: none;">Tools</a> |
                      <a href="https://cesiumcyber.com/contact" style="color: #D4AF37; text-decoration: none;">Contact</a>
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });
        console.log('📧 Welcome email sent to:', email);
      } catch (emailError) {
        // Don't fail the request if email fails
        console.error('⚠️ Failed to send welcome email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for signing up! Check your email for next steps.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Email capture error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process signup. Please try again.',
      },
      { status: 500 }
    );
  }
}

// CORS not needed since same-origin
