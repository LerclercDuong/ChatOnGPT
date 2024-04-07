// Node v10.15.3
const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment


// APP INFO
const config = {
    app_id: "2553",
    key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
    key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

class Payment {
    async doPaymentZaloPay(req, res, next) {
        // Get a list of network interfaces
        // const networkInterfaces = os.networkInterfaces();

        // // Find the IP address associated with the localhost (loopback)
        // const localhostIPAddress = networkInterfaces['lo'][0].address;

        // console.log(`Localhost IP Address: ${localhostIPAddress}`);
        
        
        const jsonString = Object.keys(req.body)[0];
        const item  = null;
        const payment_data = JSON.parse(jsonString);

        const embed_data = {
            redirecturl: `http://localhost:8084/UserManagement/MainController?action=CreateOrder&paymentMethod=ZaloPay&email=${payment_data.email}`,
        };

        console.log(payment_data);
        // create order 
        const items = [{}];
        const transID = Math.floor(Math.random() * 1000000);
        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}_ZaloPay`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
            app_user: "user123",
            app_time: Date.now(), // miliseconds
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: payment_data.totalCost,
            description: `RubikShop - Payment for the order #${transID}`,
            bank_code: "zalopayapp",
        };
        // appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        const checkOutPage = await axios.post(config.endpoint, null, { params: order })
            .then(res => {
                return res.data.order_url
            })
            .catch(err => console.log(err));
        res.send(checkOutPage);
    }


    doPaymentMomo(req, res, next) {
      
    }

}
module.exports = new Payment;