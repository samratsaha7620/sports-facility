import Razorpay from "razorpay";
import crypto from 'crypto';
import express,{Request,Response} from 'express'
import { authenticationMiddleWare } from "../../middlewares/authMiddleWare";
import authorizeRole from "../../middlewares/authorizeRole";
import prisma from "../../db";

const router = express.Router()

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



router.post('/create-order',authenticationMiddleWare,authorizeRole("STUDENT"), async(req:Request,res:Response) =>{
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
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `UID${userId.slice(-4)}-CID${clubId.slice(-4)}-FID${feeId.slice(-4)}`,
    });
    
    // Save order details to the database
    const order = await prisma.order.create({
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
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
    return;
  }  
})


router.post('/verify-payment',authenticationMiddleWare,authorizeRole("STUDENT"), async(req:Request,res:Response) =>{
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body.paymentDetails;

    // Generate a signature to verify the payment
    const generatedSignature = crypto
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
    const updatedData = await prisma.$transaction([
      // Update the order
      prisma.order.update({
        where: { orderId: razorpay_order_id },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpaySignature: razorpay_signature,
        },
      }),

      // Update the fee status
      prisma.fee.update({
        where: { id: req.body.feeId }, // Ensure the feeId is sent in the request body
        data: { status: 'PAID' },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order: updatedData[0],
      fee:updatedData[1],
    });
    return;
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
    return;
  }
})


export default router;

