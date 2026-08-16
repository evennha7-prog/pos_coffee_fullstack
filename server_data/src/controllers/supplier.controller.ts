import { Request, Response, NextFunction } from "express";
import Supplier from "../models/supplier.model";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { business_name, name, phone, address, note } = req.body;
    if (!business_name || !name) {
      return res.status(400).json({
        success: false,
        error: "Business name and contact name are required",
      });
    }

    const newDoc = await Supplier.create({
      business_name,
      name,
      phone,
      address,
      note,
    });
    res.status(201).json({
      success: true,
      result: newDoc,
    });
  } catch (error) {
    next(error);
  }
};

export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const search = req.query.search ? String(req.query.search) : "";

    const docs = await Supplier.findAll({ page, limit, search });
    const totalItem = await Supplier.countAll(search);
    const totalPage = limit ? Math.ceil(totalItem / limit) : 1;

    res.status(200).json({
      success: true,
      totalItem,
      totalPage,
      result: docs,
    });
  } catch (error) {
    next(error);
  }
};

export const findOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    const doc = await Supplier.findById(id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Supplier not found with that ID!",
      });
    }
    res.status(200).json({
      success: true,
      result: doc,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    const doc = await Supplier.update(id, req.body);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Supplier not found with that ID!",
      });
    }
    res.status(200).json({
      success: true,
      result: doc,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);
    const deleted = await Supplier.remove(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Supplier not found with that ID!",
      });
    }
    res.status(200).json({
      success: true,
      result: "Deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  findAll,
  findOne,
  update,
  remove,
};
