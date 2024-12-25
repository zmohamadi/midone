'use client'

export const Storage = {
    set: function(key, value) {
        typeof window !== 'undefined' && window.localStorage.setItem(key, JSON.stringify(value));
    },
    get: function(key) {
        return typeof window !== 'undefined' && JSON.parse(window.localStorage.getItem(key));
    }
};