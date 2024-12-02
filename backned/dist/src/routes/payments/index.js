"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const express_1 = __importDefault(require("express"));
const authMiddleWare_1 = require("../../middlewares/authMiddleWare");
const authorizeRole_1 = __importDefault(require("../../middlewares/authorizeRole"));
const db_1 = __importDefault(require("../../db"));
const router = express_1.default.Router();
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
router.post('/create-order', authMiddleWare_1.authenticationMiddleWare, (0, authorizeRole_1.default)("STUDENT"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, amount, userId, clubId, feeId } = req.body;
        // Validate required fields
        if (!name || !amount || !userId || !clubId || !feeId) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields: name, amount, userId, clubId, feeId.',
            });
            return;
        }
        // Create an order on Razorpay
        const razorpayOrder = yield razorpay.orders.create({
            amount: amount * 100, // Razorpay expects amount in paise
            currency: 'INR',
            receipt: `UID${userId.slice(-4)}-CID${clubId.slice(-4)}-FID${feeId.slice(-4)}`,
        });
        // Save order details to the database
        const order = yield db_1.default.order.create({
            data: {
                name,
                amount: amount.toString(),
                orderId: razorpayOrder.id,
                userId,
                clubId,
                feeId,
            },
        });
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            razorpayOrder,
            order,
        });
        return;
    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Failed to create order' });
        return;
    }
}));
router.post('/verify-payment', authMiddleWare_1.authenticationMiddleWare, (0, authorizeRole_1.default)("STUDENT"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body.paymentDetails;
        // Generate a signature to verify the payment
        const generatedSignature = crypto_1.default
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || "")
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');
        if (generatedSignature !== razorpay_signature) {
            console.error("Payment signature mismatch:", {
                expected: generatedSignature,
                received: razorpay_signature,
            });
            res.status(400).json({
                success: false,
                message: 'Invalid payment signature',
            });
            return;
        }
        // Perform both updates within a transaction
        const updatedData = yield db_1.default.$transaction([
            // Update the order
            db_1.default.order.update({
                where: { orderId: razorpay_order_id },
                data: {
                    razorpayPaymentId: razorpay_payment_id,
                    razorpayOrderId: razorpay_order_id,
                    razorpaySignature: razorpay_signature,
                },
            }),
            // Update the fee status
            db_1.default.fee.update({
                where: { id: req.body.feeId }, // Ensure the feeId is sent in the request body
                data: { status: 'PAID' },
            }),
        ]);
        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            order: updatedData[0],
            fee: updatedData[1],
        });
        return;
    }
    catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Failed to verify payment' });
        return;
    }
}));
exports.default = router;
