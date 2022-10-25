const aprioriAlgorithm = require("node-apriori");

const associationApriori = async (transactions, minSupport) => {
  console.log(`Executing Apriori...`);
  const convertSupport = parseFloat(minSupport / 100);

  const apriori = new aprioriAlgorithm.Apriori(convertSupport);

  let Data = [];

  apriori.on("data", function (itemset) {
    const support = itemset.support;
    const items = itemset.items;

    if (items.length === 1) {
      Data.push({
        item: items[0],
        support,
      });
    }
  });

  // const associationResult = apriori
  //   .exec(transactions)
  //   .then(function (snapshot) {
  //     let result = [];
  //     const combineItemset = snapshot.itemsets.filter(
  //       (item) => item.items.length > 1
  //     );
  //     combineItemset.forEach((itemset) => {
  //       itemset.items.forEach((itemName) => {
  //         const supportDevide = Data.filter((i) => i.item === itemName);
  //         result.push({
  //           itemset: itemset.items,
  //           product: supportDevide[0].item,
  //           support: (itemset.support / transactions.length) * 100,
  //           confidence: (itemset.support / supportDevide[0].support) * 100,
  //         });
  //       });
  //     });
  //     return result;
  //   });

  // const associationResult = apriori
  //   .exec(transactions)
  //   .then(function (snapshot) {
  //     let result = [];
  //     const combineItemset = snapshot.itemsets.filter(
  //       (item) => item.items.length > 1
  //     );
  //     combineItemset.forEach((itemset) => {
  //       let liftDevided = 0;
  //       let confidence = [];
  //       itemset.items.forEach((itemName) => {
  //         const supportDevide = Data.filter((i) => i.item === itemName);
  //         liftDevided += supportDevide[0].support;
  //         // result.push({
  //         //   itemset: itemset.items,
  //         //   product: supportDevide[0].item,
  //         //   support: (itemset.support / transactions.length) * 100,
  //         //   confidence: (itemset.support / supportDevide[0].support) * 100,
  //         // });
  //         confidence.push({
  //           item: supportDevide[0].item,
  //           value: (itemset.support / supportDevide[0].support) * 100,
  //         });
  //       });
  //       result.push({
  //         itemset: itemset.items,
  //         support: (itemset.support / transactions.length) * 100,
  //         confidence: confidence,
  //         lift:
  //           itemset.support /
  //           transactions.length /
  //           (liftDevided / (transactions.length * transactions.length)),
  //       });
  //       // console.log(
  //       //   itemset,
  //       //   "LIFT: ",
  //       //   itemset.support /
  //       //     transactions.length /
  //       //     (liftDevided / (transactions.length * transactions.length))
  //       // );
  //     });
  //     return result;
  //   });

  //   const associationResult = apriori
  //     .exec(transactions)
  //     .then(function (snapshot) {
  //       let result = [];
  //       const combineItemset = snapshot.itemsets.filter(
  //         (item) => item.items.length > 1
  //       );
  //       combineItemset.forEach((itemset) => {
  //         let liftDevided = 1;
  //         let confidence = [];
  //         itemset.items.forEach((itemName) => {
  //           const supportDevide = Data.filter((i) => i.item === itemName);
  //           liftDevided =
  //             (liftDevided * supportDevide[0].support) / transactions.length;
  //           const liftDevide = Data.filter(
  //             (i) => i.item !== itemName && itemset.items.includes(i.item)
  //           );
  //           let liftList = [];
  //           liftDevide.forEach((lift) => {
  //             //console.log("ITEMSETS: ", itemset);
  //             // console.log(supportDevide[0]);
  //             // console.log("LIFT: ", lift);
  //             // console.log("\n");
  //             const liftconfidence = itemset.support / supportDevide[0].support;
  //             const counterLift = lift.support / transactions.length;
  //             const liftValue = liftconfidence / counterLift;
  //             // console.log("LIFT ITEM: ", lift.item);
  //             // console.log("CONFIDENCE: ", liftconfidence);
  //             // console.log("LIFT_COUNTER: ", counterLift);
  //             // console.log("\n");
  //             // console.log("LIFT_VALUE_CONFIDENCE: ", liftconfidence);
  //             // console.log("LIFT_VALUE_DEVIDED: ", counterLift);

  //             liftList.push({ value: liftValue, item: lift.item });
  //           });

  //           console.log("LIFT_LIST: ", liftList);

  //           confidence.push({
  //             item: supportDevide[0].item,
  //             value: (itemset.support / supportDevide[0].support) * 100,
  //             lift_ratio: liftList,
  //           });
  //         });
  //         result.push({
  //           itemset: itemset.items,
  //           support: (itemset.support / transactions.length) * 100,
  //           confidence: confidence,
  //           lift: itemset.support / transactions.length / liftDevided,
  //         });

  //         // console.log("\n");
  //       });
  //       return result;
  //     });

  //   return associationResult;
  // };

  const associationResult = apriori
    .exec(transactions)
    .then(function (snapshot) {
      let result = [];

      const combineItemset = snapshot.itemsets.filter(
        (item) => item.items.length > 1
      );

      combineItemset.forEach((itemset) => {
        let confidence = [];

        itemset.items.forEach((itemName) => {
          const supportDevide = Data.filter((i) => i.item === itemName);

          const liftDevide = Data.filter(
            (i) => i.item !== itemName && itemset.items.includes(i.item)
          );

          let liftList = [];

          liftDevide.forEach((lift) => {
            const liftconfidence = itemset.support / supportDevide[0].support;
            const counterLift = lift.support / transactions.length;
            const liftValue = liftconfidence / counterLift;

            liftList.push({ value: liftValue, item: lift.item });
          });

          // console.log("LIFT_LIST: ", liftList);

          confidence.push({
            item: supportDevide[0].item,
            value: (itemset.support / supportDevide[0].support) * 100,
            lift_ratio: liftList,
          });
        });
        result.push({
          itemset: itemset.items,
          support: (itemset.support / transactions.length) * 100,
          confidence: confidence,
        });

        // console.log("\n");
      });
      return result;
    });

  return associationResult;
};

module.exports = associationApriori;
