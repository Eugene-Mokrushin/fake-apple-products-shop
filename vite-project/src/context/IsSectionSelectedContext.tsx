import { useContext, createContext, ReactNode, useState, useEffect } from "react";

type IsSectionSelectedProviderProps = {
    children: ReactNode
}

type IsSectionSelectedContext = {
    section: string,
    setSection: (title: string) => void
}

const IsSectionSelectedContext = createContext({} as IsSectionSelectedContext)

export function useSelectedSection() {
    return useContext(IsSectionSelectedContext)
}

export function IsSectionSelectedProvider({ children }: IsSectionSelectedProviderProps) {
    const [section, setSection] = useState<string>("QPICK")

    return (
        <IsSectionSelectedContext.Provider
            value={{
                section: section,
                setSection: setSection
            }}
        >
            {children}
        </IsSectionSelectedContext.Provider>
    )
}
