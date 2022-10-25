const express = require("express");
const cors = require("cors");
const { Op } = require("sequelize");
const Port = 8000;

const { Transaction, Product, Priority, User, History } = require("./models");
const {
  preprocessingDataTransactions,
  getPriorityValue,
} = require("./utilities");

const associationApriori = require("./services/apriori");
const getItemsRank = require("./services/saw");
const getRecomendationResult = require("./services/recomendationResult");

const app = express();

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// recomendations section
app.get("/api/v2/recomendations", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dataTransactions = await Transaction.findAll({
      where: {
        date: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });
    const dataProducts = await Product.findAll({
      where: {
        status: {
          [Op.is]: true,
        },
      },
    });
    const dataPriority = await Priority.findAll();

    const listItemTransactions =
      preprocessingDataTransactions(dataTransactions);

    const attributePriority = getPriorityValue(dataPriority);

    // const bundlingResult = (
    //   await associationApriori(listItemTransactions, 0.3)
    // ).sort((a, b) => (a.support > b.support ? -1 : 1));

    const bundlingResult = await associationApriori(listItemTransactions, 0.3);

    const itemsRankResult = (
      await getItemsRank(
        dataProducts,
        attributePriority.stock,
        attributePriority.expired,
        attributePriority.profit
      )
    ).slice(0, 15); // get the best 5 product on the rank

    // const result = (
    //   await getRecomendationResult(bundlingResult, itemsRankResult)
    // ).sort((a, b) => (a.support > b.support ? -1 : 1));

    const result = await getRecomendationResult(
      bundlingResult,
      itemsRankResult
    );

    res.status(201).json({
      data: result,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

app.get("/api/v2/attribute", async (req, res) => {
  try {
    const attribute = await Priority.findAndCountAll();
    res.status(200).json({
      data: attribute,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

app.put("/api/v2/attribute", async (req, res) => {
  try {
    const { stock, profit, expired } = req.body;
    let updateAttributePriority = [];
    updateAttributePriority.push(
      Priority.update(
        {
          priority: stock,
        },
        {
          where: {
            attribute: "stock",
          },
        }
      )
    );

    updateAttributePriority.push(
      Priority.update(
        {
          priority: profit,
        },
        {
          where: {
            attribute: "profit",
          },
        }
      )
    );

    updateAttributePriority.push(
      Priority.update(
        {
          priority: expired,
        },
        {
          where: {
            attribute: "expired",
          },
        }
      )
    );
    const updatePriority = await Promise.all(updateAttributePriority);
    res.status(200).json({
      data: updatePriority,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

// Product Sections
app.get("/api/v2/product", async (req, res) => {
  try {
    const { keyword, offset, limit } = req.query;
    const product = await Product.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      where: {
        product_id: {
          [Op.like]: `%${keyword}%`,
        },
      },
    });

    res.status(200).json({
      data: product,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

app.get("/api/v2/product-transactions", async (req, res) => {
  try {
    const { keyword, offset, limit } = req.query;
    const product = await Product.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      where: {
        product_id: {
          [Op.like]: `%${keyword}%`,
        },
        status: {
          [Op.is]: true,
        },
      },
    });

    res.status(200).json({
      data: product,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

app.get("/api/v2/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: {
        id,
      },
    });

    res.status(200).json({
      data: product,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

app.post("/api/v2/product", async (req, res) => {
  try {
    const { product_id, stock, expired, profit, status } = req.body;
    const createProduct = await Product.create({
      product_id,
      stock,
      profit,
      expired,
      status,
    });

    res.status(200).json({
      data: createProduct,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

app.put("/api/v2/product/:id", async (req, res) => {
  try {
    const { product_id, stock, expired, profit, status } = req.body;
    const { id } = req.params;
    const updateProduct = await Product.update(
      {
        stock,
        profit,
        expired,
        status,
        product_id,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).json({
      data: updateProduct,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

// Transaction Section
app.get("/api/v2/transaction", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const tranransaction = await Transaction.findAndCountAll({
      where: {
        date: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    res.status(200).json({
      data: tranransaction,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

app.post("/api/v2/transaction", async (req, res) => {
  try {
    const { list_items, date } = req.body;
    const dateFormater = new Date(date);

    const createTransaction = await Transaction.create({
      list_items,
      date: dateFormater,
    });

    res.status(200).json({
      data: createTransaction,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

app.put("/api/v2/transaction/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { list_items, date } = req.body;
    const dateFormater = new Date(date);

    const editTransaction = await Transaction.update(
      {
        list_items,
        date: dateFormater,
      },
      {
        where: {
          id: parseInt(id),
        },
      }
    );

    res.status(200).json({
      data: editTransaction,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

app.delete("/api/v2/transaction/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteTransaction = await Transaction.destroy({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({
      data: deleteTransaction,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

app.post("/api/v2/history", async (req, res) => {
  try {
    const { username, data, startDate, endDate } = req.body;
    const startDateFormater = new Date(startDate);
    const endDateFormater = new Date(endDate);

    const createHistory = await History.create({
      username,
      data,
      startDate: startDateFormater,
      endDate: endDateFormater,
    });

    res.status(200).json({
      data: createHistory,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

app.get("/api/v2/history/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const getHistory = await History.findAndCountAll({
      where: {
        username,
      },
    });

    res.status(200).json({
      data: getHistory,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

app.delete("/api/v2/history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteHistory = await History.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({
      data: deleteHistory,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

app.post("/api/v2/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userData = await User.findOne({
      where: {
        username,
      },
    });

    if (userData) {
      if (userData.password === password) {
        res.status(200).json({
          data: [],
          message: "Success",
        });
      } else {
        res.status(401).json({
          data: [],
          message: "Password Incorrect",
        });
      }
    } else {
      res.status(401).json({
        data: [],
        message: "Username Not Found",
      });
    }
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

app.post("/api/v2/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    await User.create({
      username,
      password,
    });

    res.status(401).json({
      data: [],
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      data: [],
      message: err.message,
    });
  }
});

app.listen(process.env.PORT || Port, () =>
  console.log("Listening on port 8000")
);
