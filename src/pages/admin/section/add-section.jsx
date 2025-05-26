// src/pages/admin/section/add-section.jsx

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { postData, getData } from "@/utils/api";
import { TbCirclePlus } from "react-icons/tb";
import { IoTrash } from "react-icons/io5";
import blobToBinary from "@/utils/blobToBinary";
import PreviewImgMDL from "@/components/Modal/PreviewImgMDL";
import Image from "next/image";

const AddSection = () => {
    const router = useRouter();
    const [sections, setSections] = useState([{ menuId: "", name: "", type: "", iconFile: null, bannerFile: null }]);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const { openPreviewImgMDL } = PreviewImgMDL();

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const res = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/menus`);
                setMenus(res.data);
            } catch (error) {
                console.error("Gagal mengambil data menu", error);
            }
        };

        fetchMenus();
    }, []);

    const handleAddSectionInput = () => {
        setSections([...sections, { menuId: "", type: "", iconFile: null, bannerFile: null }]);
    };

    const handleRemoveSectionInput = (index) => {
        const newSections = sections.filter((_, i) => i !== index);
        setSections(newSections);
    };

    const handleChangeSection = (index, field, value) => {
        const updated = [...sections];
        updated[index][field] = value;
        setSections(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (sections.length === 0) {
            setErrorMsg("Minimal harus ada 1 section.");
            return;
        }

        // Validasi isi setiap section
        for (let i = 0; i < sections.length; i++) {
            const s = sections[i];
            if (!s.menuId || !s.name || !s.type || !s.iconFile || !s.bannerFile) {
                setErrorMsg(`Semua field wajib diisi di section ke-${i + 1}.`);
                return;
            }
        }

        setErrorMsg("");
        setLoading(true);

        try {
            const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/sections`;

            for (const section of sections) {
                const iconBinary = await blobToBinary(section.iconFile);
                const bannerBinary = await blobToBinary(section.bannerFile);

                const iconBlob = new Blob([iconBinary], { type: section.iconFile.type });
                const bannerBlob = new Blob([bannerBinary], { type: section.bannerFile.type });

                const formData = new FormData();
                formData.append("menuId", section.menuId);
                formData.append("name", section.name);
                formData.append("type", section.type);
                formData.append("icon", iconBlob, section.iconFile.name);
                formData.append("banner", bannerBlob, section.bannerFile.name);

                await postData(endpoint, formData);
            }

            alert("Semua section berhasil ditambahkan!");
            router.push("/section");
        } catch (error) {
            setErrorMsg(error.response?.data?.message || error.message || "Gagal menambahkan section");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container p-6">
            <div className="p-4 bg-white rounded shadow">
                <h1 className="text-2xl font-semibold mb-6">Add Multiple Sections</h1>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-200 text-red-800 rounded">{errorMsg}</div>
                )}

                <form onSubmit={handleSubmit}>
                    {sections.map((section, i) => (
                        <div key={i} className="mb-6 border-b pb-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="font-semibold">Section {i + 1}</h2>
                                {sections.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSectionInput(i)}
                                        className="flex justify-center items-center p-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        <IoTrash className="inline-block mr-2" /> Remove
                                    </button>
                                )}
                            </div>
                            <label className="block mb-1 font-medium">Name</label>
                            <input
                                type="text"
                                value={section.name}
                                onChange={(e) => handleChangeSection(i, "name", e.target.value)}
                                className="w-full border px-3 py-2 rounded mb-4"
                                required
                            />

                            <label className="block mb-1 font-medium">Menu</label>
                            <select
                                value={section.menuId}
                                onChange={(e) => handleChangeSection(i, "menuId", e.target.value)}
                                className="w-full border px-3 py-2 rounded mb-4"
                                required
                            >
                                <option value="">Pilih Menu</option>
                                {menus.map((menu) => (
                                    <option key={menu.id} value={menu.id}>
                                        {menu.name}
                                    </option>
                                ))}
                            </select>

                            <label className="block mb-1 font-medium">Type</label>
                            <select
                                value={section.type}
                                onChange={(e) => handleChangeSection(i, "type", e.target.value)}
                                className="w-full border px-3 py-2 rounded mb-4"
                                required
                            >
                                <option value="">Pilih Type</option>
                                <option value="prepaid">Prepaid</option>
                                <option value="postpaid">Postpaid</option>
                            </select>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block mb-1 font-medium">Icon</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleChangeSection(i, "iconFile", e.target.files[0])
                                        }
                                        className="mb-2"
                                        required
                                    />
                                    {section.iconFile && (
                                        <Image
                                            onClick={() => openPreviewImgMDL(URL.createObjectURL(section.iconFile))}
                                            src={URL.createObjectURL(section.iconFile)}
                                            alt={`Preview Icon ${i + 1}`}
                                            className="w-24 h-24 object-contain rounded border"
                                            width={50}
                                            height={50}
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">Banner</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleChangeSection(i, "bannerFile", e.target.files[0])
                                        }
                                        className="mb-2"
                                        required
                                    />
                                    {section.bannerFile && (
                                        <Image
                                            onClick={() => openPreviewImgMDL(URL.createObjectURL(section.bannerFile))}
                                            src={URL.createObjectURL(section.bannerFile)}
                                            alt={`Preview Banner ${i + 1}`}
                                            className="w-24 h-24 object-contain rounded border"
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
                        onClick={handleAddSectionInput}
                        className="flex justify-center items-center mb-4 p-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        <TbCirclePlus className="inline-block mr-2" /> Add Another Section
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? "Saving..." : "Add Sections"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddSection;
