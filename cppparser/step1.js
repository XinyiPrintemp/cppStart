"use strict";
const CLEARING_HOUSE = require('path/to/clearing-house.js');
const TRANSACTION_FACTORY = require('path/to/transaction-factory.js');

let createEntity = function (name, prefix) {
	let transactions = {};  //map 
	let id = 0;

	function createTransaction (type, ticker, quantity, price) { 
		let curT = TRANSACTION_FACTORY.bind (undefined, name, prefix + (id++), type, quantity, price);
		transactions[curT.transactionId] = curT;
		CLEARING_HOUSE.addTransaction(curT);
		curT.cleared = CLEARING_HOUSE.isCleared (name, curT.transactionId);

	}

	var sell = createTransaction.bind(undefined, "S");
	var buy = createTransaction.bind(undefined, "B");
    
    //perform all of the transactions in the array, creating new IDs for each one of them
	function batchTransactions (simpleTrans) {
		simpleTrans.forEach( elem => {
			createTransaction(elem.type, elem.ticker, elem.quantity, elem.price);
		});
	}

	

    function listTransactions (heading, filter) {
    	console.log(heading);
    	transactions.forEach(
    		(v, k) => {
    			if(v.cleared === filter)
    				console.log(k);
    		}
    	);
    }

	var pending = listTransactions.bind(undefined, "Pending transactions for " + name, false);
	var cleared = listTransactions.bind(undefined, "Cleared transactions for " + name, true);

	function deal(value, key, map) {
		value.cleared = CLEARING_HOUSE.isCleared(name, key);
		map.set(key, value);
	}

	function refresh() {
		transactions.forEach(deal);
	}

	return {
		sell: sell,
		buy : buy,
		cleared: cleared,
		refresh: refresh,
		batchTransactions: batchTransactions
	};
};




let t = TRANSACTION_FACTORY(entityName, transId, type, ticker, quantity, price); // type must be "B" or "S"