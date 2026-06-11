import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export type ModalMode = 'alert' | 'confirm';
export type ModalType = 'success' | 'error' | 'warning' | 'info';

export interface GlobalModalEventDetail {
    title: string;
    message: string;
    mode?: ModalMode;
    type?: ModalType;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
}

const GlobalModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<GlobalModalEventDetail>({
        title: '',
        message: '',
        mode: 'alert',
        type: 'info',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
    });

    useEffect(() => {
        const handleShowModal = (event: Event) => {
            const customEvent = event as CustomEvent<GlobalModalEventDetail>;
            setConfig({
                ...customEvent.detail,
                mode: customEvent.detail.mode || 'alert',
                type: customEvent.detail.type || 'info',
                confirmText: customEvent.detail.confirmText || 'Confirm',
                cancelText: customEvent.detail.cancelText || 'Cancel',
            });
            setIsOpen(true);
        };

        window.addEventListener('SHOW_GLOBAL_MODAL', handleShowModal);
        return () => window.removeEventListener('SHOW_GLOBAL_MODAL', handleShowModal);
    }, []);

    const handleConfirm = () => {
        setIsOpen(false);
        if (config.onConfirm) {
            config.onConfirm();
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        if (config.onCancel) {
            config.onCancel();
        }
    };

    if (!isOpen) return null;

    const getIcon = () => {
        switch (config.type) {
            case 'success':
                return <CheckCircle2 className="w-6 h-6 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-6 h-6 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
            default:
                return <Info className="w-6 h-6 text-blue-500" />;
        }
    };

    const getIconBg = () => {
        switch (config.type) {
            case 'success':
                return 'bg-green-100';
            case 'error':
                return 'bg-red-100';
            case 'warning':
                return 'bg-yellow-100';
            default:
                return 'bg-blue-100';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-start p-6">
                    <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${getIconBg()} mr-4`}>
                        {getIcon()}
                    </div>
                    <div className="flex-1 w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{config.title}</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{config.message}</p>
                    </div>
                    <button onClick={handleCancel} className="ml-4 text-gray-400 hover:text-gray-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                    {config.mode === 'confirm' && (
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {config.cancelText}
                        </button>
                    )}
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm
                            ${config.type === 'error' ? 'bg-red-600 hover:bg-red-700' 
                            : config.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700'
                            : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {config.confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GlobalModal;
