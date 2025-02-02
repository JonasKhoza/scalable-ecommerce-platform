import { Request, Response } from "express";
import { CustomError } from "../models/error.models";
import { Order } from "../models/order.models";
import errorResponseHelper from "../utils/errorResponseHelper";
import { ResponseStructure } from "../models/response.models";

const createUserOrderHandler = async (req: Request, res: Response) => {
  try {
    const { cartId } = req.body;
    const { accessToken } = (req as any).userData;

    if (!cartId.trim())
      throw new CustomError(false, "Need to provide a cart parameter.", 400);

    //Get cart from the shopping cart service
    const SHOPPING_CART_SERVICE = process.env.SHOPPING_CART_SERVICE_URL;

    const results = await fetch(
      `http://${SHOPPING_CART_SERVICE}:8080/v1/api/carts/${cartId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!results.ok)
      throw new CustomError(
        false,
        "Something went wrong whilst fetching cart.",
        500
      );

    const cartResults = await results.json();

    if (cartResults.data.cart.length <= 0)
      throw new CustomError(false, "Cart was not found ", 404);

    const { _id, user_id } = cartResults.data.cart[0];

    //Create an order

    const order = new Order(_id, user_id);

    //Save order to the database
    const resultedObj = await order.saveOrder();
    console.log(resultedObj);
    //If it's an error
    if (resultedObj instanceof CustomError) throw resultedObj;

    //If success
    res.status(200).json(resultedObj);
  } catch (err) {
    console.log(err);

    errorResponseHelper(res, err);
  }
};

const getUserOrderDetailsHandler = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    //Validate
    if (!orderId.trim())
      throw new CustomError(false, "Order identifier must be provider.", 400);

    //Query the db for the order
    const results = await Order.findOrderById(orderId);

    //If an error occured
    if (results instanceof CustomError) throw results;

    //If order is not found
    if (results.length <= 0)
      throw new CustomError(false, "Order was not found.", 404);

    res.status(200).json(new ResponseStructure(true, 200, { order: results }));
  } catch (err) {
    console.log(err);

    errorResponseHelper(res, err);
  }
};

const getUserOrdersHandler = async (req: Request, res: Response) => {
  try {
    //Get user data
    const { user } = (req as any).userData;

    //Get user orders from the database
    const results = await Order.findAllOrdersForUser(user.userId);

    //If an error occured
    if (results instanceof CustomError) throw results;

    res.status(200).json(new ResponseStructure(true, 200, { orders: results }));
  } catch (err) {
    console.log(err);

    errorResponseHelper(res, err);
  }
};

const updateUserOrderStatusHandler = async (req: Request, res: Response) => {
  try {
    const { newStatus } = req.body;
    console.log(req.body, req.params);
    const { orderId } = req.params;

    //Create order instance
    const order = new Order(null, null, newStatus, orderId);

    //Update order
    const results = await order.saveOrder();

    if (results instanceof CustomError) throw results;

    res.status(200).json(results);
  } catch (err) {
    console.log(err);

    errorResponseHelper(res, err);
  }
};

export {
  createUserOrderHandler,
  getUserOrderDetailsHandler,
  getUserOrdersHandler,
  updateUserOrderStatusHandler,
};
