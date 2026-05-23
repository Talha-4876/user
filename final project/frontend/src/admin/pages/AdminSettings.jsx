import React, { useState } from "react";
import { toast } from "react-toastify";

// ─── Section wrapper ───────────────────────────────────────────
const Section = ({ icon, title, subtitle, children }) => (
  <div className="bg-[#0f0f12] border border-white/[0.07] rounded-2xl overflow-hidden mb-5">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.07]">
      <div className="w-9 h-9 rounded-xl bg-orange-400/10 border border-orange-400/20
        flex items-center justify-center text-lg shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[14px] font-semibold text-neutral-200">{title}</p>
        <p className="text-[11px] text-neutral-600 mt-0.5">{subtitle}</p>
      </div>
    </div>
    <div className="px-6 py-5 space-y-4">{children}</div>
  </div>
);

// ─── Input field ───────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
  <div className="grid grid-cols-[200px_1fr] items-start gap-6">
    <div className="pt-1">
      <p className="text-[13px] font-medium text-neutral-300">{label}</p>
      {hint && <p className="text-[11px] text-neutral-600 mt-0.5 leading-snug">{hint}</p>}
    </div>
    <div>{children}</div>
  </div>
);

// ─── Reusable styled input ─────────────────────────────────────
const Input = (props) => (
  <input
    {...props}
    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
      px-4 py-2.5 text-[13px] text-neutral-200 placeholder-neutral-700
      outline-none focus:border-orange-400/40 focus:bg-white/[0.06]
      transition-all font-sans"
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    rows={3}
    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
      px-4 py-2.5 text-[13px] text-neutral-200 placeholder-neutral-700
      outline-none focus:border-orange-400/40 focus:bg-white/[0.06]
      transition-all font-sans resize-none"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full bg-[#1a1a1f] border border-white/[0.08] rounded-xl
      px-4 py-2.5 text-[13px] text-neutral-200
      outline-none focus:border-orange-400/40
      transition-all font-sans cursor-pointer"
  >
    {children}
  </select>
);

// ─── Toggle switch ─────────────────────────────────────────────
const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0
      ${checked ? "bg-orange-500" : "bg-white/10"}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white
      shadow transition-transform duration-300
      ${checked ? "translate-x-5" : "translate-x-0"}`} />
  </button>
);

// ─── Tab button ────────────────────────────────────────────────
const Tab = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium
      transition-all duration-200 whitespace-nowrap
      ${active
        ? "bg-orange-500/10 border border-orange-400/25 text-orange-400"
        : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]"
      }`}
  >
    <span>{icon}</span> {label}
  </button>
);

// ══════════════════════════════════════════════════════════════
//  MAIN SETTINGS PAGE
// ══════════════════════════════════════════════════════════════
const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("restaurant");

  // ── Restaurant Info ──
  const [info, setInfo] = useState({
    name: "Savoria Restaurant",
    tagline: "Fine Dining & Takeaway",
    email: "contact@savoria.com",
    phone: "+92 300 1234567",
    address: "Plot 12, F-7 Markaz, Islamabad",
    city: "Islamabad",
    country: "Pakistan",
    website: "https://savoria.com",
    description: "A premier dining experience with authentic flavors.",
    taxNumber: "NTN-1234567",
    currency: "PKR",
    timezone: "Asia/Karachi",
    language: "en",
  });

  // ── Hours ──
  const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const [hours, setHours] = useState(
    DAYS.reduce((acc, d) => ({
      ...acc,
      [d]: { open: true, from: "09:00", to: "23:00" },
    }), {})
  );

  // ── Operations ──
  const [ops, setOps] = useState({
    dineIn: true,
    takeaway: true,
    delivery: true,
    reservations: true,
    maxCapacity: "120",
    maxTableSize: "12",
    reservationBuffer: "15",
    autoConfirmReservations: false,
    requireDeposit: false,
    depositAmount: "500",
    deliveryRadius: "10",
    minOrderAmount: "300",
    deliveryFee: "100",
    freeDeliveryAbove: "1500",
    estimatedDeliveryTime: "30-45",
    prepTime: "20",
  });

  // ── Menu & Pricing ──
  const [menu, setMenu] = useState({
    gst: "17",
    serviceCharge: "5",
    showCalories: true,
    showAllergens: true,
    allowSpecialRequests: true,
    menuPdfUrl: "",
  });

  // ── Notifications ──
  const [notif, setNotif] = useState({
    newOrder: true,
    newReservation: true,
    lowStock: true,
    newReview: true,
    deliveryUpdate: false,
    dailySummary: true,
    notifEmail: "admin@savoria.com",
    notifPhone: "+92 300 1234567",
    soundAlerts: true,
  });

  // ── Account ──
  const rawUser = JSON.parse(localStorage.getItem("adminUser")) || {};
  const [account, setAccount] = useState({
    name:  rawUser.name  || "Admin",
    email: rawUser.email || "",
    role:  rawUser.role  || "Admin",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = (section) => {
    toast.success(`${section} settings saved!`);
  };

  const handlePasswordChange = () => {
    if (!account.newPassword) return toast.error("Enter new password");
    if (account.newPassword !== account.confirmPassword)
      return toast.error("Passwords do not match");
    toast.success("Password updated successfully!");
    setAccount((p) => ({ ...p, currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  const TABS = [
    { id: "restaurant", icon: "🍽",  label: "Restaurant"    },
    { id: "hours",      icon: "🕐",  label: "Hours"         },
    { id: "operations", icon: "⚙️",  label: "Operations"    },
    { id: "menu",       icon: "📋",  label: "Menu & Tax"    },
    { id: "notif",      icon: "🔔",  label: "Notifications" },
    { id: "account",    icon: "👤",  label: "Account"       },
  ];

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[22px] font-bold text-neutral-100">Settings</h2>
        <p className="text-[12px] text-neutral-600 mt-1">
          Manage your restaurant configuration and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap mb-6 p-1.5 bg-[#0f0f12] border border-white/[0.07] rounded-2xl">
        {TABS.map((t) => (
          <Tab key={t.id} active={activeTab === t.id}
            onClick={() => setActiveTab(t.id)} icon={t.icon} label={t.label} />
        ))}
      </div>

      {/* ── TAB: Restaurant Info ── */}
      {activeTab === "restaurant" && (
        <>
          <Section icon="🏪" title="Restaurant Identity"
            subtitle="Your restaurant's public-facing information">
            <Field label="Restaurant Name" hint="Shown on receipts and customer portal">
              <Input value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
            </Field>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Tagline" hint="Short description shown on your menu">
                <Input value={info.tagline} onChange={(e) => setInfo({ ...info, tagline: e.target.value })} />
              </Field>
            </div>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Description" hint="About your restaurant">
                <Textarea value={info.description} onChange={(e) => setInfo({ ...info, description: e.target.value })} />
              </Field>
            </div>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Website">
                <Input value={info.website} onChange={(e) => setInfo({ ...info, website: e.target.value })} />
              </Field>
            </div>
          </Section>

          <Section icon="📞" title="Contact & Location"
            subtitle="Address and contact details">
            <Field label="Email">
              <Input type="email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
            </Field>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Phone Number">
                <Input value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} />
              </Field>
            </div>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Address">
                <Input value={info.address} onChange={(e) => setInfo({ ...info, address: e.target.value })} />
              </Field>
            </div>
            <div className="border-t border-white/[0.05] pt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[12px] text-neutral-500 mb-1.5">City</p>
                <Input value={info.city} onChange={(e) => setInfo({ ...info, city: e.target.value })} />
              </div>
              <div>
                <p className="text-[12px] text-neutral-500 mb-1.5">Country</p>
                <Input value={info.country} onChange={(e) => setInfo({ ...info, country: e.target.value })} />
              </div>
            </div>
          </Section>

          <Section icon="💼" title="Legal & Regional"
            subtitle="Tax, currency and locale settings">
            <Field label="Tax / NTN Number">
              <Input value={info.taxNumber} onChange={(e) => setInfo({ ...info, taxNumber: e.target.value })} />
            </Field>
            <div className="border-t border-white/[0.05] pt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-[12px] text-neutral-500 mb-1.5">Currency</p>
                <Select value={info.currency} onChange={(e) => setInfo({ ...info, currency: e.target.value })}>
                  <option value="PKR">PKR — Pakistani Rupee</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="AED">AED — UAE Dirham</option>
                  <option value="GBP">GBP — British Pound</option>
                </Select>
              </div>
              <div>
                <p className="text-[12px] text-neutral-500 mb-1.5">Timezone</p>
                <Select value={info.timezone} onChange={(e) => setInfo({ ...info, timezone: e.target.value })}>
                  <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </Select>
              </div>
              <div>
                <p className="text-[12px] text-neutral-500 mb-1.5">Language</p>
                <Select value={info.language} onChange={(e) => setInfo({ ...info, language: e.target.value })}>
                  <option value="en">English</option>
                  <option value="ur">Urdu</option>
                  <option value="ar">Arabic</option>
                </Select>
              </div>
            </div>
          </Section>

          <button onClick={() => handleSave("Restaurant")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500
              hover:from-orange-400 hover:to-red-400 text-white font-semibold text-[14px]
              transition-all shadow-lg shadow-orange-500/10">
            Save Restaurant Settings
          </button>
        </>
      )}

      {/* ── TAB: Business Hours ── */}
      {activeTab === "hours" && (
        <>
          <Section icon="🕐" title="Business Hours"
            subtitle="Set your opening and closing times for each day">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center gap-4 py-2 border-b border-white/[0.04] last:border-0">
                <p className="text-[13px] text-neutral-300 w-28 shrink-0">{day}</p>
                <Toggle
                  checked={hours[day].open}
                  onChange={(v) => setHours({ ...hours, [day]: { ...hours[day], open: v } })}
                />
                {hours[day].open ? (
                  <div className="flex items-center gap-3 flex-1">
                    <Input
                      type="time"
                      value={hours[day].from}
                      onChange={(e) => setHours({ ...hours, [day]: { ...hours[day], from: e.target.value } })}
                    />
                    <span className="text-neutral-600 text-sm shrink-0">to</span>
                    <Input
                      type="time"
                      value={hours[day].to}
                      onChange={(e) => setHours({ ...hours, [day]: { ...hours[day], to: e.target.value } })}
                    />
                  </div>
                ) : (
                  <span className="text-[12px] text-red-400/70 font-medium">Closed</span>
                )}
              </div>
            ))}
          </Section>

          <button onClick={() => handleSave("Hours")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500
              hover:from-orange-400 hover:to-red-400 text-white font-semibold text-[14px] transition-all">
            Save Hours
          </button>
        </>
      )}

      {/* ── TAB: Operations ── */}
      {activeTab === "operations" && (
        <>
          <Section icon="🍴" title="Service Modes"
            subtitle="Enable or disable service types">
            {[
              { key: "dineIn",       label: "Dine-In",      hint: "Customers eat at the restaurant" },
              { key: "takeaway",     label: "Takeaway",     hint: "Customers pick up their order" },
              { key: "delivery",     label: "Delivery",     hint: "Orders delivered to customer" },
              { key: "reservations", label: "Reservations", hint: "Allow table bookings" },
            ].map(({ key, label, hint }) => (
              <div key={key} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                <div>
                  <p className="text-[13px] font-medium text-neutral-200">{label}</p>
                  <p className="text-[11px] text-neutral-600">{hint}</p>
                </div>
                <Toggle checked={ops[key]} onChange={(v) => setOps({ ...ops, [key]: v })} />
              </div>
            ))}
          </Section>

          <Section icon="🪑" title="Dine-In & Reservations"
            subtitle="Table and booking configuration">
            <Field label="Max Seating Capacity" hint="Total seats in the restaurant">
              <Input type="number" value={ops.maxCapacity}
                onChange={(e) => setOps({ ...ops, maxCapacity: e.target.value })} />
            </Field>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Max Table Size" hint="Largest party size allowed">
                <Input type="number" value={ops.maxTableSize}
                  onChange={(e) => setOps({ ...ops, maxTableSize: e.target.value })} />
              </Field>
            </div>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Buffer Time (mins)" hint="Gap between reservations">
                <Input type="number" value={ops.reservationBuffer}
                  onChange={(e) => setOps({ ...ops, reservationBuffer: e.target.value })} />
              </Field>
            </div>
            <div className="border-t border-white/[0.05] pt-4 space-y-3">
              {[
                { key: "autoConfirmReservations", label: "Auto-confirm reservations" },
                { key: "requireDeposit",          label: "Require booking deposit" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <p className="text-[13px] text-neutral-300">{label}</p>
                  <Toggle checked={ops[key]} onChange={(v) => setOps({ ...ops, [key]: v })} />
                </div>
              ))}
            </div>
            {ops.requireDeposit && (
              <div className="border-t border-white/[0.05] pt-4">
                <Field label="Deposit Amount (PKR)">
                  <Input type="number" value={ops.depositAmount}
                    onChange={(e) => setOps({ ...ops, depositAmount: e.target.value })} />
                </Field>
              </div>
            )}
          </Section>

          <Section icon="🚚" title="Delivery Settings"
            subtitle="Delivery zones, fees and timing">
            <Field label="Delivery Radius (km)">
              <Input type="number" value={ops.deliveryRadius}
                onChange={(e) => setOps({ ...ops, deliveryRadius: e.target.value })} />
            </Field>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Min Order Amount (PKR)">
                <Input type="number" value={ops.minOrderAmount}
                  onChange={(e) => setOps({ ...ops, minOrderAmount: e.target.value })} />
              </Field>
            </div>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Delivery Fee (PKR)">
                <Input type="number" value={ops.deliveryFee}
                  onChange={(e) => setOps({ ...ops, deliveryFee: e.target.value })} />
              </Field>
            </div>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Free Delivery Above (PKR)">
                <Input type="number" value={ops.freeDeliveryAbove}
                  onChange={(e) => setOps({ ...ops, freeDeliveryAbove: e.target.value })} />
              </Field>
            </div>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Est. Delivery Time" hint="Shown to customer (e.g. 30-45)">
                <div className="flex items-center gap-2">
                  <Input value={ops.estimatedDeliveryTime}
                    onChange={(e) => setOps({ ...ops, estimatedDeliveryTime: e.target.value })} />
                  <span className="text-neutral-600 text-[12px] shrink-0">mins</span>
                </div>
              </Field>
            </div>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Avg. Prep Time" hint="Kitchen preparation time">
                <div className="flex items-center gap-2">
                  <Input type="number" value={ops.prepTime}
                    onChange={(e) => setOps({ ...ops, prepTime: e.target.value })} />
                  <span className="text-neutral-600 text-[12px] shrink-0">mins</span>
                </div>
              </Field>
            </div>
          </Section>

          <button onClick={() => handleSave("Operations")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500
              hover:from-orange-400 hover:to-red-400 text-white font-semibold text-[14px] transition-all">
            Save Operations
          </button>
        </>
      )}

      {/* ── TAB: Menu & Tax ── */}
      {activeTab === "menu" && (
        <>
          <Section icon="💰" title="Tax & Charges"
            subtitle="GST and service charge configuration">
            <Field label="GST (%)" hint="Government Sales Tax">
              <Input type="number" value={menu.gst}
                onChange={(e) => setMenu({ ...menu, gst: e.target.value })} />
            </Field>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Service Charge (%)" hint="Added to every bill">
                <Input type="number" value={menu.serviceCharge}
                  onChange={(e) => setMenu({ ...menu, serviceCharge: e.target.value })} />
              </Field>
            </div>
          </Section>

          <Section icon="🥗" title="Menu Display Options"
            subtitle="What customers see on the menu">
            {[
              { key: "showCalories",         label: "Show calorie count",        hint: "Display kcal per dish" },
              { key: "showAllergens",         label: "Show allergen info",        hint: "Nuts, gluten, dairy etc." },
              { key: "allowSpecialRequests",  label: "Allow special requests",    hint: "Customers can add notes" },
            ].map(({ key, label, hint }) => (
              <div key={key} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                <div>
                  <p className="text-[13px] font-medium text-neutral-200">{label}</p>
                  <p className="text-[11px] text-neutral-600">{hint}</p>
                </div>
                <Toggle checked={menu[key]} onChange={(v) => setMenu({ ...menu, [key]: v })} />
              </div>
            ))}
          </Section>

          <Section icon="📄" title="Menu PDF"
            subtitle="Upload a PDF version of your menu">
            <Field label="Menu PDF URL" hint="Link to hosted PDF or upload path">
              <Input placeholder="https://savoria.com/menu.pdf" value={menu.menuPdfUrl}
                onChange={(e) => setMenu({ ...menu, menuPdfUrl: e.target.value })} />
            </Field>
          </Section>

          <button onClick={() => handleSave("Menu & Tax")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500
              hover:from-orange-400 hover:to-red-400 text-white font-semibold text-[14px] transition-all">
            Save Menu Settings
          </button>
        </>
      )}

      {/* ── TAB: Notifications ── */}
      {activeTab === "notif" && (
        <>
          <Section icon="🔔" title="Alert Preferences"
            subtitle="Choose what triggers a notification">
            {[
              { key: "newOrder",        label: "New Order",           hint: "When a new order is placed" },
              { key: "newReservation",  label: "New Reservation",     hint: "When a table is booked" },
              { key: "lowStock",        label: "Low Inventory Alert", hint: "When stock drops below threshold" },
              { key: "newReview",       label: "New Review",          hint: "When a customer leaves a review" },
              { key: "deliveryUpdate",  label: "Delivery Updates",    hint: "Status changes on deliveries" },
              { key: "dailySummary",    label: "Daily Summary",       hint: "End-of-day revenue report" },
              { key: "soundAlerts",     label: "Sound Alerts",        hint: "Play sound for new orders" },
            ].map(({ key, label, hint }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div>
                  <p className="text-[13px] font-medium text-neutral-200">{label}</p>
                  <p className="text-[11px] text-neutral-600">{hint}</p>
                </div>
                <Toggle checked={notif[key]} onChange={(v) => setNotif({ ...notif, [key]: v })} />
              </div>
            ))}
          </Section>

          <Section icon="📬" title="Notification Recipients"
            subtitle="Where to send alerts">
            <Field label="Notification Email">
              <Input type="email" value={notif.notifEmail}
                onChange={(e) => setNotif({ ...notif, notifEmail: e.target.value })} />
            </Field>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="SMS / WhatsApp Number">
                <Input value={notif.notifPhone}
                  onChange={(e) => setNotif({ ...notif, notifPhone: e.target.value })} />
              </Field>
            </div>
          </Section>

          <button onClick={() => handleSave("Notifications")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500
              hover:from-orange-400 hover:to-red-400 text-white font-semibold text-[14px] transition-all">
            Save Notifications
          </button>
        </>
      )}

      {/* ── TAB: Account ── */}
      {activeTab === "account" && (
        <>
          <Section icon="👤" title="Profile Information"
            subtitle="Your admin account details">
            <Field label="Full Name">
              <Input value={account.name}
                onChange={(e) => setAccount({ ...account, name: e.target.value })} />
            </Field>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Email Address">
                <Input type="email" value={account.email}
                  onChange={(e) => setAccount({ ...account, email: e.target.value })} />
              </Field>
            </div>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Role">
                <Input value={account.role} disabled
                  className="opacity-50 cursor-not-allowed" />
              </Field>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  localStorage.setItem("adminUser", JSON.stringify({
                    name:  account.name,
                    email: account.email,
                    role:  account.role,
                  }));
                  toast.success("Profile updated!");
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500
                  hover:from-orange-400 hover:to-red-400 text-white font-semibold text-[13px] transition-all"
              >
                Update Profile
              </button>
            </div>
          </Section>

          <Section icon="🔐" title="Change Password"
            subtitle="Update your login password">
            <Field label="Current Password">
              <Input type="password" placeholder="••••••••"
                value={account.currentPassword}
                onChange={(e) => setAccount({ ...account, currentPassword: e.target.value })} />
            </Field>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="New Password">
                <Input type="password" placeholder="••••••••"
                  value={account.newPassword}
                  onChange={(e) => setAccount({ ...account, newPassword: e.target.value })} />
              </Field>
            </div>
            <div className="border-t border-white/[0.05] pt-4">
              <Field label="Confirm Password">
                <Input type="password" placeholder="••••••••"
                  value={account.confirmPassword}
                  onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })} />
              </Field>
            </div>
            <div className="pt-2">
              <button onClick={handlePasswordChange}
                className="px-5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08]
                  hover:border-orange-400/30 text-neutral-200 font-semibold text-[13px] transition-all">
                Change Password
              </button>
            </div>
          </Section>

          {/* Danger Zone */}
          <div className="bg-red-500/[0.04] border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20
                flex items-center justify-center text-lg">⚠️</div>
              <div>
                <p className="text-[14px] font-semibold text-red-400">Danger Zone</p>
                <p className="text-[11px] text-neutral-600">Irreversible actions</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-red-500/10">
              <div>
                <p className="text-[13px] font-medium text-neutral-300">Clear all settings</p>
                <p className="text-[11px] text-neutral-600">Reset everything to default</p>
              </div>
              <button
                onClick={() => toast.warn("This action is irreversible!")}
                className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400
                  text-[12px] font-semibold hover:bg-red-500/10 transition-all">
                Reset
              </button>
            </div>
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-[13px] font-medium text-neutral-300">Delete admin account</p>
                <p className="text-[11px] text-neutral-600">Permanently remove this account</p>
              </div>
              <button
                onClick={() => toast.error("Contact super admin to delete account")}
                className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400
                  text-[12px] font-semibold hover:bg-red-500/10 transition-all">
                Delete
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default AdminSettings;