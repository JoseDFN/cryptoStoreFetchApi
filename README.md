# Project: Product and Billing Management System

Welcome to the **Product and Billing Management System**! You can try out the live demo of the application by visiting the following link:

[Live Demo](https://cryptostorefetchapijf.netlify.app/)

This project is a web page that allows you to switch between a purchase menu and a sales menu. Through these menus, users can interact with products, add products to an invoice, and perform create, modify, delete, and list operations for products.

## Features

### Purchase Menu

In the purchase menu, users can enter the following information:

- **Identification Number**
- **First Name**
- **Last Name**
- **Address**
- **Email**

Users can also select products and specify the quantity to add to the invoice. Once the purchase is complete, the invoice is saved in the "invoices" section inside the `db.json` file, and the stock of the selected products is updated automatically.

### Product Menu

In the product menu, users can navigate through the following options:

1. **Create Product**  
   Allows users to create a new product by entering the code or ID, name, unit price, stock, and an image URL.

2. **Modify Product**  
   Allows users to select an existing product and modify its details: name, unit price, stock, and image URL.

3. **Delete Product**  
   Displays a list of existing products. The user can click the "delete" button for a product, and after an additional confirmation, the product is permanently deleted.

4. **List Products**  
   Displays product cards with the image and name. By clicking on a card, users can view more details about the product.

## Technologies Used

- **HTML**
- **CSS**
- **JavaScript**
- **JSON Server** (for data persistence)

## Installation and Running Locally

Follow these steps to run the project locally:

1. **Clone the repository**  
   Open a terminal and run the following command:
   ```bash
   git clone https://github.com/JoseDFN/cryptoStoreFetchApi.git

2. **Navigate to the project directory**
    Once cloned, go to the project directory:
    ```bash
    cd cryptoStoreFetchApi

3. **Install the dependencies**
    Run the following command to install the necessary dependencies:
    ```bash
    npm install

4. **Start the JSON Server**
    To activate the data persistence, run:
    ```bash
    json-server --watch db.json

5. **Start the project**
    To view the project and see real-time updates as you make changes, you can open the project with an extension like Live Server or Live Preview in your code editor.

    - *For VS Code:* Install the "Live Server" extension from the marketplace and click "Go Live" to open the project in your browser.
    - *For other editors*: Use the equivalent extension for live previewing or a similar method to view your HTML changes in real-time.

    The project should be running at http://localhost:3000.