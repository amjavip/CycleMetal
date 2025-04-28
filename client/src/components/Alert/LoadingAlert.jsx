import { useEffect, useState } from "react";

const LoadingAlert = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 10000); // 10 segundos

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-5 left-1/2 -translate-x-1/2 w-96 rounded-md border border-gray-300 bg-white p-4 shadow-lg"
    >
      <div className="flex items-start gap-4">
        {/* Icono de éxito */}
        <div>
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
        </div>

        {/* Mensaje */}
        <div className="overflow-hidden">
          <strong className="font-medium text-gray-900">¡Éxito!</strong>
          <p className="mt-0.5 text-sm text-gray-700">{message}</p>
        </div>

        {/* Botón de cierre */}
        <button
          onClick={() => {
            setVisible(false);
            onClose();
          }}
          className="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
          type="button"
          aria-label="Cerrar alerta"
        >
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
    </div>
  );
};

export default LoadingAlert;
