import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import React from "react";
import Image from "next/image";

const MySwal = withReactContent(Swal);

const PreviewImg = ({ urlImg }) => {
    return (
        <div className="flex flex-col justify-center items-center">
            <Image
                src={urlImg}
                alt="Preview"
                className="max-w-full max-h-[80vh] rounded-lg shadow-lg"
                width={500}
                height={500}
            />
            <button
                className="mt-4 bg-danger hover:bg-danger-dark text-white p-2 rounded"
                onClick={() => MySwal.close()}
            >
                Tutup
            </button>
        </div>
    );
};

const PreviewImgMDL = () => {
    const openPreviewImgMDL = (urlImg) => {
        MySwal.fire({
            html: <PreviewImg urlImg={urlImg} />,
            showConfirmButton: false,
            customClass: {
                popup: "bg-white w-full p-2 rounded-2xl shadow-lg",
                container: "swal-container flex justify-center items-center",
            },
            width: "auto",
        });
    };

    return { openPreviewImgMDL };
};

export default PreviewImgMDL;
