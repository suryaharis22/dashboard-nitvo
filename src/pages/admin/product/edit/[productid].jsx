import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getData, putData } from "@/utils/api";
import Swal from "sweetalert2";
import Image from "next/image";

const EditProduct = () => {
    const router = useRouter();
    const { productid } = router.query;

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [finalPrice, setFinalPrice] = useState("");
    const [channel, setChannel] = useState("");
    const [type, setType] = useState("");
    const [iconFile, setIconFile] = useState(null);
    const [icon, setIcon] = useState("");
    const [sections, setSections] = useState([]);
    const [idsection, setIdsection] = useState("");

    useEffect(() => {
        if (productid) {
            getProductById();
            getSections();
        }
    }, [productid]);

    const getProductById = async () => {
        try {
            const response = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products/id/${productid}`);
            const product = response.data;
            setCode(product.code);
            setName(product.name);
            setDescription(product.description);
            setBasePrice(product.basePrice);
            setFinalPrice(product.finalPrice);
            setChannel(product.channel);
            setType(product.type || ""); // Pastikan property type ada di product
            setIdsection(product.sectionId);
            setIcon(`${process.env.NEXT_PUBLIC_URL_STORAGE}${product.icon}`);
        } catch (error) {
            console.error("Failed to fetch product:", error);
        }
    };

    const getSections = async () => {
        try {
            const res = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sections`);
            setSections(res.data);
        } catch (error) {
            console.error("Gagal mengambil data section", error);
        }
    };

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        setIconFile(file);
        if (file) {
            setIcon(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("sectionId", idsection);
        formData.append("code", code);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("basePrice", basePrice);
        formData.append("finalPrice", finalPrice);
        formData.append("channel", channel);
        formData.append("type", type);
        if (iconFile) formData.append("icon", iconFile);

        try {
            const response = await putData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products/id/${productid}`, formData);
            Swal.fire("Berhasil", "Product berhasil diperbarui", "success");
            router.push("/admin/product");
        } catch (error) {
            console.error("Error updating product:", error);
            Swal.fire("Gagal", "Terjadi kesalahan saat mengupdate product", "error");
        }
    };

    return (
        <div className="m-4 max-w-5xl bg-white shadow-lg rounded-xl">
            <h1 className="text-2xl font-semibold mb-4 bg-gdn text-white p-4 rounded-t-xl">Edit Product</h1>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 p-6">
                {/* Bagian Kiri */}
                <div className="space-y-4">
                    {/* Code */}
                    <div>
                        <label className="block mb-1 font-medium">Code Product</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    {/* Nama Product */}
                    <div>
                        <label className="block mb-1 font-medium">Nama Product</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    {/* Pilih Section */}
                    <div>
                        <label className="block mb-1 font-medium">Pilih Section</label>
                        <select
                            value={idsection}
                            onChange={(e) => setIdsection(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                        >
                            <option value="">-- Pilih Section --</option>
                            {sections.map((section) => (
                                <option key={section.id} value={section.id}>
                                    {section.name}
                                </option>
                            ))}
                        </select>
                    </div>



                    {/* Deskripsi */}
                    <div>
                        <label className="block mb-1 font-medium">Deskripsi</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                </div>

                {/* Bagian Kanan */}
                <div className="space-y-4">
                    {/* Base Price */}
                    <div>
                        <label className="block mb-1 font-medium">Base Price</label>
                        <input
                            type="number"
                            value={basePrice}
                            onChange={(e) => setBasePrice(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    {/* Final Price */}
                    <div>
                        <label className="block mb-1 font-medium">Final Price</label>
                        <input
                            type="number"
                            value={finalPrice}
                            onChange={(e) => setFinalPrice(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    {/* Channel */}
                    <div>
                        <label className="block mb-1 font-medium">Channel</label>
                        <input
                            type="text"
                            value={channel}
                            onChange={(e) => setChannel(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    {/* Upload Icon */}
                    <div>
                        <label className="block mb-1 font-medium">Icon Product</label>
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

export default EditProduct;
