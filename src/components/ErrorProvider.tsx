import { createContext, useState, useContext, type ReactNode } from "react";

interface ErrorContextType {
    showError: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export default function ErrorProvider({children}: {children: ReactNode}) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    function showError(message: string) {
        setErrorMessage(message);
    }

    function closeModal() {
        setErrorMessage(null);
    }

    return (
        <ErrorContext.Provider value={{showError}}>
            {children}

            {errorMessage && (
                <div className="errorModal">
                    <h3 className="errorTitle">Error</h3>
                    <p className="errorMessage">{errorMessage}</p>
                    <button className="dismissError" onClick={closeModal}>Dismiss</button>
                </div>
            )}
        </ErrorContext.Provider>
    );
}

export function useError() {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error("useError must be used within an ErrorProvider");
    }
    return context;
}
