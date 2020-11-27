import React from 'react'
import { stringify } from 'querystring';
import { Redirect } from "react-router-dom";
import BasicLayout from './basicLayout'
import tokenHolder from '../../utils/tokenHolder';

const Security = () => {
    const token = tokenHolder.get()
    if (token != null) {
        return <BasicLayout />
    }
    const queryString = stringify({
        redirect: window.location.href,
    });
    return <Redirect to={`/login?${queryString}`} />
}

export default Security