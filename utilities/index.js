exports.preprocessingDataTransactions = (transactionList) => {
  const itemList = [];
  transactionList.forEach((i) => {
    itemList.push(i.list_items);
  });

  return itemList;
};

exports.getPriorityValue = (priorityData) => {
  const stock = priorityData.filter((i) => i.attribute === "stock");
  const profit = priorityData.filter((i) => i.attribute === "profit");
  const expired = priorityData.filter((i) => i.attribute === "expired");

  return {
    stock: stock[0].priority / 100,
    profit: profit[0].priority / 100,
    expired: expired[0].priority / 100,
  };
};
