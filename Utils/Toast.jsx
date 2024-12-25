'use client'

import Toastify from 'toastify-js';

export const Toast = {
    success: function(message='', title='', time=2500){
        let id = 'success-notification-'+Math.round(Math.random()*10000);
        let div = document.createElement('div');
        div.id = id; div.className = 'toastify-content flex min-w-7';
        div.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' stroke-linejoin='round' class='feather feather-check-circle text-theme-10'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path><polyline points='22 4 12 14.01 9 11.01'></polyline></svg>
                    <div class='ml-5 mr-4'>
                        <div class='font-bold'>${title}</div>
                        <div class='mt-1'>${message}</div>
                    </div>`;

        Toastify({
            node: div,
            duration: time,
            newWindow: true,
            close: true,
            gravity: 'top',
            position: 'right',
            stopOnFocus: true,
        }).showToast();
    },

    error: function(message='', title='', time=2500){
        let id = 'error-notification-'+Math.round(Math.random()*10000);
        let div = document.createElement('div');
        div.id = id; div.className = 'flex alert alert-danger show';
        div.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' stroke-linejoin='round' class='feather feather-alert-octagon w-6 h-6 ml-2'><polygon points='7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2'></polygon><line x1='12' y1='8' x2='12' y2='12'></line><line x1='12' y1='16' x2='12.01' y2='16'></line></svg>
                        <div class='ml-7 mr-4'>
                            <div class='font-bold'>${title}</div>
                            <div class='mt-1'>${message}</div>
                        </div>`;

        Toastify({
            node: div,
            duration: time,
            newWindow: true,
            close: true,
            gravity: 'top',
            position: 'right',
            stopOnFocus: true,
            style:{
                color: '#FFF',
            }
        }).showToast();
    },

    warning: function(message='', title='', time = 2500){
        let id = 'warning-notification-'+Math.round(Math.random()*10000);
        let div = document.createElement('div');
        div.id = id; div.className = 'flex alert alert-warning show';
        div.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' stroke-linejoin='round' class='feather feather-alert-triangle w-6 h-6 ml-2'><path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'></path><line x1='12' y1='9' x2='12' y2='13'></line><line x1='12' y1='17' x2='12.01' y2='17'></line></svg>
                    <div class='ml-7 mr-4'>
                        <div class='font-bold'>${title}</div>
                        <div class='mt-1'>${message}</div>
                    </div>`;

        Toastify({
            node: div,
            duration: time,
            newWindow: true,
            close: true,
            gravity: 'top',
            position: 'right',
            stopOnFocus: true,
        }).showToast();
    },
}
