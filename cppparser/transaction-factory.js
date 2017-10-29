"use strict";

module.exports = (entity, id, type, ticker, quantity, price) => {
    if (entity && id && type && (type === "S" || type === "B") && ticker
        && !isNaN(quantity) && quantity > 0
        && !isNaN(price) && price > 0) {
        return {
            "entity": entity,
            "transactionId": id,
            "type": type,
            "ticker": ticker,
            "quantity": quantity,
            "price": price
        };
    } else {
        return null;
    }
};

