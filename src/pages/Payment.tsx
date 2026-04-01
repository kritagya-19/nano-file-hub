import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Smartphone,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Shield,
} from "lucide-react";

type PaymentMethod = "card" | "upi";

const planDetails: Record<string, { name: string; price: string; period: string }> = {
  Pro: { name: "Pro", price: "$12", period: "/month" },
  Max: { name: "Max", price: "$29", period: "/month" },
};

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planName = searchParams.get("plan") || "Pro";
  const plan = planDetails[planName] || planDetails.Pro;

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // UPI field
  const [upiId, setUpiId] = useState("");

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const isCardValid = cardNumber.replace(/\s/g, "").length === 16 && cardName.trim() && expiry.length === 5 && cvv.length >= 3;
  const isUpiValid = /^[\w.-]+@[\w]+$/.test(upiId);
  const isFormValid = method === "card" ? isCardValid : isUpiValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
          <p className="text-muted-foreground">
            You've been upgraded to the <strong>{plan.name}</strong> plan. Enjoy your new features!
          </p>
          <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground">Amount paid</p>
            <p className="text-3xl font-bold text-foreground">{plan.price}<span className="text-sm font-normal text-muted-foreground">{plan.period}</span></p>
          </div>
          <Button className="w-full" size="lg" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Order summary */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Upgrading to</p>
              <h2 className="text-xl font-bold text-foreground">{plan.name} Plan</h2>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">{plan.price}</p>
              <p className="text-sm text-muted-foreground">{plan.period}</p>
            </div>
          </div>
        </Card>

        {/* Payment method selector */}
        <div className="grid grid-cols-2 gap-3">
          {([
            { key: "card" as const, label: "Credit / Debit Card", icon: CreditCard },
            { key: "upi" as const, label: "UPI", icon: Smartphone },
          ]).map((m) => (
            <button
              key={m.key}
              onClick={() => setMethod(m.key)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                method === m.key
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              )}
            >
              <m.icon className={cn("w-6 h-6", method === m.key ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-sm font-medium", method === m.key ? "text-foreground" : "text-muted-foreground")}>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Payment form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {method === "card" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      maxLength={4}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Enter your UPI ID (e.g., name@okaxis, name@ybl)</p>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={!isFormValid || processing}>
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...
                </>
              ) : (
                `Pay ${plan.price}`
              )}
            </Button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>This is a demo. No real payment will be processed.</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
