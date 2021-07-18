import React, {useContext, useEffect} from "react";
import AppContext from "src/AppContext";

export default function AutoLogin() {
    const {settings} = useContext(AppContext)

    useEffect(() => {
        document.domain = settings.serverDomain;
        window.parent.postMessage({autologin: true}, "*");
        window.addEventListener("message", e => {
            window.parent.postMessage({token: localStorage.getItem("token")}, "*");
        })
    }, [])

    return (
        <div>

        </div>
    )
}