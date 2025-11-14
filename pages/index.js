import { supabase } from "../lib/supabase";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState("");

  const signIn = async () => {
    if (!email) return setInfoMsg("Ingresa un correo válido.");

    setLoading(true);

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });


    setInfoMsg("Revisa tu correo para entrar.");
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img src="/logo.png" alt="Logo" style={styles.logo} />

        <h1 style={styles.title}>Evento Ferrer – Acceso</h1>

        {infoMsg && <div style={styles.alertBox}>{infoMsg}</div>}

        <input
          type="email"
          placeholder="Correo empresarial"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <button onClick={signIn} disabled={loading} style={styles.button}>
          {loading ? "Enviando…" : "Entrar"}
        </button>
      </div>
    </div>
  );
}

/* 🎨 ESTILOS */
const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    backgroundImage: "url('/fondo.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: "380px",
    padding: "35px",
    background: "rgba(255,255,255,0.95)",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  logo: {
    width: "220px",
    height: "auto",
    objectFit: "contain",
    marginBottom: "5px",
    marginLeft: "auto",
    marginRight: "auto",
  },

  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
  },

  alertBox: {
    background: "#0078FF22",
    color: "#00408B",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #0078FF55",
    fontSize: "14px",
    marginBottom: "5px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
  },

  button: {
    background: "#0078FF",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
};
