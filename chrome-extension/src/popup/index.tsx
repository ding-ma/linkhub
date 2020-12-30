import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Popup from './Popup';


chrome.tabs.query({ active: true, currentWindow: true }, tab => {
    // const tester = [
    //     {
    //         "name":"mywk",
    //         "key":"ki2Zs3nCC3k"
    //     },
    //     {
    //         "name":"some name",
    //         "key":"rQhSEfiTaIo"
    //     }
    //
    // ]
    // localStorage.setItem("workspace", JSON.stringify(tester))
    ReactDOM.render(
        <Popup />, document.getElementById('popup')
    );
});
