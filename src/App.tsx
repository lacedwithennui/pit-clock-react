import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import PitClock from "./pages/PitClock.tsx";
import Rankings from "./pages/Rankings.tsx";
import ErrorProvider from "./components/ErrorProvider.tsx";
import Landing from "./pages/Landing.tsx";
import "./App.css";
import "./components/Shared.css";
import { CookiesProvider } from "react-cookie";

export default function App() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <CookiesProvider>
                <ErrorProvider>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="season/:season/event/:eventCode/team/:teamNumber" element={<PitClock />} />
                        <Route path="season/:season/event/:eventCode/rankings" element={<Rankings />} />
                    </Routes>
                </ErrorProvider>
            </CookiesProvider>
        </QueryClientProvider>
    );
}
