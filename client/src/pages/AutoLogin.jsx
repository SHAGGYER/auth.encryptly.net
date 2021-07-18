import React, {useEffect} from "react";

export default function AutoLogin() {
    useEffect(() => {
        document.domain = "localhost";
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