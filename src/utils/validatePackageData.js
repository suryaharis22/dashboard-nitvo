// utils/validatePackageData.js

// Fungsi validasi untuk data package
export const validatePackageData = (formData, index) => {
    const errors = {};

    // Validasi packageName: Harus ada dan tidak boleh kosong
    if (!formData.packageName) {
        errors.packageName = "Package Name is required";
    }

    // Validasi msisdn: Harus terdiri dari 10-12 digit, dimulai dengan '08'
    if (!formData.msisdn || !/^[0-9]{10,12}$/.test(formData.msisdn) || !formData.msisdn.startsWith("08")) {
        errors.msisdn = "MSISDN must start with '08' and be 10-12 digits";
    }

    // Validasi roaming: Harus ada dan berbentuk string yang valid (misalnya '20GB')
    if (!formData.roaming || !/^\d+(MB|GB|TB)$/.test(formData.roaming)) {
        errors.roaming = "Roaming must end with 'MB', 'GB', or 'TB' (e.g., '20GB')";
    }

    // Validasi provider: Harus ada dan tidak boleh kosong
    // if (!formData.provider) {
    //     errors.provider = " Provider is required";
    // }

    // Validasi active_period: Harus ada dan dalam format yang benar, misalnya "3 bulan"
    if (!formData.active_period) {
        errors.active_period = "Active Period is required (e.g., '3 bulan')";
    } else if (!/^\d+\s*(hari|bulan|tahun)$/i.test(formData.active_period)) {
        errors.active_period = "Format: '<angka> hari/bulan/tahun' (e.g., '3 bulan'";
    }

    // Validasi quota_amount: Harus ada dan dalam format yang benar, misalnya '70GB'
    if (!formData.quota_amount || !/^\d+(MB|GB|TB)$/.test(formData.quota_amount)) {
        errors.quota_amount = "Quota Amount must end with 'MB', 'GB', or 'TB' (e.g., '20GB')";
    }

    // Validasi free_calls: Harus ada dan berbentuk string yang valid, misalnya '150 menit ke semua operator'
    if (!formData.free_calls) {
        errors.free_calls = "Free Calls is required";
    }

    // Validasi sms_amount: Harus ada dan berbentuk string yang valid, misalnya '350 pesan'
    if (!formData.sms_amount) {
        errors.sms_amount = "SMS Amount is required";
    }

    // Validasi free_access: Harus ada dan berbentuk string yang valid
    if (!formData.free_access) {
        errors.free_access = "Free Access is required";
    }

    // Validasi is_active: Harus berupa boolean
    if (typeof formData.is_active !== "boolean") {
        errors.is_active = "Active status must be either true or false";
    }

    // Validasi description: Harus ada dan tidak boleh kosong
    if (!formData.description) {
        errors.description = "Description is required";
    }

    return errors;
};
