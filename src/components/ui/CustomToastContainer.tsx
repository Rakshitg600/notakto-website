'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VT323 } from "next/font/google";

const vt323 = VT323({
    weight: "400",
    subsets: ["latin"],
});


export function CustomToastContainer() {
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={true}
                draggable={true}
                pauseOnHover={true}
                closeButton={false}
                toastClassName="custom-toast"
            />
            {/*  since the toast and progress bar are together therefore we choose the last element and add margin bottom    */}
            {/*  for some reason tailwind code doesnt work */}
            <style jsx global>{`
                .Toastify__toast-container .Toastify__toast:not(:last-child) { 
                margin-bottom: 12px;
                }
                .custom-toast {
                width: 300px;
                background: black;
                color: white;
                border: 1px solid #00ffff;
                border-radius: 6px;
                padding: 12px 16px;
                font-family: 'VT323', monospace;
                font-size: 22px;
                text-align: center;
                box-shadow: 0 0 12px #00ffff;
                letter-spacing: 0.1em;
                }`}
            </style>
        </>
    );
}