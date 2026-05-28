import { useState, useEffect } from "react";
import { Check, ShoppingCart, Loader2, Sparkles, AlertCircle, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import tshirtMockup from "../assets/images/tshirt_mockup_1779947730961.png";

interface TShirtCustomizerProps {
  userEmail?: string;
  onOrderSuccess: () => void;
}

export default function TShirtCustomizer({ userEmail = "matt.mcclain79@gmail.com", onOrderSuccess }: TShirtCustomizerProps) {
  const [selectedSize, setSelectedSize] = useState<"XS" | "S" | "M" | "L" | "XL" | "XXL">("M");
  const [selectedColor, setSelectedColor] = useState<"Black" | "Vintage White" | "Charcoal">("Black");
  const [customText, setCustomText] = useState("A life is a life, no matter how small.");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"customize" | "details">("customize");

  // Shipping details state
  const [shippingName, setShippingName] = useState("Matt McClain");
  const [shippingStreet, setShippingStreet] = useState("1200 Washington Ave");
  const [shippingCity, setShippingCity] = useState("Golden");
  const [shippingState, setShippingState] = useState("CO");
  const [shippingZip, setShippingZip] = useState("80401");
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [orderId, setOrderId] = useState("");

  const sizes: ("XS" | "S" | "M" | "L" | "XL" | "XXL")[] = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors: { name: "Black" | "Vintage White" | "Charcoal"; class: string; textHex: string }[] = [
    { name: "Black", class: "bg-neutral-900 border-neutral-700", textHex: "#F5F5DC" },
    { name: "Vintage White", class: "bg-amber-50 border-neutral-300", textHex: "#111827" },
    { name: "Charcoal", class: "bg-neutral-700 border-neutral-500", textHex: "#F3F4F6" }
  ];

  const shirtPrice = 28;
  const deliveryCharge = 4.99;
  const totalPrice = (shirtPrice * quantity + (giftWrapping ? 5 : 0) + deliveryCharge).toFixed(2);

  const handleCheckoutSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const genOrderId = "HH-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(genOrderId);

    const newOrder = {
      orderId: genOrderId,
      size: selectedSize,
      color: selectedColor,
      customText,
      quantity,
      shippingName,
      shippingStreet,
      shippingCity,
      shippingState,
      shippingZip,
      giftWrapping,
      totalPrice,
      date: new Date().toISOString(),
      status: "Processing"
    };

    // Store in LocalStorage for seamless client tracking
    const existingOrders = JSON.parse(localStorage.getItem("tee_orders") || "[]");
    existingOrders.unshift(newOrder);
    localStorage.setItem("tee_orders", JSON.stringify(existingOrders));

    setIsSubmitting(false);
    setIsOrdered(true);
    if (onOrderSuccess) {
      onOrderSuccess();
    }
  };

  return (
    <div id="tshirt-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
      {/* LEFT COLUMN: Visual Shirt Mockup Preview */}
      <div className="lg:col-span-6 flex flex-col items-center">
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950/60 p-4 flex items-center justify-center group shadow-xl">
          {/* Real-time T-Shirt Style Wrapper */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
            {selectedColor === "Black" ? (
              <img
                src={tshirtMockup}
                alt="Premium Black Shirt Mockup"
                className="w-full h-full object-contain transition-all duration-300 transform group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
            ) : (
              // Styled SVG representation for alternative selected colors
              <svg
                id="svg-tshirt"
                viewBox="0 0 100 100"
                className="w-[85%] h-[85%] drop-shadow-2xl transition-all duration-500"
              >
                <path
                  d="M27 15 L32 20 L40 20 C42 15, 58 15, 60 20 L68 20 L73 15 L85 24 L78 35 L76 34 L76 85 C76 88, 74 90, 71 90 L29 90 C26 90, 24 88, 24 85 L24 34 L22 35 L15 24 Z"
                  fill={selectedColor === "Vintage White" ? "#F9F6EE" : "#32353B"}
                  stroke="#4b5563"
                  strokeWidth="1.5"
                />
                {/* Crewneck Inner shadow */}
                <path
                  d="M40 20 C42 27, 58 27, 60 20"
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="1.5"
                />
                
                {/* Print Typography Preview Overlay */}
                <foreignObject x="32" y="38" width="36" height="30" className="overflow-visible">
                  <div 
                    style={{ 
                      color: selectedColor === "Vintage White" ? "#1e293b" : "#fdf6e2",
                    }}
                    className="w-full text-center leading-tight select-none pointer-events-none"
                  >
                    <p className="font-serif-sub text-[3.8px] md:text-[4px] font-semibold tracking-wide h-12 flex items-center justify-center px-1">
                      {customText}
                    </p>
                    <div className="mt-1 border-t border-current/25 w-4 mx-auto" />
                    <p className="text-[1.8px] tracking-[0.1em] font-mono opacity-60 mt-1 uppercase text-amber-500">
                      HOPE HOUSE CO
                    </p>
                  </div>
                </foreignObject>
              </svg>
            )}
          </div>

          {/* Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-mono rounded bg-neutral-900/90 border border-neutral-700 text-amber-400">
              100% Cotton
            </span>
            <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-mono rounded bg-neutral-900/90 border border-neutral-700 text-neutral-300">
              Charity Benefit
            </span>
          </div>

          {/* Real-time T-Shirt details caption */}
          {selectedColor === "Black" && (
            <div className="absolute inset-x-0 bottom-6 text-center select-none pointer-events-none px-6">
              <span className="text-xs font-serif-sub italic text-neutral-400">
                Premium Retail Silk-Screen Printed
              </span>
            </div>
          )}
        </div>

        {/* Info card beneath */}
        <div className="mt-4 w-full p-4 rounded-xl border border-neutral-800 bg-neutral-900/25 flex items-start gap-3">
          <Heart className="w-5 h-5 text-amber-500 fill-amber-500/10 shrink-0 mt-0.5" />
          <p className="text-xs text-neutral-400 leading-relaxed">
            By funding this, 100% of profits are wired directly to **Hope House Colorado** supporting teenage parents. Every single garment is carefully assembled of heavy 240GSM cotton.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Custom Options + Simulated Checkout Flow */}
      <div className="lg:col-span-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!isOrdered ? (
            checkoutStep === "customize" ? (
              <motion.div
                key="customize-panel"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-neutral-900 border border-neutral-800 text-amber-400">
                      LIMITED RELEASE
                    </span>
                    <span className="text-xs font-mono text-neutral-500">
                      Standard Domestic Delivery
                    </span>
                  </div>
                  <h3 className="text-3xl font-serif-sub tracking-wide text-neutral-100">
                    Advocacy Campaign Tee
                  </h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-mono text-amber-400">${shirtPrice}.00</span>
                    <span className="text-xs text-neutral-500 line-through font-mono">$40.00</span>
                    <span className="text-xs font-mono text-emerald-400/90 ml-2">100% Profits to Charity</span>
                  </div>
                </div>

                {/* Color Selector */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-mono text-neutral-400 flex items-center justify-between">
                    <span>Selected Color</span>
                    <span className="text-amber-500 text-[11px] font-sans font-medium">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-all transform cursor-pointer flex items-center justify-center ${color.class} ${
                          selectedColor === color.name
                            ? "scale-110 border-amber-500 ring-2 ring-amber-500/20"
                            : "hover:scale-105 border-neutral-800"
                        }`}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <Check 
                            className={`w-3.5 h-3.5 ${
                              color.name === "Vintage White" ? "text-neutral-900" : "text-amber-400"
                            }`} 
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-mono text-neutral-400 flex items-center justify-between">
                    <span>Select Size</span>
                    <span className="text-amber-500 text-[11px] font-sans font-medium">Standard Fit</span>
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 text-xs font-mono rounded cursor-pointer border transition ${
                          selectedSize === size
                            ? "bg-amber-500 border-amber-500 text-neutral-950 font-bold"
                            : "bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4 py-2 border-y border-neutral-900">
                  <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">
                    Quantity
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center font-mono cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-8 h-8 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center font-mono cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Proceed Button */}
                <button
                  id="checkout-proceed-btn"
                  onClick={() => setCheckoutStep("details")}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-neutral-950 font-medium tracking-wide hover:bg-amber-400 transition cursor-pointer self-stretch font-sans shadow-lg shadow-amber-500/10"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Configure Shipping Details & Order</span>
                </button>
              </motion.div>
            ) : (
              /* SHIPPING DETAILS INPUT STEP */
              <motion.form
                key="details-panel"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleCheckoutSubmit}
                className="space-y-4"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("customize")}
                    className="text-xs text-amber-500 hover:text-amber-400 font-medium font-mono"
                  >
                    ← Customize Selection
                  </button>
                  <h4 className="text-xl font-serif-sub tracking-wide text-neutral-100 mt-2">
                    Shipping & Contribution
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    Complete your simulated order checkout safely. No real card details are queried.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-mono text-neutral-400 mb-1">
                      Full Recipient Name
                    </label>
                    <input
                      id="shipping-name-input"
                      type="text"
                      required
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-800 bg-neutral-950 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-mono text-neutral-400 mb-1">
                      Street Address
                    </label>
                    <input
                      id="shipping-address-input"
                      type="text"
                      required
                      value={shippingStreet}
                      onChange={(e) => setShippingStreet(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-800 bg-neutral-950 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-mono text-neutral-400 mb-1">
                        City
                      </label>
                      <input
                        id="shipping-city-input"
                        type="text"
                        required
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-800 bg-neutral-950 text-sm text-neutral-200 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-mono text-neutral-400 mb-1">
                        State
                      </label>
                      <input
                        id="shipping-state-input"
                        type="text"
                        required
                        value={shippingState}
                        onChange={(e) => setShippingState(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-800 bg-neutral-950 text-sm text-neutral-200 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-mono text-neutral-400 mb-1">
                        Zip Code
                      </label>
                      <input
                        id="shipping-zip-input"
                        type="text"
                        required
                        value={shippingZip}
                        onChange={(e) => setShippingZip(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-800 bg-neutral-950 text-sm text-neutral-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/40 border border-neutral-800 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-neutral-300">
                      <input
                        id="gift-wrap-check"
                        type="checkbox"
                        checked={giftWrapping}
                        onChange={(e) => setGiftWrapping(e.target.checked)}
                        className="rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-0"
                      />
                      Add Premium Gift Wrapping (+$5.00)
                    </label>
                    <span className="text-[10px] font-mono text-neutral-500">Includes Custom Envelope</span>
                  </div>
                </div>

                {/* Checkout Summary */}
                <div className="pt-2 border-t border-neutral-900 space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Slogan Print Tee x {quantity}</span>
                    <span className="font-mono">${shirtPrice * quantity}.00</span>
                  </div>
                  {giftWrapping && (
                    <div className="flex justify-between text-neutral-400">
                      <span>Premium Wrapping</span>
                      <span className="font-mono">$5.00</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-400">
                    <span>Advocacy Shipping Charge</span>
                    <span className="font-mono">${deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between text-neutral-200 font-bold border-t border-neutral-900/50 pt-2 text-sm">
                    <span className="flex items-center gap-1.5 font-sans">
                      <Sparkles className="w-4 h-4 text-emerald-400" /> Total Balance
                    </span>
                    <span className="font-mono text-amber-400">${totalPrice}</span>
                  </div>
                </div>

                <button
                  id="checkout-finalize-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl bg-amber-500 text-neutral-950 font-semibold hover:bg-amber-400 transition cursor-pointer self-stretch font-sans"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Wiring Advantage Funds...</span>
                    </>
                  ) : (
                    <span>Submit Simulated Order</span>
                  )}
                </button>
              </motion.form>
            )
          ) : (
            /* ORDER SUCCESS PANEL */
            <motion.div
              key="order-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="space-y-6 text-center border border-dashed border-amber-500/30 rounded-2xl bg-amber-500/5 p-6 md:p-8"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">
                  Order Successfully Registered
                </span>
                <h4 className="text-2xl font-serif-sub tracking-wide text-neutral-100 mt-2 leading-tight">
                  Blessings for your Solidarity!
                </h4>
                <p className="text-sm text-neutral-400 mt-2 max-w-sm mx-auto leading-relaxed">
                  Excellent! We registered order <span className="font-mono text-amber-400 underline font-semibold">{orderId}</span> under <span className="font-semibold text-neutral-200">{shippingName}</span>.
                </p>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Slogan Selected:</span>
                  <span className="text-neutral-300 font-medium italic">"{customText}"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Destination Location:</span>
                  <span className="text-neutral-300 font-medium">
                    {shippingStreet}, {shippingCity}, {shippingState}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Notification Email:</span>
                  <span className="text-neutral-300 font-mono text-[10px]">{userEmail}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-800/80 pt-2 font-semibold">
                  <span className="text-neutral-400">Total Charity Contribution:</span>
                  <span className="text-amber-400 font-mono">${totalPrice}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-amber-400/90 font-mono">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Simulated success. Check orders list history bottom!</span>
              </div>

              <button
                id="reset-checkout-btn"
                onClick={() => {
                  setIsOrdered(false);
                  setCheckoutStep("customize");
                  setQuantity(1);
                  setGiftWrapping(false);
                }}
                className="px-5 py-2.5 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-xs font-mono text-neutral-300 hover:text-white transition cursor-pointer"
              >
                Buy Another Slogan Tee
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
