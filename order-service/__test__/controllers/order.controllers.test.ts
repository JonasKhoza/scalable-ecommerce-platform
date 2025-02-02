import { Request, Response } from "express";

import {
  createUserOrderHandler,
  getUserOrderDetailsHandler,
  getUserOrdersHandler,
  updateUserOrderStatusHandler,
} from "../../src/controllers/order.controllers";

import { CustomError } from "../../src/models/error.models";
import errorResponseHelper from "../../src/utils/errorResponseHelper";
import { Order } from "../../src/models/order.models"; // Ensure the actual Order class is imported
import { ResponseStructure } from "../../src/models/response.models";

jest.mock("../../src/utils/errorResponseHelper");

// Mock global fetch
global.fetch = jest.fn();

describe("Create Order Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: { cartId: "12345" },
      userData: { accessToken: "fake_token" },
    } as Partial<Request>;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    jest.clearAllMocks();
  });

  it("should create a user order successfully", async () => {
    // Mock fetch response for shopping cart service
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: { cart: [{ _id: "cart123", user_id: "user123" }] },
      }),
    });

    // Mocking instance method of Order
    const mockSaveOrder = jest
      .spyOn(Order.prototype, "saveOrder")
      .mockResolvedValue(
        new ResponseStructure(true, 202, {
          message: "Order successfully created.",
          _id: [],
        })
      );

    await createUserOrderHandler(req as Request, res as Response);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("http://"),
      expect.any(Object)
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      new ResponseStructure(true, 202, {
        message: "Order successfully created.",
        _id: [],
      })
    );

    expect(mockSaveOrder).toHaveBeenCalled(); // Ensure method was called
  });

  it("should return an error if the cart is not found", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: { cart: [] } }),
    });

    await createUserOrderHandler(req as Request, res as Response);

    expect(errorResponseHelper).toHaveBeenCalledWith(
      res,
      new CustomError(false, "Cart was not found ", 404)
    );
  });

  it("should return an error if fetching the cart fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    await createUserOrderHandler(req as Request, res as Response);

    expect(errorResponseHelper).toHaveBeenCalledWith(
      res,
      new CustomError(false, "Something went wrong whilst fetching cart.", 500)
    );
  });
});

describe("Get User Order Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: { orderId: "bdamhsdmf" },
    } as Partial<Request>;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    jest.clearAllMocks();
  });

  //For when it's a success
  it("should successfully return an order", async () => {
    // Mocking findOrderById for this test
    const mockFindOrderById = jest
      .spyOn(Order, "findOrderById")
      .mockResolvedValue([{ cart: [] }]);

    await getUserOrderDetailsHandler(req as Request, res as Response);

    expect(mockFindOrderById).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      new ResponseStructure(true, 200, { order: [{ cart: [] }] })
    );
  });

  //For when not found.
  it("should return an error if no order was found", async () => {
    // Mocking findOrderById for this test
    jest.spyOn(Order, "findOrderById").mockResolvedValue([]);

    await getUserOrderDetailsHandler(req as Request, res as Response);

    expect(errorResponseHelper).toHaveBeenCalledWith(
      res,
      new CustomError(false, "Order was not found.", 404)
    );
  });

  // For when a 500 error was returned

  it("should return an error if a server/db error occured", async () => {
    jest
      .spyOn(Order, "findOrderById")
      .mockResolvedValue(
        new CustomError(
          false,
          "Something went wrong whilst reach the database.",
          500,
          new Error("Database error")
        )
      );

    await getUserOrderDetailsHandler(req as Request, res as Response);

    expect(errorResponseHelper).toHaveBeenCalledWith(
      res,
      new CustomError(
        false,
        "Something went wrong whilst reach the database.",
        500,
        new Error("Database error")
      )
    );
  });
});

describe("Get user orders handler", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      userData: { user: { userId: "dnfdnfnfn" } },
    } as Partial<Request>;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    jest.clearAllMocks();
  });

  //To return all orders
  it("should return all user orders", async () => {
    const mockFindAllOrdersForUser = jest
      .spyOn(Order, "findAllOrdersForUser")
      .mockResolvedValue([{ _id: "sbsb" }]);

    await getUserOrdersHandler(req as Request, res as Response);

    expect(mockFindAllOrdersForUser).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      new ResponseStructure(true, 200, { orders: [{ _id: "sbsb" }] })
    );
  });

  it("should return an error when orders are not found", async () => {
    const mockFindAllOrdersForUser = jest
      .spyOn(Order, "findAllOrdersForUser")
      .mockResolvedValue(new CustomError(false, "Orders not found.", 404));

    await getUserOrdersHandler(req as Request, res as Response);

    expect(mockFindAllOrdersForUser).toHaveBeenCalled();
    expect(errorResponseHelper).toHaveBeenCalledWith(
      res,
      new CustomError(false, "Orders not found.", 404)
    );
  });

  it("should return an error when theres database/server error", async () => {
    const mockFindAllOrdersForUser = jest
      .spyOn(Order, "findAllOrdersForUser")
      .mockResolvedValue(
        new CustomError(
          false,
          "Something wen't wrong in our serrver whilst hitting the database.",
          500,
          new Error("Database/server error!1")
        )
      );

    await getUserOrdersHandler(req as Request, res as Response);

    expect(mockFindAllOrdersForUser).toHaveBeenCalled();
    expect(errorResponseHelper).toHaveBeenCalledWith(
      res,
      new CustomError(
        false,
        "Something wen't wrong in our serrver whilst hitting the database.",
        500,
        new Error("Database/server error!1")
      )
    );
  });
});

describe("Update user order", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: { newStatus: "cancelled" },
      params: {
        oderId: "hmbvbhveug3u3434u",
      },
    } as Partial<Request>;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    jest.clearAllMocks();
  });

  it("should return a successfull update.", async () => {
    const mockedSavedOrder = jest
      .spyOn(Order.prototype, "saveOrder")
      .mockResolvedValue(
        new ResponseStructure(true, 200, "Order updated successfully.")
      );

    await updateUserOrderStatusHandler(req as Request, res as Response);

    expect(mockedSavedOrder).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      new ResponseStructure(true, 200, "Order updated successfully.")
    );
  });

  it("should return an error for failed database operation.", async () => {
    const mockedSavedOrder = jest
      .spyOn(Order.prototype, "saveOrder")
      .mockResolvedValue(
        new CustomError(false, "Database operation failed.", 500)
      );

    await updateUserOrderStatusHandler(req as Request, res as Response);
    expect(mockedSavedOrder).toHaveBeenCalled();

    expect(errorResponseHelper).toHaveBeenCalledWith(
      res,
      new CustomError(false, "Database operation failed.", 500)
    );
  });
});
