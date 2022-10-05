const _ = require("lodash");

function getMinMax(value) {
  const expiredMin = _.minBy(value, "expired");
  const profitMax = _.maxBy(value, "profit");
  const stockMax = _.maxBy(value, "stock");
  return {
    expired: expiredMin.expired,
    profit: profitMax.profit,
    stock: stockMax.stock,
  };
}

function normalize(matrix, maxmin) {
  matrix.expired = maxmin.expired / matrix.expired;
  matrix.stock = matrix.stock / maxmin.stock;
  matrix.profit = matrix.profit / maxmin.profit;

  return matrix;
}

function countRank(result, stockPriotity, expiredPriority, profitPriority) {
  const total =
    result.stock * stockPriotity +
    result.expired * expiredPriority +
    result.profit * profitPriority;
  const countRankResult = {
    product_id: result.product_id,
    total: total,
  };
  return countRankResult;
}

const preprocessingDataProduct = (listItems) => {
  let product = [];
  listItems.forEach((i) => {
    product.push({
      id: i.id,
      stock: i.stock,
      profit: i.profit,
      expired: Math.floor(
        (i.expired.getTime() - Date.now()) / (24 * 3600 * 1000)
      ),
      product_id: i.product_id,
      status: i.status,
    });
  });

  return product;
};

const getItemsRank = async (
  listItems,
  stockPriotity,
  expiredPriority,
  profitPriority
) => {
  console.log(`Executing SAW...`);
  const product = preprocessingDataProduct(listItems);
  const rangeValue = getMinMax(product);
  const normalizeValue = _.map(product, (snapshot) =>
    normalize(snapshot, rangeValue)
  );
  const weightRank = _.map(normalizeValue, (snapshot) =>
    countRank(snapshot, stockPriotity, expiredPriority, profitPriority)
  );
  const result = weightRank.sort((a, b) => {
    return a.total - b.total;
  });

  const descResult = result.reverse();

  return descResult;
};

module.exports = getItemsRank;
