/*
𝐕.𝐌.𝐎. 𝐋𝐔𝐂𝐊𝐘 𝐒𝐏𝐄𝐄𝐃 𝐂𝐔𝐒𝐓𝐎𝐌
requisition system
no login
blue red theme
*/

type MenuItem = {
  id: number;
  category: string;
  name: any;
  price: number;
  img: string;
};

// ฟังก์ชันเล่นเสียง
const playClickSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800; // ความถี่เสียง
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
};

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Settings } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function Home() {
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.
  let { user, loading: authLoading, error, isAuthenticated, logout } = useAuth();

  const { theme, toggleTheme, switchable } = useTheme();
  const [, setLocation] = useLocation();
  
  /* employee */

  const employees = [
    "Luther_Alexei_Morozov",
    "Jann_Burrell",
    "Kenji_Oyama",
    "Tsukuyomi_Takuya",
    "Marco_Tempesta",
    "Draco_banks",
    "Jason Aoapo",
    "Ryan cooper",
    "Nash Wilder",
    "Yume Kawasumi",
    "Edgar_Malone",
  ];

  /* customer */
  useEffect(() => {
    // ดึงข้อมูลสต็อกจาก Google Sheets
    const fetchStock = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbyiDOq89bHfEiip0TZS08RnqBvAn71XKvthICWiUbBMtCB9_TOD85MTVV38Bv7J1PpQUA/exec"
        );
        const data = await response.json();
        
        // ดึงข้อมูลสต็อก
        const map: any = {};
        data.forEach((i: any) => {
          map[i.id] = i.qty;
        });
        setStock(map);


      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStock();
  }, []);

  const [employee, setEmployee] = useState("");

  const [note, setNote] = useState("");

  /* product */

  const [category, setCategory] = useState("custom");

  const [search, setSearch] = useState("");

  /* cart */

  const [cart, setCart] = useState<any[]>([]);
  const [stock, setStock] = useState<any>({
    101: 10, 102: 99996, 103: 8, 104: 38, 105: 0, 106: 17, 107: 29, 108: 4,
    201: 52, 202: 15, 203: 14, 204: 81, 205: 59, 206: 15, 207: 17, 208: 15, 209: 15,
    301: 14, 302: 449, 303: 10, 304: 13, 305: 13, 306: 10, 307: 13, 308: 59, 309: 14, 310: 13, 311: 63, 312: 482, 313: 10,
  });
  const [loading, setLoading] = useState(false);
  


  /* status */

  const [popup, setPopup] = useState("");

  const [sending, setSending] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  /* auto reset */

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

  /* popup auto hide */

  useEffect(() => {
    if (!popup) return;

    const t = setTimeout(() => setPopup(""), 2000);

    return () => clearTimeout(t);
  }, [popup]);

  /* menu */

  const menuData: MenuItem[] = [
    // CUSTOMS

    {
      id: 101,
      category: "custom",
      name: { th: "Performance Parts" },
      price: 10000,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228211165335682/image.png?ex=6a612c41&is=6a5fdac1&hm=71d553c2c6cc3c34daab73261e35b938d96bba11d121d26fd42f8ff890f68b1c&=&format=webp&quality=lossless",
    },
    {
      id: 104,
      category: "custom",
      name: { th: "Cosmetic Parts" },
      price: 1000,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228211492225116/image.png?ex=6a612c41&is=6a5fdac1&hm=e155d6333902fabfe0d4a91c8a2b690215a40db4ea17c980b46805fa88002f36&=&format=webp&quality=lossless",
    },

    {
      id: 107,
      category: "custom",
      name: { th: "Respray Kit" },
      price: 2000,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228211874037980/image.png?ex=6a612c41&is=6a5fdac1&hm=efd7244dcb7804b007e31ef0bafdc8d40e6c8dd88a7f70b8e18856ec9d317bd7&=&format=webp&quality=lossless",
    },

    {
      id: 103,
      category: "custom",
      name: { th: "Vehicle Wheels Set" },
      price: 2000,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228212201062440/image.png?ex=6a612c41&is=6a5fdac1&hm=f94b039ff6e4016ec3b747921ad358ed7df0aab9fd9ee6c76bdacf9e1d33d86b&=&format=webp&quality=lossless",
    },

    {
      id: 106,
      category: "custom",
      name: { th: "Extras_Kit" },
      price: 1000,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228212549324840/image.png?ex=6a612c41&is=6a5fdac1&hm=c1373bb0c3d40b537f1264c11526cab44daeab15351455a6ecf265c0d2ea858c&=&format=webp&quality=lossless",
    },

    {
      id: 102,
      category: "custom",
      name: { th: "Stancer Kit" },
      price: 1000,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529236474464043128/image.png?ex=6a6133f3&is=6a5fe273&hm=45b813b7a9a400d74f3011396e1ca64f6c5972a4ab140aa309e8003d95881732&=&format=webp&quality=lossless",
    },
   
    // Core Parts
    {
      id: 201,
      category: "Core Parts",
      name: { th: "Repair Kit" },
      price: 300,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529051090765484072/image.png?ex=6a60874c&is=6a5f35cc&hm=40f31ecd6c03e3e0fda33b59c47fd214f064183c314f5485d3f3ce3ecca703e0&=&format=webp&quality=lossless",
    },
    {
      id: 206,
      category: "Core Parts",
      name: { th: "Alternator" },
      price: 600,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529050076284977254/image.png?ex=6a60865a&is=6a5f34da&hm=5d10946c464f116d97a15b0b898d10148cab30ebafcbb72aa15eb7746403df78&=&format=webp&quality=lossless",
    },
    {
      id: 209,
      category: "Core Parts",
      name: { th: "Brakes" },
      price: 600,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529050075936985088/image.png?ex=6a60865a&is=6a5f34da&hm=71e7289097fb82c679bbae6e1ed5ee9addfb82399e879ddb731fcbb1f754edb9&=&format=webp&quality=lossless",
    },

    {
      id: 202,
      category: "Core Parts",
      name: { th: "Fuel Injector" },
      price: 600,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529050076713062400/image.png?ex=6a60865a&is=6a5f34da&hm=1b3b109609a58f723caf370af4275a0c0d097cf785b27b8ca9b5907374a92a04&=&format=webp&quality=lossless",
    },

    {
      id: 203,
      category: "Core Parts",
      name: { th: "Power Steering Pump" },
      price: 600,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529050077094477965/image.png?ex=6a60865a&is=6a5f34da&hm=251e09c02d4456c185a9d63088dc60624b3dd0eae541b55b5cdf33b197cfca67&=&format=webp&quality=lossless",
    },

    {
      id: 207,
      category: "Core Parts",
      name: { th: "Radiator" },
      price: 600,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529050077396733993/image.png?ex=6a60865a&is=6a5f34da&hm=e82287d5d55e26ee947d59e4800f84ccba7c5bea1ed38c9f49fb23400a202bc4&=&format=webp&quality=lossless",
    },

    {
      id: 208,
      category: "Core Parts",
      name: { th: "Transmission" },
      price: 600,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529050077673427034/image.png?ex=6a60865a&is=6a5f34da&hm=959e4f8916a3a4150efc53f6bb3d93cf25297df9202877e83158725c292848ad&=&format=webp&quality=lossless",
    },
    {
      id: 205,
      category: "Core Parts",
      name: { th: "EV Battery" },
      price: 600,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529227920017588284/image.png?ex=6a612bfb&is=6a5fda7b&hm=3f4436b4defa211348df9de160a456532b92f92e507758f5e508b0b737198f1b&=&format=webp&quality=lossless",
    },

    {
      id: 204,
      category: "Core Parts",
      name: { th: "Electric Motor" },
      price: 600,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529227920583688402/image.png?ex=6a612bfb&is=6a5fda7b&hm=f4a9c38d480e7b7f08caec5ec84189f1b2468d0670e252ae37ae27c4c4bdabc0&=&format=webp&quality=lossless",
    },

    // Service
    {
      id: 312,
      category: "Service",
      name: { th: "Air Filter" },
      price: 400,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228687923482915/image.png?ex=6a612cb2&is=6a5fdb32&hm=41d73e69f5363d7cdd552065ed0d99daa3143a0f6115edeb45158c5a94aefe62&=&format=webp&quality=lossless",
    },
    {
      id: 310,
      category: "Service",
      name: { th: "Brake Fluid" },
      price: 400,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228688212885625/image.png?ex=6a612cb2&is=6a5fdb32&hm=8eaf65f4b1680ab6cb8449e311c5c723f5c20f94e539a1f1a9f3bb5c95e986a4&=&format=webp&quality=lossless",
    },
    {
      id: 305,
      category: "Service",
      name: { th: "Brake Pads" },
      price: 400,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228688531656724/image.png?ex=6a612cb3&is=6a5fdb33&hm=e50b25264c6e600daf68957557ba7bcf335d80683aacf6eaa7bb2264eceef942&=&format=webp&quality=lossless",
    },
    {
      id: 309,
      category: "Service",
      name: { th: "Coolant" },
      price: 400,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228688820932708/image.png?ex=6a612cb3&is=6a5fdb33&hm=01f542ffa397eacc8ba034666429160a304e4d42d8a4a29eb4f6e810439c9cde&=&format=webp&quality=lossless",
    },
    {
      id: 304,
      category: "Service",
      name: { th: "Drive Belt" },
      price: 400,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228689143890052/image.png?ex=6a612cb3&is=6a5fdb33&hm=3c37d2fcba842631ae1b6eb7d65d990ba725811a6076f2677b66ee3d1e12b211&=&format=webp&quality=lossless",
    },
    {
      id: 303,
      category: "Service",
      name: { th: "Fuel Filter" },
      price: 400,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228689475375244/image.png?ex=6a612cb3&is=6a5fdb33&hm=2ff57caa6de895779ce0e906bb9290a367b703bdfac42d596e755f4b80644381&=&format=webp&quality=lossless",
    },
    {
      id: 302,
      category: "Service",
      name: { th: "Oil Filter" },
      price: 400,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228689844211894/image.png?ex=6a612cb3&is=6a5fdb33&hm=11e5c6d177eb2abc44ac077f2657df68b02b765abaea4bb2577d8598de8b3cbd&=&format=webp&quality=lossless",
    },
    {
      id: 306,
      category: "Service",
      name: { th: "Steering Fluid" },
      price: 400,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228690116837567/image.png?ex=6a612cb3&is=6a5fdb33&hm=1a36f1a72ada78c166b83a058e3a2991128668f826a4453d6c2dada63ce2e936&=&format=webp&quality=lossless",
    },
    {
      id: 307,
      category: "Service",
      name: { th: "Spark Plugs" },
      price: 400,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228690498781325/image.png?ex=6a612cb3&is=6a5fdb33&hm=fac62126c7252ae7a0bcfc68edc36ed260c524ca2c0dec06250b5f74683e1b98&=&format=webp&quality=lossless",
    },
    {
      id: 301,
      category: "Service",
      name: { th: "Tires" },
      price: 400,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228690498781325/image.png?ex=6a612cb3&is=6a5fdb33&hm=fac62126c7252ae7a0bcfc68edc36ed260c524ca2c0dec06250b5f74683e1b98&=&format=webp&quality=lossless",
    },
    {
      id: 313,
      category: "Service",
      name: { th: "Transmission Fluid" },
      price: 400,
      img: "https://media.discordapp.net/attachments/904634942091296788/1529228690951770112/image.png?ex=6a612cb3&is=6a5fdb33&hm=5b66c4f7bf32c50452c5a2aaeac7067b13c16dc1fdbd2cb5cbdbe7c8a9ecb0c7&=&format=webp&quality=lossless",
    },
    {
      id: 311,
      category: "Service",
      name: { th: "Battery Coolant" },
      price: 400,
      img: "https://img1.pic.in.th/images/Screenshot-2026-04-06-212515.png",
    },
    {
      id: 308,
      category: "Service",
      name: { th: "High Voltage Wiring" },
      price: 400,
      img: "https://img2.pic.in.th/Screenshot-2026-04-06-212429.png",
    },
  ];
  /* cart */

  const add = (item: any) => {
    const current = cart.find((i) => i.id === item.id)?.qty || 0;

    const max = stock[item.id] || 0;

    if (current >= max) {
      setPopup("ของไม่พอ");
      playClickSound();
      return;
    }
    playClickSound();
    setCart((prev) => {
      const f = prev.find((p) => p.id == item.id);

      if (f)
        return prev.map((p) =>
          p.id == item.id ? { ...p, qty: Math.min(p.qty + 1, 999) } : p
        );

      return [...prev, { ...item, qty: 1 }];
    });
  };

  const minus = (id: number) => {
    playClickSound();
    setCart((prev) =>
      prev

        .map((p) => (p.id == id ? { ...p, qty: p.qty - 1 } : p))

        .filter((p) => p.qty > 0)
    );
  };

  const changeQty = (id: number, val: number) => {
    const max = stock[id] || 0;

    if (val < 1) val = 1;

    if (val > max) val = max;

    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: val } : p)));
  };

  /* filter */

  const filtered = menuData

    .filter((item) => item.category === category)

    .filter((item) =>
      item.name.th

        .toLowerCase()

        .includes(search.toLowerCase())
    );

  /* total */

  const total = cart.reduce(
    (s, i) => s + i.price * i.qty,

    0
  );

  /* submit */

  const handleSubmitClick = () => {
    console.log("handleSubmitClick called, employee:", employee, "cart:", cart.length);
    if (!employee) {
      setPopup("เลือกชื่อผู้เบิก");
      playClickSound();
      return;
    }

    if (cart.length == 0) {
      setPopup("ไม่มีสินค้า");
      playClickSound();
      return;
    }

    console.log("Setting showConfirm to true");
    playClickSound();
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    playClickSound();
    setShowConfirm(false);
    setSending(true);

    const order = cart.map((i) => `${i.name.th} x ${i.qty}`).join(", ");

    try {
      // บันทึกลงฐานข้อมูล
      const response = await fetch("/api/trpc/requisitions.create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          json: {
            employeeName: employee,
            items: JSON.stringify(cart.map((i) => ({
              id: i.id,
              name: i.name.th,
              price: i.price,
              qty: i.qty,
            }))),
            totalAmount: total,
            note: note || undefined,
          },
        }),
      });

      // ส่งไปยัง Google Sheets
      await fetch(
        "https://script.google.com/macros/s/AKfycbyiDOq89bHfEiip0TZS08RnqBvAn71XKvthICWiUbBMtCB9_TOD85MTVV38Bv7J1PpQUA/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: new URLSearchParams({
            employee: employee,
            order: order,
            note: note,
            total: total.toString(),
            cart: JSON.stringify(
              cart.map((i) => ({
                id: i.id,
                qty: i.qty,
              }))
            ),
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

  /* success */

  if (submitted) return <div style={successBox}>เบิกสำเร็จ</div>;

  /* UI */

  return (
    <div style={page}>
      {loading && (
        <div style={loadingOverlay}>
          <div className="spinner" style={spinner} />
        </div>
      )}

      {/* Theme Toggle Button */}
      {switchable && toggleTheme && (
        <button
          onClick={toggleTheme}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            background: theme === 'dark' ? '#FFD700' : '#333',
            color: theme === 'dark' ? '#333' : '#FFD700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
          title={theme === 'dark' ? 'โหมดกลางวัน' : 'โหมดกลางคืน'}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={18} />
              Light
            </>
          ) : (
            <>
              <Moon size={18} />
              Dark
            </>
          )}
        </button>
      )}

      {/* History Button */}
      <button
        onClick={() => setLocation('/history')}
        style={{
          position: 'fixed',
          top: '20px',
          right: user?.role === 'admin' ? (switchable && toggleTheme ? '220px' : '120px') : (switchable && toggleTheme ? '120px' : '20px'),
          zIndex: 1000,
          padding: '8px 12px',
          borderRadius: '8px',
          border: 'none',
          background: '#e53935',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
        title="ประวัติการเบิก"
      >
        📋 ประวัติ
      </button>

      {/* Admin Button */}
      {user?.role === 'admin' && (
        <button
          onClick={() => setLocation('/admin')}
          style={{
            position: 'fixed',
            top: '20px',
            right: switchable && toggleTheme ? '120px' : '20px',
            zIndex: 1000,
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            background: '#0d47a1',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
          title="Admin Dashboard"
        >
          <Settings size={18} />
          Admin
        </button>
      )}

      <h2 style={title}>𝐕.𝐌.𝐎. 𝐋𝐔𝐂𝐊𝐘 𝐒𝐏𝐄𝐄𝐃 𝐂𝐔𝐒𝐓𝐎𝐌</h2>
      <h2 style={title}>กดรีเฟรชทุกครั้ง ก่อนกดเบิก</h2>
      <select
        value={employee}
        onChange={(e) => setEmployee(e.target.value)}
        style={input}
      >
        <option>เลือกผู้เบิก</option>

        {employees.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>

      <div style={tabs}>
        <button
          onClick={() => setCategory("custom")}
          style={tab(category == "custom")}
        >
          Customs
        </button>

        <button
          onClick={() => setCategory("Core Parts")}
          style={tab(category == "Core Parts")}
        >
          Core Parts
        </button>

        <button
          onClick={() => setCategory("Service")}
          style={tab(category == "Service")}
        >
          Service
        </button>
      </div>

      <input
        placeholder="ค้นหา"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={input}
      />

      <div style={cardContainer}>
        {filtered.map((item) => (
          <div key={item.id} style={card}>
            <img src={item.img} style={img} />
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name.th}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{item.price} ฿</div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>เหลือ {stock[item.id] ?? 0} ชิ้น</div>
              <button
              onClick={() => add(item)}
              disabled={(stock[item.id] || 0) === 0}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              style={{
                ...addBtn,
                opacity: (stock[item.id] || 0) === 0 ? 0.5 : 1,
              }}
            >
              {(stock[item.id] || 0) === 0 ? "หมด" : "เพิ่ม"}
            </button>
            </div>
          </div>
        ))}
      </div>

      <h3>รายการ</h3>

      {cart.map((i) => (
        <div key={i.id} style={cartRow}>
          {i.name.th}

          <div>
            <button 
              onClick={() => minus(i.id)}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              style={{
                ...addBtn,
                padding: "4px 10px",
              }}
            >
              -
            </button>

            <input
              type="number"
              value={i.qty}
              min={1}
              max={999}
              onChange={(e) =>
                changeQty(
                  i.id,

                  Number(e.target.value)
                )
              }
              style={{
                width: "50px",
                padding: "4px",
                marginLeft: "4px",
                marginRight: "4px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                textAlign: "center",
              }}
            />

            <button 
              onClick={() => add(i)}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              style={{
                ...addBtn,
                padding: "4px 10px",
              }}
            >
              +
            </button>
          </div>
        </div>
      ))}

      <h2>รวม {total}</h2>

      <textarea
        placeholder="Note ใส่หรือไม่ใส่ก็ได้"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={input}
      />

      <button 
        onClick={handleSubmitClick} 
        disabled={sending} 
        onMouseDown={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
        style={submitBtn}
      >
        {sending ? "กำลังส่ง..." : "เบิก"}
      </button>

      {popup && (
        <div style={popupBg}>
          <div style={popupBox}>{popup}</div>
        </div>
      )}

      {showConfirm && (
        <div style={{...popupBg, background: "rgba(0,0,0,0.7)"}}>
          <div style={confirmBox} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, color: "#0d47a1" }}>ยืนยันการเบิก</h3>
            <p style={{ marginBottom: 20, color: "#333" }}>ผู้เบิก: <strong>{employee}</strong></p>
            <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: 20, background: "#f9f9f9", padding: 12, borderRadius: 8 }}>
              {cart.map((i) => (
                <div key={i.id} style={{ display: "flex", justifyContent: "space-between", padding: 8, borderBottom: "1px solid #e0e0e0", color: "#333" }}>
                  <span>{i.name.th}</span>
                  <span><strong>x{i.qty}</strong> = {i.price * i.qty} ฿</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: 12, fontWeight: "bold", color: "#0d47a1", fontSize: 16 }}>
                <span>รวมทั้งสิ้น:</span>
                <span>{total} ฿</span>
              </div>
            </div>
            {note && (
              <div style={{ marginBottom: 20, padding: 10, background: "#fff3cd", borderRadius: 8, color: "#333" }}>
                <strong>หมายเหตุ:</strong> {note}
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={confirmSubmit}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
                style={{
                  ...confirmBtn,
                  background: "#0d47a1",
                  flex: 1,
                }}
              >
                ยืนยัน
              </button>
              <button
                onClick={cancelSubmit}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
                style={{
                  ...confirmBtn,
                  background: "#999",
                  flex: 1,
                }}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* style */
const loadingOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(255,255,255,0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
  pointerEvents: "none",
};

const spinner: React.CSSProperties = {
  width: 40,
  height: 40,
  border: "4px solid rgba(0,0,0,0.15)",
  borderTop: "4px solid #1565c0",
  borderRadius: "50%",
  animation: "spin 0.5s linear infinite",
  pointerEvents: "auto",
};

const page = {
  maxWidth: "100%",
  margin: "auto",
  padding: 20,
  background: "var(--background)",
  color: "var(--foreground)",
  fontFamily: "Poppins",
  transition: "background-color 0.3s ease, color 0.3s ease",
};

const title = {
  color: "#0d47a1",
  marginTop: 0,
};

const input = {
  width: "100%",
  marginTop: 10,
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "#fff",
  color: "#333",
};

const tabs = {
  display: "flex",
  gap: 10,
  marginTop: 15,
};

const tab = (active: boolean) => ({
  background: active ? "#0d47a1" : "#e8e8e8",
  color: active ? "#fff" : "#333",
  border: "none",
  padding: "8px 14px",
  borderRadius: 20,
  cursor: "pointer",
  fontWeight: active ? "600" : "400",
});

const cardContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: 12,
  marginTop: 12,
};

const card = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  textAlign: "center" as const,
  background: "#fff",
  padding: 12,
  borderRadius: 14,
  border: "1px solid #e0e0e0",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  cursor: "pointer",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const img: React.CSSProperties = {
  width: 60,
  height: 60,
  borderRadius: 10,
  objectFit: "cover",
};

const addBtn = {
  background: "#e53935",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: 20,
  cursor: "pointer",
  fontWeight: "500",
  transition: "all 0.1s ease-out",
  transform: "scale(1)",
};

const cartRow = {
  display: "flex",
  justifyContent: "space-between",
  background: "#fff",
  padding: 10,
  marginTop: 8,
  borderRadius: 10,
  border: "1px solid #e0e0e0",
  color: "#333",
};

const submitBtn = {
  width: "100%",
  marginTop: 15,
  padding: 14,
  background: "#0d47a1",
  color: "white",
  border: "none",
  borderRadius: 25,
  fontSize: 16,
  transition: "all 0.1s ease-out",
  transform: "scale(1)",
  cursor: "pointer",
};

const popupBg: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const popupBox = {
  background: "#fff",
  padding: 25,
  borderRadius: 15,
  color: "#333",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
};

const confirmBox = {
  background: "#fff",
  padding: 25,
  borderRadius: 15,
  color: "#333",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  maxWidth: "500px",
  width: "90%",
  zIndex: 1001,
  position: "relative" as any,
};

const confirmBtn = {
  padding: 12,
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "600",
  fontSize: 14,
  transition: "all 0.1s ease-out",
  transform: "scale(1)",
} as any;

const successBox = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 28,
  color: "#0d47a1",
  background: "#f5f5f5",
};
