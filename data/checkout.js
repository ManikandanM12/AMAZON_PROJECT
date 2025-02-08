import { cart, deleteCartProduct, saveToLocalStorage } from "../data/cart.js";
import { products } from "./ProductsList.js";
import { FormatCurrency } from "./money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "./deliveryOption.js";




let cartAddProduct = "";
cart.forEach((checkoutItem) => {
  let productId = checkoutItem.productId;
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  let today = dayjs();

  let afterSevenDays = today.add(7, "days");
  let afterThreeDays = today.add(3, "days");
  // console.log(afterSevenDays.format("dddd,MMMM D,"));

  cartAddProduct += `<div class="cart-item-container cart-product-id-${
    matchingProduct.id
  }">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${FormatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${
                      checkoutItem.quantity
                    }</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
                    matchingProduct.id
                  }">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
               ${deliveryOptionsHTML(matchingProduct,cart)}
              </div>
            </div>
          </div>
`;
});
let checkoutItems = document.querySelector(".order-summary");
checkoutItems.innerHTML = cartAddProduct;

//DeleiveryOptions in HTML
function deliveryOptionsHTML(matchingProduct,cart) {
  let deliveryHTML='';
  deliveryOptions.forEach((delivery) => {
    let today=dayjs();
    let deliveryDate=today.add(delivery.deliveryDay,'days')
    let dateString=deliveryDate.format("dddd,MMMM D")
    
   
    
    let priceString=delivery.priceCents===0?'FREE':`$${FormatCurrency(delivery.priceCents)} -`
    let isChecked=delivery.id===cart.deliveryOptionId
    
   deliveryHTML += ` <div class="delivery-option">
                  <input type="radio" 
                    class="delivery-option-input"
                    name="${matchingProduct.id}" 
                    ${isChecked?'checked':'checked'}>
                  <div>
                    <label class="delivery-option-date">
                  ${dateString}

                    </label>
                    <div class="delivery-option-price">
                      ${priceString} - Shipping
                    </div>
                  </div>
                </div>`;
  });
  return deliveryHTML;

}

let deleteCartItem = document.querySelectorAll(".js-delete-link");
// console.log(deleteCartItem);

deleteCartItem.forEach((link) => {
  link.addEventListener("click", (event) => {
    let productId = link.dataset.productId;
    deleteCartProduct(productId);
    const container = document.querySelector(`.cart-product-id-${productId}`);
    // console.log(container);
    container.remove();
    // console.log(cart);
  });
});

// Total checkout item

let totalCheckoutItems = 0;
cart.forEach((item) => {
  totalCheckoutItems += item.quantity;
  let checkout = document.querySelector(".return-to-home-link");
  checkout.textContent = totalCheckoutItems + " " + "items";
});
