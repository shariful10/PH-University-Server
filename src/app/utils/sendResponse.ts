import { Response } from "express";

type TMeta = {
	limit: number;
	page: number;
	total: number;
	totalPage: number;
};

type TResponse<T> = {
	message?: string;
	meta?: TMeta;
	data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
	res.status(200).json({
		success: true,
		message: data?.message,
		meta: data.meta,
		data: data?.data,
	});
};

export default sendResponse;
