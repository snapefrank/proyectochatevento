import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";


export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const process = async () => {
      await supabase.auth.exchangeCodeForSession(window.location.href);
      router.replace("/chat"); // <-- A dónde enviarlo una vez logueado
    };

    process();
  }, []);

  return <p>Validando acceso...</p>;
}
