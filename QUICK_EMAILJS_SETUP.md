# 🚀 Quick EmailJS Setup - 5 Minutes!

## **Step 1: Sign Up (1 minute)**
1. Go to **[EmailJS.com](https://www.emailjs.com/)**
2. Click **"Sign Up"**
3. Use your email and create password
4. **Verify your email**

## **Step 2: Add Gmail Service (2 minutes)**
1. In dashboard, click **"Email Services"**
2. Click **"Add New Service"**
3. Click **"Gmail"**
4. Sign in with your Gmail account
5. **Copy the Service ID** (looks like `service_abc123`)

## **Step 3: Create Template (1 minute)**
1. Click **"Email Templates"**
2. Click **"Create New Template"**
3. Paste this content:

```
Subject: {{subject}}

Dear {{client_name}},

{{message}}

Invoice: {{invoice_number}}
Amount: {{total_amount}}
Due: {{due_date}}

{{invoice_html}}

Best regards,
{{company_name}}
```

4. **Save** and **copy the Template ID** (looks like `template_xyz789`)

## **Step 4: Get Public Key (30 seconds)**
1. Click **"Account"** → **"General"**
2. **Copy your Public Key** (looks like `user_public_key_123`)

## **Step 5: Update Your App (30 seconds)**
1. Open `src/config/emailConfig.ts`
2. Replace the values:

```typescript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc123',        // Your service ID
  TEMPLATE_ID: 'template_xyz789',      // Your template ID  
  PUBLIC_KEY: 'user_public_key_123',   // Your public key
};
```

## **Step 6: Test! (30 seconds)**
1. Save the file
2. Create an invoice
3. Click "Send via Email"
4. Enter any email address
5. Click "Send Email"
6. **Email sent automatically!** 🎉

---

## **What You Need:**
- ✅ EmailJS account (free)
- ✅ Gmail account
- ✅ 5 minutes of time

## **What You Get:**
- ✅ Automatic email sending
- ✅ Professional email templates
- ✅ 200 emails/month free
- ✅ No more manual email sending!

## **Result:**
Instead of this popup:
> "Email client opened with invoice details. Please send the email manually."

You'll get:
> "Email sent successfully!" ✅

**Ready to set it up?** Follow the steps above and your emails will be sent automatically! 🚀
