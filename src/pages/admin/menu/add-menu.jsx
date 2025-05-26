// src/pages/admin/menu/add-menu.jsx

import React, { useState } from "react";
import { useRouter } from "next/router";
import blobToBinary from "@/utils/blobToBinary";
import { postData } from "@/utils/api";
import { TbCirclePlus } from "react-icons/tb";
import { IoTrash } from "react-icons/io5";
import PreviewImgMDL from "@/components/Modal/PreviewImgMDL";
import Image from "next/image";

const AddMenu = () => {
    const router = useRouter();
    const [menus, setMenus] = useState([
        { name: "", iconFile: null },
    ]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const { openPreviewImgMDL } = PreviewImgMDL();

    // Tambah input menu baru
    const handleAddMenuInput = () => {
        setMenus([...menus, { name: "", iconFile: null }]);
    };

    // Hapus input menu berdasarkan index
    const handleRemoveMenuInput = (index) => {
        const newMenus = menus.filter((_, i) => i !== index);
        setMenus(newMenus);
    };

    // Update name atau iconFile pada menu ke-i
    const handleChangeMenu = (index, field, value) => {
        const newMenus = [...menus];
        newMenus[index][field] = value;
        setMenus(newMenus);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi jika tidak ada menu sama sekali
        if (menus.length === 0) {
            setErrorMsg("Minimal harus ada 1 menu yang ditambahkan.");
            return;
        }

        // Validasi per menu
        for (let i = 0; i < menus.length; i++) {
            const menu = menus[i];

            if (!menu.name.trim()) {
                setErrorMsg(`Field "Name" pada menu ke-${i + 1} wajib diisi.`);
                return;
            }

            if (!menu.iconFile) {
                setErrorMsg(`Field "Icon" pada menu ke-${i + 1} wajib di-upload.`);
                return;
            }
        }

        setErrorMsg("");
        setLoading(true);

        try {
            const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/menus`;

            for (const menu of menus) {
                const iconBinary = await blobToBinary(menu.iconFile);
                const binaryBlob = new Blob([iconBinary], { type: menu.iconFile.type });

                const formData = new FormData();
                formData.append("name", menu.name);
                formData.append("icon", binaryBlob, menu.iconFile.name);

                await postData(endpoint, formData);
            }

            alert("Semua menu berhasil ditambahkan!");
            router.push("/admin/menu");
        } catch (error) {
            setErrorMsg(error.response?.data?.message || error.message || "Gagal menambahkan menu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container p-6">
            <div className="p-4 bg-white rounded shadow">
                <h1 className="text-2xl font-semibold mb-6">Add Multiple Menus</h1>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-200 text-red-800 rounded">{errorMsg}</div>
                )}

                <form onSubmit={handleSubmit}>
                    {menus.map((menu, i) => (
                        <div key={i} className="mb-6 border-b pb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="font-semibold">Menu {i + 1}</h2>
                                {menus.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveMenuInput}
                                        className="flex justify-center items-center mb-4 p-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        <IoTrash className="inline-block mr-2" /> remove
                                    </button>

                                )}
                            </div>

                            <label className="block mb-1 font-medium">Name</label>
                            <input
                                type="text"
                                value={menu.name}
                                onChange={(e) => handleChangeMenu(i, "name", e.target.value)}
                                className="w-full border px-3 py-2 rounded mb-4"
                                placeholder="Enter menu name"
                                required
                            />

                            <div>
                                <label className="block mb-1 font-medium">Icon</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleChangeMenu(i, "iconFile", e.target.files[0])}
                                    className="mb-2"
                                    required
                                />
                                {menu.iconFile && (
                                    <Image
                                        onClick={() => openPreviewImgMDL(URL.createObjectURL(menu.iconFile))}
                                        src={URL.createObjectURL(menu.iconFile)}
                                        alt={`Preview Icon ${i + 1}`}
                                        className="w-24 h-24 object-contain rounded border"
                                        width={50}
                                        height={50}
                                    />
                                )}
                            </div>

                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddMenuInput}
                        className="flex justify-center items-center mb-4 p-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        <TbCirclePlus className="inline-block mr-2" /> Add Another Menu
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? "Saving..." : "Add Menus"}
                    </button>
                </form>
            </div>

        </div>
    );
};

export default AddMenu;
