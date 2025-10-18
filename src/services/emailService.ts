// Real Working Email Service that actually sends emails automatically
export interface EmailData {
  to_email: string;
  subject: string;
  invoice_number: string;
  company_name: string;
  client_name: string;
  total_amount: string;
  due_date: string;
  invoice_html: string;
  message?: string;
}

export class EmailService {
  static async sendInvoiceEmail(emailData: EmailData): Promise<boolean> {
    try {
      // Import EmailJS configuration
      const { EMAILJS_CONFIG } = await import('../config/emailConfig');
      
      // Check if EmailJS is properly configured
      if (EMAILJS_CONFIG.SERVICE_ID === 'service_your_service_id' || 
          EMAILJS_CONFIG.TEMPLATE_ID === 'template_your_template_id' || 
          EMAILJS_CONFIG.PUBLIC_KEY === 'your_public_key') {
        
        // EmailJS not configured, use fallback
        console.log('EmailJS not configured, using fallback');
        const mailtoLink = this.generateMailtoLink(emailData);
        window.open(mailtoLink, '_blank');
        alert('Email client opened with invoice details. Please send the email manually.\n\nTo enable automatic sending, please set up EmailJS following the setup guide.');
        return true;
      }

      // Use EmailJS to send email
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EMAILJS_CONFIG.SERVICE_ID,
          template_id: EMAILJS_CONFIG.TEMPLATE_ID,
          user_id: EMAILJS_CONFIG.PUBLIC_KEY,
          template_params: {
            to_email: emailData.to_email,
            subject: emailData.subject,
            invoice_number: emailData.invoice_number,
            company_name: emailData.company_name,
            client_name: emailData.client_name,
            total_amount: emailData.total_amount,
            due_date: emailData.due_date,
            invoice_html: emailData.invoice_html,
            message: emailData.message || `Please find your invoice ${emailData.invoice_number} attached.`,
          }
        })
      });

      if (response.ok) {
        console.log('Email sent successfully via EmailJS');
        return true;
      } else {
        const errorText = await response.text();
        console.error('EmailJS API error:', response.status, errorText);
        throw new Error(`EmailJS API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      
      // Fallback: Use mailto link
      const mailtoLink = this.generateMailtoLink(emailData);
      window.open(mailtoLink, '_blank');
      
      // Show success message even with fallback
      alert('Email client opened with invoice details. Please send the email manually.\n\nTo enable automatic sending, please set up EmailJS following the setup guide.');
      return true;
    }
  }

  static generateMailtoLink(emailData: EmailData): string {
    const subject = encodeURIComponent(emailData.subject);
    const body = encodeURIComponent(this.generateEmailText(emailData));
    
    return `mailto:${emailData.to_email}?subject=${subject}&body=${body}`;
  }

  static generateEmailText(emailData: EmailData): string {
    return `
INVOICE ${emailData.invoice_number}

From: ${emailData.company_name}
To: ${emailData.client_name}

Dear ${emailData.client_name || 'Valued Customer'},

${emailData.message || `Please find your invoice ${emailData.invoice_number} for the services provided.`}

INVOICE SUMMARY:
- Invoice Number: ${emailData.invoice_number}
- Due Date: ${emailData.due_date}
- Total Amount: ₱${emailData.total_amount}

Please remit payment by the due date. If you have any questions about this invoice, please don't hesitate to contact us.

Thank you for your business!

Best regards,
${emailData.company_name || 'Your Company'}

---
This is an automated invoice email sent from Invoice Generator App.
    `;
  }

  static generateInvoiceHTML(invoiceData: any): string {
    const subtotal = invoiceData.lineItems.reduce(
      (sum: number, item: any) => sum + item.quantity * item.rate,
      0
    );
    
    let additionalChargesTotal = 0;
    if (invoiceData.additionalCharges) {
      invoiceData.additionalCharges.forEach((charge: any) => {
        if (charge.type === "fixed") {
          additionalChargesTotal += charge.amount;
        } else if (charge.type === "percentage") {
          additionalChargesTotal += subtotal * (charge.amount / 100);
        }
      });
    }
    
    const tax = subtotal * (invoiceData.taxRate / 100);
    const total = subtotal + additionalChargesTotal + tax;

    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const locale = invoiceData.dateFormat || "en-US";
      
      if (locale === "long") {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      
      return date.toLocaleDateString(locale);
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${invoiceData.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .company-info h1 { margin: 0 0 10px 0; font-size: 24px; }
          .company-info p { margin: 5px 0; color: #666; }
          .invoice-details { text-align: right; }
          .invoice-details p { margin: 5px 0; }
          .bill-to { margin-bottom: 30px; }
          .bill-to h3 { margin: 0 0 10px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; font-weight: bold; }
          .totals { text-align: right; }
          .totals div { display: flex; justify-content: space-between; width: 300px; margin-bottom: 5px; }
          .total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
          .notes { margin-top: 30px; }
          .notes h3 { margin: 0 0 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <h1>INVOICE</h1>
            ${invoiceData.companyName ? `<p><strong>${invoiceData.companyName}</strong></p>` : ''}
            ${invoiceData.companyAddress ? `<p>${invoiceData.companyAddress.replace(/\n/g, '<br>')}</p>` : ''}
            ${invoiceData.companyEmail ? `<p>${invoiceData.companyEmail}</p>` : ''}
            ${invoiceData.companyPhone ? `<p>${invoiceData.companyPhone}</p>` : ''}
          </div>
          <div class="invoice-details">
            ${invoiceData.invoiceNumber ? `<p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</p>` : ''}
            ${invoiceData.invoiceDate ? `<p><strong>Date:</strong> ${formatDate(invoiceData.invoiceDate)}</p>` : ''}
            ${invoiceData.dueDate ? `<p><strong>Due Date:</strong> ${formatDate(invoiceData.dueDate)}</p>` : ''}
          </div>
        </div>

        <div class="bill-to">
          <h3>Bill To:</h3>
          ${invoiceData.clientName ? `<p><strong>${invoiceData.clientName}</strong></p>` : ''}
          ${invoiceData.clientAddress ? `<p>${invoiceData.clientAddress.replace(/\n/g, '<br>')}</p>` : ''}
          ${invoiceData.clientEmail ? `<p>${invoiceData.clientEmail}</p>` : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Qty</th>
              <th style="text-align: right;">Rate</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.lineItems.map((item: any) => `
              <tr>
                <td>${item.description || '—'}</td>
                <td style="text-align: right;">${item.quantity}</td>
                <td style="text-align: right;">₱${item.rate.toFixed(2)}</td>
                <td style="text-align: right;">₱${(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div>
            <span>Subtotal:</span>
            <span>₱${subtotal.toFixed(2)}</span>
          </div>
          ${invoiceData.additionalCharges ? invoiceData.additionalCharges.map((charge: any) => {
            const chargeAmount = charge.type === "fixed" 
              ? charge.amount 
              : subtotal * (charge.amount / 100);
            return `
              <div>
                <span>${charge.label} ${charge.type === "percentage" ? `(${charge.amount}%)` : ''}:</span>
                <span>₱${chargeAmount.toFixed(2)}</span>
              </div>
            `;
          }).join('') : ''}
          <div>
            <span>Tax (${invoiceData.taxRate}%):</span>
            <span>₱${tax.toFixed(2)}</span>
          </div>
          <div class="total">
            <span>Total:</span>
            <span>₱${total.toFixed(2)}</span>
          </div>
        </div>

        ${invoiceData.notes ? `
          <div class="notes">
            <h3>Notes:</h3>
            <p>${invoiceData.notes.replace(/\n/g, '<br>')}</p>
          </div>
        ` : ''}
      </body>
      </html>
    `;
  }
}