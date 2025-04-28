import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Alert = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 100000); // Oculta la alerta después de 3 segundos

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed top-5 left-1/2 transform -translate-x-1/2 w-96 rounded-md border border-gray-300 bg-white p-4 shadow-lg 
      "
      initial={{ opacity: 0, y: -20 }} // Aparece desde arriba con opacidad 0
      animate={{ opacity: 1, y: 0 }} // Se desliza hacia abajo y se hace visible
      exit={{ opacity: 0, y: -20 }} // Se oculta hacia arriba cuando desaparece
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="flex items-start gap-4">
        {/* ✅ Animación de la palomita */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.div>

        {/* ✅ Animación de apertura del mensaje */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          className="overflow-hidden"
        >
          <strong className="font-medium text-gray-900">¡Éxito!</strong>
          <p className="mt-0.5 text-sm text-gray-700">{message}</p>
        </motion.div>

        {/* Botón de cierre */}
        <button
          onClick={() => setVisible(false)}
          className="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 
          dark:text-gray-400 "
          type="button"
          aria-label="Cerrar alerta"
        >
          <span className="sr-only">Cerrar alerta</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default Alert;
