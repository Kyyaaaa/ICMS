import type { GlobalModalEventDetail, ModalType } from '../shared/components/ui/GlobalModal';

export const showGlobalModal = (detail: GlobalModalEventDetail) => {
    window.dispatchEvent(
        new CustomEvent('SHOW_GLOBAL_MODAL', {
            detail
        })
    );
};

export const showAlertModal = (
    title: string, 
    message: string, 
    type: ModalType = 'error',
    confirmText?: string
): Promise<void> => {
    return new Promise((resolve) => {
        let defaultBtnText = 'OK';
        if (type === 'error') defaultBtnText = 'Got it';
        if (type === 'success') defaultBtnText = 'Continue';

        showGlobalModal({
            title,
            message,
            mode: 'alert',
            type,
            confirmText: confirmText || defaultBtnText,
            onConfirm: () => resolve(),
            onCancel: () => resolve(),
        });
    });
};

export const showConfirmModal = (
    title: string, 
    message: string, 
    type: ModalType = 'warning',
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel'
): Promise<boolean> => {
    return new Promise((resolve) => {
        showGlobalModal({
            title,
            message,
            mode: 'confirm',
            type,
            confirmText,
            cancelText,
            onConfirm: () => resolve(true),
            onCancel: () => resolve(false),
        });
    });
};
