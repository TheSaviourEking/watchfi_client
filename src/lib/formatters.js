// const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
//     currency: "USD",
//     style: "currency",
//     minimumFractionDigits: 0,
// })

// export function formatCurrency(amount) {
//     return CURRENCY_FORMATTER.format(amount)
// }

// const NUMBER_FORMATTER = new Intl.NumberFormat("en-US")

// export function formatNumber(number) {
//     return NUMBER_FORMATTER.format(number)
// }

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
    minimumFractionDigits: 2,
});

export function formatCurrency(amount) {
    return CURRENCY_FORMATTER.format(amount).replace(/(\.\d{2})\d+/, "$1");
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export function formatNumber(number) {
    return NUMBER_FORMATTER.format(number);
}

// utils version
// export function formatCurrency(input, decimalPlaces = 2) {
//   return Number(input).toFixed(decimalPlaces)
// }