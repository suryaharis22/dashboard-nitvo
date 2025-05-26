import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getData, putData } from "@/utils/api";
import Swal from "sweetalert2";
import Image from "next/image";

const EditSection = () => {
    const router = useRouter();
    const { sectionid } = router.query;

    const [name, setName] = useState("");
    const [iconFile, setIconFile] = useState(null);
    const [icon, setIcon] = useState("");
    const [bannerFile, setBannerFile] = useState(null);
    const [banner, setBanner] = useState("");
    const [menus, setMenus] = useState([]);
    const [idmenu, setIdmenu] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
        if (sectionid) {
            getSectionById();
            getMenus();
        }
    }, [sectionid]);

    const getSectionById = async () => {
        try {
            const response = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sections/id/${sectionid}`);
            const section = response.data;
            setName(section.name);
            setIdmenu(section.menuId);
            setType(section.type);
            setIcon(`${process.env.NEXT_PUBLIC_URL_STORAGE}${section.icon}`);
            setBanner(`${process.env.NEXT_PUBLIC_URL_STORAGE}${section.banner}`); // banner lama
        } catch (error) {
            console.error("Failed to fetch section:", error);
        }
    };

    const getMenus = async () => {
        try {
            const res = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/menus`);
            setMenus(res.data);
        } catch (error) {
            console.error("Gagal mengambil data menu", error);
        }
    };

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        setIconFile(file);
        if (file) {
            setIcon(URL.createObjectURL(file));
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        setBannerFile(file);
        if (file) {
            setBanner(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("menuId", idmenu);
        formData.append("name", name);
        formData.append("type", type);
        if (iconFile) formData.append("icon", iconFile);
        if (bannerFile) formData.append("banner", bannerFile);

        try {
            const response = await putData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sections/id/${sectionid}`, formData);
            Swal.fire("Berhasil", "Section berhasil diperbarui", "success");
            router.push("/admin/section");
        } catch (error) {
            console.error("Error updating section:", error);
            Swal.fire("Gagal", "Terjadi kesalahan saat mengupdate section", "error");
        }
    };

    return (
        <div className="m-4  max-w-5xl  bg-white shadow-lg rounded-xl">
            <h1 className="text-2xl font-semibold mb-4 bg-gdn text-white p-4 rounded-t-xl">Edit Section</h1>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 p-6">

                {/* Bagian Kiri */}
                <div className="space-y-4">
                    {/* Nama Section */}
                    <div>
                        <label className="block mb-1 font-medium">Nama Section</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    {/* Pilih Menu */}
                    <div>
                        <label className="block mb-1 font-medium">Pilih Menu</label>
                        <select
                            value={idmenu}
                            onChange={(e) => setIdmenu(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                        >
                            <option value="">-- Pilih Menu --</option>
                            {menus.map((menu) => (
                                <option key={menu.id} value={menu.id}>
                                    {menu.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pilih Tipe */}
                    <div>
                        <label className="block mb-1 font-medium">Tipe Section</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                        >
                            <option value="">-- Pilih Type --</option>
                            <option value="prepaid">Prepaid</option>
                            <option value="postpaid">Postpaid</option>
                        </select>
                    </div>
                </div>

                {/* Bagian Kanan */}
                <div className="space-y-4">
                    {/* Upload Icon */}
                    <div>
                        <label className="block mb-1 font-medium">Icon Section</label>
                        {icon && (
                            <Image
                                src={icon}
                                alt="Preview Icon"
                                className="w-28 h-28 object-cover rounded mb-2 border"
                                width={50}
                                height={50}
                            />
                        )}
                        <input type="file" accept="image/*" onChange={handleIconChange} />
                    </div>

                    {/* Upload Banner */}
                    <div>
                        <label className="block mb-1 font-medium">Banner Section</label>
                        {banner && (
                            <Image
                                src={banner}
                                alt="Preview Banner"
                                className="w-full h-40 object-cover rounded mb-2 border"
                                width={100}
                                height={100}
                            />
                        )}
                        <input type="file" accept="image/*" onChange={handleBannerChange} />
                    </div>
                </div>

                {/* Tombol Simpan (full width bawah) */}
                <div className="md:col-span-2 pt-6">
                    <button
                        type="submit"
                        className="bg-primary text-white px-6 py-3 font-semibold rounded-xl hover:bg-primary-dark hover:text-warning-light w-full"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditSection;
