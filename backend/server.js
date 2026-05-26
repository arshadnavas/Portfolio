/**
 * ARSHAD NAVAS PORTFOLIO - BACKEND SERVER
 * Built with Node.js and Express
 * Handles contact form submissions and email delivery
 */

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// ============================================
// EMAIL CONFIGURATION
// ============================================

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Test email connection
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email configuration error:', error.message);
    } else {
        console.log('✅ Email service ready!');
    }
});

// ============================================
// ROUTES
// ============================================

/**
 * GET / - Serve the main portfolio page
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

/**
 * GET /api/health - Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'Server is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

/**
 * POST /api/contact - Handle contact form submissions
 * Expected body:
 * {
 *   name: string,
 *   email: string,
 *   subject: string,
 *   message: string
 * }
 */
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // ============================================
        // VALIDATION
        // ============================================

        // Check if all required fields are present
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                error: 'All fields are required',
                received: { name, email, subject, message }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Invalid email address' 
            });
        }

        // Validate message length (prevent spam)
        if (message.length < 5 || message.length > 5000) {
            return res.status(400).json({ 
                error: 'Message must be between 5 and 5000 characters' 
            });
        }

        // Sanitize input (basic protection)
        const sanitizedName = name.trim().substring(0, 100);
        const sanitizedEmail = email.trim();
        const sanitizedSubject = subject.trim().substring(0, 200);
        const sanitizedMessage = message.trim();

        // ============================================
        // EMAIL TEMPLATE
        // ============================================

        const htmlTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; }
                    .header { background-color: #00d4ff; color: #0a0e27; padding: 20px; border-radius: 8px 8px 0 0; }
                    .content { background-color: #fff; padding: 20px; }
                    .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #666; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #00d4ff; }
                    .value { color: #333; word-wrap: break-word; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>📧 New Portfolio Contact Message</h2>
                    </div>
                    
                    <div class="content">
                        <div class="field">
                            <div class="label">From:</div>
                            <div class="value">${sanitizedName}</div>
                        </div>
                        
                        <div class="field">
                            <div class="label">Email:</div>
                            <div class="value">
                                <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a>
                            </div>
                        </div>
                        
                        <div class="field">
                            <div class="label">Subject:</div>
                            <div class="value">${sanitizedSubject}</div>
                        </div>
                        
                        <div class="field">
                            <div class="label">Message:</div>
                            <div class="value">${sanitizedMessage.replace(/\n/g, '<br>')}</div>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                        
                        <div style="font-size: 12px; color: #666;">
                            <p>Received at: ${new Date().toLocaleString()}</p>
                            <p>From: <strong>Arshad Navas Portfolio</strong></p>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>&copy; 2024 Arshad Navas Portfolio. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // ============================================
        // SEND EMAIL TO YOU (OWNER)
        // ============================================

        const ownerMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL,
            subject: `📧 New Message: ${sanitizedSubject}`,
            html: htmlTemplate,
            replyTo: sanitizedEmail
        };

        await transporter.sendMail(ownerMailOptions);

        // ============================================
        // SEND CONFIRMATION EMAIL TO USER
        // ============================================

        const confirmationTemplate = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; }
                    .header { background-color: #00d4ff; color: #0a0e27; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
                    .content { background-color: #fff; padding: 20px; }
                    .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>✅ Message Received!</h2>
                    </div>
                    
                    <div class="content">
                        <p>Hi <strong>${sanitizedName}</strong>,</p>
                        
                        <p>Thank you for reaching out! Your message has been received and will be reviewed shortly.</p>
                        
                        <p><strong>Your Message Details:</strong></p>
                        <p style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">
                            <strong>Subject:</strong> ${sanitizedSubject}<br>
                            <strong>Sent From:</strong> ${sanitizedEmail}
                        </p>
                        
                        <p>I'll get back to you as soon as possible. If you have any urgent matters, feel free to reach out directly.</p>
                        
                        <p>Best regards,<br><strong>Arshad Navas</strong></p>
                    </div>
                    
                    <div class="footer">
                        <p>&copy; 2024 Arshad Navas Portfolio. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: sanitizedEmail,
            subject: 'Message Received - Arshad Navas Portfolio',
            html: confirmationTemplate
        };

        await transporter.sendMail(userMailOptions);

        // ============================================
        // SUCCESS RESPONSE
        // ============================================

        console.log(`📬 Message from ${sanitizedName} (${sanitizedEmail})`);

        res.status(200).json({ 
            success: true,
            message: 'Your message has been sent successfully! Check your email for confirmation.',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        
        res.status(500).json({ 
            success: false,
            error: 'Failed to send message. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        message: 'The requested resource does not exist'
    });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
    console.error('🔥 Error:', err);
    
    res.status(err.status || 500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('\n');
    console.log('═══════════════════════════════════════════════════');
    console.log('🚀 ARSHAD NAVAS PORTFOLIO SERVER');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Server running at: http://localhost:${PORT}`);
    console.log(`📧 Email service: ${process.env.EMAIL_USER}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('═══════════════════════════════════════════════════\n');
    console.log('Press Ctrl+C to stop the server\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down server...');
    process.exit(0);
});

module.exports = app;