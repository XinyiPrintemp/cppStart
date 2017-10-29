"use strict";

let CH = (() => {
    var d_transactions = [];
    const RANDOM_DELAY = 5000;
    const STATUS = {
        "CLEAR":"Cleared",
        "PENDING":"Pending",
        "REJECT":"Rejected"
    };

    function addTransaction (newTransaction, callback) {
        let transactionCopy = JSON.parse(JSON.stringify(newTransaction));
        if (validTransaction(transactionCopy)) {
            transactionCopy.callback = callback;
            transactionCopy.cleared = false;
            d_transactions[d_transactions.length] = transactionCopy;
            attemptClearing(transactionCopy);
        } else {
            throw new Error("Invalid Transaction!");
        }
    };

    function addTransactionP (newTransaction) {
	    return new Promise((resolve, reject)=>{
	        try {
		        addTransaction(newTransaction, resolve);
	        } catch (e) {
		        reject(e);
	        }
	    });
    };

    function attemptClearing (transaction, callback) {
        let findType =  transaction.type === "B" ? "S" : "B";
        let found = d_transactions.findIndex((target)=>(findType === target.type
                                                        && target.ticker == transaction.ticker
                                                        && target.price === transaction.price
                                                        && target.quantity === transaction.quantity
                                                        && target.cleared === false));
        if (found >= 0) {
            d_transactions[found].cleared = true;
            transaction.cleared = true;
            if (transaction.callback) {
                setTimeout(transaction.callback,
                           Math.random() * RANDOM_DELAY,
                           {"id": transaction.transactionId,
                            "status": STATUS.CLEAR});
            }
            if (d_transactions[found].callback) {
                setTimeout(d_transactions[found].callback,
                           Math.random() * RANDOM_DELAY,
                           {"id": d_transactions[found].transactionId,
                            "status": STATUS.CLEAR});
            }
        } else {
            return false;
        }
        return true;
    };

    function cleared () {
        console.log("Completed Transactions:");
        d_transactions.filter(elem=>elem.cleared).forEach((elem)=>{console.log(elem.entity + " - " + elem.transactionId);});
    };

    function isCleared (entity, id) {
        let item = d_transactions.find((elem)=>(elem.entity === entity && elem.transactionId === id));
	    return !!item && item.cleared;
    };

    function pending () {
        console.log("Pending Transactions:");
        d_transactions.filter(elem=>!elem.cleared).forEach((elem)=>{console.log(elem.entity + " - " + elem.transactionId);});
    };

    function validTransaction (transaction) {
        return (transaction.entity && transaction.transactionId
                && transaction.type && (transaction.type === "S" || transaction.type === "B")
                && transaction.ticker
                && !isNaN(transaction.quantity) && transaction.quantity > 0
                && !isNaN(transaction.price) && transaction.price > 0);
    };

    return {
        "addTransaction": addTransaction,
        "addTransactionP": addTransactionP,
        "cleared": cleared,
        "isCleared": isCleared,
        "pending": pending
    };
})();

module.exports = CH;
