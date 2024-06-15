import { createNewTransaction, updateTransaction } from "./transactionController.js";
import request from "request";

const { ALAOPAY_TOKEN, ALAOPAY_URL, CLUBKONNECT_KEY, CLUBKONNECT_URL, CLUBKONNECT_USERID, BACKEND_URL } = process.env;
const refund = false;

export const createAirtimeOrder = async (req, res) => {
	const { amount, id: requestID, number } = req.body;
	const options = {
		method: "POST",
		url: `${CLUBKONNECT_URL}/APIAirtimeV1.asp?UserID=${CLUBKONNECT_USERID}&APIKey=${CLUBKONNECT_KEY}&MobileNetwork=${requestID}&Amount=${amount}&MobileNumber=${number}&RequestID=${requestID}&CallBackURL=${BACKEND_URL}`,
		headers: { Accept: "application/json" },
	};

	const id = await createNewTransaction(req, res);
	const dataRes = await new Promise((resolve, reject) => {
		request(options, function (error, response) {
			const body = JSON.parse(response.body);
			if (error) reject(error);
			else resolve(body);
		});
	});
	console.log(dataRes);
	if (dataRes.status === "ORDER_COMPLETED" || dataRes.statuscode === "200") await updateTransaction(id, refund, req, res);

	return dataRes;
};

export const createDataOrder = async (req, res) => {
	const { provider_code, package_code, number } = req.body;
	console.log("provider_code", req.body);
	const options = {
		method: "POST",
		url: `${ALAOPAY_URL}/api/data/buy?provider_code=${provider_code}&package_code=${package_code}&phone_number=${number}`,
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${ALAOPAY_TOKEN}`,
		},
	};

	const id = await createNewTransaction(req, res);
	const dataRes = await new Promise((resolve, reject) => {
		request(options, function (error, response) {
			const body = JSON.parse(response.body);
			if (error) reject(error);
			else resolve(body);
		});
	});
	console.log("STATUS", dataRes.status);
	console.log("STATUS_CODE", dataRes.status_code);
	if (dataRes.status === "successful" || dataRes.status_code === "111") await updateTransaction(id, refund, req, res);

	return dataRes;
};

export const verifyCableOrder = async (req, res) => {
	console.log(req.body);
	const { smartcardno, cableId } = req.body;
	const options = {
		method: "POST",
		url: `${CLUBKONNECT_URL}/APIVerifyCableTVV1.0.asp?UserID=${CLUBKONNECT_USERID}&APIKey=${CLUBKONNECT_KEY}&cabletv=${cableId}&smartcardno=${smartcardno}`,
		headers: { Accept: "application/json" },
	};

	const dataRes = await new Promise((resolve, reject) => {
		request(options, function (error, response) {
			const body = JSON.parse(response.body);
			if (error) reject(error);
			else resolve(body);
		});
	});
	console.log(dataRes);
	return dataRes;
};
export const createCableOrder = async (req, res) => {
	const { amount, id: requestID, number } = req.body;
	const options = {
		method: "POST",
		url: `${CLUBKONNECT_URL}/APIAirtimeV1.asp?UserID=${CLUBKONNECT_USERID}&APIKey=${CLUBKONNECT_KEY}&MobileNetwork=${requestID}&Amount=${amount}&MobileNumber=${number}&RequestID=${requestID}&CallBackURL=${BACKEND_URL}`,
		headers: { Accept: "application/json" },
	};

	const id = await createNewTransaction(req, res);
	const dataRes = await new Promise((resolve, reject) => {
		request(options, function (error, response) {
			const body = JSON.parse(response.body);
			if (error) reject(error);
			else resolve(body);
		});
	});
	if (dataRes.orderstatus === "ORDER_COMPLETED" || dataRes.statuscode === "200") await updateTransaction(id, refund, req, res);
};
