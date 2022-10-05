const recomendationResult = async (itemset, bestItems) => {
  const itemsIDList = bestItems.map((i) => i.product_id);
  let recomendedItemset = [];
  itemset.forEach((item) => {
    for (let index = 0; index < item.itemset.length; index++) {
      if (itemsIDList.includes(item.itemset[index])) {
        recomendedItemset.push(item);
        index++;
      }
    }
  });
  return recomendedItemset;
};

module.exports = recomendationResult;
