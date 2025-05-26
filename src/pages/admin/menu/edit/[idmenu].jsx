import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getData, putData } from "@/utils/api";
import Swal from "sweetalert2";
import Image from "next/image";

const EditMenu = () => {
    const router = useRouter();
    const { idmenu } = router.query;

    const [name, setName] = useState("");
    const [iconFile, setIconFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(""); // untuk preview icon lama / baru

    useEffect(() => {
        if (idmenu) {
            getMenuById();
        }
    }, [idmenu]);

    const getMenuById = async () => {
        try {
            const response = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/menus/id/${idmenu}`);
            const menu = response.data;
            setName(menu.name);
            // Set preview image dari icon lama
            setPreviewImage(`${process.env.NEXT_PUBLIC_URL_STORAGE}${menu.icon}`);
        } catch (error) {
            console.error("Failed to fetch menu:", error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setIconFile(file);
        // Tampilkan preview dari file baru yang diupload
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        if (iconFile) {
            formData.append("icon", iconFile);
        }

        try {
            const response = await putData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/menus/id/${idmenu}`, formData);
            Swal.fire("Berhasil", "Menu berhasil diperbarui", "success");
            router.push("/admin/menu");
        } catch (error) {
            console.error("Error updating menu:", error);
            Swal.fire("Gagal", "Terjadi kesalahan saat mengupdate menu", "error");
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-xl font-semibold mb-4">Edit Menu</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Nama Menu</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Icon Menu</label>
                    {previewImage && (
                        <Image
                            src={previewImage}
                            alt="Preview Icon"
                            className="w-28 h-28 object-cover rounded mb-2 border"
                            width={100}
                            height={100}
                        />
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditMenu;
