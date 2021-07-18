import React, {useContext, useEffect} from "react";
import AppContext from "src/AppContext";

export default function AutoLogout() {
    const {settings} = useContext(AppContext)

    useEffect(() => {
        document.domain = settings.serverDomain;
        window.parent.postMessage({autologout: true}, "*");
        window.addEventListener("message", e => {
            if (e.data.autologout) {
                localStorage.removeItem("token");
                window.parent.postMessage({autologoutComplete: true}, "*");
            }
        })
    }, [])

    return (
        <div>

        </div>
    )
}