import { useState } from "react";
import { InvoiceForm, InvoiceData } from "./components/InvoiceForm";
import { InvoicePreview } from "./components/InvoicePreview";
import { Button } from "./components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Toaster } from "./components/ui/sonner";
import { FileText, Download, Printer, Mail, Settings, Building, Calendar, DollarSign, Plus, Trash2, Eye, User, ShoppingCart, StickyNote, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export interface AdditionalCharge {
  id: string;
  label: string;
  amount: number;
  type: "fixed" | "percentage";
}

export default function App() {
  const today = new Date().toISOString().split("T")[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  const dueDateString = dueDate.toISOString().split("T")[0];

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "INV-001",
    invoiceDate: today,
    dueDate: dueDateString,
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    lineItems: [
      {
        id: "1",
        description: "",
        quantity: 1,
        rate: 0,
      },
    ],
    taxRate: 0,
    notes: "",
  });

  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSubject, setEmailSubject] = useState("");

  // Settings state
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [companyInfoDialogOpen, setCompanyInfoDialogOpen] = useState(false);
  const [dateFormatDialogOpen, setDateFormatDialogOpen] = useState(false);
  const [additionalChargesDialogOpen, setAdditionalChargesDialogOpen] = useState(false);

  // Default company information
  const [defaultCompanyInfo, setDefaultCompanyInfo] = useState({
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
  });

  // Date format preference
  const [dateFormat, setDateFormat] = useState("en-US");

  // Additional charges
  const [additionalCharges, setAdditionalCharges] = useState<AdditionalCharge[]>([]);

  // Mobile preview visibility
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  
  // Mobile screen state: 'main' | 'company-settings' | 'additional-charges'
  const [mobileScreen, setMobileScreen] = useState<'main' | 'company-settings' | 'additional-charges'>('main');

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  const handleSendEmail = () => {
    // Pre-fill with client email if available
    if (invoiceData.clientEmail && !emailAddress) {
      setEmailAddress(invoiceData.clientEmail);
    }
    // Pre-fill subject if not already set
    if (!emailSubject) {
      setEmailSubject(`Invoice ${invoiceData.invoiceNumber}`);
    }
    setEmailDialogOpen(true);
  };

  const handleEmailSubmit = () => {
    // Mock email sending functionality
    if (!emailAddress) {
      toast.error("Please enter an email address");
      return;
    }
    if (!emailSubject) {
      toast.error("Please enter an email subject");
      return;
    }
    
    // Simulate sending email
    toast.success(`Invoice sent to ${emailAddress}`);
    setEmailDialogOpen(false);
  };

  const handleSaveCompanyInfo = () => {
    setInvoiceData({
      ...invoiceData,
      companyName: defaultCompanyInfo.companyName,
      companyAddress: defaultCompanyInfo.companyAddress,
      companyEmail: defaultCompanyInfo.companyEmail,
      companyPhone: defaultCompanyInfo.companyPhone,
    });
    toast.success("Default company information saved");
    setCompanyInfoDialogOpen(false);
  };

  const handleSaveDateFormat = () => {
    toast.success("Date format preference saved");
    setDateFormatDialogOpen(false);
  };

  const addAdditionalCharge = () => {
    const newCharge: AdditionalCharge = {
      id: Date.now().toString(),
      label: "",
      amount: 0,
      type: "fixed",
    };
    setAdditionalCharges([...additionalCharges, newCharge]);
  };

  const removeAdditionalCharge = (id: string) => {
    setAdditionalCharges(additionalCharges.filter((charge) => charge.id !== id));
  };

  const updateAdditionalCharge = (id: string, field: keyof AdditionalCharge, value: any) => {
    setAdditionalCharges(
      additionalCharges.map((charge) =>
        charge.id === id ? { ...charge, [field]: value } : charge
      )
    );
  };

  const handleSaveAdditionalCharges = () => {
    toast.success("Additional charges saved");
    setAdditionalChargesDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            {/* Top row - Logo/Back button and title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Back button for mobile settings screens */}
                {(mobileScreen === 'company-settings' || mobileScreen === 'additional-charges') && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileScreen('main')}
                    className="sm:hidden"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                
                {/* Logo - only show on main screen for mobile, always show on desktop */}
                <div className={`h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center ${mobileScreen !== 'main' ? 'hidden sm:flex' : ''}`}>
                  <FileText className="h-6 w-6 text-white" />
                </div>
                
                <div>
                  {/* Mobile: Dynamic title based on screen */}
                  <h1 className="text-slate-900 sm:hidden">
                    {mobileScreen === 'company-settings' && 'Company Information'}
                    {mobileScreen === 'additional-charges' && 'Additional Charges'}
                    {mobileScreen === 'main' && 'Invoice Generator'}
                  </h1>
                  
                  {/* Desktop: Always show Invoice Generator */}
                  <h1 className="text-slate-900 hidden sm:block">Invoice Generator</h1>
                  <p className="text-slate-600 text-sm hidden sm:block">
                    Create professional invoices in seconds
                  </p>
                </div>
              </div>
              
              {/* Desktop action buttons */}
              <div className="hidden sm:flex gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="default" onClick={handleSendEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send to Email
                </Button>
                <Button variant="outline" size="icon" onClick={() => setSettingsDialogOpen(true)}>
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pb-24 sm:pb-8">
        {/* Mobile: Company Settings Screen */}
        {mobileScreen === 'company-settings' && (
          <div className="sm:hidden">
            <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile-company-name">Company Name</Label>
                  <Input
                    id="mobile-company-name"
                    value={defaultCompanyInfo.companyName}
                    onChange={(e) =>
                      setDefaultCompanyInfo({ ...defaultCompanyInfo, companyName: e.target.value })
                    }
                    placeholder="Your Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile-company-address">Address</Label>
                  <Textarea
                    id="mobile-company-address"
                    value={defaultCompanyInfo.companyAddress}
                    onChange={(e) =>
                      setDefaultCompanyInfo({ ...defaultCompanyInfo, companyAddress: e.target.value })
                    }
                    placeholder="123 Business St, Suite 100&#10;City, State 12345"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile-company-email">Email</Label>
                  <Input
                    id="mobile-company-email"
                    type="email"
                    value={defaultCompanyInfo.companyEmail}
                    onChange={(e) =>
                      setDefaultCompanyInfo({ ...defaultCompanyInfo, companyEmail: e.target.value })
                    }
                    placeholder="contact@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile-company-phone">Phone</Label>
                  <Input
                    id="mobile-company-phone"
                    value={defaultCompanyInfo.companyPhone}
                    onChange={(e) =>
                      setDefaultCompanyInfo({ ...defaultCompanyInfo, companyPhone: e.target.value })
                    }
                    placeholder="+63 (XXX) XXX-XXXX"
                  />
                </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setMobileScreen('main')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    handleSaveCompanyInfo();
                    setMobileScreen('main');
                  }}
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile: Additional Charges Screen */}
        {mobileScreen === 'additional-charges' && (
          <div className="sm:hidden">
            <div className="space-y-4">
                {additionalCharges.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No additional charges added. Click the button below to add one.
                  </p>
                ) : (
                  additionalCharges.map((charge) => (
                    <div key={charge.id} className="space-y-3 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor={`mobile-charge-label-${charge.id}`}>Label</Label>
                        <Input
                          id={`mobile-charge-label-${charge.id}`}
                          value={charge.label}
                          onChange={(e) =>
                            updateAdditionalCharge(charge.id, "label", e.target.value)
                          }
                          placeholder="e.g., Shipping, Discount"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                        <Label htmlFor={`mobile-charge-type-${charge.id}`}>Type</Label>
                        <Select
                          value={charge.type}
                          onValueChange={(value: string) =>
                            updateAdditionalCharge(charge.id, "type", value)
                          }
                        >
                            <SelectTrigger id={`mobile-charge-type-${charge.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixed">Fixed (₱)</SelectItem>
                              <SelectItem value="percentage">Percentage (%)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`mobile-charge-amount-${charge.id}`}>Amount</Label>
                          <Input
                            id={`mobile-charge-amount-${charge.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={charge.amount}
                            onChange={(e) =>
                              updateAdditionalCharge(
                                charge.id,
                                "amount",
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAdditionalCharge(charge.id)}
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Charge
                      </Button>
                    </div>
                  ))
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAdditionalCharge}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Charge
                </Button>
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setMobileScreen('main')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    handleSaveAdditionalCharges();
                    setMobileScreen('main');
                  }}
                  className="flex-1"
                >
                  Save Charges
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Invoice Screen */}
        {mobileScreen === 'main' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className={`print:hidden ${showMobilePreview ? 'hidden sm:block' : 'block'}`}>
              <InvoiceForm 
                data={{
                  ...invoiceData,
                  additionalCharges,
                  dateFormat,
                }} 
                onChange={setInvoiceData}
                hasDefaultCompanyInfo={
                  defaultCompanyInfo.companyName !== "" ||
                  defaultCompanyInfo.companyAddress !== "" ||
                  defaultCompanyInfo.companyEmail !== "" ||
                  defaultCompanyInfo.companyPhone !== ""
                }
              />
            </div>

            {/* Preview Section */}
            <div className={`lg:sticky lg:top-8 self-start ${showMobilePreview ? 'block' : 'hidden lg:block'}`}>
              <div className="mb-4 print:hidden">
                <h2 className="text-slate-900">Preview</h2>
                <p className="text-slate-600 text-sm">
                  This is how your invoice will look
                </p>
              </div>
              <InvoicePreview 
                data={{
                  ...invoiceData,
                  additionalCharges,
                  dateFormat,
                }} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar - Mobile Only (hide on settings screens) */}
      {mobileScreen === 'main' && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 print:hidden z-50">
        <div className="grid grid-cols-5 gap-1 p-2">
          <Button
            variant={showMobilePreview ? "ghost" : "default"}
            size="icon"
            onClick={() => setShowMobilePreview(false)}
            className="h-12 w-full"
          >
            <FileText className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSendEmail}
            className="h-12 w-full"
          >
            <Mail className="h-5 w-5" />
          </Button>
          <Button
            variant={showMobilePreview ? "default" : "ghost"}
            size="icon"
            onClick={() => setShowMobilePreview(true)}
            className="h-12 w-full"
          >
            <Eye className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrint}
            className="h-12 w-full"
          >
            <Printer className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsDialogOpen(true)}
            className="h-12 w-full"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        </div>
      )}

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Choose a setting to configure
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <button
              onClick={() => {
                setSettingsDialogOpen(false);
                // On mobile, show full screen; on desktop, show dialog
                if (window.innerWidth < 640) {
                  setMobileScreen('company-settings');
                } else {
                  setCompanyInfoDialogOpen(true);
                }
              }}
              className="w-full flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-900">Edit Default Company Information</p>
                <p className="text-sm text-slate-600">Set your default company details</p>
              </div>
            </button>
            <button
              onClick={() => {
                setSettingsDialogOpen(false);
                setDateFormatDialogOpen(true);
              }}
              className="w-full flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-slate-900">Edit Date Format</p>
                <p className="text-sm text-slate-600">Choose your preferred date format</p>
              </div>
            </button>
            <button
              onClick={() => {
                setSettingsDialogOpen(false);
                // On mobile, show full screen; on desktop, show dialog
                if (window.innerWidth < 640) {
                  setMobileScreen('additional-charges');
                } else {
                  setAdditionalChargesDialogOpen(true);
                }
              }}
              className="w-full flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-slate-900">Edit Additional Charges</p>
                <p className="text-sm text-slate-600">Add shipping, discount, or other charges</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Invoice to Email</DialogTitle>
            <DialogDescription>
              Enter the recipient's email address and subject line.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email-address">Email address:</Label>
              <Input
                id="email-address"
                type="email"
                placeholder="recipient@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-subject">Email Subject:</Label>
              <Input
                id="email-subject"
                type="text"
                placeholder="Invoice INV-001"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEmailSubmit}>
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Company Information Dialog */}
      <Dialog open={companyInfoDialogOpen} onOpenChange={setCompanyInfoDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Default Company Information</DialogTitle>
            <DialogDescription>
              Set your default company information to auto-fill new invoices.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="default-company-name">Company Name</Label>
              <Input
                id="default-company-name"
                value={defaultCompanyInfo.companyName}
                onChange={(e) =>
                  setDefaultCompanyInfo({ ...defaultCompanyInfo, companyName: e.target.value })
                }
                placeholder="Your Company Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-company-address">Address</Label>
              <Textarea
                id="default-company-address"
                value={defaultCompanyInfo.companyAddress}
                onChange={(e) =>
                  setDefaultCompanyInfo({ ...defaultCompanyInfo, companyAddress: e.target.value })
                }
                placeholder="123 Business St, Suite 100&#10;City, State 12345"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default-company-email">Email</Label>
                <Input
                  id="default-company-email"
                  type="email"
                  value={defaultCompanyInfo.companyEmail}
                  onChange={(e) =>
                    setDefaultCompanyInfo({ ...defaultCompanyInfo, companyEmail: e.target.value })
                  }
                  placeholder="contact@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-company-phone">Phone</Label>
                <Input
                  id="default-company-phone"
                  value={defaultCompanyInfo.companyPhone}
                  onChange={(e) =>
                    setDefaultCompanyInfo({ ...defaultCompanyInfo, companyPhone: e.target.value })
                  }
                  placeholder="+63 (XXX) XXX-XXXX"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompanyInfoDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCompanyInfo}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Date Format Dialog */}
      <Dialog open={dateFormatDialogOpen} onOpenChange={setDateFormatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Date Format</DialogTitle>
            <DialogDescription>
              Choose your preferred date format for invoices.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date-format">Date Format</Label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger id="date-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">MM/DD/YYYY (US Format)</SelectItem>
                  <SelectItem value="en-GB">DD/MM/YYYY (UK Format)</SelectItem>
                  <SelectItem value="en-PH">MM/DD/YYYY (Philippines)</SelectItem>
                  <SelectItem value="ja-JP">YYYY/MM/DD (Japan)</SelectItem>
                  <SelectItem value="de-DE">DD.MM.YYYY (Germany)</SelectItem>
                  <SelectItem value="fr-FR">DD/MM/YYYY (France)</SelectItem>
                  <SelectItem value="long">Long Format (e.g., January 1, 2025)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Preview: {new Date().toLocaleDateString(dateFormat === "long" ? "en-US" : dateFormat, 
                  dateFormat === "long" ? { year: "numeric", month: "long", day: "numeric" } : undefined)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDateFormatDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDateFormat}>
              Save Format
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Additional Charges Dialog */}
      <Dialog open={additionalChargesDialogOpen} onOpenChange={setAdditionalChargesDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Additional Charges</DialogTitle>
            <DialogDescription>
              Add shipping, discount, or other charges to your invoices.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {additionalCharges.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No additional charges added. Click the button below to add one.
              </p>
            ) : (
              additionalCharges.map((charge) => (
                <div key={charge.id} className="flex gap-4 items-end p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`charge-label-${charge.id}`}>Label</Label>
                    <Input
                      id={`charge-label-${charge.id}`}
                      value={charge.label}
                      onChange={(e) =>
                        updateAdditionalCharge(charge.id, "label", e.target.value)
                      }
                      placeholder="e.g., Shipping, Discount"
                    />
                  </div>
                  <div className="w-32 space-y-2">
                  <Label htmlFor={`charge-type-${charge.id}`}>Type</Label>
                  <Select
                    value={charge.type}
                    onValueChange={(value: string) =>
                      updateAdditionalCharge(charge.id, "type", value)
                    }
                  >
                      <SelectTrigger id={`charge-type-${charge.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed (₱)</SelectItem>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32 space-y-2">
                    <Label htmlFor={`charge-amount-${charge.id}`}>Amount</Label>
                    <Input
                      id={`charge-amount-${charge.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={charge.amount}
                      onChange={(e) =>
                        updateAdditionalCharge(
                          charge.id,
                          "amount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeAdditionalCharge(charge.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
            <Button
              type="button"
              variant="outline"
              onClick={addAdditionalCharge}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Charge
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdditionalChargesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAdditionalCharges}>
              Save Charges
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast Notifications */}
      <Toaster />

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}
