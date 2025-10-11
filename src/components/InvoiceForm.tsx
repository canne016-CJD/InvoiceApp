import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Alert, AlertDescription } from "./ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Plus, Trash2, Pencil, Save, AlertTriangle } from "lucide-react";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface AdditionalCharge {
  id: string;
  label: string;
  amount: number;
  type: "fixed" | "percentage";
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  lineItems: LineItem[];
  taxRate: number;
  notes: string;
  additionalCharges?: AdditionalCharge[];
  dateFormat?: string;
}

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  hasDefaultCompanyInfo?: boolean;
}

export function InvoiceForm({ data, onChange }: InvoiceFormProps) {
  const [isCompanyInfoEditable, setIsCompanyInfoEditable] = useState(false);
  
  // Collapsible states for mobile - all open by default
  const [isInvoiceDetailsOpen, setIsInvoiceDetailsOpen] = useState(true);
  const [isCompanyInfoOpen, setIsCompanyInfoOpen] = useState(true);
  const [isBillToOpen, setIsBillToOpen] = useState(true);
  const [isLineItemsOpen, setIsLineItemsOpen] = useState(true);
  const [isAdditionalDetailsOpen, setIsAdditionalDetailsOpen] = useState(true);

  const updateField = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Check if all company fields are empty
  const isCompanyInfoEmpty = !data.companyName && !data.companyAddress && !data.companyEmail && !data.companyPhone;

  const handleEditToggle = () => {
    setIsCompanyInfoEditable(!isCompanyInfoEditable);
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
    };
    onChange({ ...data, lineItems: [...data.lineItems, newItem] });
  };

  const removeLineItem = (id: string) => {
    onChange({
      ...data,
      lineItems: data.lineItems.filter((item) => item.id !== id),
    });
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    onChange({
      ...data,
      lineItems: data.lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Desktop: Regular Cards */}
      <div className="hidden sm:block space-y-6">
        <Card id="invoice-details">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={data.invoiceNumber}
                  onChange={(e) => updateField("invoiceNumber", e.target.value)}
                  placeholder="INV-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={data.invoiceDate}
                  onChange={(e) => updateField("invoiceDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={data.dueDate}
                  onChange={(e) => updateField("dueDate", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card id="company-info">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Company Information</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={isCompanyInfoEditable ? "default" : "outline"}
                      size="icon"
                      onClick={handleEditToggle}
                      disabled={isCompanyInfoEmpty}
                      className="h-8 w-8 shrink-0"
                    >
                      {isCompanyInfoEditable ? (
                        <Save className="h-4 w-4" />
                      ) : (
                        <Pencil className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isCompanyInfoEmpty 
                        ? "No company info to edit" 
                        : isCompanyInfoEditable 
                        ? "Save and lock" 
                        : "Edit company info"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {isCompanyInfoEmpty && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  ⚠️ Set the default company information first in your Settings.
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={data.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="Your Company Name"
                disabled={!isCompanyInfoEditable}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Address</Label>
              <Textarea
                id="companyAddress"
                value={data.companyAddress}
                onChange={(e) => updateField("companyAddress", e.target.value)}
                placeholder="123 Business St, Suite 100&#10;City, State 12345"
                rows={3}
                disabled={!isCompanyInfoEditable}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={data.companyEmail}
                  onChange={(e) => updateField("companyEmail", e.target.value)}
                  placeholder="contact@company.com"
                  disabled={!isCompanyInfoEditable}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Phone</Label>
                <Input
                  id="companyPhone"
                  value={data.companyPhone}
                  onChange={(e) => updateField("companyPhone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  disabled={!isCompanyInfoEditable}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card id="bill-to">
          <CardHeader>
            <CardTitle>Bill To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={data.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                placeholder="Client Company Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Address</Label>
              <Textarea
                id="clientAddress"
                value={data.clientAddress}
                onChange={(e) => updateField("clientAddress", e.target.value)}
                placeholder="456 Client Ave&#10;City, State 67890"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={data.clientEmail}
                onChange={(e) => updateField("clientEmail", e.target.value)}
                placeholder="client@email.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card id="line-items">
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.lineItems.map((item, index) => (
              <div key={item.id} className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`description-${item.id}`}>Description</Label>
                  <Input
                    id={`description-${item.id}`}
                    value={item.description}
                    onChange={(e) =>
                      updateLineItem(item.id, "description", e.target.value)
                    }
                    placeholder="Service or product description"
                  />
                </div>
                <div className="w-24 space-y-2">
                  <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                  <Input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) =>
                      updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label htmlFor={`rate-${item.id}`}>Rate</Label>
                  <Input
                    id={`rate-${item.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) =>
                      updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label>Amount</Label>
                  <div className="h-10 flex items-center px-3 border rounded-md bg-muted">
                    ₱{(item.quantity * item.rate).toFixed(2)}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeLineItem(item.id)}
                  disabled={data.lineItems.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addLineItem}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Line Item
            </Button>
          </CardContent>
        </Card>

        <Card id="additional-details">
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={data.taxRate}
                onChange={(e) =>
                  updateField("taxRate", parseFloat(e.target.value) || 0)
                }
              />
            </div>
            
            {data.additionalCharges && data.additionalCharges.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Additional Charges</Label>
                  <p className="text-xs text-muted-foreground">
                    Manage in Settings
                  </p>
                </div>
                <div className="space-y-2 p-3 border rounded-lg bg-muted/50">
                  {data.additionalCharges.map((charge) => (
                    <div key={charge.id} className="flex justify-between items-center text-sm">
                      <span className="text-foreground">{charge.label}</span>
                      <span className="text-muted-foreground">
                        {charge.type === "percentage" 
                          ? `${charge.amount}%` 
                          : `₱${charge.amount.toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={data.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Payment terms, thank you message, etc."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile: Collapsible Cards */}
      <div className="sm:hidden space-y-6">
        {/* Invoice Details - Not Collapsible on Mobile */}
        <Card id="invoice-details-mobile">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber-mobile">Invoice Number</Label>
              <Input
                id="invoiceNumber-mobile"
                value={data.invoiceNumber}
                onChange={(e) => updateField("invoiceNumber", e.target.value)}
                placeholder="INV-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceDate-mobile">Date</Label>
              <Input
                id="invoiceDate-mobile"
                type="date"
                value={data.invoiceDate}
                onChange={(e) => updateField("invoiceDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate-mobile">Due Date</Label>
              <Input
                id="dueDate-mobile"
                type="date"
                value={data.dueDate}
                onChange={(e) => updateField("dueDate", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Collapsible open={isCompanyInfoOpen} onOpenChange={setIsCompanyInfoOpen}>
          <Card id="company-info-mobile">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle>Your Company Information</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                        type="button"
                        variant={isCompanyInfoEditable ? "default" : "outline"}
                        size="icon"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          handleEditToggle();
                        }}
                        disabled={isCompanyInfoEmpty}
                          className="h-8 w-8 shrink-0"
                        >
                          {isCompanyInfoEditable ? (
                            <Save className="h-4 w-4" />
                          ) : (
                            <Pencil className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isCompanyInfoEmpty 
                            ? "No company info to edit" 
                            : isCompanyInfoEditable 
                            ? "Save and lock" 
                            : "Edit company info"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {isCompanyInfoEmpty && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      ⚠️ Set the default company information first in your Settings.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="companyName-mobile">Company Name</Label>
                  <Input
                    id="companyName-mobile"
                    value={data.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="Your Company Name"
                    disabled={!isCompanyInfoEditable}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyAddress-mobile">Address</Label>
                  <Textarea
                    id="companyAddress-mobile"
                    value={data.companyAddress}
                    onChange={(e) => updateField("companyAddress", e.target.value)}
                    placeholder="123 Business St, Suite 100&#10;City, State 12345"
                    rows={3}
                    disabled={!isCompanyInfoEditable}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail-mobile">Email</Label>
                    <Input
                      id="companyEmail-mobile"
                      type="email"
                      value={data.companyEmail}
                      onChange={(e) => updateField("companyEmail", e.target.value)}
                      placeholder="contact@company.com"
                      disabled={!isCompanyInfoEditable}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone-mobile">Phone</Label>
                    <Input
                      id="companyPhone-mobile"
                      value={data.companyPhone}
                      onChange={(e) => updateField("companyPhone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      disabled={!isCompanyInfoEditable}
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={isBillToOpen} onOpenChange={setIsBillToOpen}>
          <Card id="bill-to-mobile">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                <CardTitle>Bill To</CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName-mobile">Client Name</Label>
                  <Input
                    id="clientName-mobile"
                    value={data.clientName}
                    onChange={(e) => updateField("clientName", e.target.value)}
                    placeholder="Client Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientAddress-mobile">Address</Label>
                  <Textarea
                    id="clientAddress-mobile"
                    value={data.clientAddress}
                    onChange={(e) => updateField("clientAddress", e.target.value)}
                    placeholder="456 Client Ave&#10;City, State 67890"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail-mobile">Email</Label>
                  <Input
                    id="clientEmail-mobile"
                    type="email"
                    value={data.clientEmail}
                    onChange={(e) => updateField("clientEmail", e.target.value)}
                    placeholder="client@email.com"
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={isLineItemsOpen} onOpenChange={setIsLineItemsOpen}>
          <Card id="line-items-mobile">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                <CardTitle>Line Items</CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {data.lineItems.map((item, index) => (
                  <div key={item.id} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`description-mobile-${item.id}`}>Description</Label>
                      <Input
                        id={`description-mobile-${item.id}`}
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(item.id, "description", e.target.value)
                        }
                        placeholder="Service or product description"
                      />
                    </div>
                    <div className="w-24 space-y-2">
                      <Label htmlFor={`quantity-mobile-${item.id}`}>Quantity</Label>
                      <Input
                        id={`quantity-mobile-${item.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label htmlFor={`rate-mobile-${item.id}`}>Rate</Label>
                      <Input
                        id={`rate-mobile-${item.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) =>
                          updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>Amount</Label>
                      <div className="h-10 flex items-center px-3 border rounded-md bg-muted">
                        ₱{(item.quantity * item.rate).toFixed(2)}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeLineItem(item.id)}
                      disabled={data.lineItems.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addLineItem}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line Item
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Collapsible open={isAdditionalDetailsOpen} onOpenChange={setIsAdditionalDetailsOpen}>
          <Card id="additional-details-mobile">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate-mobile">Tax Rate (%)</Label>
                  <Input
                    id="taxRate-mobile"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={data.taxRate}
                    onChange={(e) =>
                      updateField("taxRate", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                
                {data.additionalCharges && data.additionalCharges.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Additional Charges</Label>
                      <p className="text-xs text-muted-foreground">
                        Manage in Settings
                      </p>
                    </div>
                    <div className="space-y-2 p-3 border rounded-lg bg-muted/50">
                      {data.additionalCharges.map((charge) => (
                        <div key={charge.id} className="flex justify-between items-center text-sm">
                          <span className="text-foreground">{charge.label}</span>
                          <span className="text-muted-foreground">
                            {charge.type === "percentage" 
                              ? `${charge.amount}%` 
                              : `₱${charge.amount.toFixed(2)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes-mobile">Notes</Label>
                  <Textarea
                    id="notes-mobile"
                    value={data.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="Payment terms, thank you message, etc."
                    rows={4}
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  );
}
