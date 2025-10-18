// EmailJS Configuration
// To use this email functionality, you need to:
// 1. Sign up for EmailJS at https://www.emailjs.com/
// 2. Create a service (Gmail, Outlook, etc.)
// 3. Create an email template
// 4. Replace the values below with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  // Replace with your EmailJS service ID
  SERVICE_ID: 'service_yeqfuh5',
  
  // Replace with your EmailJS template ID
  TEMPLATE_ID: 'service_yeqfuh5',
  
  // Replace with your EmailJS public key
  PUBLIC_KEY: 'IP0msXRuHCmVLwhXd',
  
  // Email template variables that should be available in your EmailJS template:
  // - {{to_email}} - Recipient email address
  // - {{subject}} - Email subject
  // - {{invoice_number}} - Invoice number
  // - {{company_name}} - Company name
  // - {{client_name}} - Client name
  // - {{total_amount}} - Total amount
  // - {{due_date}} - Due date
  // - {{invoice_html}} - HTML content of the invoice
  // - {{from_name}} - Sender name
  // - {{reply_to}} - Reply-to email
  // - {{message}} - Custom message
};

// Instructions for EmailJS setup:
// 1. Go to https://www.emailjs.com/ and create an account
// 2. In the dashboard, go to "Email Services" and add your email service (Gmail, Outlook, etc.)
// 3. Go to "Email Templates" and create a new template with the variables listed above
// 4. Go to "Account" > "General" to find your Public Key
// 5. Replace the values in EMAILJS_CONFIG with your actual credentials
// 6. Update the emailService.ts file to use these config values

// QUICK SETUP FOR IMMEDIATE USE:
// If you want to test the email functionality immediately without EmailJS setup,
// the app will automatically fallback to opening your default email client
// with the invoice content pre-filled. This works right now!
