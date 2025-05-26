import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import React from "react";
import Image from "next/image";

const MySwal = withReactContent(Swal);

const Content = ({ dataProduct }) => {
    if (!dataProduct) return null;

    const {
        sectionId,
        code,
        name,
        description,
        basePrice,
        finalPrice,
        isActive,
        channel,
        icon,
        createdAt,
    } = dataProduct;

    return (
        <div className="flex flex-col space-y-3 p-4 max-w-md">
            <div className="flex justify-center">
                {icon && (
                    <Image
                        src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${icon}`}
                        alt={`${process.env.NEXT_PUBLIC_URL_STORAGE}${icon}`}
                        className="w-32 h-32 object-contain rounded-lg border"
                        width={500}
                        height={500}
                    />
                )}
            </div>
            <div>
                <strong>Section ID:</strong> {sectionId}
            </div>
            <div>
                <strong>Code:</strong> {code}
            </div>
            <div>
                <strong>Name:</strong> {name}
            </div>
            <div>
                <strong>Description:</strong> {description}
            </div>
            <div>
                <strong>Base Price:</strong> {basePrice?.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
            </div>
            <div>
                <strong>Final Price:</strong> {finalPrice?.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
            </div>
            <div>
                <strong>Active Status:</strong> {isActive ? "Active" : "Inactive"}
            </div>
            <div>
                <strong>Channel:</strong> {channel}
            </div>
            <div>
                <strong>Created Date:</strong>{" "}
                {new Date(createdAt).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                    timeZone: "Asia/Jakarta",
                })}
            </div>
        </div>
    );
};

const DetailProductMDL = () => {
    const openDetailProductMDLMDL = (dataProduct) => {
        MySwal.fire({
            html: <Content dataProduct={dataProduct} />,
            showConfirmButton: true,
            confirmButtonText: "Close",
            customClass: {
                popup: "bg-white rounded-2xl shadow-lg max-w-lg mx-auto p-6",
                container: "swal-container flex justify-center items-center",
            },
            width: "auto",
        });
    };

    return { openDetailProductMDLMDL };
};

export default DetailProductMDL;
