// src/pages/admin/product/add-product.jsx

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { postData, getData } from "@/utils/api";
import { TbCirclePlus } from "react-icons/tb";
import { IoTrash } from "react-icons/io5";
import blobToBinary from "@/utils/blobToBinary";
import PreviewImgMDL from "@/components/Modal/PreviewImgMDL";
import Image from "next/image";

const AddProduct = () => {
    const router = useRouter();
    const [products, setProducts] = useState([
        {
            sectionId: "",
            code: "",
            name: "",
            description: "",
            basePrice: "",
            finalPrice: "",
            channel: "",
            iconFile: null,
        },
    ]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const { openPreviewImgMDL } = PreviewImgMDL();

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const res = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sections?pageSize=100`);
                setSections(res.data);
            } catch (error) {
                console.error("Gagal mengambil data section", error);
            }
        };

        fetchSections();
    }, []);

    const handleAddProductInput = () => {
        setProducts([
            ...products,
            {
                sectionId: "",
                code: "",
                name: "",
                description: "",
                basePrice: "",
                finalPrice: "",
                channel: "",
                iconFile: null,
            },
        ]);
    };

    const handleRemoveProductInput = (index) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const handleChangeProduct = (index, field, value) => {
        const updated = [...products];
        updated[index][field] = value;
        setProducts(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (products.length === 0) {
            setErrorMsg("Minimal harus ada 1 produk.");
            return;
        }

        for (let i = 0; i < products.length; i++) {
            const p = products[i];
            if (!p.sectionId || !p.code || !p.name || !p.description || !p.basePrice || !p.finalPrice || !p.channel || !p.iconFile) {
                setErrorMsg(`Semua field wajib diisi di produk ke-${i + 1}.`);
                return;
            }
        }

        setErrorMsg("");
        setLoading(true);

        try {
            const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products`;

            for (const product of products) {
                const iconBinary = await blobToBinary(product.iconFile);

                const iconBlob = new Blob([iconBinary], { type: product.iconFile.type });

                const formData = new FormData();
                formData.append("sectionId", product.sectionId);
                formData.append("code", product.code);
                formData.append("name", product.name);
                formData.append("description", product.description);
                formData.append("basePrice", product.basePrice);
                formData.append("finalPrice", product.finalPrice);
                formData.append("channel", product.channel);
                formData.append("icon", iconBlob, product.iconFile.name);

                await postData(endpoint, formData);
            }

            alert("Semua produk berhasil ditambahkan!");
            router.push("/admin/product");
        } catch (error) {
            setErrorMsg(error?.response?.data?.message || error.message || "Gagal menambahkan produk.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container p-6">
            <div className=" bg-white rounded shadow">
                <h1 className="text-2xl font-semibold mb-4 bg-gdn text-white p-4 rounded-t-xl">Add Products</h1>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-200 text-red-800 rounded">{errorMsg}</div>
                )}

                <form onSubmit={handleSubmit} className="p-6">
                    {products.map((product, i) => (
                        <div key={i} className="mb-6 border-b pb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="font-semibold">Produk {i + 1}</h2>
                                {products.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveProductInput(i)}
                                        className="flex items-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        <IoTrash className="mr-2" /> Hapus
                                    </button>
                                )}
                            </div>

                            <label className="block mb-1 font-medium">Section</label>
                            <select
                                value={product.sectionId}
                                onChange={(e) => handleChangeProduct(i, "sectionId", e.target.value)}
                                className="w-full border px-3 py-2 rounded mb-4"
                                required
                            >
                                <option value="">Pilih Section</option>
                                {sections.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>

                            <label className="block mb-1 font-medium">Code</label>
                            <input
                                type="text"
                                value={product.code}
                                onChange={(e) => handleChangeProduct(i, "code", e.target.value)}
                                className="w-full border px-3 py-2 rounded mb-4"
                                required
                            />

                            <label className="block mb-1 font-medium">Name</label>
                            <input
                                type="text"
                                value={product.name}
                                onChange={(e) => handleChangeProduct(i, "name", e.target.value)}
                                className="w-full border px-3 py-2 rounded mb-4"
                                required
                            />

                            <label className="block mb-1 font-medium">Description</label>
                            <textarea
                                value={product.description}
                                onChange={(e) => handleChangeProduct(i, "description", e.target.value)}
                                className="w-full border px-3 py-2 rounded mb-4"
                                required
                            ></textarea>

                            <label className="block mb-1 font-medium">Base Price</label>
                            <input
                                type="number"
                                value={product.basePrice}
                                onChange={(e) => handleChangeProduct(i, "basePrice", e.target.value)}
                                className="w-full border px-3 py-2 rounded mb-4"
                                required
                            />

                            <label className="block mb-1 font-medium">Final Price</label>
                            <input
                                type="number"
                                value={product.finalPrice}
                                onChange={(e) => handleChangeProduct(i, "finalPrice", e.target.value)}
                                className="w-full border px-3 py-2 rounded mb-4"
                                required
                            />

                            <label className="block mb-1 font-medium">Channel</label>
                            <input
                                type="text"
                                value={product.channel}
                                onChange={(e) => handleChangeProduct(i, "channel", e.target.value)}
                                className="w-full border px-3 py-2 rounded mb-4"
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block mb-1 font-medium">Icon</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleChangeProduct(i, "iconFile", e.target.files[0])}
                                        className="mb-2"
                                        required
                                    />
                                    {product.iconFile && (
                                        <Image
                                            src={URL.createObjectURL(product.iconFile)}
                                            onClick={() => openPreviewImgMDL(URL.createObjectURL(product.iconFile))}
                                            alt={`Preview Icon ${i + 1}`}
                                            className="w-24 h-24 object-contain rounded border cursor-pointer"
                                            width={50}
                                            height={50}
                                        />
                                    )}
                                </div>


                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddProductInput}
                        className="flex items-center mb-4 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        <TbCirclePlus className="mr-2" /> Tambah Produk
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                    >
                        {loading ? "Menyimpan..." : "Simpan Produk"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
