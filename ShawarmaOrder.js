const Order = require("./Order");

const OrderState = Object.freeze({
  WELCOMING: Symbol("welcoming"),
  SIZE: Symbol("size"),
  TOPPINGS: Symbol("toppings"),
  DRINKS: Symbol("drinks"),
  ITEM: Symbol("item"),
  DESSERT: Symbol("dessert"),
  MoreItems: Symbol("moreitems"),
  PAYMENT: Symbol("payment")
});

let total = 0;
let foodtype, fooditem;
var FoodItemss = [2];
var FoodSize = [2];
var FoodToppings = [2];
let i = 0;
let d;
module.exports = class ShwarmaOrder extends Order {
  constructor(sNumber, sUrl) {
    super(sNumber, sUrl);
    this.stateCur = OrderState.WELCOMING;
    this.sSize = "";
    this.sToppings = "";
    this.sDrinks = "";
    this.sItem = "";
    this.sDessert = "";
  }
  handleInput(sInput) {
    let aReturn = [];
    switch (this.stateCur) {

      case OrderState.WELCOMING:
        this.stateCur = OrderState.ITEM;
        aReturn.push("Welcome to Jose Restaurant.");
        aReturn.push("What would you like to have ? \n Shawarma \n Burger \n Pizza");
        break;

      case OrderState.ITEM:
        fooditem = sInput.toLowerCase();
        if ((fooditem == "shawarma") || (fooditem == "burger") || (fooditem == "pizza")) {
          this.stateCur = OrderState.SIZE;
          FoodItemss[i] = sInput;
          this.sItem = sInput;
          aReturn.push("What size would you like ? (large or small)");
        }
        else {
          aReturn.push(`${sInput} is not a valid entry , Please select Shawarma / Burger / Pizza`);
        }
        break;

      case OrderState.SIZE:
        foodtype = sInput.toLowerCase();
        if ((foodtype == "small") || (foodtype == "large")) {
          this.stateCur = OrderState.TOPPINGS
          FoodSize[i] = sInput;
          this.sSize = sInput;

          if ((fooditem == "burger") && (foodtype == "large")) {
            total = total + 15
          }
          if ((fooditem == "burger") && (foodtype == "small")) {
            total = total + 7;
          }
          if ((fooditem == "Shawarma" && foodtype == "large")) {
            total = total + 20;
          }
          if ((fooditem == "Shawarma" && foodtype == "small")) {
            total = total + 10;
          }
          if ((fooditem == "pizza" && foodtype == "large")) {
            total = total + 30;
            console.log(`"total"${total}`);
          }
          if ((fooditem == "pizza" && foodtype == "small")) {
            total = total + 15;
          }

          aReturn.push("What toppings would you like? Cheese or Sauce");
        }
        else {
          aReturn.push(`${sInput} is not a valid entry , Please select large or small`);
        }

        break;

      case OrderState.TOPPINGS:
        if ((sInput.toLowerCase() == "cheese") || (sInput.toLowerCase() == "sauce")) {
          this.stateCur = OrderState.MoreItems
          FoodToppings[i] = sInput;
          this.sToppings = sInput;
          if (sInput.toLowerCase() == "cheese") {
            total = total + 3;
          } else if (sInput.toLowerCase() == "sauce") {
            total = total + 2;
          }
          aReturn.push("Would you like to select more item from menu : (yes or No)");

        }
        else {
          aReturn.push(`${sInput} is not a valid entry , Please select cheese or sauce`);
        }
        break;

      case OrderState.MoreItems:

        if (sInput.toLowerCase() == "yes") {
          aReturn.push("What would you like to have ? \n Shawarma \n Burger \n Pizza");
          this.stateCur = OrderState.ITEM;
          i = i + 1;
        }
        else if (sInput.toLowerCase() == "no") {
          this.stateCur = OrderState.DESSERT;
          aReturn.push("Would you like to add Dessert ? (Yes or No) ");
        }

        break;

      case OrderState.DESSERT:
        if ((sInput.toLowerCase() == "yes" || sInput.toLowerCase() == "no")) {
          this.stateCur = OrderState.DRINKS;
          if (sInput.toLowerCase() != "no") {
            this.sDessert = "Dessert:" + sInput;
            total = total + 4;
          }
          aReturn.push("Would you like drinks with that? (Yes or No) ");
        }

        else {
          aReturn.push(`${sInput} is not a valid entry , Please select Yes or No `);
        }

        break;

      case OrderState.DRINKS:
        if ((sInput.toLowerCase() == "yes") || (sInput.toLowerCase() == "no")) {

          this.isDone(true);         
          if (sInput.toLowerCase() != "no") {
            this.sDrinks = "Drinks:" + sInput;
            total = total + 3;
          }
          this.nOrder = total;
          aReturn.push("Thank-you for your order of");
          for (let j = 0; j <= i; j++) {
            //aReturn.push(`${this.sSize} ${this.sItem} with ${this.sToppings}`);            

            aReturn.push(`${FoodSize[j]} ${FoodItemss[j]} with ${FoodToppings[j]}`);
          }
          if (this.sDrinks) {
            aReturn.push(this.sDrinks);
          }
          if (this.sDessert) {
            aReturn.push(this.sDessert);
          }
          aReturn.push("Estimated Amount  =" + total + " CAD");
          d = new Date();
          d.setMinutes(d.getMinutes() + 20);
          //  aReturn.push(`Please pick it up at ${d.toTimeString()}`);

          this.stateCur = OrderState.PAYMENT;
          aReturn.push(`Please pay for your order here`);
          aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`)
        }

        else {
          aReturn.push(`${sInput} is not a valid entry , Please select Yes or No `);
        }
        break;

      case OrderState.PAYMENT:
        console.log(sInput);
        console.log();
        this.isDone(true);
        d = new Date();
        d.setMinutes(d.getMinutes() + 20);
        aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
        aReturn.push([Object.values(sInput.purchase_units[0].shipping.address)]);
        break;

    }
    return aReturn;
  }
  renderForm(sTitle = "-1", sAmount = "-1") {
    // your client id should be kept private
    if (sTitle != "-1") {
      this.sItem = sTitle;
    }
    if (sAmount != "-1") {
      this.nOrder = sAmount;
    }
    const sClientID = process.env.SB_CLIENT_ID || 'put your client id here for testing ... Make sure that you delete it before committing'
    return (`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${[...FoodItemss]} order of $${this.nOrder}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);

  }
}