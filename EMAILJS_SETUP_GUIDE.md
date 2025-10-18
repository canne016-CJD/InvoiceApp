# 📧 EmailJS Setup Guide - Automatic Email Sending

This guide will help you set up EmailJS to automatically send invoices via email without opening your email client.

## 🚀 Quick Setup (10 Minutes)

### Step 1: Create EmailJS Account

1. **Go to [EmailJS.com](https://www.emailjs.com/)**
2. **Click "Sign Up"** and create a free account
3. **Verify your email address**

### Step 2: Add Email Service

1. **In EmailJS Dashboard**, go to **"Email Services"**
2. **Click "Add New Service"**
3. **Choose your email provider:**
   - **Gmail** (recommended for personal use)
   - **Outlook/Hotmail**
   - **Yahoo Mail**
   - **Custom SMTP**

4. **For Gmail:**
   - Click "Gmail"
   - Sign in with your Gmail account
   - Allow permissions
   - **Copy your Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template

1. **Go to "Email Templates"**
2. **Click "Create New Template"**
3. **Use this template content:**

```html
Subject: {{subject}}

Dear {{client_name}},

{{message}}

Invoice Details:
- Invoice Number: {{invoice_number}}
- Due Date: {{due_date}}
- Total Amount: {{total_amount}}

{{invoice_html}}

If you have any questions about this invoice, please don't hesitate to contact us.

Best regards,
{{company_name}}
```

4. **Save the template** and **copy your Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key

1. **Go to "Account" → "General"**
2. **Find "Public Key"** and copy it (e.g., `user_public_key_123`)

### Step 5: Update Your App Configuration

1. **Open `src/config/emailConfig.ts`**
2. **Replace the placeholder values:**

```typescript
export const EMAILJS_CONFIG = {
  // Replace with your actual EmailJS service ID
  SERVICE_ID: 'service_abc123', // Your actual service ID
  
  // Replace with your actual EmailJS template ID
  TEMPLATE_ID: 'template_xyz789', // Your actual template ID
  
  // Replace with your actual EmailJS public key
  PUBLIC_KEY: 'user_public_key_123', // Your actual public key
};
```

### Step 6: Test the Email Functionality

1. **Save the configuration file**
2. **Restart your development server:**
   ```bash
   npm run dev
   ```
3. **Create an invoice**
4. **Click "Send via Email"**
5. **Enter a test email address**
6. **Click "Send Email"**

## ✅ Expected Result

After setup, when you click "Send Email":
- ✅ **No popup** asking to open email client
- ✅ **Email sent automatically** to the recipient
- ✅ **Success message** appears in the app
- ✅ **Recipient receives the email** with invoice details

## 🔧 Troubleshooting

### Common Issues:

1. **"Service not found" error:**
   - Check your Service ID is correct
   - Ensure the service is properly configured

2. **"Template not found" error:**
   - Check your Template ID is correct
   - Ensure the template is saved and published

3. **"User not found" error:**
   - Check your Public Key is correct
   - Ensure your EmailJS account is verified

4. **Emails not received:**
   - Check spam/junk folders
   - Verify recipient email address
   - Check your email service provider's sending limits

### EmailJS Limits:

- **Free Plan**: 200 emails/month
- **Paid Plans**: Higher limits available
- Check your usage in EmailJS dashboard

## 📱 Mobile Testing

The email functionality works on both desktop and mobile:
- ✅ **Desktop**: Full email preview and sending
- ✅ **Mobile**: Responsive email interface
- ✅ **All devices**: Professional email formatting

## 🎯 Next Steps

Once EmailJS is set up:

1. **Test with different email addresses**
2. **Customize the email template** if needed
3. **Monitor your email usage** in EmailJS dashboard
4. **Consider upgrading** if you need more emails/month

## 🆘 Need Help?

If you encounter any issues:

1. **Check EmailJS documentation**: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
2. **Verify your configuration** in EmailJS dashboard
3. **Test with a simple email** first
4. **Check browser console** for error messages

## 🎉 Success!

Once configured, your Invoice Generator App will automatically send professional emails with invoice details to your clients without any manual intervention!

---

**Setup Time**: ~10 minutes  
**Cost**: Free (200 emails/month)  
**Difficulty**: Easy  
**Result**: Automatic email sending! 🚀
