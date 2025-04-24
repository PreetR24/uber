import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

const Alert = ({ message, type = "success", duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (duration === null || duration === Infinity) return;
        const timer = setTimeout(() => {
            setVisible(false);
            onClose?.();
        }, duration);

        const startTime = Date.now();
        const progressInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const remainingProgress = Math.max(0, 100 - (elapsedTime / duration) * 100);
            setProgress(remainingProgress);
            
            if (elapsedTime >= duration) {
                clearInterval(progressInterval);
            }
        }, 16);

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }, [duration, onClose]);

    const handleClose = () => {
        setVisible(false);
        onClose?.();
    };

    if (!visible) return null;

    return (
        <div
            role="alert"
            aria-live="assertive"
            className="fixed inset-x-2 top-2 md:top-4 md:right-4 md:left-auto md:max-w-md 
                flex flex-col rounded-xl shadow-lg z-50 overflow-hidden
                text-white backdrop-blur-sm transition-all duration-300"
        >
            <div className={`flex items-center gap-2 p-3 md:p-4
                ${type === "success" 
                    ? "bg-green-500/95" 
                    : "bg-red-500/95"
                }`}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {type === "success" ? (
                        <CheckCircle className="w-5 h-5 shrink-0" />
                    ) : (
                        <AlertCircle className="w-5 h-5 shrink-0" />
                    )}
                    <span className="text-sm font-medium line-clamp-2 break-words">
                        {message}
                    </span>
                </div>
                <button 
                    onClick={handleClose}
                    className="shrink-0 p-2 -m-1 rounded-full hover:bg-white/20 
                        active:bg-white/30 transition-colors"
                    aria-label="Close alert"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="w-full h-1 bg-black/10">
                    {duration !== null && duration !== Infinity && (
                    <div 
                        className={`h-full ${type === "success" ? "bg-green-400" : "bg-red-400"}`}
                        style={{ 
                            width: `${progress}%`,
                            transition: 'width linear',
                            transitionDuration: `${duration}ms`
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Alert;