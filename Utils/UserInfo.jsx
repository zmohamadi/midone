'use client'

import {Config} from '../index';

const UserInfo = () => {
    let user = Config.getStore().getState().user;
    return (user);
}
export {UserInfo};
