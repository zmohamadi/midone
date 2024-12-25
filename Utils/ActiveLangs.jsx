'use client'

import Config from '../../Config';

const ActiveLangs = () => {
    let activeLangs = Config.getStore().getState().allLocal;
    return (activeLangs);
}

export default ActiveLangs;
