/**
 * Helper untuk format angka ke Rupiah dengan Rp dan tanpa desimal
 * @param {number|string} amount - Angka atau string angka yang akan diformat
 * @returns {string} Format Rupiah dalam string
 */
export const formatToRupiah = (amount) => {
    const parsedAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;

    if (typeof parsedAmount !== 'number' || isNaN(parsedAmount)) {
        console.error('Input harus berupa angka atau string angka');
        return 'Invalid input';
    }

    return `Rp ${new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(parsedAmount)}`;
};
