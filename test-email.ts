import nodemailer from 'nodemailer';

const SMTP_CONFIG = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'preepcuet@gmail.com',
        pass: process.env.SMTP_PASS || 'hmkntldngpgdfdgo',
    },
};

const transporter = nodemailer.createTransport(SMTP_CONFIG);

async function testConnection() {
    console.log('Testing SMTP configuration...');
    console.log('User:', SMTP_CONFIG.auth.user);

    try {
        const success = await transporter.verify();
        console.log('Server is ready to take our messages:', success);

        const info = await transporter.sendMail({
            from: '"PrepCUET Test" <' + SMTP_CONFIG.auth.user + '>',
            to: SMTP_CONFIG.auth.user, // Send to self
            subject: "Test Email from PrepCUET",
            text: "If you receive this, the SMTP configuration is working perfectly.",
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error('SMTP Connection Error:');
        console.error(error);
    }
}

testConnection();
