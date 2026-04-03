import React, { useEffect, useState } from 'react';
import useWebSocket, { getWebSocketUrl } from '../../hooks/useWebSocket';
import { Bell, X } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const RealTimeNotification = () => {
    const { isAuthenticated, user } = useAuthStore();
    const [notifications, setNotifications] = useState([]);

    const wsPath = isAuthenticated ? `/ws/notifications/?token=${encodeURIComponent(useAuthStore.getState().accessToken || '')}` : null;
    const { lastMessage, sendMessage } = useWebSocket(wsPath);

    useEffect(() => {
        if (lastMessage) {
            setNotifications(prev => [
                { id: Date.now(), ...lastMessage },
                ...prev
            ].slice(0, 10));

            const timer = setTimeout(() => {
                setNotifications(prev => prev.slice(0, -1));
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [lastMessage]);

    if (!isAuthenticated) return null;

    const handleButtonClick = () => {
        sendMessage({
            message: "A user clicked the real-time update button!",
            action: "button_click"
        });
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <button 
                onClick={handleButtonClick}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-emerald-700 transition flex items-center gap-2"
            >
                <Bell size={20} />
                Trigger Real-Time Update
            </button>

            {notifications.map((notif) => (
                <div 
                    key={notif.id}
                    className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-4 rounded-xl shadow-2xl flex items-start gap-4 animate-in slide-in-from-right max-w-sm"
                >
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full text-emerald-600">
                        <Bell size={20} />
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                            {notif.action === 'button_click' ? 'Real-time Action' : 'Notification'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {notif.message}
                        </p>
                    </div>
                    <button 
                        onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default RealTimeNotification;
