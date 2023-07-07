export const getDiscountedPricePercentage = (originalPrice, DiscountedPrice) => {
        const discount =  originalPrice - DiscountedPrice;

        const discountPercentage = (discount/originalPrice)*100;

        return discountPercentage.toFixed(2)
}