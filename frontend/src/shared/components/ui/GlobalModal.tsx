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
                return <CheckCircle2 className="w-6 h-6 text-[#137333]" />;
            case 'error':
                return <AlertCircle className="w-6 h-6 text-[#ba1a1a]" />;
            case 'warning':
                return <AlertTriangle className="w-6 h-6 text-[#855e00]" />;
            default:
                return <Info className="w-6 h-6 text-[#0061a5]" />;
        }
    };

    const getIconBg = () => {
        switch (config.type) {
            case 'success':
                return 'bg-[#e6f4ea]';
            case 'error':
                return 'bg-[#ffdad6]';
            case 'warning':
                return 'bg-[#fff4ce]';
            default:
                return 'bg-[#e3f2fd]';
        }
    };

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-[#002045]/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-start p-6 md:p-8">
                    <div className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-full ${getIconBg()} mr-5`}>
                        {getIcon()}
                    </div>
                    <div className="flex-1 w-0 pt-1">
                        <h3 className="text-xl font-extrabold text-[#002045] mb-2">{config.title}</h3>
                        <p className="text-sm text-[#43474e] whitespace-pre-wrap leading-relaxed">{config.message}</p>
                    </div>
                    <button onClick={handleCancel} className="ml-4 p-1.5 text-[#74777f] hover:bg-[#f1f4f6] rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="bg-[#f8f9fc] px-6 py-5 flex justify-end gap-3 border-t border-[#e2e2e9]">
                    {config.mode === 'confirm' && (
                        <button
                            onClick={handleCancel}
                            className="px-5 py-2.5 text-sm font-bold text-[#43474e] bg-white border border-[#c4c6cf] rounded-xl hover:bg-[#f1f4f6] transition-colors"
                        >
                            {config.cancelText || 'Cancel'}
                        </button>
                    )}
                    <button
                        onClick={handleConfirm}
                        className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-md hover:shadow-lg
                            ${config.type === 'error' ? 'bg-[#ba1a1a] hover:bg-[#93000a]' 
                            : config.type === 'warning' ? 'bg-[#855e00] hover:bg-[#604400]'
                            : config.type === 'success' ? 'bg-[#137333] hover:bg-[#0d5023]'
                            : 'bg-[#0061a5] hover:bg-[#004a80]'}`}
                    >
                        {config.confirmText || (config.mode === 'alert' ? 'OK' : 'Confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GlobalModal;
