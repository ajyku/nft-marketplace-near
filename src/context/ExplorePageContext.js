import { createContext, useState } from "react";

const ExplorePageContext = createContext();

export const ExplorePageProvider = (props) => {
    const [selectedNFTtoBuy, setSelectedNFTtoBuy] = useState();
    return (<ExplorePageContext.Provider value={{ selectedNFTtoBuy, setSelectedNFTtoBuy }}>
        {props.children}
    </ExplorePageContext.Provider>);
}

export default ExplorePageContext;