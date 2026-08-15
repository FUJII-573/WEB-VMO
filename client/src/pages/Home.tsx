import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Settings } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

// Types Definition
type MenuItem = {
  id: number;
  category: string;
  name: { th: string };
  price: number;
  img: string;
};

type CartItem = MenuItem & {
  qty: number;
};

// Global AudioContext Instance
let audioCtx: AudioContext | null = null;

const playClickSound = () => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    console.error("Audio error:", e);
  }
};

export default function Home() {
  const { user } = useAuth();
  const { theme, toggleTheme, switchable } = useTheme();
  const [, setLocation] = useLocation();

  /* Employee List */
  const employees = [
    "Luther_Alexei_Morozov",
    "Jann_Burrell",
    "Kenji_Oyama",
    "Tsukuyomi_Takuya",
    "Shikishima_Sendou",
    "Marco_Tempesta",
    "Draco_banks",
    "Jason Aoapo",
    "Ryan cooper",
    "Nash Wilder",
    "Yume Kawasumi",
    "Edgar_Malone",
    "Hiran Swagger",
  ];

  /* State Management */
  const [employee, setEmployee] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("custom");
  const [search, setSearch] = useState("");
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stock, setStock] = useState<Record<number, number>>({
    101: 4, 102: 1, 103: 7, 104: 38, 105: 0, 106: 11, 107: 32, 108: 4,
    201: 18, 202: 14, 203: 16, 204: 81, 205: 59, 206: 15, 207: 20, 208: 14, 209: 15,
    301: 19, 302: 353, 303: 20, 304: 13, 305: 13, 306: 21, 307: 18, 308: 59, 309: 14, 310: 13, 311: 63, 312: 482, 313: 19,
  });
  
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* Menu Items Data */
  const menuData: MenuItem[] = [
    // CUSTOMS
    { id: 101, category: "custom", name: { th: "Performance Parts" }, price: 10000, img: "https://i.postimg.cc/1RddG9fz/Performance-Parts.png" },
    { id: 104, category: "custom", name: { th: "Cosmetic Parts" }, price: 1000, img: "https://i.postimg.cc/QNzzQXHD/Cosmetic-Parts.png" },
    { id: 107, category: "custom", name: { th: "Respray Kit" }, price: 2000, img: "https://i.postimg.cc/2jttQzVV/Respray-Kit.png" },
    { id: 103, category: "custom", name: { th: "Vehicle Wheels Set" }, price: 2000, img: "https://i.postimg.cc/rFtPgvrp/Vehicle-Wheels.png" },
    { id: 106, category: "custom", name: { th: "Extras_Kit" }, price: 1000, img: "https://i.postimg.cc/VshhqYdf/Extras-Kit.png" },
    { id: 102, category: "custom", name: { th: "Stancer Kit" }, price: 1000, img: "https://i.postimg.cc/tRcc3XYs/Stancer-Kit.png" },
    { id: 108, category: "custom", name: { th: "Carplay" }, price: 2000, img: "https://img1.pic.in.th/images/Screenshot-2026-04-12-041049.png" },

    // Core Parts
    { id: 201, category: "Core Parts", name: { th: "Repair Kit" }, price: 300, img: "https://i.postimg.cc/2jttQzV3/Repair-Kit.png" },
    { id: 206, category: "Core Parts", name: { th: "Alternator" }, price: 600, img: "https://i.postimg.cc/WpyyG2hL/Alternator.png" },
    { id: 209, category: "Core Parts", name: { th: "Brakes" }, price: 600, img: "https://i.postimg.cc/sfLLYVvR/Brakes.png" },
    { id: 202, category: "Core Parts", name: { th: "Fuel Injector" }, price: 600, img: "https://i.postimg.cc/bY55xzsY/Fuel-Injector.png" },
    { id: 203, category: "Core Parts", name: { th: "Power Steering Pump" }, price: 600, img: "https://i.postimg.cc/QNzzQXHt/Power-Steering-Pum.png" },
    { id: 207, category: "Core Parts", name: { th: "Radiator" }, price: 600, img: "https://i.postimg.cc/L4WWtHn5/Radiator.png" },
    { id: 208, category: "Core Parts", name: { th: "Transmission" }, price: 600, img: "https://i.postimg.cc/BQ1VNdKn/Transmission.png" },
    { id: 205, category: "Core Parts", name: { th: "EV Battery" }, price: 600, img: "https://i.postimg.cc/h4YYLSfK/EV-Battery.png" },
    { id: 204, category: "Core Parts", name: { th: "Electric Motor" }, price: 600, img: "https://i.postimg.cc/QNzzQXHh/Electric-Motor.png" },

    // Service
    { id: 312, category: "Service", name: { th: "Air Filter" }, price: 400, img: "https://i.postimg.cc/sfLLYV1k/Air-Filter.png" },
    { id: 310, category: "Service", name: { th: "Brake Fluid" }, price: 400, img: "https://i.postimg.cc/xjZZv0cr/Brake-Fluid.png" },
    { id: 305, category: "Service", name: { th: "Brake Pads" }, price: 400, img: "https://i.postimg.cc/Pf77WtPn/Brake-Pads.png" },
    { id: 309, category: "Service", name: { th: "Coolant" }, price: 400, img: "https://i.postimg.cc/bY55xzsh/Coolant.png" },
    { id: 304, category: "Service", name: { th: "Drive Belt" }, price: 400, img: "https://i.postimg.cc/tRcc3XYy/Drive-Belt.png" },
    { id: 303, category: "Service", name: { th: "Fuel Filter" }, price: 400, img: "https://i.postimg.cc/bY55xzsz/Fuel-Filter.png" },
    { id: 302, category: "Service", name: { th: "Oil Filter" }, price: 400, img: "https://i.postimg.cc/0544Y8b2/Oil-Filter.png" },
    { id: 306, category: "Service", name: { th: "Steering Fluid" }, price: 400, img: "https://i.postimg.cc/kMHHQnBt/Steering-Fluid.png" },
    { id: 307, category: "Service", name: { th: "Spark Plugs" }, price: 400, img: "https://i.postimg.cc/G3ffFcHB/Spark-Plugs.png" },
    { id: 301, category: "Service", name: { th: "Tires" }, price: 400, img: "https://i.postimg.cc/ryHH18Kr/Tires.png" },
    { id: 313, category: "Service", name: { th: "Transmission Fluid" }, price: 400, img: "https://i.postimg.cc/xTb4gWzT/Transmission-Fluid.png" },
    { id: 311, category: "Service", name: { th: "Battery Coolant" }, price: 400, img: "https://img1.pic.in.th/images/Screenshot-2026-04-06-212515.png" },
    { id: 308, category: "Service", name: { th: "High Voltage Wiring" }, price: 400, img: "https://img2.pic.in.th/Screenshot-2026-04-06-212429.png" },
  ];

  /* Fetch Stock */
  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbyiDOq89bHfEiip0TZS08RnqBvAn71XKvthICWiUbBMtCB9_TOD85MTVV38Bv7J1PpQUA/exec"
        );
        const data = await response.json();
        
        const map: Record<number, number> = {};
        data.forEach((i: any) => {
          map[i.id] = i.qty;
        });
        setStock(map);
      } catch (error) {
        console.error("Error fetching stock:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStock();
  }, []);

  /* Auto Reset & Auto Hide Popup */
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => {
      setSubmitted(false);
      setSending(false);
      setCart([]);
      setNote("");
      setEmployee("");
    }, 2000);
    return () => clearTimeout(t);
  }, [submitted]);

  useEffect(() => {
    if (!popup) return;
    const t = setTimeout(() => setPopup(""), 2000);
    return () => clearTimeout(t);
  }, [popup]);

  /* Cart Operations */
  const add = (item: MenuItem) => {
    const current = cart.find((i) => i.id === item.id)?.qty || 0;
    const max = stock[item.id] || 0;

    if (current >= max) {
      setPopup("ของไม่พอ");
      playClickSound();
      return;
    }
    
    playClickSound();
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: Math.min(p.qty + 1, max) } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const minus = (id: number) => {
    playClickSound();
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: p.qty - 1 } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const changeQty = (id: number, val: number) => {
    const max = stock[id] || 0;
    let targetQty = val;
    if (targetQty < 1) targetQty = 1;
    if (targetQty > max) targetQty = max;

    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: targetQty } : p)));
  };

  /* Filtered Menu */
  const filtered = menuData
    .filter((item) => item.category === category)
    .filter((item) => item.name.th.toLowerCase().includes(search.toLowerCase()));

  /* Total Price */
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  /* Submit Handlers */
  const handleSubmitClick = () => {
    if (!employee || employee === "เลือกผู้เบิก") {
      setPopup("เลือกชื่อผู้เบิก");
      playClickSound();
      return;
    }

    if (cart.length === 0) {
      setPopup("ไม่มีสินค้าในรายการ");
      playClickSound();
      return;
    }

    playClickSound();
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    playClickSound();
    setShowConfirm(false);
    setSending(true);

    const orderSummary = cart.map((i) => `${i.name.th} x ${i.qty}`).join(", ");

    try {
      // 1. บันทึกลงระบบ Backend (tRPC)
      await fetch("/api/trpc/requisitions.create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: {
            employeeName: employee,
            items: JSON.stringify(
              cart.map((i) => ({ id: i.id, name: i.name.th, price: i.price, qty: i.qty }))
            ),
            totalAmount: total,
            note: note || undefined,
          },
        }),
      });

      // 2. บันทึกลง Google Sheets
      await fetch(
        "https://script.google.com/macros/s/AKfycbyiDOq89bHfEiip0TZS08RnqBvAn71XKvthICWiUbBMtCB9_TOD85MTVV38Bv7J1PpQUA/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: new URLSearchParams({
            employee,
            order: orderSummary,
            note,
            total: total.toString(),
            cart: JSON.stringify(cart.map((i) => ({ id: i.id, qty: i.qty }))),
          }),
        }
      );

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting requisition:", error);
      setPopup("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSending(false);
    }
  };

  const cancelSubmit = () => {
    playClickSound();
    setShowConfirm(false);
  };

  if (submitted) return <div style={successBox}>เบิกสำเร็จเรียบร้อย</div>;

  return (
    <div style={page}>
      {loading && (
        <div style={loadingOverlay}>
          <div style={spinner} />
        </div>
      )}

      {/* Top Bar Navigation Controls */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000, display: "flex", gap: "8px" }}>
        {user?.role === "admin" && (
          <button
            onClick={() => setLocation("/admin")}
            style={actionBtnStyle("#0d47a1")}
            title="Admin Dashboard"
          >
            <Settings size={18} />
            Admin
          </button>
        )}

        <button
          onClick={() => setLocation("/history")}
          style={actionBtnStyle("#e53935")}
          title="ประวัติการเบิก"
        >
          📋 ประวัติ
        </button>

        {switchable && toggleTheme && (
          <button
            onClick={toggleTheme}
            style={{
              ...actionBtnStyle(theme === "dark" ? "#FFD700" : "#333"),
              color: theme === "dark" ? "#333" : "#FFD700",
            }}
            title={theme === "dark" ? "โหมดกลางวัน" : "โหมดกลางคืน"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        )}
      </div>

      <h2 style={title}>𝐕.𝐌.𝐎. 𝐋𝐔𝐂𝐊𝐘 𝐒𝐏𝐄𝐄𝐃 𝐂𝐔𝐒𝐓𝐎𝐌</h2>
      <p style={{ color: "#e53935", fontSize: "14px", fontWeight: "bold", margin: "4px 0 16px" }}>
        *กดรีเฟรชทุกครั้ง ก่อนกดเบิกสินค้า
      </p>

      {/* Employee Selector */}
      <select
        value={employee}
        onChange={(e) => setEmployee(e.target.value)}
        style={inputStyle}
      >
        <option value="">-- เลือกผู้เบิก --</option>
        {employees.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>

      {/* Category Tabs */}
      <div style={tabsStyle}>
        {["custom", "Core Parts", "Service"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={tabStyle(category === cat)}
          >
            {cat === "custom" ? "Customs" : cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <input
        placeholder="🔍 ค้นหาอะไหล่..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputStyle}
      />

      {/* Menu Cards Container */}
      <div style={cardContainerStyle}>
        {filtered.map((item) => {
          const remStock = stock[item.id] ?? 0;
          const isOutOfStock = remStock === 0;
          return (
            <div key={item.id} style={cardStyle}>
              <img src={item.img} alt={item.name.th} style={imgStyle} />
              <div style={{ marginTop: 8, width: "100%" }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name.th}</div>
                <div style={{ fontSize: 12, color: "#e53935", fontWeight: "bold", marginTop: 2 }}>
                  {item.price.toLocaleString()} ฿
                </div>
                <div style={{ fontSize: 11, color: remStock < 5 ? "#e53935" : "#666", marginTop: 2 }}>
                  คงเหลือ {remStock} ชิ้น
                </div>
                <button
                  onClick={() => add(item)}
                  disabled={isOutOfStock}
                  style={{
                    ...addBtnStyle,
                    opacity: isOutOfStock ? 0.4 : 1,
                    cursor: isOutOfStock ? "not-allowed" : "pointer",
                  }}
                >
                  {isOutOfStock ? "หมด" : "เพิ่ม"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <h3 style={{ marginTop: 24, borderBottom: "2px solid #0d47a1", paddingBottom: 6 }}>
        🛒 รายการเบิกสินค้า
      </h3>

      {cart.length === 0 ? (
        <div style={{ color: "#888", textAlign: "center", padding: "20px 0" }}>
          ยังไม่มีสินค้าในตะกร้า
        </div>
      ) : (
        cart.map((i) => (
          <div key={i.id} style={cartRowStyle}>
            <span style={{ fontWeight: 500 }}>{i.name.th}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button onClick={() => minus(i.id)} style={qtyBtnStyle}>
                -
              </button>
              <input
                type="number"
                value={i.qty}
                min={1}
                max={stock[i.id] || 1}
                onChange={(e) => changeQty(i.id, Number(e.target.value))}
                style={qtyInputStyle}
              />
              <button onClick={() => add(i)} style={qtyBtnStyle}>
                +
              </button>
            </div>
          </div>
        ))
      )}

      <h2 style={{ textAlign: "right", color: "#0d47a1", marginTop: 16 }}>
        รวมทั้งหมด: {total.toLocaleString()} ฿
      </h2>

      <textarea
        placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ ...inputStyle, height: "70px", resize: "none" }}
      />

      <button onClick={handleSubmitClick} disabled={sending} style={submitBtnStyle}>
        {sending ? "กำลังส่งข้อมูล..." : "ยืนยันการเบิกสินค้า"}
      </button>

      {/* Popups & Dialogs */}
      {popup && (
        <div style={popupBgStyle}>
          <div style={popupBoxStyle}>{popup}</div>
        </div>
      )}

      {showConfirm && (
        <div style={{ ...popupBgStyle, background: "rgba(0,0,0,0.7)" }}>
          <div style={confirmBoxStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, color: "#0d47a1" }}>ยืนยันรายการเบิก</h3>
            <p style={{ marginBottom: 12 }}>
              ผู้เบิก: <strong>{employee}</strong>
            </p>
            <div style={confirmListStyle}>
              {cart.map((i) => (
                <div key={i.id} style={confirmRowStyle}>
                  <span>{i.name.th}</span>
                  <span>
                    <strong>x{i.qty}</strong> = {(i.price * i.qty).toLocaleString()} ฿
                  </span>
                </div>
              ))}
              <div style={confirmTotalStyle}>
                <span>ยอดรวมสุทธิ:</span>
                <span>{total.toLocaleString()} ฿</span>
              </div>
            </div>
            {note && (
              <div style={noteBoxStyle}>
                <strong>หมายเหตุ:</strong> {note}
              </div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={confirmSubmit} style={{ ...dialogBtnStyle, background: "#0d47a1" }}>
                ยืนยันส่งเบิก
              </button>
              <button onClick={cancelSubmit} style={{ ...dialogBtnStyle, background: "#888" }}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= Inline Style Definitions ================= */

const page: React.CSSProperties = {
  maxWidth: "700px",
  margin: "auto",
  padding: 16,
  background: "var(--background, #f9f9f9)",
  color: "var(--foreground, #333)",
  fontFamily: "'Poppins', sans-serif",
  minHeight: "100vh",
};

const title: React.CSSProperties = {
  color: "#0d47a1",
  marginTop: 0,
  fontSize: "22px",
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 8,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "#fff",
  color: "#333",
  boxSizing: "border-box",
};

const tabsStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  marginTop: 12,
  marginBottom: 4,
};

const tabStyle = (active: boolean): React.CSSProperties => ({
  background: active ? "#0d47a1" : "#e0e0e0",
  color: active ? "#fff" : "#333",
  border: "none",
  padding: "8px 16px",
  borderRadius: 20,
  cursor: "pointer",
  fontWeight: active ? 600 : 400,
  transition: "all 0.2s ease",
});

const cardContainerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
  gap: 10,
  marginTop: 12,
};

const cardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  background: "#fff",
  padding: 10,
  borderRadius: 12,
  border: "1px solid #e0e0e0",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};

const imgStyle: React.CSSProperties = {
  width: 55,
  height: 55,
  borderRadius: 8,
  objectFit: "cover",
};

const addBtnStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 6,
  background: "#e53935",
  color: "#fff",
  border: "none",
  padding: "6px 0",
  borderRadius: 16,
  fontWeight: 600,
  fontSize: "12px",
};

const actionBtnStyle = (bgColor: string): React.CSSProperties => ({
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  background: bgColor,
  color: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "13px",
  fontWeight: "bold",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
});

const cartRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#fff",
  padding: "10px 14px",
  marginTop: 8,
  borderRadius: 8,
  border: "1px solid #e0e0e0",
};

const qtyBtnStyle: React.CSSProperties = {
  background: "#0d47a1",
  color: "#fff",
  border: "none",
  padding: "4px 10px",
  borderRadius: 4,
  cursor: "pointer",
  fontWeight: "bold",
};

const qtyInputStyle: React.CSSProperties = {
  width: "45px",
  padding: "3px",
  borderRadius: 4,
  border: "1px solid #ccc",
  textAlign: "center",
};

const submitBtnStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 16,
  padding: 12,
  background: "#0d47a1",
  color: "#fff",
  border: "none",
  borderRadius: 25,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
};

const loadingOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(255,255,255,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const spinner: React.CSSProperties = {
  width: 36,
  height: 36,
  border: "4px solid rgba(0,0,0,0.1)",
  borderTop: "4px solid #0d47a1",
  borderRadius: "50%",
  animation: "spin 0.6s linear infinite",
};

const popupBgStyle: React.CSSProperties = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const popupBoxStyle: React.CSSProperties = {
  background: "#fff",
  padding: "16px 28px",
  borderRadius: 12,
  color: "#333",
  fontWeight: "bold",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
};

const confirmBoxStyle: React.CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  color: "#333",
  maxWidth: "450px",
  width: "90%",
};

const confirmListStyle: React.CSSProperties = {
  maxHeight: "220px",
  overflowY: "auto",
  background: "#f5f5f5",
  padding: 10,
  borderRadius: 8,
};

const confirmRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
  borderBottom: "1px solid #e0e0e0",
  fontSize: "14px",
};

const confirmTotalStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  paddingTop: 8,
  fontWeight: "bold",
  color: "#0d47a1",
  fontSize: "15px",
};

const noteBoxStyle: React.CSSProperties = {
  marginTop: 10,
  padding: 8,
  background: "#fff3cd",
  borderRadius: 6,
  fontSize: "13px",
};

const dialogBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: 10,
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const successBox: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 24,
  fontWeight: "bold",
  color: "#0d47a1",
  background: "#f5f5f5",
};
