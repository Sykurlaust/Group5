import React from "react"
import { useNavigate } from "react-router-dom"

type Props = {
    onClose: () => void
}

export default function AccountRequiredModal({ onClose }: Props) {
    const navigate = useNavigate()

    const goLogin = () => {
        onClose()
        navigate("/login")
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 " onClick={onClose} />
            <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <h3 className="text-lg font-semibold">Account required</h3>
                <p className="mt-3 text-sm text-gray-600">You need an account to add properties to your favorites.</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button className="rounded-full px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200" onClick={onClose}>
                        Close
                    </button>
                    <button className="rounded-full bg-[#46a796] px-4 py-2 text-sm font-semibold text-white hover:bg-gray-200" onClick={goLogin}>
                        Log in
                    </button>
                </div>
            </div>
        </div>
    )
}
