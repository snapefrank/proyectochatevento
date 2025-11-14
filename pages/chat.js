import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();
  const chatEndRef = useRef(null);

  // Scroll automático
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Verificar sesión
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) router.replace("/");
      else setUser(data.session.user);
    };
    checkSession();
  }, []);

  // Cargar mensajes + realtime
  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("id", { ascending: true });

    setMessages(data || []);
    scrollToBottom();
  };

  const sendMessage = async () => {
    if (text.trim() === "") return;

    await supabase.from("messages").insert({
      user_id: user.id,
      email: user.email,
      name: user.email.split("@")[0],
      message: text,
    });

    setText("");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <div style={styles.pageContainer}>
      
      {/* LOGO */}
      <img src="/logo.png" alt="Logo" style={styles.logo} />

      <div style={styles.chatContainer}>
        
        <div style={styles.chatHeader}>
          <span>Chat del Evento Ferrer</span>
          <button onClick={logout} style={styles.logoutButton}>Salir</button>
        </div>

        <div style={styles.messagesBox}>
          {messages.map((m) => {
            const isMine = m.email === user?.email;
            const displayName = m.name || m.email?.split("@")[0];

            return (
<div
  key={m.id}
  style={{
    ...styles.messageWrapper,
    alignSelf: isMine ? "flex-end" : "flex-start",
    textAlign: isMine ? "right" : "left",
  }}
>

                {/* Nombre del usuario */}
                <div style={styles.sender}>
                  {displayName} escribió:
                </div>

                {/* Burbuja */}
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(isMine ? styles.myMessage : styles.otherMessage),
                  }}
                >
                  {m.message}
                </div>
              </div>
            );
          })}

          <div ref={chatEndRef}></div>
        </div>

        {/* INPUT */}
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            placeholder="Escribe un mensaje…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button style={styles.sendButton} onClick={sendMessage}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🎨 ESTILOS PROFESIONALES */
const styles = {
  pageContainer: {
    backgroundImage: "url('/fondo.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "30px",
    fontFamily: "Arial, sans-serif",
  },

  logo: {
    height: 70,
    marginBottom: 20,
  },

  chatContainer: {
    width: "60%",
    minWidth: "350px",
    height: "70%",
    background: "rgba(255,255,255,0.85)",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  },

  chatHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "18px",
    marginBottom: "10px",
    fontWeight: "bold",
  },

  logoutButton: {
    background: "#d9534f",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  messagesBox: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  messageWrapper: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "75%",
  },

  sender: {
    fontSize: "12px",
    opacity: 0.7,
    marginBottom: "3px",
    color: "#555",
  },

  messageBubble: {
    padding: "10px 15px",
    borderRadius: "12px",
    fontSize: "14px",
    lineHeight: "18px",
    wordBreak: "break-word",
  },

  myMessage: {
    background: "#0078FF",
    color: "white",
    alignSelf: "flex-end",
  },

  otherMessage: {
    background: "#ececec",
    color: "#333",
    alignSelf: "flex-start",
  },

  inputRow: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  input: {
    flex: 1,
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "14px",
  },

  sendButton: {
    padding: "12px 20px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
