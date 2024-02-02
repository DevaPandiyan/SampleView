
import { createContext,useContext,useState } from "react";
const ConfiguratorContext =createContext();
export const ConfiguratorProvider=({children})=>{


    const [loading, setLoading] = useState(false);

    

    return(
        <ConfiguratorContext.Provider 
         value= { {
            loading,
            setLoading,
         
        } }
        >
         {children}
        </ConfiguratorContext.Provider>
    );    
};

export const useConfigurator=() => {
return useContext(ConfiguratorContext);
}