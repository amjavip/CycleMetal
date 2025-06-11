import { BsPlusLg } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { div } from "three/tsl";
import { IoIosArrowBack } from "react-icons/io";

export default function BotonAnimado() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rotate, setRotate] = useState(0);

  const isInForm = location.pathname === "/seller-services/neworder";
  const [isPendingForm, setIsPendingForm] = useState(false);
  const path = location.pathname.replace("/seller-services/neworder", "");
  console.log(path);
  const paths = [
    '/ubication',
    '/payment',
    '/summary'
  ]
useEffect(() => {
  if (paths.includes(path)) {
    setIsPendingForm(true);
  }
}, [path]);

  const handleBack = () => {
   
      if (paths.includes(path)) {
        navigate(-1)
        
        setIsPendingForm(false)
     
    }
  };
 
  // Efecto para actualizar rotación cuando cambia la ruta
  useEffect(() => {
    setRotate(isInForm ? 45 : 0);
  }, [isInForm]);

  const handleClick = () => {
    if (isInForm) {
      // 1. Animar de regreso
      setRotate(0);
      // 2. Esperar a que termine la animación
      setTimeout(() => {
        navigate("/seller-services");
      }, 400); // debe coincidir con el `transition.duration`
    } if (!isInForm) {
      // 1. Animar a 45°
      setRotate(45);
      // 2. Redirigir después
      setTimeout(() => {
        navigate("/seller-services/neworder");
      }, 100);
    }
  };
  console.log(isPendingForm)
  return (
    !isPendingForm ? (
      <motion.div
        onClick={handleClick}
        animate={{ rotate }}
        transition={{ duration: 0.1 }}
        className="text-[#404040] h-20 w-20 btn flex-none btn bg-transparent transition duration-300 border-none shadow-none hover:scale-105 "
      >
        <BsPlusLg className="h-full w-full" />
      </motion.div>
    )
      :
      (
        <div className="text-[#404040] h-20 w-20 btn flex-none btn bg-transparent transition duration-300 border-none shadow-none hover:scale-105
        ">
          <IoIosArrowBack className="h-full w-full text-black" onClick={handleBack} />
        </div>
      )

  );
}
