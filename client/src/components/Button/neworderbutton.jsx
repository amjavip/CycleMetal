import { BsPlusLg } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { div, step } from "three/tsl";
import { IoIosArrowBack } from "react-icons/io";
import { useOrder } from "../../context/OrderContext";
export default function BotonAnimado() {
   const { resetOrder, updateOrder } = useOrder();
  const navigate = useNavigate();
  const location = useLocation();
  const [rotate, setRotate] = useState(0);

  const isInForm = location.pathname === "/seller-services/neworder";
  const [isPendingForm, setIsPendingForm] = useState(false);
  const path = location.pathname.replace("/seller-services/neworder", "");

  const paths = [
    '/ubication',
    '/summary',
    '/payment',
  ]
useEffect(() => {
  if (paths.includes(path)) {
    updateOrder("step", (paths.indexOf(path)+1));
    setIsPendingForm(true);
  }
}, [path]);
  const handleBack = () => {
   
      if (paths.includes(path)) {
       
        if (paths.indexOf(path)===0){
          navigate("/seller-services/neworder");
          setIsPendingForm(false)
        }
      else {
          navigate("/seller-services/neworder"+(paths[(paths.indexOf(path)-1)]))
        
        
      }
     
    }
  };
 
  // Efecto para actualizar rotación cuando cambia la ruta
  useEffect(() => {
    setRotate(isInForm ? 45 : 0);
  }, [isInForm]);

  const handleClick = () => {
    if (isInForm) {
      
      resetOrder();

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
          <IoIosArrowBack className="h-full w-full text-black font-light" onClick={handleBack} />
        </div>
      )

  );
}
