# Email Functionality Setup Guide

This Invoice Generator App now includes email functionality that allows you to send invoices directly to clients via email. The email feature includes:

- **Email Preview**: Preview the email before sending
- **Customizable Message**: Add your own message to the email
- **Invoice Attachment**: The invoice is included as HTML content
- **Professional Templates**: Clean, professional email formatting

## Setup Instructions

### 1. EmailJS Account Setup

1. Go to [EmailJS](https://www.emailjs.com/) and create a free account
2. Verify your email address

### 2. Email Service Configuration

1. In the EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider (Gmail, Outlook, Yahoo, etc.)
4. Follow the setup instructions for your chosen provider
5. Note down your **Service ID**

### 3. Email Template Setup

1. Go to **"Email Templates"** in the EmailJS dashboard
2. Click **"Create New Template"**
3. Use this template content:

```html
Subject: {{subject}}

Dear {{client_name}},

{{message}}

Please find your invoice details below:

Invoice Number: {{invoice_number}}
Due Date: {{due_date}}
Total Amount: {{total_amount}}

{{invoice_html}}

If you have any questions about this invoice, please don't hesitate to contact us.

Best regards,
{{from_name}}
```

4. Save the template and note down your **Template ID**

### 4. Get Your Public Key

1. Go to **"Account"** > **"General"** in the EmailJS dashboard
2. Find your **Public Key** (also called User ID)

### 5. Update Configuration

1. Open `src/config/emailConfig.ts`
2. Replace the placeholder values with your actual EmailJS credentials:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_actual_service_id',
  TEMPLATE_ID: 'your_actual_template_id', 
  PUBLIC_KEY: 'your_actual_public_key',
};
```

### 6. Test the Email Functionality

1. Start your development server: `npm run dev`
2. Create an invoice
3. Click the **"Send via Email"** button in the preview
4. Fill in the recipient email and customize the message
5. Click **"Preview Email"** to see how it will look
6. Click **"Send Email"** to send the invoice

## Features

### Email Preview Dialog
- **Recipient Email**: Pre-filled with client email if available
- **Subject Line**: Pre-filled with invoice number
- **Custom Message**: Professional default message that you can customize
- **Invoice Summary**: Quick overview of invoice details
- **Preview Mode**: See exactly how the email will look before sending

### Email Content
- Professional HTML formatting
- Invoice details included in the email body
- Clean, readable layout
- Responsive design for mobile devices

### Error Handling
- Validation for required fields
- User-friendly error messages
- Loading states during email sending

## Troubleshooting

### Common Issues

1. **"Email service initialization failed"**
   - Check that your Public Key is correct
   - Ensure you're connected to the internet

2. **"Failed to send email"**
   - Verify your Service ID and Template ID are correct
   - Check that your email service is properly configured in EmailJS
   - Ensure your email template has all required variables

3. **Emails not received**
   - Check spam/junk folders
   - Verify the recipient email address is correct
   - Check your email service provider's sending limits

### EmailJS Limits

- **Free Plan**: 200 emails/month
- **Paid Plans**: Higher limits available
- Check your usage in the EmailJS dashboard

## Security Notes

- EmailJS credentials are safe to use in client-side applications
- The Public Key is designed to be public
- Never share your Service ID or Template ID publicly
- Consider using environment variables for production deployments

## Production Deployment

For production use, consider:

1. Moving credentials to environment variables
2. Adding rate limiting
3. Implementing proper error logging
4. Adding email delivery tracking
5. Setting up email templates for different invoice types

## Support

If you encounter issues:

1. Check the EmailJS documentation: https://www.emailjs.com/docs/
2. Verify your configuration in the EmailJS dashboard
3. Test with a simple email first
4. Check browser console for error messages

