import { toast } from 'react-toastify';

export const Notif = (type = 'success', message, second = null, close = 4000, hover = true, position = 'top-right') => {

    switch (type) {
        case 'update':
            return toast.update(second.id, { 
                render: message, 
                type: second.type,
                isLoading: false,
                autoClose: '5000'
            });
        default:
            return toast[type](message, {
                position: position,
                autoClose: close,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: hover,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
    }
}