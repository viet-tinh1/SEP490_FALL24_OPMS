using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Net.payOS.Types;
using Net.payOS;
using Repositories.Types;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using Web_API_OPMS.Controllers;
using BusinessObject.Models;
using System.Linq;
using Repositories.Implements;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentAPI : ControllerBase
    {
        private readonly PayOS _payOS;
        private readonly OrderAPI _orderAPI;
        private OrderRepository OrderRepository = new OrderRepository();
        public PaymentAPI(PayOS payOS, OrderAPI orderAPI)
        {
            _payOS = payOS;
            _orderAPI = orderAPI;
        }
        [HttpPost("create-payment-link")]
        public async Task<IActionResult> CreatePaymentLink([FromBody] List<int> orderIds)
        {
            try
            {
                List<ItemData> items = new List<ItemData>();
                int totalAmount = 0;
                foreach (var orderId in orderIds)
                {
                    var orderResult = _orderAPI.GetOrderById(orderId);
                    if (orderResult == null || orderResult.Result is not OkObjectResult okResult || okResult.Value == null)
                    {
                        return NotFound(new Response(-1, $"Order with ID {orderId} not found", null));
                    }

                    var orderDetails = okResult.Value as Order;
                    if (orderDetails?.ShoppingCartItem?.Plant == null)
                    {
                        return BadRequest(new Response(-1, $"Invalid data for order ID {orderId}", null));
                    }

                    // Add item details for each order
                    var item = new ItemData(
                        orderDetails.ShoppingCartItem.Plant.PlantName,
                        orderDetails.ShoppingCartItem.Quantity,
                        (int)Math.Round(orderDetails.TotalAmount)
                    );
                    items.Add(item);

                    // Accumulate total amount
                    totalAmount += (int)Math.Round(orderDetails.TotalAmount);
                }

                // Create payment data with the aggregated items and total amount
                var paymentData = new PaymentData(
                    orderIds.First(), // Using the first order ID as a reference
                    totalAmount,
                    "Payment for orders",
                    items,
                    "https://clientfe.runasp.net/PaymentFailure",
                    "https://clientfe.runasp.net/PaymentSuccess"
                );

                var createPayment = await _payOS.createPaymentLink(paymentData);
                //if (createPayment != null && createPayment.checkoutUrl != null)
                //{
                //    // Nếu tạo payment thành công và có checkoutUrl, điều hướng tới đó
                //    return Redirect(createPayment.checkoutUrl);
                //}
                return Ok(new Response(0, "Payment link created successfully", createPayment));
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                return StatusCode(500, new Response(-1, "Failed to create payment link", null));
            }
        }


        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetOrder([FromRoute] int orderId)
        {
            try
            {
                var order = OrderRepository.GetOrderById (orderId);
               // var order = _orderAPI.GetOrderById(orderId);
                if (order is NotFoundObjectResult)
                {
                    return Ok(new Response(-1, "Order not found", null));
                }

                PaymentLinkInformation paymentLinkInformation = await _payOS.getPaymentLinkInformation(orderId);

                // Check if the status in paymentLinkInformation is "PAID"
                if (paymentLinkInformation?.status == "PAID")
                {
                    order.IsSuccess = 1;
                    OrderRepository.UpdateOrder(order);
                    return Ok(new Response(1, "Order has been paid", paymentLinkInformation));
                }
                order.IsSuccess = 0;
                OrderRepository.UpdateOrder(order);
                return Ok(new Response(0, "Order retrieved successfully", paymentLinkInformation));
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                return Ok(new Response(-1, "Failed to retrieve order", null));
            }
        }

        [HttpPut("order/{orderId}")]
        public async Task<IActionResult> CancelOrder([FromRoute] int orderId)
        {
            try
            {
                PaymentLinkInformation paymentLinkInformation = await _payOS.cancelPaymentLink(orderId);
                return Ok(new Response(0, "Order cancelled successfully", paymentLinkInformation));
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                return Ok(new Response(-1, "Failed to cancel order", null));
            }
        }

        [HttpPost("confirm-webhook")]
        public async Task<IActionResult> ConfirmWebhook([FromBody] ConfirmWebhook body)
        {
            try
            {
                await _payOS.confirmWebhook(body.webhook_url);
                return Ok(new Response(0, "Webhook confirmed successfully", null));
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                return Ok(new Response(-1, "Failed to confirm webhook", null));
            }
        }

        [HttpPost("payos-transfer-handler")]
        public IActionResult PayOSTransferHandler([FromBody] WebhookType body)
        {
            try
            {
                WebhookData data = _payOS.verifyPaymentWebhookData(body);

                if (data.description == "Ma giao dich thu nghiem" || data.description == "VQRIO123")
                {
                    return Ok(new Response(0, "Webhook handled successfully", null));
                }
                return Ok(new Response(0, "Webhook handled successfully", null));
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Ok(new Response(-1, "Failed to handle webhook", null));
            }
        }

        [HttpGet("all-orders")]
        public IActionResult GetAllOrders()
        {
            try
            {
                var orders = _orderAPI.getOrder();
                if (orders.Result is NotFoundObjectResult)
                {
                    return Ok(new Response(-1, "No orders found", null));
                }
                return Ok(new Response(0, "Orders retrieved successfully", orders.Value));
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception);
                return Ok(new Response(-1, "Failed to retrieve orders", null));
            }
        }
    }
}