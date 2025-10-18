import { InvoiceData } from "./InvoiceForm";
import { Separator } from "./ui/separator";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Mail } from "lucide-react";

interface InvoicePreviewProps {
  data: InvoiceData;
  onSendEmail?: () => void;
}

export function InvoicePreview({ data, onSendEmail }: InvoicePreviewProps) {
  const subtotal = data.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  
  // Calculate additional charges
  let additionalChargesTotal = 0;
  if (data.additionalCharges) {
    data.additionalCharges.forEach((charge) => {
      if (charge.type === "fixed") {
        additionalChargesTotal += charge.amount;
      } else if (charge.type === "percentage") {
        additionalChargesTotal += subtotal * (charge.amount / 100);
      }
    });
  }
  
  const tax = subtotal * (data.taxRate / 100);
  const total = subtotal + additionalChargesTotal + tax;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const locale = data.dateFormat || "en-US";
    
    if (locale === "long") {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    
    return date.toLocaleDateString(locale);
  };

  return (
    <Card className="p-8 bg-white print-invoice-content">
      {/* Email Button - Desktop Only */}
      {onSendEmail && (
        <div className="mb-6 print:hidden">
          <Button 
            onClick={onSendEmail}
            className="w-full sm:w-auto"
            variant="outline"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send via Email
          </Button>
        </div>
      )}
      
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-slate-900 mb-2">INVOICE</h1>
            {data.companyName && (
              <p className="text-slate-900 mb-1">{data.companyName}</p>
            )}
            {data.companyAddress && (
              <p className="text-slate-600 whitespace-pre-line text-sm">
                {data.companyAddress}
              </p>
            )}
            {data.companyEmail && (
              <p className="text-slate-600 text-sm">{data.companyEmail}</p>
            )}
            {data.companyPhone && (
              <p className="text-slate-600 text-sm">{data.companyPhone}</p>
            )}
          </div>
          <div className="text-right">
            {data.invoiceNumber && (
              <div className="mb-2">
                <span className="text-slate-600 text-sm">Invoice #:</span>
                <p className="text-slate-900">{data.invoiceNumber}</p>
              </div>
            )}
            {data.invoiceDate && (
              <div className="mb-2">
                <span className="text-slate-600 text-sm">Date:</span>
                <p className="text-slate-900 text-sm">
                  {formatDate(data.invoiceDate)}
                </p>
              </div>
            )}
            {data.dueDate && (
              <div>
                <span className="text-slate-600 text-sm">Due Date:</span>
                <p className="text-slate-900 text-sm">
                  {formatDate(data.dueDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Bill To */}
        <div>
          <p className="text-slate-600 text-sm mb-2">Bill To:</p>
          {data.clientName && (
            <p className="text-slate-900 mb-1">{data.clientName}</p>
          )}
          {data.clientAddress && (
            <p className="text-slate-600 whitespace-pre-line text-sm">
              {data.clientAddress}
            </p>
          )}
          {data.clientEmail && (
            <p className="text-slate-600 text-sm">{data.clientEmail}</p>
          )}
        </div>

        {/* Line Items Table */}
        <div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 text-slate-600 text-sm">
                  Description
                </th>
                <th className="text-right py-3 text-slate-600 text-sm w-20">
                  Qty
                </th>
                <th className="text-right py-3 text-slate-600 text-sm w-32">
                  Rate
                </th>
                <th className="text-right py-3 text-slate-600 text-sm w-32">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {data.lineItems.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-3 text-slate-900 text-sm">
                    {item.description || "—"}
                  </td>
                  <td className="py-3 text-right text-slate-900 text-sm">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right text-slate-900 text-sm">
                    ₱{item.rate.toFixed(2)}
                  </td>
                  <td className="py-3 text-right text-slate-900 text-sm">
                    ₱{(item.quantity * item.rate).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600 text-sm">Subtotal:</span>
              <span className="text-slate-900 text-sm">
                ₱{subtotal.toFixed(2)}
              </span>
            </div>
            {data.additionalCharges && data.additionalCharges.map((charge) => {
              const chargeAmount = charge.type === "fixed" 
                ? charge.amount 
                : subtotal * (charge.amount / 100);
              return (
                <div key={charge.id} className="flex justify-between">
                  <span className="text-slate-600 text-sm">
                    {charge.label} {charge.type === "percentage" && `(${charge.amount}%)`}:
                  </span>
                  <span className="text-slate-900 text-sm">
                    ₱{chargeAmount.toFixed(2)}
                  </span>
                </div>
              );
            })}
            <div className="flex justify-between">
              <span className="text-slate-600 text-sm">
                Tax ({data.taxRate}%):
              </span>
              <span className="text-slate-900 text-sm">₱{tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-slate-900">Total:</span>
              <span className="text-slate-900">₱{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div>
            <p className="text-slate-600 text-sm mb-2">Notes:</p>
            <p className="text-slate-900 text-sm whitespace-pre-line">
              {data.notes}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
