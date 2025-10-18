import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Card } from "./ui/card";
import { Mail, Eye, Send, X } from "lucide-react";
import { InvoiceData } from "../components/InvoiceForm";
import { EmailService } from "../services/emailService";

interface EmailPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceData: InvoiceData;
  onEmailSent: () => void;
}

export function EmailPreviewDialog({ 
  open, 
  onOpenChange, 
  invoiceData, 
  onEmailSent 
}: EmailPreviewDialogProps) {
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Pre-fill with client email if available
  const handleOpen = () => {
    if (invoiceData.clientEmail && !emailAddress) {
      setEmailAddress(invoiceData.clientEmail);
    }
    if (!emailSubject) {
      setEmailSubject(`Invoice ${invoiceData.invoiceNumber}`);
    }
    if (!emailMessage) {
      setEmailMessage(`Dear ${invoiceData.clientName || 'Valued Customer'},

Please find attached your invoice ${invoiceData.invoiceNumber} for the services provided.

Invoice Details:
- Invoice Number: ${invoiceData.invoiceNumber}
- Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString()}
- Total Amount: ₱${calculateTotal().toFixed(2)}

Please remit payment by the due date. If you have any questions about this invoice, please don't hesitate to contact us.

Thank you for your business!

Best regards,
${invoiceData.companyName || 'Your Company'}`);
    }
  };

  const calculateTotal = () => {
    const subtotal = invoiceData.lineItems.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
    
    let additionalChargesTotal = 0;
    if (invoiceData.additionalCharges) {
      invoiceData.additionalCharges.forEach((charge) => {
        if (charge.type === "fixed") {
          additionalChargesTotal += charge.amount;
        } else if (charge.type === "percentage") {
          additionalChargesTotal += subtotal * (charge.amount / 100);
        }
      });
    }
    
    const tax = subtotal * (invoiceData.taxRate / 100);
    return subtotal + additionalChargesTotal + tax;
  };

  const handleSendEmail = async () => {
    if (!emailAddress) {
      alert("Please enter an email address");
      return;
    }
    if (!emailSubject) {
      alert("Please enter an email subject");
      return;
    }

    setIsSending(true);
    try {
      const invoiceHTML = EmailService.generateInvoiceHTML(invoiceData);
      
      const emailData = {
        to_email: emailAddress,
        subject: emailSubject,
        invoice_number: invoiceData.invoiceNumber,
        company_name: invoiceData.companyName,
        client_name: invoiceData.clientName,
        total_amount: calculateTotal().toFixed(2),
        due_date: new Date(invoiceData.dueDate).toLocaleDateString(),
        invoice_html: invoiceHTML,
        message: emailMessage,
      };

      // Send the actual email
      await EmailService.sendInvoiceEmail(emailData);
      
      onEmailSent();
      onOpenChange(false);
      
      // Reset form
      setEmailAddress("");
      setEmailSubject("");
      setEmailMessage("");
      setShowPreview(false);
      
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Invoice via Email
          </DialogTitle>
          <DialogDescription>
            Preview and send your invoice to the recipient's email address.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {!showPreview ? (
            <div className="space-y-6 flex-1 overflow-y-auto">
              {/* Email Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-address">Recipient Email Address</Label>
                  <Input
                    id="email-address"
                    type="email"
                    placeholder="recipient@example.com"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Email Subject</Label>
                  <Input
                    id="email-subject"
                    type="text"
                    placeholder="Invoice INV-001"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-message">Email Message</Label>
                  <Textarea
                    id="email-message"
                    placeholder="Enter your message here..."
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={8}
                  />
                </div>
              </div>

              <Separator />

              {/* Invoice Summary */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Invoice Summary</h3>
                <Card className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Invoice Number:</span>
                      <span className="text-sm font-medium">{invoiceData.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Client:</span>
                      <span className="text-sm font-medium">{invoiceData.clientName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Due Date:</span>
                      <span className="text-sm font-medium">
                        {new Date(invoiceData.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Amount:</span>
                      <span className="text-sm font-bold">₱{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {/* Email Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Email Preview</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClosePreview}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close Preview
                  </Button>
                </div>
                
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-muted-foreground">To:</p>
                          <p className="font-medium">{emailAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Subject:</p>
                          <p className="font-medium">{emailSubject}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-sm">
                        {emailMessage}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">📎 Invoice attachment will be included</p>
                      <p>Invoice #{invoiceData.invoiceNumber} - Total: ₱{calculateTotal().toFixed(2)}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          <DialogFooter className="flex-shrink-0">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              
              {!showPreview ? (
                <Button
                  onClick={handlePreview}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Email
                </Button>
              ) : (
                <Button
                  onClick={handleSendEmail}
                  disabled={isSending}
                  className="flex-1"
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
