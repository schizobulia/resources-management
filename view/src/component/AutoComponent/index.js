import React from 'react';
import Tool from '../../until/tool';

export default function (props) {
    if (props.auto === Tool.getAuto()) {
        return (
            <div>{props.children}</div>
        )
    } else {
        return (
            <div>
                权限不足
            </div>
        )
    }
}